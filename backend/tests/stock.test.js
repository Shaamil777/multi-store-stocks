const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const Product = require("../src/models/Product");
const Store = require("../src/models/Store");
const Stock = require("../src/models/Stock");

let mongoServer;
let adminToken;

// Mock environment variables
process.env.JWT_SECRET = "testsecret";

beforeAll(async () => {
    // Start MongoDB Memory Server with Replica Set for transactions
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);

    // Create an admin user and generate a token
    const admin = await User.create({
        name: "Admin User",
        email: "admin@test.com",
        password: "hashedpassword",
        role: "admin"
    });

    adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

beforeEach(async () => {
    // Clear collections (except users) before each test
    await Product.deleteMany({});
    await Store.deleteMany({});
    await Stock.deleteMany({});
});

describe("Stock Transfer Logic", () => {
    
    it("should process a correct end-to-end transfer", async () => {
        // Setup data
        const product = await Product.create({
            name: "Test Product",
            sku: "TEST-SKU-1",
            brand: "Test",
            category: "Test",
            price: 100
        });

        const storeA = await Store.create({ name: "Store A", district: "North", manager: "John Doe", phone: "1234567890", address: "123 North St" });
        const storeB = await Store.create({ name: "Store B", district: "South", manager: "Jane Doe", phone: "0987654321", address: "456 South St" });

        await Stock.create({ product: product._id, store: storeA._id, quantity: 100 });
        await Stock.create({ product: product._id, store: storeB._id, quantity: 0 });

        // Execute transfer
        const res = await request(app)
            .post("/api/stock/transfer")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                product: product._id.toString(),
                fromStore: storeA._id.toString(),
                toStore: storeB._id.toString(),
                quantity: 30
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify database state
        const stockA = await Stock.findOne({ store: storeA._id });
        const stockB = await Stock.findOne({ store: storeB._id });

        expect(stockA.quantity).toBe(70);
        expect(stockB.quantity).toBe(30);
    });

    it("should reject a transfer that exceeds available stock", async () => {
        const product = await Product.create({
            name: "Test Product 2",
            sku: "TEST-SKU-2",
            brand: "Test",
            category: "Test",
            price: 100
        });

        const storeA = await Store.create({ name: "Store A", district: "North", manager: "John Doe", phone: "1234567890", address: "123 North St" });
        const storeB = await Store.create({ name: "Store B", district: "South", manager: "Jane Doe", phone: "0987654321", address: "456 South St" });

        await Stock.create({ product: product._id, store: storeA._id, quantity: 5 });

        // Execute transfer exceeding stock
        const res = await request(app)
            .post("/api/stock/transfer")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                product: product._id.toString(),
                fromStore: storeA._id.toString(),
                toStore: storeB._id.toString(),
                quantity: 20
            });

        expect(res.status).toBe(400); // Bad Request
        expect(res.body.success).toBe(false);

        // Verify database state didn't change
        const stockA = await Stock.findOne({ store: storeA._id });
        expect(stockA.quantity).toBe(5);
        
        const stockB = await Stock.findOne({ store: storeB._id });
        expect(stockB).toBeNull();
    });

    it("should guarantee stock never goes negative during concurrent requests", async () => {
        const product = await Product.create({
            name: "Test Product 3",
            sku: "TEST-SKU-3",
            brand: "Test",
            category: "Test",
            price: 100
        });

        const storeA = await Store.create({ name: "Store A", district: "North", manager: "John Doe", phone: "1234567890", address: "123 North St" });
        const storeB = await Store.create({ name: "Store B", district: "South", manager: "Jane Doe", phone: "0987654321", address: "456 South St" });

        // Store A has exactly 10 items
        await Stock.create({ product: product._id, store: storeA._id, quantity: 10 });

        // Simulate two admins making the same request at the same exact time
        const transferPayload = {
            product: product._id.toString(),
            fromStore: storeA._id.toString(),
            toStore: storeB._id.toString(),
            quantity: 10 // Trying to deduct 10
        };

        const req1 = request(app)
            .post("/api/stock/transfer")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(transferPayload);
            
        const req2 = request(app)
            .post("/api/stock/transfer")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(transferPayload);

        // Fire both requests concurrently
        const [res1, res2] = await Promise.all([req1, req2]);

        // One should succeed, one should fail
        const successCount = (res1.status === 200 ? 1 : 0) + (res2.status === 200 ? 1 : 0);
        const failCount = (res1.status !== 200 ? 1 : 0) + (res2.status !== 200 ? 1 : 0);
        
        expect(successCount).toBe(1);
        expect(failCount).toBe(1);

        // Verify database state: Stock A should be exactly 0, not -10
        const stockA = await Stock.findOne({ store: storeA._id });
        expect(stockA.quantity).toBe(0);

        // Stock B should only have 10
        const stockB = await Stock.findOne({ store: storeB._id });
        expect(stockB.quantity).toBe(10);
    });
});
