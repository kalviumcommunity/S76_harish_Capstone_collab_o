export async function startRazorpayPayment({ apiBase, proposalId, amount, name = 'Project Payment', description = 'Payment for accepted proposal' }) {
  try {
    // Create order on server (amount in paise)
    const res = await fetch(`${apiBase}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId, amount, currency: 'INR' })
    });
    if (!res.ok) throw new Error('Failed to create payment order');
    const { orderId, amount: orderAmount, currency, keyId } = await res.json();

    if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');

    const options = {
      key: keyId,
      amount: orderAmount,
      currency,
      name,
      description,
      order_id: orderId,
      handler: async function (response) {
        // Verify signature on server
        const verifyRes = await fetch(`${apiBase}/api/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposalId,
            orderId,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          })
        });
        if (!verifyRes.ok) throw new Error('Payment verification failed');
        return true;
      },
      theme: { color: '#FC427B' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    return true;
  } catch (err) {
    console.error('Payment error', err);
    return false;
  }
}
