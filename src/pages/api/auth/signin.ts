import { connectToDatabase } from '@/db/db-connection';
import User from '@/db/schema/User.schema';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
			const { email, password } = req.body;

			// check data
			if (!email || !password) {
				return res
					.status(400)
					.json({ error: 'Email and password are required' });
			}

			// signin with supabase
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			// error response
			if (error) {
				return res.status(400).json({ error: error.message });
			}

			// find user
			const user = await User.findOne({ email });

			// handle not found error
			if (!user) {
				return res.status(400).json({ message: 'Invalid email or password.' });
			}

			// check password
			const isPasswordValid = await bcrypt.compare(password, user.password);

			// if password not matched
			if (!isPasswordValid) {
				return res.status(400).json({ message: 'Invalid email or password.' });
			}

			// generate JWT token
			const token = jwt.sign(
				{ id: user?._id, email: user?.email, role: user?.role }, // payload
				process.env.JWT_SECRET as string, // secret key
				{ expiresIn: process.env.JWT_EXPIRES } // Token expiration
			);

			// success response
			res.status(200).json({
				message: 'Login successful!',
				token,
				_id: user?._id,
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
