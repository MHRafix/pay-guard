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
			// find users
			const users = await User.find({});
			// await User.deleteOne({ _id: '677fe1ea0967ac4883729ccb' });

			// success response
			res.status(200).json({
				message: 'Users list get successful.',
				data: users,
			});
		} catch (err) {
			// error response
			res.status(500).json({
				message: 'Failed to get users list.',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
