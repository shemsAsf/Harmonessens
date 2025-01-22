const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendClientEMail = async (req, res) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "contact@harmonessens.fr",
      subject: `Message depuis le site web: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Nouveau message depuis le site web</h2>
          <p><strong>De la part de:</strong></p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Prénom:</strong> ${firstName}</li>
            <li><strong>Nom:</strong> ${lastName}</li>
            <li><strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50;">${email}</a></li>
            <li><strong>Téléphone:</strong> ${phone || "Non spécifié"}</li>
          </ul>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #888;">Cet email a été généré automatiquement depuis le site Harmonessens.</p>
        </div>
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: "Error sending email", error: error.message });
      }
      res.status(200).json({ success: true, message: "Email sent successfully", response: info.response });
    });
  };

  module.exports = { sendClientEMail };