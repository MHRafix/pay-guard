import { connectToDatabase } from '@/db/db-connection';
import FileDocument from '@/db/schema/Document.schema';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	// upload document logic
	if (req.method === 'POST') {
		try {
			const { userId, url } = req.body;

			// find document
			const isExistDocument = await FileDocument.findOne({ userId });

			// update document
			if (isExistDocument) {
				await FileDocument.updateOne(
					{ userId },
					{ $set: { document: url } },
					{ upsert: true, runValidators: true }
				);

				return res.status(200).json({
					message: 'Document updated successfully.',
					isSuccess: true,
				});
			}

			// create document
			await FileDocument.create({ userId, document: url });

			return res.status(200).json({
				message: 'Document created successfully.',
				data: { url },
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed to upload document.',
			});
		}
	} else if (req.method === 'GET') {
		try {
			// find documents
			const documents = await FileDocument.aggregate([
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
						_id: 1, // include the _id from FileDocument
						document: 1, // include document fields
						status: 1, // include status fields
						'userId.name': 1, // include specific fields from the joined collection
						'userId.email': 1, // include specific fields from the joined collection
					},
				},
			]);

			// throw not found err
			if (!documents.length) {
				return res.status(400).json({ message: 'No documents found.' });
			}

			return res.status(200).json({
				message: 'All documents fetched successfully.',
				data: documents,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed to get documents',
			});
		}
	} else if (req.method === 'PATCH') {
		try {
			const { _id, status } = req.body;

			// find document
			const document = await FileDocument.findOne({ _id });

			// throw not found err
			if (!document) {
				return res.status(400).json({ message: 'No document found.' });
			}

			// verify document
			await FileDocument.updateOne(
				{ _id },
				{ $set: { status } },
				{ upsert: true, runValidators: true }
			);

			return res.status(200).json({
				message: 'Identity verification success.',
				isSuccess: true,
			});
		} catch (err) {
			res.status(500).json({
				message: 'Failed verify identity.',
			});
		}
	} else {
		// error response
		res.status(404).json({
			message: 'Not found!',
		});
	}
}
