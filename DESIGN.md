# System Design

## 1. Data Model
I structured the database using MongoDB with three main collections:
- **Products**: Stores basic product info (name, SKU, price, etc.).
- **Stores**: Stores physical location details (name, district, address, manager).
- **Stocks**: This is a junction collection that ties a Product and a Store together with a `quantity` field. 

*Note on Transfers:* I intentionally did not create a dedicated `Transfer` data model/collection. A transfer is simply an atomic action (a deduction from one store and an addition to another) that modifies the `Stocks` collection in real-time. Since there is no requirement to maintain a historical ledger or audit log of past transfers, introducing a separate `Transfers` collection would just add unnecessary overhead and complexity.

I decided to keep `Stock` as its own collection instead of embedding it inside `Products` or `Stores`. Embedding an array of stocks inside a product document would create massive documents over time and lead to heavy locking during concurrent updates. By keeping it separate, we can index the `(product_id, store_id)` pair to enforce uniqueness, making queries extremely fast.

## 2. Concurrency Strategy (Never-Negative Guarantee)
The biggest challenge with inventory systems is race conditions—two admins trying to deduct stock at the exact same time, which could accidentally push the balance below zero.

To prevent this, I avoided the typical approach of `findOne()` followed by `save()`. That gap between reading and writing is where race conditions happen. 

Instead, I used MongoDB's `findOneAndUpdate` atomic operator combined with a query filter:
`{ product: productId, store: storeId, quantity: { $gte: transferQuantity } }`

By moving the check into the query itself, MongoDB locks the document at the database level and ensures the condition is true right before applying the `$inc` deduction. If the stock falls below the requested quantity, the query simply matches nothing, and the database rejects the update. This guarantees stock will never drop below zero, no matter how many requests hit the server at once.

## 3. Atomicity (Stock Transfers)
A stock transfer requires two operations: deducting from Store A and adding to Store B. If the server crashes in the middle, we'd lose stock into the void.

To fix this, I wrapped the transfer logic in a MongoDB Transaction (`session.startTransaction()`). 
Both the deduction (`findOneAndUpdate`) and the addition (`findOneAndUpdate`) share the same session. If either one fails (for example, if Store A doesn't have enough stock, or if a network error occurs), the entire transaction is rolled back using `session.abortTransaction()`. This ensures the operation is strictly "all-or-nothing".
