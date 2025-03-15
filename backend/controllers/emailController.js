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

const createAppointmentMail = ({ firstName, lastName, email, phone, title, message, isOnline, day, time, appointmentId, inviteLink }) => {
	return {
		from: process.env.EMAIL_USER,
		to: `contact@harmonessens.fr, ${email}`,
		subject: `Rendez-Vous Harmonessens: ${title}`,
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

		<h2 style="color: #4CAF50; text-align: center;">✨ Nouveau Rendez-vous Harmonessens ✨</h2>

		<div style="
			background: #f9f9f9;
			padding: 15px;
			border-radius: 8px;
			border-left: 5px solid #4CAF50;
			margin-bottom: 20px;
		">
			<p><strong>De la part de:</strong></p>
			<ul style="list-style: none; padding: 0; margin: 0;">
			<li><strong>Prénom:</strong> ${firstName}</li>
			<li><strong>Nom:</strong> ${lastName}</li>
			<li><strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50;">${email}</a></li>
			 ${phone == null ? `` : `<li><strong>Téléphone:</strong>${phone}</li>`}
			</ul>
		</div>

		<div style="
			background: #f9f9f9;
			padding: 15px;
			border-radius: 8px;
			border-left: 5px solid #4CAF50;
			margin-bottom: 20px;
		">
			<p><strong>🕒 Horaires du rendez-vous:</strong></p>
			<ul style="list-style: none; padding: 0; margin: 0;">
			<li><strong>📅 Date:</strong> ${day}</li>
			<li><strong>⏰ Heure:</strong> ${time}</li>
			 ${isOnline ? `<li><strong>🌎Rendez-vous en ligne</strong></li>` : ``}
			</ul>
		</div>

		<div style="text-align: center; margin-bottom: 20px;">
			<a href="${process.env.ALLOWED_ORIGIN}/seeAppointment/${appointmentId}" target="_blank" style="
			display: inline-block;
			background-color: #4CAF50;
			color: white;
			text-decoration: none;
			padding: 14px 22px;
			border-radius: 6px;
			font-weight: bold;
			font-size: 16px;
			margin-right: 10px;
			">🔍 Voir ma réservation</a>

			<a href="${inviteLink}" target="_blank" style="
			display: inline-block;
			background-color: #4CAF50;
			color: white;
			text-decoration: none;
			padding: 14px 22px;
			border-radius: 6px;
			font-weight: bold;
			font-size: 16px;
			">📅 Ajouter à Google Agenda</a>
		</div>

		${message ? `
			<div style="
			background: #f9f9f9;
			padding: 15px;
			border-radius: 8px;
			border-left: 5px solid #4CAF50;
			margin-bottom: 20px;
			">
			<p><strong>📩 Message du client:</strong></p>
			<p style="padding: 10px; background: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
				${message}
			</p>
			</div>
		` : ''}

		${isOnline == 1 ? `
			<div style="
				background: #f9f9f9;
				padding: 15px;
				border-radius: 8px;
				border-left: 5px solid #4CAF50;
				margin-bottom: 20px;
			">
				<p><strong>📜 Déroulement d’un soin à distance :</strong></p>
				<p>Il vous suffit de réserver votre rendez-vous à la date et à l’heure qui vous conviennent. 
				Le jour du soin, je vous contacterai via WhatsApp pour un premier échange afin de poser l’intention du soin ensemble. 
				Ensuite, vous serez invité(e) à vous installer confortablement dans un espace au calme, propice à l’écoute intérieure. 
				Pour profiter pleinement de ce moment, vous pouvez allumer une bougie, diffuser un encens si cela vous parle, et écouter 
				en fond un voyage chamanique pour accompagner la détente.</p>
				<p>Pendant ce temps, je prendrai le temps de réaliser le soin, en lien avec votre volonté et le besoin que vous avez exprimé. 
				Nous échangerons ensuite ensemble sur ce qui a été fait, votre ressenti et votre expérience du soin.</p>
				<p>Un moment d’alignement et de connexion avec vous-même. ✨</p>
			</div>
		` : ''}
		
		<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">

		<p style="font-size: 0.9em; text-align: center; color: #888;">
			Cet email a été généré automatiquement depuis le site <strong>Harmonessens</strong>.
		</p>
	</div>
`
	};
};

const sendAppointmentEMail = async (req, res) => {
	const { firstName, lastName, email, phone, title, message, isOnline, day, time, appointmentId, inviteLink } = req.body;
	const mailOptions = createAppointmentMail({ firstName, lastName, email, phone, title, message, isOnline, day, time, appointmentId, inviteLink });

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

module.exports = { sendContactEMail, sendAppointmentEMail };