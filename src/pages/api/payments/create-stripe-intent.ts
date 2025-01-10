import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string); // secret API key

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const { amount, currency, description } = req.body;

			// Create a PaymentIntent
			const paymentIntent = await stripe.paymentIntents.create({
				amount, // Amount in smallest currency unit (e.g., cents for USD)
				currency, // e.g., 'usd'
				description,
				payment_method_types: ['card'], // Specify allowed payment methods
			});

			res.status(200).json({
				success: true,
				clientSecret: paymentIntent.client_secret, // Send client secret to the frontend
			});
		} catch (error) {
			console.error('Error creating payment intent:', error);
			res.status(500).json({ success: false, message: error });
		}
	} else {
		res.status(405).json({ success: false, message: 'Method not allowed' });
	}
}
