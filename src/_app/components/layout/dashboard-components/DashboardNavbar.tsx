import {
	ActionIcon,
	Navbar,
	NavLink,
	ScrollArea,
	Space,
	Text,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
	IconDashboard,
	IconTransactionDollar,
	IconUser,
	IconX,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
	opened: boolean;
	onOpened: (state: boolean) => void;
}
const DashboardNavbar: React.FC<Props> = ({ opened, onOpened }) => {
	const { asPath } = useRouter();

	// theme mode
	const [mode = 'light', setMode] = useLocalStorage<any>({
		key: 'mode',
	});

	return (
		<Navbar
			hiddenBreakpoint='sm'
			hidden={!opened}
			width={{ sm: 200, lg: 250 }}
			style={{ zIndex: 100000000 }}
			className={`${
				mode === 'light'
					? '!bg-[#FFFFFF] !border-r-slate-300'
					: '!bg-slate-800 !border-r-slate-600'
			} !border-r-solid`}
		>
			<Navbar.Section>
				<Space h={10} />
				<div className='text-left'>
					<Image
						src={'/assets/Logo/logo.png'}
						alt='Logo'
						width={200}
						height={200}
						className='!w-[200px] !object-cover'
					/>
				</div>
			</Navbar.Section>
			<Space h={20} />
			{opened && (
				<div className='!flex justify-between w-full items-center p-3 ml-auto'>
					<Text size={'xl'} fw={800}>
						Navbar
					</Text>
					<ActionIcon size='xl' color='red' onClick={() => onOpened(false)}>
						<IconX size={50} />
					</ActionIcon>
				</div>
			)}
			<Navbar.Section grow component={ScrollArea}>
				{menus.map((item) => (
					<NavLink
						style={{
							fontFamily: 'Nunito sans, sans-serif',
							borderLeft:
								asPath.includes(item.href!) && asPath === item.href
									? '4px solid #5d34d8'
									: 0,
						}}
						fz={20}
						key={item.label}
						icon={item.icon}
						label={
							<Text size='md' weight={500} ff={'Nunito sans, sans-serif'}>
								{item.label}
							</Text>
						}
						component={Link}
						href={item.href!}
						disabled={
							item?.href === '/rating_&&_reviews' ||
							item?.href === '/reception_management/task_review'
						}
						active={asPath === item.href}
						defaultOpened={asPath.includes(item.href)}
						color={mode === 'light' ? 'dark' : 'blue'}
						styles={() => ({
							// theme.colors.brand[9]
							root: {
								fontWeight: asPath.includes(item.href!) ? 600 : 400,
								fontFamily: 'Nunito sans, sans-serif',
								fontSize: 20,
							},
						})}
					/>
				))}
			</Navbar.Section>
			{/* <Navbar.Section>
				<UserButton />
			</Navbar.Section> */}
		</Navbar>
	);
};

export default DashboardNavbar;

export const menus = [
	{
		label: 'Dashboard',
		icon: <IconDashboard size={20} />,
		href: '/',
	},
	{
		label: 'Verify Identity',
		icon: <IconUser size={20} />,
		href: '/identity-documents',
	},

	{
		label: 'Payments',
		icon: <IconTransactionDollar size={20} />,
		href: '/payments',
	},
];
