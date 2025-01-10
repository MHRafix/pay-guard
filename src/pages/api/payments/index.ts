import { connectToDatabase } from '@/db/db-connection';
import Payment from '@/db/schema/Payment.schema';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// payment logic
	if (req.method === 'POST') {
		try {
			const payload = req.body;

			// create payment
			const payment = await Payment.create(payload);

			return res.status(200).json({
				message: 'Payment request created successfully.',
				data: payment,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed to create payment.',
			});
		}
	} else if (req.method === 'GET') {
		try {
			// find payments
			const payments = await Payment.aggregate([
				{
					$lookup: {
						from: 'users', // name of the collection
						localField: 'userId', // field in document
						foreignField: '_id', // field in User
						as: 'userId', // output array field
					},
				},
				{ $unwind: '$userId' }, // flatten the array if each document has one author
				{
					$project: {
						_id: 1, // Include the _id from FileDocument
						document: 1, // Include other FileDocument fields
						status: 1, // Include other FileDocument fields
						'userId.name': 1, // Include specific fields from the joined collection
						'userId.email': 1, // Include specific fields from the joined collection
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

// else if (req.method === 'PATCH') {
//   try {
//     const { _id, status } = req.body;

//     // find document
//     const document = await Payment.findOne({ _id });

//     // throw not found err
//     if (!document) {
//       return res.status(400).json({ message: 'No document found.' });
//     }

//     // verify document
//     await Payment.updateOne(
//       { _id },
//       { $set: { status } },
//       { upsert: true, runValidators: true }
//     );

//     return res.status(200).json({
//       message: 'Identity verification success.',
//       isSuccess: true,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: 'Failed verify identity.',
//     });
//   }
// }
