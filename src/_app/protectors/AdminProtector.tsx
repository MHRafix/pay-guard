import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { ComponentType, FC, useEffect } from 'react';
import { useGetSession } from '../hooks/useGetSession';

const AdminProtectWithSession = <P extends object>(
	Component: ComponentType<P>
): FC<P> => {
	const WithAuthenticationRequired: FC<P> = (props) => {
		const router = useRouter();
		const { isLoading, user } = useGetSession();

		useEffect(() => {
			if (user == null && !isLoading) {
				router.push(`/auth/signin`);
			}

			// redirect ot identity-document s page if the role is user
			if (user?.role === 'USER') {
				router.push('/identity-documents');
			}
		}, [user, isLoading]);

		if (isLoading || user == null || user?.role === 'USER') {
			return (
				<div className='flex justify-center w-full h-screen items-center'>
					<Loader color='violet' size='lg' />
				</div>
			);
		}
		return <Component {...props} />;
	};

	return WithAuthenticationRequired;
};

export default AdminProtectWithSession;
