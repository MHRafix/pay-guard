import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import authenticationApiRepository from '../api/repo/authentication.api';

export const useGetSession = () => {
	const userInfo = Cookies.get('user') && JSON.parse(Cookies.get('user')!);

	// get logged in user
	const {
		data,
		isLoading,
		refetch: onRefetch,
	} = useQuery({
		queryKey: ['get_logged_in_user_session'],
		queryFn: async () =>
			await authenticationApiRepository.getLoggedInUser(userInfo?._id),
		enabled: Boolean(userInfo?._id),
	});

	return { user: data?.data?.data, isLoading, onRefetch };
};
