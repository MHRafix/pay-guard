import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		const { email, password } = req.body;
		console.log(req.body);
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		res.status(200).json({
			message: 'Signup successful! Please check your email to confirm.',
		});
	} else {
		res.json({
			message: 'Api route not found!',
		});
	}
}
