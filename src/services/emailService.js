const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.EMAIL_FROM;
    this.fromName = process.env.EMAIL_FROM_NAME || 'Earthen Strings';
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  // Initialize email transporter
  async initialize() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Verify connection
      await this.transporter.verify();
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Email service initialization failed:', error);
      throw error;
    }
  }

  // Send email with template
  async sendEmail(to, subject, html, text = null) {
    if (!this.transporter) {
      await this.initialize();
    }

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to,
      subject,
      html,
      text: text || this.stripHtml(html)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  // Send email verification
  async sendEmailVerification(user, token) {
    const verificationUrl = `${this.baseUrl}/verify-email?token=${token}`;
    
    const subject = 'Verify Your Email - Earthen Strings';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Earthen Strings!</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Earthen Strings Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Send password reset email
  async sendPasswordReset(user, token) {
    const resetUrl = `${this.baseUrl}/reset-password?token=${token}`;
    
    const subject = 'Reset Your Password - Earthen Strings';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${user.firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Earthen Strings Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Earthen Strings!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Earthen Strings!</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for joining our community! We're excited to have you on board.</p>
        <p>Start exploring our beautiful string art collection and discover unique pieces that will add character to your space.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.baseUrl}/products" 
             style="background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Browse Products
          </a>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Earthen Strings Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Send order confirmation
  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmation #${order._id} - Earthen Strings`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for your order! We've received your order and will begin processing it soon.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        
        <p>We'll send you updates as your order progresses.</p>
        <p>Best regards,<br>The Earthen Strings Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Send order status update
  async sendOrderStatusUpdate(user, order) {
    const subject = `Order Update #${order._id} - ${order.status}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Status Update</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your order status has been updated!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>New Status:</strong> ${order.status}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
          ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
        </div>
        
        <p>Thank you for choosing Earthen Strings!</p>
        <p>Best regards,<br>The Earthen Strings Team</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Strip HTML tags for text version
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}

module.exports = new EmailService(); 