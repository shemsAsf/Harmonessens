const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

const createContactMail = ({ firstName, lastName, email, phone, subject, message }) => {
	return {
		from: process.env.EMAIL_USER,
		to: "contact@harmonessens.fr",
		subject: `Message depuis le site web: ${subject}`,
		html: `
  	<div style="
		font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #333;
		max-width: 600px;
		margin: auto;
		background: #ffffff;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  	">

		<h2 style="color: #4CAF50; text-align: center;">📩 Nouveau message reçu</h2>

		<div style="
			background: #f9f9f9;
			padding: 15px;
			border-radius: 8px;
			border-left: 5px solid #4CAF50;
			margin-bottom: 20px;
		">
			<p><strong>📌 Informations de l'expéditeur:</strong></p>
			<ul style="list-style: none; padding: 0; margin: 0;">
				<li><strong>👤 Prénom:</strong> ${firstName}</li>
				<li><strong>👤 Nom:</strong> ${lastName}</li>
				<li><strong>✉️ Email:</strong> <a href="mailto:${email}" style="color: #4CAF50;">${email}</a></li>
				<li><strong>📞 Téléphone:</strong> ${phone || "Non spécifié"}</li>
			</ul>
		</div>

		<div style="
			background: #f9f9f9;
			padding: 15px;
			border-radius: 8px;
			border-left: 5px solid #4CAF50;
			margin-bottom: 20px;
		">
			<p><strong>💬 Message:</strong></p>
			<p style="padding: 10px; background: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
			${message}
			</p>
		</div>

		<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">

		<p style="font-size: 0.9em; text-align: center; color: #888;">
			Cet email a été généré automatiquement depuis le site <strong>Harmonessens</strong>.
		</p>
  	</div>
`

	};
};

const sendContactEMail = async (req, res) => {
	const { firstName, lastName, email, phone, subject, message } = req.body;
	const mailOptions = createContactMail({ firstName, lastName, email, phone, subject, message });

	return sendMail(res, mailOptions);
};

const sendMail = async (res, mailOptions) => {
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.status(500).json({ success: false, message: "Error sending email", error: error.message });
		}
		return res.status(200).json({ success: true, message: "Email sent successfully", response: info.response });
	});
}

module.exports = { sendContactEMail };