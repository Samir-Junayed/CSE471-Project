const express = require("express");
const cors = require("cors");

const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ============================================================
// TEMPORARY PLAYER PROFILE DATA
// ============================================================

let player_profile = {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    membership: ""
};


// ============================================================
// TEMPORARY UPCOMING BOOKING DATA
// ============================================================

let upcoming_booking = {
    turf_name: "",
    location: "",
    date: "",
    time: "",
    status: ""
};


// ============================================================
// TEMPORARY PAST BOOKINGS DATA
// ============================================================

let past_bookings = [];


// ============================================================
// PAYMENT INFORMATION
// ============================================================

// Temporary payment numbers.
// These can later come from MongoDB
// depending on the selected turf.

let payment_numbers = {
    bKash: "01711111111",
    Nagad: "01822222222"
};


// ============================================================
// HOME ROUTE
// ============================================================

app.get("/", (req, res) => {

    res.json({
        message: "Player Profile and Payment API is running"
    });

});


// ============================================================
// VIEW PLAYER PROFILE
// ============================================================

app.get("/profile", (req, res) => {

    res.json(player_profile);

});


// ============================================================
// UPDATE PLAYER PROFILE
// ============================================================

app.post("/profile/update", (req, res) => {

    const full_name = req.body.full_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const location = req.body.location;
    const membership = req.body.membership;


    // Validation

    if (!full_name || full_name.length > 150) {
        return res.status(400).send("Invalid Full Name");
    }

    if (!email || email.length > 150) {
        return res.status(400).send("Invalid Email");
    }

    if (!phone || phone.length > 20) {
        return res.status(400).send("Invalid Phone");
    }

    if (!location || location.length > 150) {
        return res.status(400).send("Invalid Location");
    }

    if (!["Premium", "Regular"].includes(membership)) {
        return res.status(400).send("Invalid Membership");
    }


    // Save Profile (Temporary)

    player_profile.full_name = full_name;
    player_profile.email = email;
    player_profile.phone = phone;
    player_profile.location = location;
    player_profile.membership = membership;


    return res.json({
        message: "Profile Updated Successfully",
        profile: player_profile
    });

});


// ============================================================
// VIEW UPCOMING BOOKING
// ============================================================

app.get("/booking", (req, res) => {

    res.json(upcoming_booking);

});


// ============================================================
// UPDATE UPCOMING BOOKING
// ============================================================

app.post("/booking/update", (req, res) => {

    const turf_name = req.body.turf_name;
    const location = req.body.location;
    const date = req.body.date;
    const time = req.body.time;
    const status = req.body.status;


    // Validation

    if (!turf_name) {
        return res.status(400).send("Invalid Turf Name");
    }

    if (!location) {
        return res.status(400).send("Invalid Location");
    }

    if (!date) {
        return res.status(400).send("Invalid Date");
    }

    if (!time) {
        return res.status(400).send("Invalid Time");
    }

    if (!["Pending", "Confirmed"].includes(status)) {
        return res.status(400).send("Invalid Status");
    }


    // Save Booking (Temporary)

    upcoming_booking.turf_name = turf_name;
    upcoming_booking.location = location;
    upcoming_booking.date = date;
    upcoming_booking.time = time;
    upcoming_booking.status = status;


    return res.json({
        message: "Booking Updated Successfully",
        booking: upcoming_booking
    });

});


// ============================================================
// VIEW PAST BOOKINGS
// ============================================================

app.get("/past-bookings", (req, res) => {

    const latest_four = past_bookings.slice(-4);

    return res.json(latest_four.reverse());

});


// ============================================================
// ADD PAST BOOKING
// ============================================================

app.post("/past-bookings/add", (req, res) => {

    const turf_name = req.body.turf_name;


    if (!turf_name || turf_name.length > 150) {
        return res.status(400).send("Invalid Turf Name");
    }


    past_bookings.push({
        turf_name: turf_name
    });


    return res.json({
        message: "Past Booking Added Successfully",
        past_bookings: past_bookings.slice(-4).reverse()
    });

});


// ============================================================
// PAYMENT - SELECT PAYMENT METHOD
// ============================================================

app.post("/payment/select", (req, res) => {

    const payment_method = req.body.payment_method;


    // Validate payment method

    if (!["Cash", "bKash", "Nagad"].includes(payment_method)) {

        return res.status(400).json({
            message: "Invalid Payment Method"
        });

    }


    // --------------------------------------------------------
    // CASH PAYMENT
    // --------------------------------------------------------

    if (payment_method === "Cash") {

        // Cash payment automatically confirms booking

        upcoming_booking.status = "Confirmed";


        return res.json({
            message: "Cash Payment Selected",
            payment_method: "Cash",
            payment_status: "Confirmed",
            booking_status: "Confirmed"
        });

    }


    // --------------------------------------------------------
    // BKASH / NAGAD
    // --------------------------------------------------------

    return res.json({
        message: payment_method + " Payment Selected",
        payment_method: payment_method,
        payment_number: payment_numbers[payment_method],
        payment_status: "Pending",
        booking_status: "Pending"
    });

});


// ============================================================
// PAYMENT - CONFIRM BKASH / NAGAD
// ============================================================

app.post("/payment/confirm", (req, res) => {

    const payment_method = req.body.payment_method;


    // Validate payment method

    if (!["bKash", "Nagad"].includes(payment_method)) {

        return res.status(400).json({
            message: "Invalid Payment Method"
        });

    }


    // --------------------------------------------------------
    // CONFIRM MANUAL PAYMENT
    // --------------------------------------------------------

    upcoming_booking.status = "Confirmed";


    return res.json({
        message: "Payment Confirmed Successfully",
        payment_method: payment_method,
        payment_status: "Confirmed",
        booking_status: "Confirmed"
    });

});


// ============================================================
// RUN NODE.JS SERVER
// ============================================================

app.listen(5000, () => {

    console.log("Player Profile and Payment API is running");
    console.log("Server running at http://localhost:5000");

});