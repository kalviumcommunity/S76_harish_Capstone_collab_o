const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/AuthMiddleWare');

// PayPal SDK configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

const PAYPAL_API_BASE = PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

/**
 * Get PayPal access token
 */
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

/**
 * Create PayPal order
 */
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'USD', description, contractId, milestoneIndex } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const accessToken = await getPayPalAccessToken();
    
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `${contractId}_milestone_${milestoneIndex}`,
        description: description || 'Freelance Project Payment',
        amount: {
          currency_code: currency,
          value: amount.toFixed(2)
        }
      }],
      application_context: {
        brand_name: 'Collab-O',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/cancel`
      }
    };
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const order = await response.json();
    
    if (!response.ok) {
      console.error('PayPal order creation failed:', order);
      return res.status(500).json({ error: 'Failed to create PayPal order', details: order });
    }
    
    res.json({ 
      orderId: order.id,
      approvalUrl: order.links.find(link => link.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create PayPal order' });
  }
});

/**
 * Capture PayPal order (complete payment)
 */
router.post('/capture-order', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const captureData = await response.json();
    
    if (!response.ok) {
      console.error('PayPal capture failed:', captureData);
      return res.status(500).json({ error: 'Failed to capture payment', details: captureData });
    }
    
    // Extract payment details
    const payment = captureData.purchase_units[0].payments.captures[0];
    
    res.json({
      success: true,
      orderId: captureData.id,
      payerId: captureData.payer.payer_id,
      payerEmail: captureData.payer.email_address,
      amount: payment.amount.value,
      currency: payment.amount.currency_code,
      status: payment.status,
      captureId: payment.id,
      createTime: payment.create_time
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: error.message || 'Failed to capture payment' });
  }
});

/**
 * Get PayPal order details
 */
router.get('/order/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const order = await response.json();
    
    if (!response.ok) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('PayPal order fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

/**
 * Get PayPal client ID for frontend
 */
router.get('/config', (req, res) => {
  res.json({
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD'
  });
});

/**
 * Refund a payment
 */
router.post('/refund', authenticate, async (req, res) => {
  try {
    const { captureId, amount, reason } = req.body;
    
    if (!captureId) {
      return res.status(400).json({ error: 'Capture ID is required' });
    }
    
    const accessToken = await getPayPalAccessToken();
    
    const refundData = {
      amount: amount ? {
        value: amount.toFixed(2),
        currency_code: 'USD'
      } : undefined,
      note_to_payer: reason || 'Refund for contract milestone'
    };
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refundData)
    });
    
    const refund = await response.json();
    
    if (!response.ok) {
      console.error('PayPal refund failed:', refund);
      return res.status(500).json({ error: 'Failed to process refund', details: refund });
    }
    
    res.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount.value,
      currency: refund.amount.currency_code,
      createTime: refund.create_time
    });
  } catch (error) {
    console.error('PayPal refund error:', error);
    res.status(500).json({ error: error.message || 'Failed to process refund' });
  }
});

/**
 * Verify webhook signature (for production use)
 */
router.post('/webhook', async (req, res) => {
  try {
    const webhookEvent = req.body;
    
    // Log webhook events for debugging
    console.log('PayPal Webhook Event:', webhookEvent.event_type);
    
    // Handle different webhook events
    switch (webhookEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment captured:', webhookEvent.resource.id);
        // Update contract payment status if needed
        break;
        
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('Payment denied:', webhookEvent.resource.id);
        // Handle failed payment
        break;
        
      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('Payment refunded:', webhookEvent.resource.id);
        // Update contract refund status
        break;
        
      default:
        console.log('Unhandled webhook event:', webhookEvent.event_type);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
