import { useEffect, useState } from "react";
import "./playerprofile.css";

function App() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    membership: ""
  });

  const [booking, setBooking] = useState({
    turf_name: "",
    location: "",
    date: "",
    time: "",
    status: ""
  });

  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    // Get Player Profile from Flask
    fetch("http://127.0.0.1:5000/profile")
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });

    // Get Upcoming Booking from Flask
    fetch("http://127.0.0.1:5000/booking")
      .then((response) => response.json())
      .then((data) => {
        setBooking(data);
      })
      .catch((error) => {
        console.error("Error fetching booking:", error);
      });

    // Get Past Bookings from Flask
    fetch("http://127.0.0.1:5000/past-bookings")
      .then((response) => response.json())
      .then((data) => {
        setPastBookings(data);
      })
      .catch((error) => {
        console.error("Error fetching past bookings:", error);
      });
  }, []);

  return (
    <div className="container">

      <center>
        <h1>Player Profile Management</h1>
        <hr width="80%" />
      </center>

      <center>
        <img
          src="https://via.placeholder.com/150"
          alt="Player Profile"
        />
        <h3>Player Profile</h3>
      </center>

      <hr />

      {/* Player Profile */}

      <form>
        <table cellPadding="10">
          <tbody>

            <tr>
              <td><b>Full Name</b></td>
              <td>
                <input
                  type="text"
                  value={profile.full_name}
                  readOnly
                  size="40"
                />
              </td>
            </tr>

            <tr>
              <td><b>Email</b></td>
              <td>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  size="40"
                />
              </td>
            </tr>

            <tr>
              <td><b>Phone Number</b></td>
              <td>
                <input
                  type="text"
                  value={profile.phone}
                  readOnly
                  size="40"
                />
              </td>
            </tr>

            <tr>
              <td><b>Location</b></td>
              <td>
                <input
                  type="text"
                  value={profile.location}
                  readOnly
                  size="40"
                />
              </td>
            </tr>

            <tr>
              <td><b>Membership</b></td>
              <td>
                <input
                  type="text"
                  value={profile.membership}
                  readOnly
                  size="20"
                />
              </td>
            </tr>

          </tbody>
        </table>
      </form>

      <hr />

      {/* Upcoming Booking */}

      <h2>Upcoming Booking</h2>

      <table cellPadding="10">
        <tbody>

          <tr>
            <th>Turf Name</th>
            <td>{booking.turf_name}</td>
          </tr>

          <tr>
            <th>Location</th>
            <td>{booking.location}</td>
          </tr>

          <tr>
            <th>Date</th>
            <td>{booking.date}</td>
          </tr>

          <tr>
            <th>Time</th>
            <td>{booking.time}</td>
          </tr>

          <tr>
            <th>Status</th>
            <td>{booking.status}</td>
          </tr>

        </tbody>
      </table>

      <hr />

      {/* Past Bookings */}

      <h2>Past Bookings</h2>

      <table cellPadding="10">
        <thead>
          <tr>
            <th>Recent Turf Bookings</th>
          </tr>
        </thead>

        <tbody>
          {pastBookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.turf_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <hr />

      {/* Membership */}

      <center>
        <h3>Player Membership</h3>

        <table cellPadding="10">
          <tbody>
            <tr>
              <th>Membership Type</th>
              <td>{profile.membership}</td>
            </tr>
          </tbody>
        </table>
      </center>

      <br />

      <hr />

      {/* Dashboard */}

      <center>
        <h4>Player Dashboard</h4>

        <p>
          This page displays the player's profile information,
          upcoming booking details, and the latest four past bookings.
        </p>
      </center>

    </div>
  );
}

export default App;