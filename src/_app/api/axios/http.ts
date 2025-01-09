import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const httpReq: AxiosInstance = axios.create({
	baseURL: '/api',
	withCredentials: true,
	headers: {
		'Content-type': 'application/json',
	},
});

httpReq.interceptors.request.use(
	(config: any) => {
		const userInfo = Cookies.get('user') && JSON.parse(Cookies.get('user')!);
		return {
			...config,
			headers: {
				...config.headers,
				// Authorization: userInfo?.token ? `Bearer ${userInfo?.token}` : '',
				Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZlMWVhMDk2N2FjNDg4MzcyOWNjYiIsImVtYWlsIjoicmFmaXoubWVoZWRpQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzM2NDM0MTU0LCJleHAiOjE3MzY2OTMzNTR9.egndHvWcJm8NoUKgImHMWcX99L0W4ErgCZFG5RHZfnQ`,
			},
		};
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default httpReq;
