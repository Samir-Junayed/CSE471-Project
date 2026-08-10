from flask import Flask, request, jsonify
from flask_cors import CORS
from database import players, bookings

app = Flask(__name__)
CORS(app)


# ============================================================
# TEMPORARY PLAYER PROFILE DATA
# ============================================================

player_profile = {
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "membership": ""
}


# ============================================================
# TEMPORARY UPCOMING BOOKING DATA
# ============================================================

upcoming_booking = {
    "turf_name": "",
    "location": "",
    "date": "",
    "time": "",
    "status": ""
}


# ============================================================
# TEMPORARY PAST BOOKINGS DATA
# ============================================================

past_bookings = []


# ============================================================
# PAYMENT INFORMATION
# ============================================================

# Temporary payment numbers.
# These can later come from MongoDB
# depending on the selected turf.

payment_numbers = {
    "bKash": "01711111111",
    "Nagad": "01822222222"
}


# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/")
def home():

    return jsonify({
        "message": "Player Profile and Payment API is running"
    })


# ============================================================
# VIEW PLAYER PROFILE
# ============================================================

@app.route("/profile", methods=["GET"])
def get_profile():

    return jsonify(player_profile)


# ============================================================
# UPDATE PLAYER PROFILE
# ============================================================

@app.route("/profile/update", methods=["POST"])
def update_profile():

    full_name = request.form.get("full_name")
    email = request.form.get("email")
    phone = request.form.get("phone")
    location = request.form.get("location")
    membership = request.form.get("membership")

    # Validation

    if not full_name or len(full_name) > 150:
        return "Invalid Full Name"

    if not email or len(email) > 150:
        return "Invalid Email"

    if not phone or len(phone) > 20:
        return "Invalid Phone"

    if not location or len(location) > 150:
        return "Invalid Location"

    if membership not in ["Premium", "Regular"]:
        return "Invalid Membership"

    # Save Profile (Temporary)

    player_profile["full_name"] = full_name
    player_profile["email"] = email
    player_profile["phone"] = phone
    player_profile["location"] = location
    player_profile["membership"] = membership

    return jsonify({
        "message": "Profile Updated Successfully",
        "profile": player_profile
    })


# ============================================================
# VIEW UPCOMING BOOKING
# ============================================================

@app.route("/booking", methods=["GET"])
def get_booking():

    return jsonify(upcoming_booking)


# ============================================================
# UPDATE UPCOMING BOOKING
# ============================================================

@app.route("/booking/update", methods=["POST"])
def update_booking():

    turf_name = request.form.get("turf_name")
    location = request.form.get("location")
    date = request.form.get("date")
    time = request.form.get("time")
    status = request.form.get("status")

    # Validation

    if not turf_name:
        return "Invalid Turf Name"

    if not location:
        return "Invalid Location"

    if not date:
        return "Invalid Date"

    if not time:
        return "Invalid Time"

    if status not in ["Pending", "Confirmed"]:
        return "Invalid Status"

    # Save Booking (Temporary)

    upcoming_booking["turf_name"] = turf_name
    upcoming_booking["location"] = location
    upcoming_booking["date"] = date
    upcoming_booking["time"] = time
    upcoming_booking["status"] = status

    return jsonify({
        "message": "Booking Updated Successfully",
        "booking": upcoming_booking
    })


# ============================================================
# VIEW PAST BOOKINGS
# ============================================================

@app.route("/past-bookings", methods=["GET"])
def get_past_bookings():

    latest_four = past_bookings[-4:]

    return jsonify(latest_four[::-1])


# ============================================================
# ADD PAST BOOKING
# ============================================================

@app.route("/past-bookings/add", methods=["POST"])
def add_past_booking():

    turf_name = request.form.get("turf_name")

    if not turf_name or len(turf_name) > 150:
        return "Invalid Turf Name"

    past_bookings.append({
        "turf_name": turf_name
    })

    return jsonify({
        "message": "Past Booking Added Successfully",
        "past_bookings": past_bookings[-4:][::-1]
    })


# ============================================================
# PAYMENT - SELECT PAYMENT METHOD
# ============================================================

@app.route("/payment/select", methods=["POST"])
def select_payment_method():

    payment_method = request.form.get("payment_method")

    # Validate payment method

    if payment_method not in ["Cash", "bKash", "Nagad"]:

        return jsonify({
            "message": "Invalid Payment Method"
        }), 400


    # --------------------------------------------------------
    # CASH PAYMENT
    # --------------------------------------------------------

    if payment_method == "Cash":

        # Cash payment automatically confirms booking

        upcoming_booking["status"] = "Confirmed"

        return jsonify({
            "message": "Cash Payment Selected",
            "payment_method": "Cash",
            "payment_status": "Confirmed",
            "booking_status": "Confirmed"
        })


    # --------------------------------------------------------
    # BKASH / NAGAD
    # --------------------------------------------------------

    return jsonify({
        "message": payment_method + " Payment Selected",
        "payment_method": payment_method,
        "payment_number": payment_numbers[payment_method],
        "payment_status": "Pending",
        "booking_status": "Pending"
    })


# ============================================================
# PAYMENT - CONFIRM BKASH / NAGAD
# ============================================================

@app.route("/payment/confirm", methods=["POST"])
def confirm_payment():

    payment_method = request.form.get("payment_method")

    # Validate payment method

    if payment_method not in ["bKash", "Nagad"]:

        return jsonify({
            "message": "Invalid Payment Method"
        }), 400


    # --------------------------------------------------------
    # CONFIRM MANUAL PAYMENT
    # --------------------------------------------------------

    upcoming_booking["status"] = "Confirmed"

    return jsonify({
        "message": "Payment Confirmed Successfully",
        "payment_method": payment_method,
        "payment_status": "Confirmed",
        "booking_status": "Confirmed"
    })


# ============================================================
# RUN FLASK SERVER
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)
