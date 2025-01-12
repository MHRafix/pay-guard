import { ActionIcon, Flex, Loader, Title } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import cls from 'classnames';
// import { mkConfig } from 'export-to-csv';
import {
	MRT_ColumnDef,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import React from 'react';

interface Prop {
	columns: MRT_ColumnDef<any>[];
	data: any[];
	refetch: () => void;
	loading: boolean;
	tableTitle: string;
}

// const csvConfig = mkConfig({
// 	fieldSeparator: ',',
// 	decimalSeparator: '.',
// 	useKeysAsHeaders: true,
// });

const DataTable: React.FC<Prop> = ({
	columns,
	loading,
	data,
	refetch,
	tableTitle,
}) => {
	const table = useMantineReactTable({
		columns,
		data,
		state: {
			showProgressBars: loading,
		},
		enablePagination: false,

		// enableRowActions: RowActionMenu ? true : false,
		positionActionsColumn: 'last',
		// renderRowActionMenuItems: (_row: any) =>
		// RowActionMenu?.(_row?.row?.original),
		renderTopToolbar: () => {
			return (
				<div className='flex justify-between items-center px-2 pt-5 mb-5'>
					<Title order={2} fw={700}>
						{tableTitle}
					</Title>
					<Flex gap={'md'} justify={'space-between'} align={'center'}>
						{loading ? (
							<Loader size={'lg'} color='violet' />
						) : (
							<ActionIcon
								onClick={() => refetch()}
								variant='outline'
								radius={100}
								size={45}
							>
								<IconRefresh
									size={35}
									className={cls({ 'animate-reverse-spin': loading })}
								/>
							</ActionIcon>
						)}

						{/* {ActionArea} */}
					</Flex>
				</div>
			);
		},
	});

	return (
		<>
			<div className='p-3'>
				<MantineReactTable table={table} />
			</div>
		</>
	);
};

export default DataTable;
