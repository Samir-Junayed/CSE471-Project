const express = require("express");
const cors = require("cors");

const {
    client,
    players,
    bookings,
    payments
} = require("../database");

const app = express();

// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// PAYMENT INFORMATION

const payment_numbers = {
    bKash: "01711111111",
    Nagad: "01822222222"
};

// TEMPORARY CURRENT PLAYER ID

const CURRENT_PLAYER_ID = 1;

// HOME ROUTE

app.get("/", (req, res) => {

    res.json({
        message: "Player Profile and Payment API is running"
    });

});

// VIEW PLAYER PROFILE

app.get("/profile", async (req, res) => {

    try {

        const profile = await players.findOne({
            player_id: CURRENT_PLAYER_ID
        });

        // If the player does not exist in MongoDB yet

        if (!profile) {

            return res.json({
                full_name: "",
                email: "",
                phone: "",
                location: "",
                membership: ""
            });

        }

        return res.json({

            full_name: profile.full_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || "",
            membership: profile.membership || ""

        });

    } catch (error) {

        console.error("Error fetching profile:", error);

        return res.status(500).json({
            message: "Failed to fetch player profile"
        });

    }

});

// UPDATE PLAYER PROFILE

app.post("/profile/update", async (req, res) => {

    try {

        const full_name = req.body.full_name;
        const email = req.body.email;
        const phone = req.body.phone;
        const location = req.body.location;
        const membership = req.body.membership;


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

        // SAVE PROFILE TO MONGODB

        await players.updateOne(

            {
                player_id: CURRENT_PLAYER_ID
            },

            {
                $set: {

                    player_id: CURRENT_PLAYER_ID,

                    full_name: full_name,

                    email: email,

                    phone: phone,

                    location: location,

                    membership: membership

                }

            },

            {
                upsert: true
            }

        );


        return res.json({

            message: "Profile Updated Successfully",

            profile: {

                full_name: full_name,

                email: email,

                phone: phone,

                location: location,

                membership: membership

            }

        });

    } catch (error) {

        console.error("Error updating profile:", error);

        return res.status(500).json({
            message: "Failed to update player profile"
        });

    }

});

// VIEW UPCOMING BOOKING

app.get("/booking", async (req, res) => {

    try {

        const booking = await bookings.findOne({

            player_id: CURRENT_PLAYER_ID,

            booking_type: "upcoming"

        });


        if (!booking) {

            return res.json({

                turf_name: "",
                location: "",
                date: "",
                time: "",
                status: ""

            });

        }


        return res.json({

            turf_name: booking.turf_name || "",

            location: booking.location || "",

            date: booking.date || "",

            time: booking.time || "",

            status: booking.status || ""

        });

    } catch (error) {

        console.error("Error fetching booking:", error);

        return res.status(500).json({
            message: "Failed to fetch booking"
        });

    }

});

// UPDATE UPCOMING BOOKING

app.post("/booking/update", async (req, res) => {

    try {

        const turf_name = req.body.turf_name;
        const location = req.body.location;
        const date = req.body.date;
        const time = req.body.time;
        const status = req.body.status;

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

        // SAVE BOOKING TO MONGODB

        await bookings.updateOne(

            {
                player_id: CURRENT_PLAYER_ID,

                booking_type: "upcoming"
            },

            {
                $set: {

                    player_id: CURRENT_PLAYER_ID,

                    booking_type: "upcoming",

                    turf_name: turf_name,

                    location: location,

                    date: date,

                    time: time,

                    status: status

                }

            },

            {
                upsert: true
            }

        );


        return res.json({

            message: "Booking Updated Successfully",

            booking: {

                turf_name: turf_name,

                location: location,

                date: date,

                time: time,

                status: status

            }

        });

    } catch (error) {

        console.error("Error updating booking:", error);

        return res.status(500).json({
            message: "Failed to update booking"
        });

    }

});

// VIEW PAST BOOKINGS

