export const getStatusBadgeColor = (status: string) => {
	switch (status) {
		case 'PENDING':
			return 'orange';

		case 'APPROVED':
			return 'teal';

		default:
			return 'red';
	}
};
