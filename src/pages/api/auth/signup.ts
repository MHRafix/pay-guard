import { connectToDatabase } from '@/db/db-connection';
import User from '@/db/schema/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// db connect
	await connectToDatabase();

	if (req.method === 'POST') {
		const { name, email, password } = req.body;

		//
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ error: 'Name, email and password are required' });
		}

		// signup with supabase
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
				},
			},
		});

		// throw error
		if (error) {
			return res.status(400).json({ error: error.message });
		}

		// find exisiting user
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ message: 'User already exists.' });
		}

		// hash the password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// create the new user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		// generate JWT token
		const token = jwt.sign(
			{ id: user?._id, email: user?.email, role: user?.role }, // payload
			process.env.JWT_SECRET as string, // secret key
			{ expiresIn: process.env.JWT_EXPIRES } // Token expiration
		);

		// success response
		res.status(200).json({
			message: 'Signup successful.',
			data: {
				token: token,
			},
		});
	} else {
		// not found response
		res.json({
			message: 'Api route not found!',
		});
	}
}
