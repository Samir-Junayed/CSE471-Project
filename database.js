const { MongoClient } = require("mongodb");


// ============================================================
// MONGODB CONNECTION
// ============================================================

const client = new MongoClient(
    "mongodb+srv://samirdjunayed200_db_user:YOUR_PASSWORD@cluster0.rznywvv.mongodb.net/turfconnect_dhaka?retryWrites=true&w=majority&appName=Cluster0"
);


// ============================================================
// DATABASE
// ============================================================

const db = client.db("turfconnect_dhaka");


// ============================================================
// PLAYER PROFILE COLLECTION
// ============================================================

const players = db.collection("players");


// ============================================================
// BOOKING COLLECTION
// ============================================================

const bookings = db.collection("bookings");


// ============================================================
// PAYMENT COLLECTION
// ============================================================

const payments = db.collection("payments");


// ============================================================
// EXPORT COLLECTIONS
// ============================================================

module.exports = {
    players,
    bookings,
    payments
};