app.get("/past-bookings", async (req, res) => {

    try {

        const latest_four = await bookings
            .find({

                player_id: CURRENT_PLAYER_ID,

                booking_type: "past"

            })
            .sort({
                created_at: -1
            })
            .limit(4)
            .toArray();


        return res.json(

            latest_four.map((booking) => ({

                turf_name: booking.turf_name || ""

            }))

        );

    } catch (error) {

        console.error("Error fetching past bookings:", error);

        return res.status(500).json({
            message: "Failed to fetch past bookings"
        });

    }

});

// ADD PAST BOOKING

app.post("/past-bookings/add", async (req, res) => {

    try {

        const turf_name = req.body.turf_name;


        if (!turf_name || turf_name.length > 150) {

            return res.status(400).send("Invalid Turf Name");

        }

        // SAVE TO MONGODB

        await bookings.insertOne({

            player_id: CURRENT_PLAYER_ID,

            booking_type: "past",

            turf_name: turf_name,

            created_at: new Date()

        });

        // GET LATEST FOUR

        const latest_four = await bookings
            .find({

                player_id: CURRENT_PLAYER_ID,

                booking_type: "past"

            })
            .sort({
                created_at: -1
            })
            .limit(4)
            .toArray();


        return res.json({

            message: "Past Booking Added Successfully",

            past_bookings: latest_four.map((booking) => ({

                turf_name: booking.turf_name

            }))

        });

    } catch (error) {

        console.error("Error adding past booking:", error);

        return res.status(500).json({
            message: "Failed to add past booking"
        });

    }

});

// PAYMENT 

app.post("/payment/select", async (req, res) => {

    try {

        const payment_method = req.body.payment_method;


        if (!["Cash", "bKash", "Nagad"].includes(payment_method)) {

            return res.status(400).json({

                message: "Invalid Payment Method"

            });

        }

        if (payment_method === "Cash") {


            // Cash automatically confirms booking

            await bookings.updateOne(

                {
                    player_id: CURRENT_PLAYER_ID,

                    booking_type: "upcoming"
                },

                {
                    $set: {
                        status: "Confirmed"
                    }
                }

            );


            // Save payment information

            await payments.insertOne({

                player_id: CURRENT_PLAYER_ID,

                payment_method: "Cash",

                payment_status: "Confirmed",

                created_at: new Date()

            });


            return res.json({

                message: "Cash Payment Selected",

                payment_method: "Cash",

                payment_status: "Confirmed",

                booking_status: "Confirmed"

            });

        }

        // BKASH / NAGAD

        return res.json({

            message: payment_method + " Payment Selected",

            payment_method: payment_method,

            payment_number: payment_numbers[payment_method],

            payment_status: "Pending",

            booking_status: "Pending"

        });

    } catch (error) {

        console.error("Error selecting payment:", error);

        return res.status(500).json({

            message: "Failed to process payment method"

        });

    }

});

// PAYMENT - CONFIRM BKASH / NAGAD

app.post("/payment/confirm", async (req, res) => {

    try {

        const payment_method = req.body.payment_method;


        if (!["bKash", "Nagad"].includes(payment_method)) {

            return res.status(400).json({

                message: "Invalid Payment Method"

            });

        }

        // CONFIRM BOOKING

        await bookings.updateOne(

            {
                player_id: CURRENT_PLAYER_ID,

                booking_type: "upcoming"
            },

            {
                $set: {
                    status: "Confirmed"
                }
            }

        );


        await payments.insertOne({

            player_id: CURRENT_PLAYER_ID,

            payment_method: payment_method,

            payment_status: "Confirmed",

            created_at: new Date()

        });


        return res.json({

            message: "Payment Confirmed Successfully",

            payment_method: payment_method,

            payment_status: "Confirmed",

            booking_status: "Confirmed"

        });

    } catch (error) {

        console.error("Error confirming payment:", error);

        return res.status(500).json({

            message: "Failed to confirm payment"

        });

    }

});

async function startServer() {

    try {

        await client.connect();

        console.log("MongoDB connected successfully");

        console.log("Database: turfconnect_dhaka");

        console.log("Player Profile and Payment API is running");


        app.listen(5000, () => {

            console.log(
                "Server running at http://localhost:5000"
            );

        });

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error
        );

    }

}

startServer();
