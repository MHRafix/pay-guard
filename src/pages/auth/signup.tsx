import authenticationApiRepository from '@/_app/api/authentication.api';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Flex,
	Input,
	Paper,
	PasswordInput,
	Space,
	Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
	IconCheck,
	IconLock,
	IconLogin,
	IconMail,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const SignUpPage: NextPage = () => {
	// signup form
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({
		defaultValues: { email: '' },
		resolver: yupResolver(signup_Form_Validation_Schema),
	});

	// signup mutation
	const { mutate, isPending } = useMutation({
		mutationKey: ['Signup_Mutation'],
		mutationFn: (payload: ISignupPayload) =>
			authenticationApiRepository.signup(payload),
		onSuccess(res) {
			showNotification({
				title: 'Registration successful.',
				color: 'teal',
				icon: <IconCheck size={16} />,
				message: '',
			});
		},
		onError(error: AxiosError) {
			console.log({ error });
			showNotification({
				title: 'Failed to signup.',
				color: 'red',
				icon: <IconX size={16} />,
				// @ts-ignore
				message: error?.response?.data?.error,
			});
		},
	});

	// handle signup
	const handleSignup = async (payload: ISignupPayload) => {
		mutate(payload);
	};

	return (
		<Flex justify='center' align='center' h='100vh'>
			<Paper className='xs:w-11/12 lg:w-5/12 p-5 drop-shadow-xl rounded-md'>
				<Title order={2} mb={10} ff={'Nunito sans, sans-serif'}>
					Register Now
				</Title>
				<form onSubmit={handleSubmit(handleSignup)}>
					<Input.Wrapper
						label='Name'
						my={10}
						error={<ErrorMessage errors={errors} name='name' />}
					>
						<Input
							disabled={isPending}
							{...register('name')}
							icon={<IconUser size={20} />}
							placeholder='Your name'
							size='md'
							variant='filled'
							style={{
								fontFamily: 'Nunito sans, sans-serif !important',
							}}
						/>
					</Input.Wrapper>
					<Input.Wrapper
						label='Email'
						my={10}
						error={<ErrorMessage errors={errors} name='email' />}
					>
						<Input
							disabled={isPending}
							{...register('email')}
							icon={<IconMail size={20} />}
							placeholder='Your email'
							size='md'
							variant='filled'
							style={{
								fontFamily: 'Nunito sans, sans-serif !important',
							}}
						/>
					</Input.Wrapper>

					<Input.Wrapper
						label='Email'
						my={10}
						error={<ErrorMessage errors={errors} name='password' />}
					>
						<PasswordInput
							disabled={isPending}
							{...register('password')}
							icon={<IconLock size={20} />}
							placeholder='Your Password'
							size='md'
							variant='filled'
							style={{
								fontFamily: 'Nunito sans, sans-serif !important',
							}}
						/>
					</Input.Wrapper>

					<Space h={'xs'} />

					<Button
						type='submit'
						color='violet'
						size='md'
						loading={isPending}
						fullWidth
						mt={10}
					>
						Register now
					</Button>
				</form>
				<div className='text-left mt-3 text-pink-300'>
					<Link href='/auth/signin'>
						<Button color='teal' leftIcon={<IconLogin size={18} />}>
							Signin now
						</Button>
					</Link>
				</div>
			</Paper>
		</Flex>
	);
};

export default SignUpPage;

export const signup_Form_Validation_Schema = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	email: Yup.string().email().required().label('Email'),
	password: Yup.string().min(8).max(20).required().label('Password'),
});

export interface ISigninPayload {
	email: string;
	password: string;
}

export interface ISignupPayload extends ISigninPayload {
	name: string;
}
