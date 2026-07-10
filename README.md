# Multi-Store Stocks Management

A full-stack app I built to handle products, store locations, and inventory levels. It includes role-based access control and uses database transactions for safe stock transfers between stores.



## Tech Stack

**Frontend**
* React (with TypeScript)
* Tailwind CSS

**Backend**
* Node.js & Express
* MongoDB (Mongoose)
* JWT Authentication



## Features

* **User Auth & Roles:** Login, registration, and role-based permissions (Admin, Manager, Shopper).
* **Core Management:** CRUD operations for Products and Stores.
* **Inventory Control:** Track stock levels at specific locations.
* **Safe Transfers:** Stock adjustments and transfers use MongoDB transactions so data doesn't get corrupted if something fails halfway.



## Docs

If you want to dive deeper into how things are built:

* `DESIGN.md` - System architecture, database schema, and my thought process.
* `openapi.yaml` - The full API spec for the backend routes.



## How to run this locally

You'll need Node.js and MongoDB installed on your machine.

**1. Backend**

Open a terminal, go to the backend folder, and install everything:
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder. You can look at `.env.example` to see what you need. It should look something like this:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/multi-store-stocks
JWT_SECRET=your_secret_key_here
```

Start the backend server:
```bash
npm run dev
```
(It usually runs on `http://localhost:5000`)


**2. Frontend**

Open a second terminal, go to the frontend folder, and install the UI dependencies:
```bash
cd frontend
npm install
```

Start up React:
```bash
npm run dev
```
(It usually runs on `http://localhost:5173`)



## Tests

If you want to run the backend tests (specifically to test the stock transaction logic):

```bash
cd backend
npm test
```
