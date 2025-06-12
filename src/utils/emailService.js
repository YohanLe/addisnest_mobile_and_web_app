const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '__cnY6DsRUizO1-QQVaP4w');

/**
 * Send an email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise} - SendGrid API response
 */
const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@addisnest.com',
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully');
    return response;
  } catch (error) {
    console.error('Email sending failed:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    throw error;
  }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @param {string} firstName - User's first name
 * @returns {Promise} - SendGrid API response
 */
const sendOTPEmail = async (email, otp, firstName) => {
  const subject = 'Your Addisnest Login OTP';
  const text = `Hello ${firstName || 'there'},\n\nYour OTP for logging into Addisnest is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.\n\nRegards,\nThe Addisnest Team`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Addisnest</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Hello ${firstName || 'there'},</p>
        <p>Your one-time password (OTP) for logging into Addisnest is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otp}</strong>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p>Regards,<br>The Addisnest Team</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} Addisnest. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail
};
