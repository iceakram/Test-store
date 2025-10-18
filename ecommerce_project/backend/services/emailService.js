const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: config.email.from,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Our E-Commerce Store';
    const html = `
      <h1>Welcome, ${user.firstName}!</h1>
      <p>Thank you for registering at our store.</p>
      <p>We're excited to have you as a customer.</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const html = `
      <h1>Order Confirmation</h1>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for your order!</p>
      <p>Order Number: ${order.orderNumber}</p>
      <p>Total: $${order.total}</p>
      <p>We'll notify you when your order ships.</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendPasswordReset(user, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${config.corsOrigin}/reset-password/${resetToken}`;
    const html = `
      <h1>Password Reset</h1>
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  async sendOrderStatusUpdate(user, order) {
    const subject = `Order Status Update - ${order.orderNumber}`;
    const html = `
      <h1>Order Status Update</h1>
      <p>Dear ${user.firstName},</p>
      <p>Your order ${order.orderNumber} status has been updated to: <strong>${order.status}</strong></p>
      ${order.trackingNumber ? `<p>Tracking Number: ${order.trackingNumber}</p>` : ''}
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
