import { connectToDatabase } from '@/db/db-connection';
import User from '@/db/schema/User';
import { uploadDocument } from '@/lib/cloudinary/config';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// signin logic
	if (req.method === 'PATCH') {
		try {
			const { document, email } = req.body;

			// document upload to cloudinary
			const url = await uploadDocument(document);

			// find user
			const user = await User.findOne({ email });

			console.log(url);
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
				message: 'Document updated successfully.',
				data: updatedUser,
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
