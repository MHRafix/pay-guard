import { connectToDatabase } from '@/db/db-connection';
import User from '@/db/schema/User';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// user get logic
	if (req.method === 'GET') {
		try {

			// find users
			const users = await User.find({});

			// console.log(url);
			if (!users.length) {
				return res.status(400).json({ message: 'No users found.' });
			}

			return res.status(200).json({
				message: 'All users list get successfully.',
				data: users,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed to get users list',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
