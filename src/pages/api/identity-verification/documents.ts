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

			// throw err
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
			const documents = await FileDocument.find().populate(
				'userId',
				'name email'
			);

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
