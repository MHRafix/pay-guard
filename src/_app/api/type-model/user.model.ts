import { IApiResponse } from './api-response.model';

export interface IUser {
	_id: string;
	name: string;
	email: string;
	role: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserApiResponse extends IApiResponse {
	data: IUser;
}

export interface IUsersApiResponse extends IApiResponse {
	data: IUser[];
}
