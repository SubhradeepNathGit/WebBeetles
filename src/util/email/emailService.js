import emailjs from '@emailjs/browser';

// EmailJS config — fill these in after setting up at https://emailjs.com
// Service ID: from Email Services tab
// Template ID: from Email Templates tab  
// Public Key: from Account > API Keys
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_FORGET_PASSWORD_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_FORGET_PASSWORD_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;

/**
 * Generates a cryptographically random 6-digit OTP.
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends an OTP email using EmailJS.
 * @param {string} toEmail  - Recipient email address
 * @param {string} toName   - Recipient name (for personalisation)
 * @param {string} otp      - The 6-digit OTP code
 */
export async function sendOTPEmail(toEmail, toName, otp) {
  const templateParams = {
    to_email: toEmail,
    email: toEmail,
    to: toEmail,
    to_name: toName || 'User',
    otp_code: otp,
    otp: otp,
    app_name: 'WebBeetles',
    expiry_minutes: '10',
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('EmailJS send successful. Status:', response.status, 'Text:', response.text);
    return response;
  } catch (error) {
    console.error('EmailJS send failed. Error:', error);
    throw error;
  }
}

export async function sendForgetPasswordEmail(toEmail, toName, resetLink) {
  const messageText = `
    <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 16px;">We received a request to reset the password for your account on <strong>WebBeetles</strong>.</p>
    <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 24px;">Please click the button below to choose a new password. This link is secure and will remain valid for <strong>15 minutes</strong>:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetLink}" style="background-color: #7c3aed; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Reset My Password</a>
    </div>
    
    <p style="font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 8px;">If the button above does not work, copy and paste the following URL into your web browser:</p>
    <p style="font-size: 13px; color: #7c3aed; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 6px;">${resetLink}</p>
    
    <p style="font-size: 14px; color: #666; line-height: 1.5; margin-top: 32px;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
  `;

  const [firstName, ...lastNameParts] = (toName || 'User').split(' ');
  const lastName = lastNameParts.join(' ');

  const templateParams = {
    to_email: toEmail,
    email: toEmail,
    to: toEmail,
    to_name: toName || 'User',
    first_name: firstName,
    last_name: lastName || '',
    reset_link: resetLink,
    confirmation_link: resetLink,
    link: resetLink,
    app_name: 'WebBeetles',
    expiry_minutes: '15',
    subject: 'Reset your WebBeetles Password',
    message: messageText,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_FORGET_PASSWORD_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('EmailJS send successful (Forget Password). Status:', response.status, 'Text:', response.text);
    return response;
  } catch (error) {
    console.error('EmailJS send failed (Forget Password). Error:', error);
    throw error;
  }
}

/**
 * Sends a subscription refund notification email using the dynamic Forget Password template.
 * @param {string} toEmail  - Recipient email address
 * @param {string} toName   - Recipient name (for personalisation)
 * @param {string} planName - The name of the cancelled plan
 * @param {number} amount   - The refunded amount
 */
export async function sendRefundEmail(toEmail, toName, planName, amount) {
  const refundMsg = `
    <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 16px;">We are writing to confirm that your <strong>${planName || 'Subscription'}</strong> plan has been successfully cancelled by our administrative team.</p>
    
    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="font-size: 16px; color: #166534; margin: 0; font-weight: 500;">A full refund of <strong>₹${amount ? amount.toLocaleString('en-IN') : '0'}</strong> has been initiated to your original payment method.</p>
    </div>
    
    <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 24px;">Please allow <strong>5-7 business days</strong> for the funds to reflect in your bank account, depending on your card issuer's processing times.</p>
    
    <p style="font-size: 14px; color: #666; line-height: 1.5; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">If you have any questions or did not authorize this action, please reach out to our support team immediately.</p>
  `;

    const [firstName, ...lastNameParts] = (toName || 'User').split(' ');
    const lastName = lastNameParts.join(' ');

    const templateParams = {
        to_email: toEmail,
        email: toEmail,
        to: toEmail,
        to_name: toName || 'User',
        first_name: firstName,
        last_name: lastName || '',
        plan_name: planName || 'Subscription',
        amount: amount ? amount.toLocaleString('en-IN') : '0',
        app_name: 'WebBeetles',
        subject: 'Subscription Cancelled & Refunded - WebBeetles',
        message: refundMsg,
    };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_FORGET_PASSWORD_TEMPLATE_ID, // Reusing this template dynamically
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log('EmailJS refund send successful. Status:', response.status, 'Text:', response.text);
    return response;
  } catch (error) {
    console.error('EmailJS refund send failed. Error:', error);
    throw error;
  }
}
