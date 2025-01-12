import { IApiResponse } from './api-response.model';
import { IUser } from './user.model';

export interface IDocument {
	_id: string;
	userId: IUser;
	document: string;
	status: string;
}

export interface IDocumentsApiResponse extends IApiResponse {
	data: IDocument[];
}
