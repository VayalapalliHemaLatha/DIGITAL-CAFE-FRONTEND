import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const RazorpayModal = ({ isOpen, onClose, amount, orderData, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('');
  const [processing, setProcessing] = useState(false);

  const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak', 'Canara', 'BOI'];
  const wallets = ['Paytm', 'PhonePe', 'Amazon Pay', 'Google Pay', 'FreeCharge'];

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag',
        amount: amount * 100,
        currency: 'INR',
        name: 'Digital Cafe',
        description: 'Food Order Payment',
        handler: function (response) {
          onSuccess(response);
          onClose();
        },
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex' }}>
      <div style={{ background: 'white', width: '90%', maxWidth: '800px', margin: 'auto', borderRadius: '12px', display: 'flex', height: '80vh', overflow: 'hidden' }}>
        
        {/* Left Side - Order Summary */}
        <div style={{ background: '#f8f9fa', padding: '30px', width: '35%', borderRight: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Digital Cafe</h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Order Amount</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>₹{amount}</div>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            <div>📧 {orderData.customerEmail}</div>
            <div>📱 {orderData.customerPhone}</div>
          </div>
          <div style={{ fontSize: '11px', color: '#28a745', marginTop: '20px' }}>
            🔒 100% Secure - 128-bit SSL Encrypted
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>Visa</span>
            <span style={{ fontSize: '12px', color: '#666' }}>RuPay</span>
            <span style={{ fontSize: '12px', color: '#666' }}>UPI</span>
            <span style={{ fontSize: '12px', color: '#666' }}>BHIM</span>
          </div>
        </div>

        {/* Right Side - Payment Options */}
        <div style={{ padding: '30px', width: '65%', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Select Payment Method</h3>
          
          {/* Payment Method Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
            {['UPI', 'Card', 'NetBanking', 'Wallet'].map(method => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method.toLowerCase())}
                style={{ 
                  padding: '8px 16px', 
                  border: 'none', 
                  background: paymentMethod === method.toLowerCase() ? '#007bff' : '#f8f9fa',
                  color: paymentMethod === method.toLowerCase() ? 'white' : '#333',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {method}
              </button>
            ))}
          </div>

          {/* UPI Options */}
          {paymentMethod === 'upi' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h4>Scan QR Code</h4>
                <div style={{ background: 'white', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center' }}>
                  <QRCode value={`upi://pay?pa=digitalcafe@upi&pn=Digital Cafe&am=${amount}&cu=INR`} size={150} />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Scan with any UPI app</div>
                </div>
              </div>
              <div>
                <h4>Enter UPI ID</h4>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '10px' }}
                />
              </div>
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div>
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  style={{ flex: 1, padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  style={{ width: '80px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px' }}
                />
              </div>
            </div>
          )}

          {/* NetBanking */}
          {paymentMethod === 'netbanking' && (
            <div>
              <h4>Select Bank</h4>
              {banks.map(bank => (
                <label key={bank} style={{ display: 'block', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '5px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="bank"
                    value={bank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={{ marginRight: '10px' }}
                  />
                  {bank}
                </label>
              ))}
            </div>
          )}

          {/* Wallets */}
          {paymentMethod === 'wallet' && (
            <div>
              <h4>Select Wallet</h4>
              {wallets.map(wallet => (
                <button
                  key={wallet}
                  onClick={() => setSelectedBank(wallet)}
                  style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '5px', textAlign: 'left', cursor: 'pointer' }}
                >
                  {wallet}
                </button>
              ))}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            style={{
              width: '100%',
              padding: '15px',
              background: processing ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: processing ? 'not-allowed' : 'pointer',
              marginTop: '20px'
            }}
          >
            {processing ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
