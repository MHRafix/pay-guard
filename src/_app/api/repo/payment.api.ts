import { AxiosInstance } from 'axios';
import httpReq from '../axios-config/http';

class PaymentApiRepository {
	constructor(private httpReq: AxiosInstance) {}

	/**
	 * create payment api
	 * @param payload
	 * @returns
	 */
	async payPayment(payload: any) {
		const res = await this.httpReq.post<any>(`/payments`, payload);
		return res.data;
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
