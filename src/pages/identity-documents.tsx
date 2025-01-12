import documentApiRepository from '@/_app/api/repo/document.api';
import { IDocument } from '@/_app/api/type-model/documents.model';
import VerifyIdentityForm from '@/_app/components/identity-verify/VerifyIdentityForm';
import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import { useGetSession } from '@/_app/hooks/useGetSession';
import ProtectWithSession from '@/_app/protectors/ProtectWithSession';
import DataTable from '@/lib/mantine-react-table/DataTable';
import { getStatusBadgeColor } from '@/utils/getStatusBadgeColor';
import { Anchor, Badge, Menu } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconFile, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { NextPage } from 'next';
import { useEffect, useMemo } from 'react';

const IdentityDocumentsPage: NextPage = () => {
	const { user } = useGetSession();

	// documents fetching
	const { data, isPending, refetch, isRefetching } = useQuery({
		queryKey: ['all-documents'],
		queryFn: () => documentApiRepository.getDocuments(),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, []);

	// document update mutation
	const { mutate: verifyDocument, isPending: __verifying } = useMutation({
		mutationKey: ['Verify_Document'],
		mutationFn: ({ _id, status }: { _id: string; status: string }) =>
			documentApiRepository.verifyDocuments(_id, status),
		onSuccess() {
			refetch();
			showNotification({
				title: 'Document verified successfully.',
				color: 'teal',
				icon: <IconCheck />,
				message: '',
			});
		},
		onError: (err) => {
			showNotification({
				title: 'Document verification failed.',
				color: 'red',
				icon: <IconX />,
				message: err?.message,
			});
		},
	});

	// table columns
	const columns = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'userId.name',
				header: 'Name',
			},
			{
				accessorKey: 'userId.email',
				header: 'Email',
			},
			{
				accessorKey: 'document',
				accessorFn: (document: IDocument) => (
					<div className='flex items-center gap-5'>
						<IconFile color='#7048EA' />
						<Anchor target='_blank' href={document?.document}>
							{document?.document?.split('/upload/')[1]}
						</Anchor>
					</div>
				),
				header: 'Document',
			},
			{
				accessorKey: 'status',
				accessorFn: (document: IDocument) => (
					<Menu>
						<Menu.Target>
							<Badge color={getStatusBadgeColor(document?.status)}>
								{document?.status}
							</Badge>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								onClick={() =>
									verifyDocument({ _id: document?._id, status: 'PENDING' })
								}
								color={getStatusBadgeColor('PENDING')}
								disabled={document?.status === 'PENDING'}
							>
								PENDING
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									verifyDocument({ _id: document?._id, status: 'APPROVED' })
								}
								color={getStatusBadgeColor('APPROVED')}
								disabled={document?.status === 'APPROVED'}
							>
								APPROVED
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									verifyDocument({ _id: document?._id, status: 'REJECTED' })
								}
								color={getStatusBadgeColor('REJECTED')}
								disabled={document?.status === 'REJECTED'}
							>
								REJECTED
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				),
				header: 'Status',
			},
		],
		[]
	);

	return (
		<DashboardLayout title='All Identity Documents'>
			{user?.role === 'ADMIN' ? (
				<DataTable
					tableTitle='Users identity documents'
					columns={columns}
					data={data?.data?.data ?? []}
					refetch={refetch}
					loading={isPending || isRefetching || __verifying}
				/>
			) : (
				<VerifyIdentityForm />
			)}
		</DashboardLayout>
	);
};

export default ProtectWithSession(IdentityDocumentsPage);
