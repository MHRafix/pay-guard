import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL_USER, // email
		pass: process.env.APP_PASSWORD, // app password
	},
});

// send email
export async function sendMail(sendTo: string, __htmlPayload: string) {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: sendTo,
		subject: 'Reply from PayGuard',
		html: __htmlPayload,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Email sent successfully!');
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
}
