import authenticationApiRepository from '@/_app/api/repo/authentication.api';
import { useGetSession } from '@/_app/hooks/useGetSession';
import { Anchor, Space, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import {
	IconCheck,
	IconFile,
	IconInfoCircle,
	IconX,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

const VerifyIdentityForm = () => {
	const { user } = useGetSession();
	// upload document mutation
	const { mutate, isPending, data } = useMutation({
		mutationKey: ['Upload_Document_Mutation'],
		mutationFn: (payload: File) =>
			authenticationApiRepository.uploadDocument(payload, user?._id!),
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

	// handle upload document
	const handleUploadDocument = async (payload: File) => {
		mutate(payload);
	};
	return (
		<div>
			{' '}
			{data?.data?.data?.url && (
				<div className='flex gap-3 bg-slate-400 rounded-md'>
					<IconFile /> &nbsp;&nbsp;{' '}
					<Anchor target='_blank' href={data?.data?.data?.url}>
						{data?.data?.data?.url}
					</Anchor>
				</div>
			)}
			<Space h={'md'} />
			<h3>Upload your NID or Birth certificate for verification</h3>{' '}
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
				h={220}
				className='flex items-center justify-center'
				loading={isPending}
			>
				<div>
					<Text size='xl' inline>
						Upload NID / Birth Certificate
					</Text>
					<Text size='sm' color='dimmed' inline mt={7}>
						Your file should not exceed 5mb
					</Text>
				</div>
			</Dropzone>
		</div>
	);
};

export default VerifyIdentityForm;
