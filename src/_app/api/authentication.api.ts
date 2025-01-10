import { uploadDocument } from '@/lib/cloudinary/uploadDocument';
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
	async uploadDocument(document: File, userId: string) {
		// upload document
		const url = await uploadDocument(document);
		return this.httpReq.post<any>(`/identity-verification/documents`, {
			url,
			userId,
		});
	}
}

const authenticationApiRepository = new AuthenticationApiRepository(httpReq);
export default authenticationApiRepository;
