import { connectToDatabase } from '@/db/db-connection';
import Payment from '@/db/schema/Payment.schema';
import { getMailBody } from '@/lib/mail-service/getMailBody';
import { sendMail } from '@/lib/mail-service/mail-sender';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string); // secret API key

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// payment update
	if (req.method === 'PATCH') {
		try {
			const { paymentId: _id } = req.query;
			const { email, name, status } = req.body;

			// find payment
			const payment = await Payment.findOne({ _id });

			// email body
			const emailBody = getMailBody({
				name,
				status,
				payment,
			});

			// notify the user who pay the payment via email
			await sendMail(email, emailBody);

			// throw not found err
			if (!payment) {
				return res.status(400).json({ message: 'No payment found.' });
			}

			// review payment
			await Payment.updateOne(
				{ _id },
				{ $set: { status } },
				{ upsert: true, runValidators: true }
			);

			return res.status(200).json({
				message: 'Payment review success.',
				isSuccess: true,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed review payment.',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
