import React, { useState } from 'react';

const CustomPaymentModal = ({ paymentData, onPaymentComplete, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiMethod, setUpiMethod] = useState('phonepe');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps'
    },
    {
      id: 'cards',
      name: 'Cards',
      icon: '💳',
      description: 'Credit/Debit Cards'
    },
    {
      id: 'emi',
      name: 'EMI',
      icon: '📊',
      description: 'Easy Installments'
    },
    {
      id: 'netbanking',
      name: 'Netbanking',
      icon: '🏦',
      description: 'Internet Banking'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: '👛',
      description: 'Mobile Wallets'
    },
    {
      id: 'paylater',
      name: 'Pay Later',
      icon: '⏰',
      description: 'Pay Later Options'
    }
  ];

  const upiOptions = [
    { id: 'phonepe', name: 'PhonePe', recommended: true },
    { id: 'gpay', name: 'Google Pay', recommended: false },
    { id: 'paytm', name: 'Paytm', recommended: false },
    { id: 'bhim', name: 'BHIM', recommended: false }
  ];

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentId = 'PAY_' + Date.now();
      onPaymentComplete(paymentId);
      setLoading(false);
    }, 2000);
  };

  const renderPaymentContent = () => {
    switch (selectedMethod) {
      case 'upi':
        return (
          <div className="upi-section">
            <div className="upi-qr">
              <div className="qr-code">
                <div className="qr-placeholder">
                  <div className="qr-pattern">
                    <div className="qr-grid"></div>
                  </div>
                </div>
              </div>
              <p className="scan-text">Scan QR to pay</p>
            </div>
            
            <div className="upi-apps">
              <h4>Choose UPI App</h4>
              <div className="upi-options">
                {upiOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setUpiMethod(option.id)}
                    className={`upi-option ${upiMethod === option.id ? 'selected' : ''} ${option.recommended ? 'recommended' : ''}`}
                  >
                    <div className="upi-app-icon">
                      <div className="app-icon-placeholder"></div>
                    </div>
                    <span className="app-name">{option.name}</span>
                    {option.recommended && <span className="recommended-badge">Recommended</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'cards':
        return (
          <div className="cards-section">
            <div className="card-inputs">
              <div className="input-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxLength="19" />
              </div>
              <div className="card-row">
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" maxLength="3" />
                </div>
              </div>
              <div className="input-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
            </div>
          </div>
        );
      
      case 'netbanking':
        return (
          <div className="netbanking-section">
            <div className="bank-grid">
              {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                <button key={bank} className="bank-option">
                  <div className="bank-logo">{bank.charAt(0)}</div>
                  <span>{bank}</span>
                </button>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="default-section">
            <p>Select a payment method to continue</p>
          </div>
        );
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <button className="close-btn" onClick={onClose}>×</button>
          <div className="merchant-info">
            <h3>Digital Cafe</h3>
            <p>Online Order</p>
          </div>
        </div>

        <div className="payment-body">
          <div className="payment-summary">
            <div className="price-breakdown">
              <div className="item">
                <span>Subtotal</span>
                <span>₹{paymentData?.subtotal || 140}</span>
              </div>
              <div className="item">
                <span>Taxes</span>
                <span>₹{paymentData?.tax || 10}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span className="total-amount">₹{paymentData?.total || 150}</span>
              </div>
            </div>
          </div>

          <div className="payment-methods">
            <div className="methods-tabs">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`method-tab ${selectedMethod === method.id ? 'active' : ''}`}
                >
                  <span className="method-icon">{method.icon}</span>
                  <div className="method-info">
                    <span className="method-name">{method.name}</span>
                    <span className="method-desc">{method.description}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="payment-content">
              {renderPaymentContent()}
            </div>
          </div>
        </div>

        <div className="payment-footer">
          <button 
            className="pay-button" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              <>
                Pay ₹{paymentData?.total || 150}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .payment-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .payment-header {
          padding: 20px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .merchant-info h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .merchant-info p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .payment-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .payment-summary {
          width: 300px;
          padding: 20px;
          background: #f8f9fa;
          border-right: 1px solid #e5e5e5;
        }

        .price-breakdown .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #666;
        }

        .price-breakdown .total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          font-weight: 600;
          font-size: 16px;
        }

        .total-amount {
          color: #2563eb;
          font-size: 24px;
          font-weight: 700;
        }

        .payment-methods {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .methods-tabs {
          display: flex;
          border-bottom: 1px solid #e5e5e5;
          overflow-x: auto;
        }

        .method-tab {
          flex: 1;
          min-width: 100px;
          padding: 15px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: all 0.2s;
        }

        .method-tab:hover {
          background: #f8f9fa;
        }

        .method-tab.active {
          border-bottom: 2px solid #2563eb;
          color: #2563eb;
        }

        .method-icon {
          font-size: 20px;
        }

        .method-name {
          font-size: 12px;
          font-weight: 600;
        }

        .method-desc {
          font-size: 10px;
          color: #666;
        }

        .payment-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .upi-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .upi-qr {
          text-align: center;
        }

        .qr-code {
          width: 200px;
          height: 200px;
          margin: 0 auto 10px;
          background: #f8f9fa;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-placeholder {
          width: 180px;
          height: 180px;
          background: repeating-linear-gradient(
            45deg,
            #000,
            #000 10px,
            #fff 10px,
            #fff 20px
          );
          border-radius: 4px;
          position: relative;
        }

        .qr-pattern::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 8px;
        }

        .scan-text {
          color: #666;
          font-size: 14px;
        }

        .upi-apps h4 {
          margin: 0 0 15px 0;
          font-size: 16px;
          color: #333;
        }

        .upi-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .upi-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 15px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .upi-option:hover {
          border-color: #2563eb;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }

        .upi-option.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .upi-option.recommended {
          border-color: #10b981;
        }

        .recommended-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #10b981;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .upi-app-icon {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-icon-placeholder {
          width: 24px;
          height: 24px;
          background: #ddd;
          border-radius: 4px;
        }

        .cards-section {
          max-width: 400px;
        }

        .card-inputs {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .input-group label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .input-group input {
          padding: 12px;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 14px;
        }

        .card-row {
          display: flex;
          gap: 15px;
        }

        .card-row .input-group {
          flex: 1;
        }

        .netbanking-section {
          max-width: 500px;
        }

        .bank-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
        }

        .bank-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 15px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bank-option:hover {
          border-color: #2563eb;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }

        .bank-logo {
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #2563eb;
        }

        .payment-footer {
          padding: 20px;
          border-top: 1px solid #e5e5e5;
        }

        .pay-button {
          width: 100%;
          padding: 15px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s;
        }

        .pay-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .pay-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .payment-modal {
            width: 95%;
            height: 90vh;
          }

          .payment-body {
            flex-direction: column;
          }

          .payment-summary {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e5e5e5;
          }

          .methods-tabs {
            flex-wrap: wrap;
          }

          .method-tab {
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomPaymentModal;
