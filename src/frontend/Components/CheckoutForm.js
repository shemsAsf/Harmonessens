import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ handlePayment, handleFailedPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    setLoading(false);

    if (error) {
      console.error(error);
      handleFailedPayment();
    } else {
      handlePayment(paymentIntent);
    }
  };

  return (

    <div className="confirmation-modal__overlay">
      <div className="confirmation-modal__content">
        <span className="confirmation-modal__close" onClick={handleFailedPayment}>&times;</span>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <br/>
          <button disabled={!stripe || loading} className="submit-button">
            {loading ? "Paiement en cours..." : "Payer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
