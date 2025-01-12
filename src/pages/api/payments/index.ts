import { connectToDatabase } from '@/db/db-connection';
import Payment from '@/db/schema/Payment.schema';
import { checkRole, verifyToken } from '@/utils/jwt/RoleGuard';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string); // secret API key

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	const token = req.headers?.authorization?.split('Bearer ')[1];
	const user = verifyToken(token!);

	// throw err
	if (!user) {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}

	// payment logic
	if (req.method === 'POST') {
		// check has access
		const hasAccess = checkRole(token!, ['USER']);

		if (!hasAccess) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}
		const payload = req.body;

		// create a payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: payload?.amount, // amount
			currency: 'BDT', // bdt
			payment_method_types: ['card'], // payment methods
		});

		if (!paymentIntent.client_secret) {
			return res.status(400).json({
				isSuccess: false,
				message: 'Failed to create payment in stripe',
			});
		}

		// create payment
		const payment = await Payment.create(payload);

		return res.status(200).json({
			message: 'Payment request created successfully.',
			data: { payment, paymentClientSecret: paymentIntent.client_secret },
		});
	} else if (req.method === 'GET') {
		// check has access
		const hasAccess = checkRole(token!, ['ADMIN']);

		if (!hasAccess) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}
		try {
			// find payments
			const payments = await Payment.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'userId',
					},
				},
				{ $unwind: '$userId' }, // flatten the array if each document has one author
				{
					$project: {
						_id: 1,
						title: 1,
						amount: 1,
						status: 1,
						'userId.name': 1,
						'userId.email': 1,
					},
				},
			]);

			// throw not found err
			if (!payments.length) {
				return res.status(400).json({ message: 'No payments found.' });
			}

			return res.status(200).json({
				message: 'All payments fetched successfully.',
				data: payments,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed to get payments',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
