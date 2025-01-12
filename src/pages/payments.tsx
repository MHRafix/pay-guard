import DashboardLayout from '@/_app/components/layout/DashboardLayout';
import PaymentForm from '@/_app/components/payments/PaymentForm';

const PaymentPage: React.FC = () => {
	return (
		<DashboardLayout title='Payment'>
			<PaymentForm />
		</DashboardLayout>
	);
};

export default PaymentPage;
