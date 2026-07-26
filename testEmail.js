// backend/testEmail.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('--- ENV CHECK ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***** (Loaded)' : 'MISSING!');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,             // Port 587 bypasses blocked SMTPS ports
  secure: false,        // false for 587 (uses STARTTLS)
  requireTLS: true,     // Forces TLS security
  family: 4,            // FORCES IPv4 (Fixes ENETUNREACH)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Prevents certificate issues on Windows
  }
});

async function runTest() {
  try {
    console.log('\n1. Verifying SMTP connection...');
    await transporter.verify();
    console.log('SUCCESS: Connected to Gmail SMTP server!');

    console.log('\n2. Attempting to send test email...');
    const info = await transporter.sendMail({
      from: `"ShopVibe Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from ShopVibe',
      text: 'If you see this, your email setup is working 100%!',
    });

    console.log('SUCCESS: Email sent!', info.response);
  } catch (error) {
    console.error('\nERROR DETAILS:');
    console.error(error);
  }
}

runTest();