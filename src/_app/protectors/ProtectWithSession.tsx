import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { ComponentType, FC, useEffect } from 'react';
import { useGetSession } from '../hooks/useGetSession';

const ProtectWithSession = <P extends object>(
	Component: ComponentType<P>
): FC<P> => {
	const WithAuthenticationRequired: FC<P> = (props) => {
		const router = useRouter();
		const { isLoading, user } = useGetSession();
		useEffect(() => {
			if (user == null && !isLoading) {
				router.push(`/auth/signin`);
			}
		}, [user, isLoading]);

		if (isLoading || user == null) {
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

export default ProtectWithSession;
