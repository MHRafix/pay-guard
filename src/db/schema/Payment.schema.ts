import mongoose, { Document, Model, Schema } from 'mongoose';
import User from './User.schema';

export interface IPayment extends Document {
	title: string;
	cardNo: string;
	amount: number;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	userId: string;
}

const paymentSchema: Schema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		amount: { type: Number, required: true },
		status: { type: String, required: false, default: 'PENDING' },
		cardNo: { type: String, required: true, },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: User.name }, // reference to User
	},
	{ timestamps: true }
);

const Payment: Model<IPayment> =
	mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
