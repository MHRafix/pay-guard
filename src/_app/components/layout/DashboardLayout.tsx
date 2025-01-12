import { AppShell, Box } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import Head from 'next/head';
import { PropsWithChildren, useState } from 'react';
import DashboardHeader from './dashboard-components/DashboardHeader';
import DashboardNavbar from './dashboard-components/DashboardNavbar';

interface Props {
	title?: string;
	Actions?: React.ReactNode;
}

const DashboardLayout: React.FC<PropsWithChildren<Props>> = ({
	children,
	title,
	Actions,
}) => {
	// theme mode
	const [mode = 'light', setMode] = useLocalStorage<any>({
		key: 'mode',
	});

	const [opened, setOpened] = useState(false);
	return (
		<div>
			<Head>
				<title>PayGuard - {title ? title : 'Dashboard'}</title>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
			</Head>
			<AppShell
				header={<DashboardHeader opened={opened} setOpened={setOpened} />}
				navbar={<DashboardNavbar opened={opened} onOpened={setOpened} />}
				className={`${mode === 'light' ? '!bg-[#FFFFFF]' : '!bg-slate-800'}`}
				footer={
					<Box
						className={`flex justify-center items-center ${
							mode === 'light' ? '!bg-[#FFFFFF]' : '!bg-slate-800'
						} ${mode === 'light' ? '!text-[#FFFFFF]' : '!text-slate-800'}`}
					>
						All right reserved by BookNest©2024
					</Box>
				}
				children={<main className='mt-[100px]'>{children}</main>}
			></AppShell>
		</div>
	);
};

export default DashboardLayout;
