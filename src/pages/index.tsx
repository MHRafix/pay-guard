import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import ProtectWithSession from '@/_app/protectors/ProtectWithSession';
import { NextPage } from 'next';

const DashboardPage: NextPage = () => {
	return (
		<DashboardLayout title='Dashboard analytics'>DashboardPage</DashboardLayout>
	);
};

export default ProtectWithSession(DashboardPage);
