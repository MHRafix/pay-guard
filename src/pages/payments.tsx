import paymentApiRepository from '@/_app/api/repo/payment.api';
import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import PaymentForm from '@/_app/components/payments/PaymentForm';
import { useGetSession } from '@/_app/hooks/useGetSession';
import ProtectWithSession from '@/_app/protectors/ProtectWithSession';
import { IPayment } from '@/db/schema/Payment.schema';
import DataTable from '@/lib/mantine-react-table/DataTable';
import { getStatusBadgeColor } from '@/utils/getStatusBadgeColor';
import { Badge, Menu } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';

const PaymentPage: React.FC = () => {
	const { user } = useGetSession();
	// payments fetching
	const { data, isPending, refetch, isRefetching } = useQuery({
		queryKey: ['all-payments-fetched'],
		queryFn: () => paymentApiRepository.getPayments(),
	});

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
		onError: () => {
			showNotification({
				title: 'Payment reviewed failed.',
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
										name: payment?.userId?.email,
										status: 'PENDING',
									})
								}
								color={getStatusBadgeColor('PENDING')}
							>
								PENDING
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									reviewPayment({
										// @ts-ignore
										_id: payment?._id,
										email: payment?.userId?.email,
										name: payment?.userId?.email,
										status: 'APPROVED',
									})
								}
								color={getStatusBadgeColor('APPROVED')}
							>
								APPROVED
							</Menu.Item>
							<Menu.Item
								onClick={() =>
									reviewPayment({
										// @ts-ignore
										_id: payment?._id,
										email: payment?.userId?.email,
										name: payment?.userId?.email,
										status: 'REJECTED',
									})
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
		</DashboardLayout>
	);
};

export default ProtectWithSession(PaymentPage);
