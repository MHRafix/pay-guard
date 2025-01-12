import { connectToDatabase } from '@/db/db-connection';
import User from '@/db/schema/User.schema';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// signin logic
	if (req.method === 'GET') {
		try {
			const { userId } = req.query;

			// find user
			const user = await User.findOne(
				{ _id: userId },
				'-__v -password -createdAt -updatedAt'
			);

			// success response
			res.status(200).json({
				message: 'User get successful.',
				data: user,
			});
		} catch (err) {
			// error response
			res.status(500).json({
				message: 'Failed to get user.',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
