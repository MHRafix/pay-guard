import paymentApiRepository from '@/_app/api/repo/payment.api';
import { useGetSession } from '@/_app/hooks/useGetSession';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, NumberInput, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
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
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const cardStyle: StripeCardNumberElementOptions = {
	style: {
		base: {
			color: '#000',
			fontFamily: 'Arial, sans-serif',
			fontSize: '13px',
		},
		invalid: {
			color: '#fa755a',
		},
	},
};

const PaymentForm: React.FC = () => {
	const stripe = useStripe();
	const elements = useElements();

	const { user } = useGetSession();

	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(Payment_Form_Validation_Schema),
	});

	// confirm payment with stripe
	const handleStripeSubmit = async (clientSecret: string) => {
		if (!stripe || !elements) return;

		const cardNumberElement = elements.getElement(CardNumberElement);

		try {
			// Confirm payment
			const { error, paymentIntent } = await stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: cardNumberElement!,
					},
				}
			);

			if (error) {
				showNotification({
					title: 'Failed to payment.',
					color: 'red',
					icon: <IconX size={16} />,
					// @ts-ignore
					message: error?.response?.data?.error,
				});
			} else if (paymentIntent?.status === 'succeeded') {
				showNotification({
					title: 'Payment successful.',
					color: 'teal',
					icon: <IconCheck size={16} />,
					message: '',
				});
			}
		} catch (err) {
			showNotification({
				title: 'Failed to payment.',
				color: 'red',
				icon: <IconX size={16} />,
				// @ts-ignore
				message: error?.response?.data?.error,
			});
		}
	};

	// payment mutation
	const { mutate: paymentMutate, isPending: paymentInProgress } = useMutation({
		mutationKey: ['Payment_Mutation'],
		mutationFn: (payload: any) => paymentApiRepository.payPayment(payload),
		onSuccess(res) {
			handleStripeSubmit(res?.data?.paymentClientSecret);
		},
		onError(error: AxiosError) {
			showNotification({
				title: 'Failed to payment.',
				color: 'red',
				icon: <IconX size={16} />,
				// @ts-ignore
				message: error?.response?.data?.error,
			});
		},
	});

	const handleFormSubmit = (payload: IPaymentFormType) => {
		const apiPayload = { ...payload, status: 'PENDING', userId: user?._id };
		paymentMutate(apiPayload);
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<div className='bg-slate-700 p-5 rounded-md lg:w-6/12 mx-auto'>
				<div className='bg-white p-3 rounded-md'>
					<Input.Wrapper
						label='Title'
						error={<ErrorMessage name='title' errors={errors} />}
					>
						<Input
							{...register('title')}
							variant='unstyled'
							placeholder='Pay product price'
						/>
					</Input.Wrapper>
				</div>
				<Space h={'md'} />
				<div className='bg-white p-3 rounded-md'>
					<Input.Wrapper
						label='Amount'
						error={<ErrorMessage name='amount' errors={errors} />}
					>
						<NumberInput
							onChange={(e) => setValue('amount', parseInt(e as string))}
							min={1}
							variant='unstyled'
							placeholder='2000.00'
						/>
					</Input.Wrapper>
				</div>
				<Space h={'md'} />
				<div className='bg-white p-3 rounded-md'>
					<Input.Wrapper label='Card Number'>
						<Space h={8} />
						<CardNumberElement options={cardStyle} />
					</Input.Wrapper>
				</div>
				<Space h={'md'} />
				<div className='bg-white p-3 rounded-md'>
					<Input.Wrapper label='Expire Date'>
						<Space h={8} />
						<CardExpiryElement
							options={cardStyle as StripeCardExpiryElementOptions}
						/>
					</Input.Wrapper>
				</div>{' '}
				<Space h={'md'} />
				<div className='bg-white p-2 rounded-md'>
					<Input.Wrapper label='CVC'>
						<Space h={8} />
						<CardCvcElement
							options={cardStyle as StripeCardCvcElementOptions}
						/>
					</Input.Wrapper>
				</div>{' '}
				<Space h={'md'} />
				<Button
					type='submit'
					disabled={!stripe}
					className='pay-button'
					loading={paymentInProgress}
					fullWidth
					size='lg'
				>
					Pay
				</Button>
			</div>
		</form>
	);
};

export default PaymentForm;

export const Payment_Form_Validation_Schema = Yup.object().shape({
	title: Yup.string().required().label('Title'),
	amount: Yup.number().required().label('Amount'),
});

export interface IPaymentFormType {
	title: string;
	amount: number;
}
// title
// amount
// status
// cardNo
// userId
