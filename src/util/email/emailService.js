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
 * Generates a cryptographically random 8-digit OTP.
 */
export function generateOTP() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
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

/**
 * Sends a password reset OTP email using EmailJS.
 * @param {string} toEmail  - Recipient email address
 * @param {string} toName   - Recipient name (for personalisation)
 * @param {string} otp      - The OTP code
 */
export async function sendForgetPasswordEmail(toEmail, toName, otp) {
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
