const { MongoClient } = require("mongodb");


// ============================================================
// MONGODB CONNECTION
// ============================================================

const client = new MongoClient(
    "mongodb+srv://samirdjunayed200_db_user:KL9U7ym3jYZcQRHk@cluster0.xsyhrsd.mongodb.net/?appName=Cluster0"
);


// ============================================================
// DATABASE
// ============================================================

const db = client.db("turfconnect_dhaka");


// ============================================================
// COLLECTIONS
// ============================================================

const players = db.collection("players");

const bookings = db.collection("bookings");

const payments = db.collection("payments");


// ============================================================
// EXPORT COLLECTIONS
// ============================================================

module.exports = {
    client,
    players,
    bookings,
    payments
};
