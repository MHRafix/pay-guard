import paymentApiRepository from '@/_app/api/repo/payment.api';
import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import PaymentForm from '@/_app/components/payments/PaymentForm';
import { useGetSession } from '@/_app/hooks/useGetSession';
import ProtectWithSession from '@/_app/protectors/ProtectWithSession';
import { IPayment } from '@/db/schema/Payment.schema';
import DataTable from '@/lib/mantine-react-table/DataTable';
import { getStatusBadgeColor } from '@/utils/getStatusBadgeColor';
import {
	Badge,
	Button,
	Flex,
	Menu,
	Modal,
	Paper,
	Space,
	Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconDownload, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { usePDF } from 'react-to-pdf';

const PaymentPage: React.FC = () => {
	const { user } = useGetSession();

	const [opened, modalHandler] = useDisclosure();
	const [payment, setPayment] = useState<IPayment | null>(null);

	// payments fetching
	const { data, isPending, refetch, isRefetching } = useQuery({
		queryKey: ['all-payments-fetched'],
		queryFn: () => paymentApiRepository.getPayments(),
		enabled: false,
	});

	// refetch payments
	useEffect(() => {
		refetch();
	}, []);

	// payments update mutation
	const { mutate: reviewPayment, isPending: __reviewing } = useMutation({
		mutationKey: ['reviewed_payments'],
		mutationFn: ({
			_id,
			name,
			email,
			status,
		}: {
			_id: string;
			name: string;
			email: string;
			status: string;
		}) => paymentApiRepository.updatePayments(_id, name, email, status),
		onSuccess() {
			refetch();
			showNotification({
				title: 'Payment reviewed successfully.',
				color: 'teal',
				icon: <IconCheck />,
				message: '',
			});
		},
		onError: (err) => {
			showNotification({
				title: 'Payment reviewed failed.',
				color: 'red',
				icon: <IconX />,
				message: err.message,
			});
		},
	});

	// table columns
	const columns = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
			},
			{
				accessorKey: 'amount',
				header: 'Amount',
			},
			{
				accessorKey: 'userId.name',
				header: 'Name',
			},
			{
				accessorKey: 'userId.email',
				header: 'Email',
			},
			{
				accessorKey: 'status',
				accessorFn: (payment: IPayment) => (
					<Menu>
						<Menu.Target>
							<Badge color={getStatusBadgeColor(payment?.status)}>
								{payment?.status}
							</Badge>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								onClick={() =>
									reviewPayment({
										// @ts-ignore
										_id: payment?._id,
										email: payment?.userId?.email,
										name: payment?.userId?.name,
										status: 'PENDING',
									})
								}
								color={getStatusBadgeColor('PENDING')}
								disabled={payment?.status === 'PENDING'}
							>
								PENDING
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									reviewPayment({
										// @ts-ignore
										_id: payment?._id,
										email: payment?.userId?.email,
										name: payment?.userId?.name,
										status: 'APPROVED',
									})
								}
								color={getStatusBadgeColor('APPROVED')}
								disabled={payment?.status === 'APPROVED'}
							>
								APPROVED
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									reviewPayment({
										// @ts-ignore
										_id: payment?._id,
										email: payment?.userId?.email,
										name: payment?.userId?.name,
										status: 'REJECTED',
									})
								}
								color={getStatusBadgeColor('REJECTED')}
								disabled={payment?.status === 'REJECTED'}
							>
								REJECTED
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				),
				header: 'Status',
			},
			{
				accessorKey: 'action',
				accessorFn: (payment: IPayment) => (
					<Button
						disabled={payment?.status !== 'APPROVED'}
						onClick={() => {
							setPayment(payment);
							modalHandler.open();
						}}
					>
						Generate Invoice
					</Button>
				),
				header: 'Action',
			},
		],
		[]
	);

	// pdf invoice funcitonalities
	const { toPDF, targetRef } = usePDF({
		filename: `invoice-${payment?.title}.pdf`,
	});

	return (
		<DashboardLayout title='Payments'>
			{user?.role === 'ADMIN' ? (
				<DataTable
					tableTitle='All Payments'
					columns={columns}
					data={data?.data?.data ?? []}
					refetch={refetch}
					loading={isPending || isRefetching || __reviewing}
				/>
			) : (
				<PaymentForm />
			)}

			<Modal
				title='Print Invoice'
				opened={opened}
				onClose={modalHandler.close}
				withCloseButton={false}
				centered
			>
				<div ref={targetRef}>
					<Paper p={10} withBorder>
						<Text size={'lg'}>Payment Details</Text>
						<Text>Title: {payment?.title ?? 'N/A'}</Text>
						<Text>Amount: {payment?.amount ?? 0.0} BDT</Text>
						<Flex gap={5} align={'center'}>
							Status:{' '}
							<Badge color={getStatusBadgeColor(payment?.status!)}>
								{payment?.status}
							</Badge>
						</Flex>
						<Space h={'lg'} />
						<Text size={'lg'}>User Details</Text>
						<Text>Name: {payment?.userId?.name ?? 'N/A'}</Text>
						<Text>Email: {payment?.userId?.email ?? 'N/A'}</Text>
					</Paper>
				</div>

				<Space h={'md'} />
				<Button onClick={() => toPDF()} leftIcon={<IconDownload />}>
					Download PDF
				</Button>
			</Modal>
		</DashboardLayout>
	);
};

export default ProtectWithSession(PaymentPage);
