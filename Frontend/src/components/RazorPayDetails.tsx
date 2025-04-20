import React from 'react';
import toast from 'react-hot-toast';

const RazorPayDetails = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error('Razorpay SDK failed to load.');
      return;
    }

    try {
      // Call backend to create Razorpay order
      const response = await fetch('http://localhost:3000/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // ₹500 donation
      });

      const data = await response.json();

      const options = {
        key: 'rzp_test_o4BYuWab5ZZGk5', // Replace this with your Razorpay key ID
        amount: data.amount,
        currency: data.currency,
        name: 'Carelink NGO',
        description: 'Donation for NGO support',
        order_id: data.id,
        handler: function (response: any) {
          toast.success('Donation successful!');
          console.log('Payment ID:', response.razorpay_payment_id);
          console.log('Order ID:', response.razorpay_order_id);
          console.log('Signature:', response.razorpay_signature);
        },
        prefill: {
          name: 'Donor Name',
          email: 'donor@example.com',
          contact: '9000000000',
        },
        theme: {
          color: '#F37254',
        },
      };

      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.error('Donation failed!');
      console.error('Donation error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Support our NGO</h2>
        <p className="text-gray-600 text-center mb-6">
          Your contribution can make a difference.
        </p>
        <button
          onClick={handleDonate}
          className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700"
        >
          Donate ₹500
        </button>
      </div>
    </div>
  );
};

export default RazorPayDetails;