const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Proposal = require('../model/Proposal');
const ioService = require('../services/io');

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
  }
  return new Razorpay({ key_id, key_secret });
}

// Create an order for a proposal
// Body: { proposalId, amount, currency }
router.post('/create-order', async (req, res) => {
  try {
    const { proposalId, amount, currency = 'INR' } = req.body;
    if (!proposalId || !amount) return res.status(400).json({ error: 'proposalId and amount are required' });

    const options = {
      amount: Math.round(amount), // in paise
      currency,
      receipt: `receipt_${proposalId}_${Date.now()}`,
      notes: { proposalId }
    };
  const rp = getRazorpay();
  const order = await rp.orders.create(options);

    await Proposal.findByIdAndUpdate(proposalId, { paymentStatus: 'pending', paymentIntentId: order.id }, { new: true });

    res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('create-order error', err);
    res.status(500).json({ error: err.message });
  }
});

// Verify payment signature from client
// Body: { proposalId, orderId, paymentId, signature }
router.post('/verify', async (req, res) => {
  try {
    const { proposalId, orderId, paymentId, signature } = req.body;
    if (!proposalId || !orderId || !paymentId || !signature) return res.status(400).json({ error: 'Missing fields' });

    const signBody = `${orderId}|${paymentId}`;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(signBody).digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    await Proposal.findByIdAndUpdate(proposalId, { paymentStatus: 'paid', amountPaid: undefined }, { new: true });

    const io = ioService.getIO();
    if (io) io.to(`proposal_${proposalId}`).emit('paymentSucceeded', { proposalId });

    res.json({ success: true });
  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
