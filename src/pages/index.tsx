import paymentApiRepository from '@/_app/api/repo/payment.api';
import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import ProtectWithSession from '@/_app/protectors/ProtectWithSession';
import {
	Flex,
	Paper,
	Select,
	Skeleton,
	Space,
	Text,
	Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const DashboardPage: NextPage = () => {
	const [status, setStatus] = useState<string>();
	const [filterDate, setFilterDate] = useState<Date>();

	// payments fetching
	const { data, isPending, refetch } = useQuery({
		queryKey: ['all-payments-fetched'],
		queryFn: () =>
			paymentApiRepository.getTotalPaymentsByStatus(status!, filterDate),
		enabled: false,
	});

	useEffect(() => {
		refetch();
	}, [status, filterDate]);

	return (
		<DashboardLayout title='Dashboard analytics'>
			<Flex gap={10} align={'center'}>
				<Select
					w={300}
					data={['PENDING', 'APPROVED', 'REJECTED']}
					onChange={(e) => setStatus(e!)}
					size='md'
					label='Filter by status'
					value={status}
					placeholder='Pick a status'
				/>

				<DateInput
					label={'Filter by date'}
					value={filterDate}
					onChange={(e) => setFilterDate(e!)}
					placeholder='Pick a date'
				/>
			</Flex>

			<Space h={'sm'} />

			{isPending ? (
				<Skeleton h={300} radius={10} />
			) : (
				<Paper w={300} p={20} radius={10} withBorder>
					<Title order={5} fw={700}>
						Total Payments of {status}
					</Title>
					<Space h={'md'} />
					<Text size={'md'} fw={700}>
						{data?.data?.data?.totalPayment ?? 0.0} BDT
					</Text>
				</Paper>
			)}
		</DashboardLayout>
	);
};

export default ProtectWithSession(DashboardPage);
