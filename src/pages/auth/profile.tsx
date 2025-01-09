import authenticationApiRepository from '@/_app/api/authentication.api';
import { Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { NextPage } from 'next';

const MyProfilePage: NextPage = () => {
	// upload document mutation
	const { mutate, isPending } = useMutation({
		mutationKey: ['Upload_Document_Mutation'],
		mutationFn: (payload: File) =>
			authenticationApiRepository.uploadDocument(
				payload,
				'rafiz.mehedi@gmail.com'
			),
		onSuccess(res) {
			showNotification({
				title: 'Document uploaded successfully.',
				color: 'teal',
				icon: <IconCheck size={16} />,
				message: '',
			});
		},
		onError(error: AxiosError) {
			console.log({ error });
			showNotification({
				title: 'Failed to upload document.',
				color: 'red',
				icon: <IconX size={16} />,
				// @ts-ignore
				message: error?.response?.data?.error,
			});
		},
	});

	// handle upload document
	const handleUploadDocument = async (payload: File) => {
		console.log(payload);
		mutate(payload);
	};

	return (
		<div className='h-screen flex justify-center items-center'>
			<Dropzone
				onDrop={(files) => handleUploadDocument(files[0])}
				onReject={(files) => console.log('rejected files', files)}
				maxSize={3 * 1024 ** 2}
				accept={IMAGE_MIME_TYPE}
				multiple={false}
			>
				<div>
					<Text size='xl' inline>
						Drag images here or click to select files
					</Text>
					<Text size='sm' color='dimmed' inline mt={7}>
						Attach as many files as you like, each file should not exceed 5mb
					</Text>
				</div>
			</Dropzone>
		</div>
	);
};

export default MyProfilePage;
