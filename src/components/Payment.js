import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const { id } = useParams(); // The product id from the URL
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');

  const handlePayment = () => {
    // Handle payment logic here, and update payment status accordingly
    setPaymentStatus('Success');
    alert('Payment successful!');
  };

  return (
    <div className="payment-page">
      <h2>Complete Your Payment</h2>
      <div className="payment-card">
        <div className="payment-card-header">
          <h3>Payment for Product ID: {id}</h3>
        </div>
        <div className="payment-card-body">
          <div className="payment-info-item">
            <label htmlFor="payment-method">Payment Method:</label>
            <select 
              id="payment-method" 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select a payment method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>
          <div className="payment-status">
            <p>Payment Status: <strong>{paymentStatus}</strong></p>
          </div>
          <div className="payment-buttons">
            <button className="confirm-button" onClick={handlePayment}>Confirm Payment</button>
            <button className="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
