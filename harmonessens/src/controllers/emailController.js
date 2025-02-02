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
};

const sendContactEMail = async (req, res) => {
	const { firstName, lastName, email, phone, subject, message } = req.body;
	const mailOptions = createContactMail({ firstName, lastName, email, phone, subject, message });

	return sendMail(res, mailOptions);
};

const createAppointmentMail = ({ firstName, lastName, email, phone, title, message, day, time, appointmentId, inviteLink }) => {
	return {
		from: process.env.EMAIL_USER,
		to: `contact@harmonessens.fr, ${email}`,
		subject: `Rendez-Vous Harmonessens: ${title}`,
		html: `
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
		  <h2 style="color: #4CAF50;">Nouveau rendez-vous Harmonessens</h2>
		  <p><strong>De la part de:</strong></p>
		  <ul style="list-style-type: none; padding: 0;">
			<li><strong>Prénom:</strong> ${firstName}</li>
			<li><strong>Nom:</strong> ${lastName}</li>
			<li><strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50;">${email}</a></li>
			<li><strong>Téléphone:</strong> ${phone || "Non spécifié"}</li>
		  </ul>
		  
		  <p><strong>Horaires:</strong></p>
		  <ul style="list-style-type: none; padding: 0;">
			<li><strong>Le:</strong> ${day}</li>	
			<li><strong>À:</strong> ${time}</li>
		  </ul>

		  <p style="text-align: center;">
		    <a href="${process.env.REACT_APP_WEBSITE_URL}/seeAppointment/${appointmentId}" target="_blank" style="
		      display: inline-block;
		      background-color: #4CAF50;
		      color: white;
		      text-decoration: none;
		      padding: 12px 20px;
		      border-radius: 5px;
		      font-weight: bold;
		      font-size: 14px;
		      margin-bottom: 15px;
		    ">Voir ma réservation</a>
		  </p>
		  <p style="text-align: center;">
		    <a href="${inviteLink}" target="_blank" style="
		      display: inline-block;
		      background-color: #4CAF50;
		      color: white;
		      text-decoration: none;
		      padding: 12px 20px;
		      border-radius: 5px;
		      font-weight: bold;
		      font-size: 14px;
		    ">📅 Ajouter à Google Agenda</a>
		  </p>

		  <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
		  
		  ${message ? `
			<p><strong>Message:</strong></p>
			<p style="padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">${message}</p>
			<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
		  ` : ''}
		  
		  <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">

		  <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
		  
		  <p style="font-size: 0.9em; color: #888;">Cet email a été généré automatiquement depuis le site Harmonessens.</p>
		</div>
	  `,
	};
};


const sendAppointmentEMail = async (req, res) => {
	const { firstName, lastName, email, phone, title, message, day, time, appointmentId, inviteLink } = req.body;
	const mailOptions = createAppointmentMail({ firstName, lastName, email, phone, title, message, day, time, appointmentId, inviteLink });

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