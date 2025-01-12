import documentApiRepository from '@/_app/api/repo/document.api';
import { IDocument } from '@/_app/api/type-model/documents.model';
import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import ProtectWithSession from '@/_app/protectors/ProtectWithSession';
import DataTable from '@/lib/mantine-react-table/DataTable';
import { getStatusBadgeColor } from '@/utils/getStatusBadgeColor';
import { Anchor, Badge, Menu } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconFile, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { NextPage } from 'next';
import { useMemo } from 'react';

const IdentityDocumentsPage: NextPage = () => {
	// documents fetching
	const { data, isPending, refetch, isRefetching } = useQuery({
		queryKey: ['all-documents'],
		queryFn: () => documentApiRepository.getDocuments(),
	});

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
		onError: () => {
			showNotification({
				title: 'Document verified failed.',
				color: 'red',
				icon: <IconX />,
				message: '',
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
							>
								PENDING
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									verifyDocument({ _id: document?._id, status: 'APPROVED' })
								}
								color={getStatusBadgeColor('APPROVED')}
							>
								APPROVED
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									verifyDocument({ _id: document?._id, status: 'REJECTED' })
								}
								color={getStatusBadgeColor('REJECTED')}
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
			<DataTable
				tableTitle='Users identity documents'
				columns={columns}
				data={data?.data?.data ?? []}
				refetch={refetch}
				loading={isPending || isRefetching || __verifying}
			/>
		</DashboardLayout>
	);
};

export default ProtectWithSession(IdentityDocumentsPage);
