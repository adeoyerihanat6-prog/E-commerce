import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  console.log("📧 sendEmail() called for:", to);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ShopVibe Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.verify();
    console.log("SMTP Server is ready ✅");

    const info = await transporter.sendMail(mailOptions);
    console.log("Order Email sent successfully:", info.response);

    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error);
  }
};

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌"
);

export default sendEmail;