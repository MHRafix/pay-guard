import { IApiResponse } from './api-response.model';
import { IUser } from './user.model';

export interface IPayment {
	_id: string;
	title: string;
	amount: number;
	status: string;
	userId: IUser;
}

export interface IPaymentApiResponse extends IApiResponse {
	data: IPayment[];
}
