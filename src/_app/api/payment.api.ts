import { AxiosInstance } from 'axios';
import httpReq from './axios/http';

class PaymentApiRepository {
	constructor(private httpReq: AxiosInstance) {}

	/**
	 * create payment api
	 * @param payload
	 * @returns
	 */
	async(payload: any) {
		return this.httpReq.post<any>(`/payments`, payload);
	}

	/**
	 * payments get api
	 * @returns
	 */
	async getPayments() {
		return this.httpReq.get<any>(`/payments`);
	}

	/**
	 * update payments api
	 * @param _id string
	 * @param status string
	 * @returns
	 */
	async updatePayments(_id: string, status: string) {
		return this.httpReq.patch<any>(`/payments/${_id}`, {
			status,
		});
	}
}

const paymentApiRepository = new PaymentApiRepository(httpReq);
export default paymentApiRepository;
