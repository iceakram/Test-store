const stripe = require('stripe');
const config = require('../config/config');

const stripeClient = stripe(config.stripe.secretKey);

class PaymentService {
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  async createRefund(paymentIntentId, amount = null) {
    try {
      const refund = await stripeClient.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error) {
      throw new Error(`Refund creation failed: ${error.message}`);
    }
  }

  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await stripeClient.customers.create({
        email,
        name,
        metadata,
      });

      return customer;
    } catch (error) {
      throw new Error(`Customer creation failed: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();
