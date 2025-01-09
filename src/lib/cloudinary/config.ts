// document upload to cloudinary cloud service
export const uploadDocument = async (document: File) => {
	if (document?.size > 5242880) {
		console.log('first');
	} else {
		if (document) {
			console.log('second');
			const data = new FormData();
			data.append('file', document);
			data.append('upload_preset', 'identity-document');
			data.append('cloud_name', 'CoderXone');
			const upload_req = await fetch(
				'https://api.cloudinary.com/v1_1/CoderXone/image/upload',
				{
					method: 'POST',
					body: data,
				}
			);
			const file_uploaded = await upload_req.json();
			console.log({ file_uploaded });
			return file_uploaded.url;
		} else {
			return;
		}
	}
};
