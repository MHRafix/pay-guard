import { ISigninPayload, ISignupPayload } from '@/pages/auth/signin';
import { AxiosInstance } from 'axios';
import httpReq from './axios/http';

class AuthenticationApiRepository {
	constructor(private httpReq: AxiosInstance) {}

	/**
	 * signin api
	 * @param payload
	 * @returns
	 */
	signin(payload: ISigninPayload) {
		return this.httpReq.post<{ token: string }>(`/auth/signin`, payload);
	}

	/**
	 * signup api
	 * @param payload
	 * @returns
	 */
	signup(payload: ISignupPayload) {
		return this.httpReq.post<any>(`/auth/signup`, payload);
	}

	/**
	 * upload document api
	 * @param payload
	 * @returns
	 */
	uploadDocument(payload: File) {
		return this.httpReq.post<any>(`/auth/upload-document`, {
			document: payload,
		});
	}
}

const authenticationApiRepository = new AuthenticationApiRepository(httpReq);
export default authenticationApiRepository;
