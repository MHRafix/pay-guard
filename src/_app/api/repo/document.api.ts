import { uploadDocument } from '@/lib/cloudinary/uploadDocument';
import { AxiosInstance } from 'axios';
import httpReq from '../axios-config/http';

class DocumentApiRepository {
	constructor(private httpReq: AxiosInstance) {}

	/**
	 * upload document api
	 * @param document File
	 * @param userId string
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

	/**
	 * documents get api
	 * @returns
	 */
	async getDocuments() {
		return this.httpReq.get<any>(`/identity-verification/documents`);
	}

	/**
	 * verify documents api
	 * @param _id string
	 * @param status string
	 * @returns
	 */
	async verifyDocuments(_id: string, status: string) {
		return this.httpReq.patch<any>(`/identity-verification/documents`, {
			_id,
			status,
		});
	}
}

const documentApiRepository = new DocumentApiRepository(httpReq);
export default documentApiRepository;
