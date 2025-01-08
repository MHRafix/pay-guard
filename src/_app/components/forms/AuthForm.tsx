import { signin, signout, signup } from '@/lib/api/auth';
import { useState } from 'react';

const AuthForm = () => {
	const [email, setEmail] = useState(''); // email
	const [password, setPassword] = useState(''); // password

	// signup api handler
	const handleSignup = async () => {
		const response = await signup(email, password);
		alert(response.message || response.error);
	};

	// signin api handler
	const handleSignin = async () => {
		const response = await signin(email, password);
		alert(response.message || response.error);
	};

	// sing out api handler
	const handleSignout = async () => {
		const response = await signout();
		alert(response.message || response.error);
	};

	return (
		<div>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button className='px-4 py-3 p-2 bg-slate-500' onClick={handleSignup}>
				Sign Up
			</button>
			<button className='px-4 py-3 p-2 bg-slate-500' onClick={handleSignin}>
				Log In
			</button>
			<button className='px-4 py-3 p-2 bg-slate-500' onClick={handleSignout}>
				Log Out
			</button>
		</div>
	);
};

export default AuthForm;
