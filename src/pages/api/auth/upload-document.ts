import { connectToDatabase } from '@/db/db-connection';
import User from '@/db/schema/User';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// upload document logic
	if (req.method === 'PATCH') {
		try {
			const { url, email } = req.body;

			// find user
			const user = await User.findOne({ email });

			// console.log(url);
			if (!user) {
				return res.status(400).json({ message: 'User not found.' });
			}

			// update the new user
			const updatedUser = await User.updateOne(
				{ email },
				{ $set: { identityDocument: url } },
				{ upsert: true, runValidators: true }
			);

			return res.status(200).json({
				message: 'Document uploaded successfully.',
				data: {url},
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed to upload',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
