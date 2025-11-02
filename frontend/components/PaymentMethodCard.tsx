import React, { useState } from 'react';
import { Recommendation } from '../types';

interface PaymentMethodCardProps {
  plan: Recommendation;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ plan, onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'paynow' | 'card' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayNowPayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  const handleCardPayment = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      alert('Please fill in all card details');
      return;
    }
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
        <h3 className="font-bold text-lg">Payment Details</h3>
        <p className="text-sm opacity-90">Complete your insurance purchase</p>
      </div>

      {/* Plan Summary */}
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Plan Selected</p>
            <p className="font-bold text-gray-800">{plan.policy_name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-primary">
              {plan.currency} ${plan.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-700 mb-3">Select Payment Method</h4>

        <div className="space-y-3">
          {/* PayNow Option */}
          <button
            onClick={() => setPaymentMethod('paynow')}
            className={`w-full p-4 border-2 rounded-lg transition-all ${
              paymentMethod === 'paynow'
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'paynow' ? 'border-primary bg-primary' : 'border-gray-300'
              } flex items-center justify-center`}>
                {paymentMethod === 'paynow' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">PayNow</p>
                <p className="text-xs text-gray-500">Instant payment via QR code</p>
              </div>
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </div>
          </button>

          {/* Card Option */}
          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 border-2 rounded-lg transition-all ${
              paymentMethod === 'card'
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 ${
                paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-gray-300'
              } flex items-center justify-center`}>
                {paymentMethod === 'card' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                <p className="text-xs text-gray-500">Visa, MasterCard, Amex</p>
              </div>
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h12v2H6v-2z"/>
              </svg>
            </div>
          </button>
        </div>

        {/* PayNow Details */}
        {paymentMethod === 'paynow' && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="bg-white p-3 rounded-lg inline-block mb-3">
                <img src="https://www.kasikornbank.com/SiteCollectionDocuments/personal/digital-banking/kplus/functions/qr-pay-with-kplus/images/img-qr-pay-01.png" alt="PayNow QR Code" className="w-32 h-32 rounded" />
              </div>
              <p className="text-sm text-gray-700 mb-2">Scan this QR code with your banking app</p>
              <p className="text-xs text-gray-500">Amount: {plan.currency} ${plan.price.toFixed(2)}</p>
              <button
                onClick={handlePayNowPayment}
                disabled={processing}
                className="mt-3 w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              >
                {processing ? 'Processing...' : 'I Have Paid'}
              </button>
            </div>
          </div>
        )}

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              onClick={handleCardPayment}
              disabled={processing}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:bg-gray-400"
            >
              {processing ? 'Processing Payment...' : `Pay ${plan.currency} $${plan.price.toFixed(2)}`}
            </button>
          </div>
        )}

        {/* Cancel Button */}
        {!processing && (
          <button
            onClick={onCancel}
            className="w-full mt-3 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
