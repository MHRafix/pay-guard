import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import {
	StripeCardCvcElementOptions,
	StripeCardExpiryElementOptions,
	StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import { useState } from 'react';

const cardStyle: StripeCardNumberElementOptions = {
	style: {
		base: {
			color: '#32325d',
			fontFamily: 'Arial, sans-serif',
			fontSize: '16px',
			'::placeholder': {
				color: '#a0aec0',
			},
		},
		invalid: {
			color: '#fa755a',
		},
	},
};

const PaymentForm: React.FC = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);

		if (!stripe || !elements) return;

		const cardNumberElement = elements.getElement(CardNumberElement);

		setLoading(true);

		try {
			// Call your API to create a PaymentIntent
			const res = await fetch('/api/payments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ amount: 1000, currency: 'usd' }), // Replace with dynamic amount/currency
			});

			const { clientSecret } = await res.json();

			// Confirm payment
			const { error, paymentIntent } = await stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: cardNumberElement!,
						payment_method: 'card',
						billing_details: {},
					},
				}
			);

			if (error) {
				setError(error.message || 'Payment failed');
			} else if (paymentIntent?.status === 'succeeded') {
				alert('Payment successful!');
			}
		} catch (err) {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Card Number</label>
				<CardNumberElement options={cardStyle} />
			</div>
			<div>
				<label>Expiry Date</label>
				<CardExpiryElement
					options={cardStyle as StripeCardExpiryElementOptions}
				/>
			</div>
			<div>
				<label>CVC</label>
				<CardCvcElement options={cardStyle as StripeCardCvcElementOptions} />
			</div>
			<button
				type='submit'
				disabled={!stripe || loading}
				className='pay-button'
			>
				{loading ? 'Processing...' : 'Pay'}
			</button>
			{error && <div className='error'>{error}</div>}
		</form>
	);
};

export default PaymentForm;
