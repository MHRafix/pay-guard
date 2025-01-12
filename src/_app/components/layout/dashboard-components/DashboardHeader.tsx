import { useGetSession } from '@/_app/hooks/useGetSession';
import { Avatar, Box, Burger, Group, Menu, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import { IconLogout, IconSun, IconSunFilled } from '@tabler/icons-react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import React from 'react';

interface Props {
	opened: boolean;
	setOpened: (state: boolean) => void;
}

const DashboardHeader: React.FC<Props> = ({ opened, setOpened }) => {
	const { user } = useGetSession();

	// theme mode
	const [mode = 'light', setMode] = useLocalStorage<any>({
		key: 'mode',
	});

	return (
		<Box
			className={`${
				mode === 'light' ? 'bg-[#FFFFFF]' : 'bg-slate-800'
			} lg:block flex justify-between items-center fixed w-full top-0 z-[99999] px-3 py-5 border-[0px] border-b-[1px] ${
				mode === 'light' ? 'border-b-300' : 'border-b-slate-600'
			}   border-solid`}
		>
			<Burger
				className='block lg:!hidden'
				opened={opened}
				onClick={() => setOpened(!opened)}
				size={40}
				// @ts-ignore
				color={opened && 'red'}
			/>

			<div className='flex justify-end items-center'>
				<Group>
					{mode === 'dark' ? (
						<IconSunFilled
							className='cursor-pointer'
							onClick={() => setMode('light')}
							size={30}
						/>
					) : (
						<IconSun
							className='cursor-pointer'
							onClick={() => setMode('dark')}
							color='#5d34d8'
							size={30}
						/>
					)}

					<Menu width={200} withArrow>
						<Menu.Target>
							<Avatar
								variant='filled'
								className='cursor-pointer'
								color={'violet'}
								size={'lg'}
								radius={100}
							>
								{user?.email?.slice(0, 1).toUpperCase()}
							</Avatar>
						</Menu.Target>

						<Menu.Dropdown w={200}>
							<Menu.Label>{user?.email}</Menu.Label>

							<Menu.Item
								color='red'
								icon={<IconLogout />}
								onClick={() =>
									openConfirmModal({
										title: 'Are you sure to log out?',
										children: (
											<Text>Proceed yes button to perform the action.</Text>
										),
										centered: true,
										labels: {
											confirm: 'Yes',
											cancel: 'No',
										},
										onConfirm: () => signOut(),
										onCancel: () => {},
									})
								}
							>
								Logout
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>
			</div>
		</Box>
	);
};

export default DashboardHeader;

// signout action function
export const signOut = async () => {
	Cookies.remove('user');
	Router.push('/auth/signin');
	Router.reload();
};
