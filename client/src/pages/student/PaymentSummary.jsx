import React from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, sessionDetails }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const response = await fetch('/api/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        sessionDetails,
      }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Pay Now
      </button>
    </form>
  );
};

const PaymentSummary = () => {
  const location = useLocation();
  const { tutorName, startTime, endTime, subjects, amount, tutorId, studentId, date, slotId } = location.state || {};
  const platformFee = 20;
  const totalAmount = amount + platformFee;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center">Payment Summary</h2>
        <div className="text-left text-gray-800 dark:text-gray-200 mb-6">
          <p><strong>Tutor Name:</strong> {tutorName}</p>
          <p><strong>Start Time:</strong> {startTime}</p>
          <p><strong>End Time:</strong> {endTime}</p>
          <p><strong>Subjects:</strong> {subjects}</p>
          <p><strong>Amount:</strong> Rs{amount}</p>
          <p><strong>Platform Fee:</strong> Rs{platformFee}</p>
          <p><strong>Total Amount to be paid:</strong> Rs{totalAmount}</p>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={totalAmount} sessionDetails={{ tutorId, studentId, date, tutorName, startTime, endTime, subjects, slotId }} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentSummary;
