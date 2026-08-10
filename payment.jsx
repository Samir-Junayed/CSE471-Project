import { useState } from "react";
import "./payment.css";

function Payment() {
  const [showMethods, setShowMethods] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePaymentMethod = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="payment-container">

      <h1>Turf Payment</h1>

      <button
        className="payment-button"
        onClick={() => setShowMethods(!showMethods)}
      >
        Enter Payment Method
      </button>

      {showMethods && (
        <div className="payment-methods">

          <button
            onClick={() => handlePaymentMethod("Cash")}
          >
            Cash Payment
          </button>

          <button
            onClick={() => handlePaymentMethod("bKash")}
          >
            bKash
          </button>

          <button
            onClick={() => handlePaymentMethod("Nagad")}
          >
            Nagad
          </button>

        </div>
      )}

      {selectedMethod === "Cash" && (
        <div className="payment-info">
          <h2>Cash Payment</h2>
          <p>
            Cash payment selected.
          </p>
          <p>
            Your booking will be confirmed automatically.
          </p>

          <button className="confirm-button">
            Confirm Booking
          </button>
        </div>
      )}

      {selectedMethod === "bKash" && (
        <div className="payment-info">
          <h2>bKash Payment</h2>

          <p>
            Please make your payment to the turf owner's bKash number:
          </p>

          <h3>01XXXXXXXXX</h3>

          <p>
            After completing the payment, click the button below.
          </p>

          <button className="confirm-button">
            Payment Confirmed
          </button>
        </div>
      )}

      {selectedMethod === "Nagad" && (
        <div className="payment-info">
          <h2>Nagad Payment</h2>

          <p>
            Please make your payment to the turf owner's Nagad number:
          </p>

          <h3>01XXXXXXXXX</h3>

          <p>
            After completing the payment, click the button below.
          </p>

          <button className="confirm-button">
            Payment Confirmed
          </button>
        </div>
      )}

    </div>
  );
}

export default Payment;