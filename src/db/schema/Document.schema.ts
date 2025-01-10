import mongoose, { Document, Model, Schema } from 'mongoose';
import User from './User.schema';

export interface IFileDocument extends Document {
	userId: string;
	document: string;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const documentSchema: Schema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name }, // reference to User
		document: { type: String, required: true },
		status: { type: String, required: false, default: 'PENDING' },
	},
	{ timestamps: true }
);

const FileDocument: Model<IFileDocument> =
	mongoose.models.FileDocument ||
	mongoose.model<IFileDocument>('FileDocument', documentSchema);

export default FileDocument;
