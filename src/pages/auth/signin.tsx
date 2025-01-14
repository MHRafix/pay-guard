import authenticationApiRepository from '@/_app/api/repo/authentication.api';
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
	IconMail,
	IconUserPlus,
	IconX,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const SigninPage: NextPage = () => {
	const router = useRouter(); // router instance

	// signin form
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({
		defaultValues: { email: '' },
		resolver: yupResolver(Signin_Form_Validation_Schema),
	});

	// execute after success
	const onSuccess = (res: { _id: string; token: string }) => {
		Cookies.set(
			'user',
			JSON.stringify({
				token: res?.token,
				_id: res?._id,
			}),
			{
				expires: 60 / (24 * 60),
				sameSite: 'strict',
			}
		);
		if (router?.query?.callback) {
			router?.push(router?.query?.callback as string);
		} else {
			router?.push('/');
		}
	};

	// signin mutation
	const { mutate, isPending } = useMutation({
		mutationKey: ['Signin_Mutation'],
		mutationFn: (payload: ISigninPayload) =>
			authenticationApiRepository.signin(payload),
		onSuccess(res: any) {
			onSuccess(res?.data);
			showNotification({
				title: 'Login successful.',
				color: 'teal',
				icon: <IconCheck size={16} />,
				message: '',
			});
		},
		onError(error: AxiosError) {
			console.log({ error });
			showNotification({
				title: 'Failed to signin.',
				color: 'red',
				icon: <IconX size={16} />,
				// @ts-ignore
				message: error?.response?.data?.error,
			});
		},
	});

	// handle sign in
	const handleSignin = async (payload: ISigninPayload) => {
		mutate(payload);
	};

	return (
		<Flex justify='center' align='center' h='100vh'>
			<Paper className='xs:w-11/12 lg:w-5/12 p-5 drop-shadow-xl rounded-md'>
				<Title order={2} mb={10} ff={'Nunito sans, sans-serif'}>
					Login Now
				</Title>
				<form onSubmit={handleSubmit(handleSignin)}>
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
						Login now
					</Button>
				</form>

				<div className='text-right mt-3'>
					<Link href='/auth/signup'>
						<Button color='teal' rightIcon={<IconUserPlus size={18} />}>
							Register now
						</Button>
					</Link>
				</div>
			</Paper>
		</Flex>
	);
};

export default SigninPage;

export const Signin_Form_Validation_Schema = Yup.object().shape({
	email: Yup.string().email().required().label('Email'),
	password: Yup.string().min(4).max(20).required().label('Password'),
});

export interface ISigninPayload {
	email: string;
	password: string;
}

export interface ISignupPayload extends ISigninPayload {
	name: string;
}
