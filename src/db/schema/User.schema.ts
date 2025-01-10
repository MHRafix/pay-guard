import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: 'USER' | 'ADMIN';
}

const userSchema: Schema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: false, default: 'USER' },
	},
	{ timestamps: true }
);

const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
