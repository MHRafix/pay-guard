import authenticationApiRepository from '@/_app/api/authentication.api';
import { Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { NextPage } from 'next';

const MyProfilePage: NextPage = () => {
	// upload document mutation
	const { mutate, isPending, data } = useMutation({
		mutationKey: ['Upload_Document_Mutation'],
		mutationFn: (payload: File) =>
			authenticationApiRepository.uploadDocument(
				payload,
				'6781573ecaaf3a8a232f3141'
			),
		onSuccess(res: AxiosResponse) {
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
	console.log(data);
	// handle upload document
	const handleUploadDocument = async (payload: File) => {
		mutate(payload);
	};

	return (
		<div className='h-screen flex justify-center items-center'>
			<img src={data?.data?.data?.url} alt='' />
			<Dropzone
				onDrop={(files) => handleUploadDocument(files[0])}
				onReject={() =>
					showNotification({
						title: 'File is bigger than 5 mb',
						message: 'File should be smaller than 5 mb',
						color: 'yellow',
						icon: <IconInfoCircle />,
					})
				}
				maxSize={4 * 1024 ** 2}
				accept={IMAGE_MIME_TYPE}
				multiple={false}
				loading={isPending}
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
