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
		const hasAccess = checkRole(token!, ['ADMIN']);

		if (!hasAccess) {
			return res.status(401).json({
				message: 'Unauthorized',
			});
		}

		const { status, filterDate } = req.body;

		// filter pipeline
		const pipeline: any[] = [];

		// filter push to pipeline
		if (status) pipeline.push({ $match: { status } }); // filter by genre

		// get the current date
		const nextDateOfFilterDate = new Date(filterDate);

		// qdd one day to the current date
		nextDateOfFilterDate.setDate(nextDateOfFilterDate.getDate() + 1);

		// filter by publication date
		if (filterDate) {
			pipeline.push({
				$match: {
					createdAt: {
						$gte: new Date(filterDate),
						$lte: nextDateOfFilterDate,
					},
				},
			});
		}

		let payments = [];

		if (pipeline.length) {
			payments = await Payment.aggregate(pipeline);
		} else {
			payments = await Payment.find({});
		}

		let totalAmount = 0;
		payments?.map((payment) => (totalAmount = totalAmount + payment?.amount));

		return res.status(200).json({
			message: 'Payment request created successfully.',
			data: { totalPayment: totalAmount },
		});
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
