from flask import Flask, render_template, request, jsonify
from database import players, bookings
app = Flask(__name__)

# Temporary Player Profile Data
# (Will come from MongoDB)

player_profile = {
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "membership": ""
}

# Temporary Upcoming Booking Data
# (Will come from MongoDB)
upcoming_booking = {
    "turf_name": "",
    "location": "",
    "date": "",
    "time": "",
    "status": ""
}

# Temporary Past Bookings Data
# (Will come from MongoDB)
past_bookings = []

# Home Page

@app.route("/")
def home():

    return render_template(
        "player profile management.html",
        profile=player_profile,
        booking=upcoming_booking,
        past_bookings=past_bookings
    )

# View Player Profile

@app.route("/profile", methods=["GET"])
def get_profile():

    return jsonify(player_profile)

# Update Player Profile

@app.route("/profile/update", methods=["POST"])
def update_profile():

    full_name = request.form.get("full_name")
    email = request.form.get("email")
    phone = request.form.get("phone")
    location = request.form.get("location")
    membership = request.form.get("membership")

    # Validation

    if not full_name or len(full_name) > 150:
        return "Name too long"

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


# View Upcoming Booking

@app.route("/booking", methods=["GET"])
def get_booking():

    return jsonify(upcoming_booking)

# Update Upcoming Booking

@app.route("/booking/update", methods=["POST"])
def update_booking():

    turf_name = request.form.get("turf_name")
    location = request.form.get("location")
    date = request.form.get("date")
    time = request.form.get("time")
    status = request.form.get("status")

    # Validation

    if not turf_name:
        return "There is no such Turf"

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


# View Past Bookings

@app.route("/past-bookings", methods=["GET"])
def get_past_bookings():

    latest_four = past_bookings[-4:]

    return jsonify(latest_four[::-1])

# Add Past Booking

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

if __name__ == "__main__":
    app.run(debug=True)
