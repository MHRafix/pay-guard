import { connectToDatabase } from '@/db/db-connection';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// signin logic
	if (req.method === 'POST') {
		try {
			const { document } = req.body;
			console.log({ document });

			// success response
			res.status(200).json({
				message: 'Documnet uploaded successfully!',
			});
		} catch (err) {
			// error response
			res.status(500).json({
				message: 'Failed to login',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
