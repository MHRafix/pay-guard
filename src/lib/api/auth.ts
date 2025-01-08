// singup api
export const signup = async (email: string, password: string) => {
	const res = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});
	return res.json();
};

// signin api
export const signin = async (email: string, password: string) => {
	const res = await fetch('/api/auth/signin', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});
	return res.json();
};

// signout api
export const signout = async () => {
	const res = await fetch('/api/auth/signout', {
		method: 'POST',
	});
	return res.json();
};
