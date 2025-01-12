import { AxiosInstance } from 'axios';
import httpReq from '../axios-config/http';
import { IPaymentApiResponse } from '../type-model/payment.model';

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
		return this.httpReq.get<IPaymentApiResponse>(`/payments`);
	}

	/**
	 * update payments api
	 * @param _id string
	 * @param status string
	 * @returns
	 */
	async updatePayments(
		_id: string,
		name: string,
		email?: string,
		status?: string
	) {
		return this.httpReq.patch<any>(`/payments/${_id}`, {
			status,
			name,
			email,
		});
	}
}

const paymentApiRepository = new PaymentApiRepository(httpReq);
export default paymentApiRepository;
