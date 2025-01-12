import '@/styles/globals.css';
import { payGuardApplicationEmotionCache } from '@/utils/emotionCache';
import type { AppProps } from 'next/app';

import { MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	// theme mode
	const [mode = 'light', setMode] = useLocalStorage<any>({
		key: 'mode',
	});

	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider
				emotionCache={payGuardApplicationEmotionCache}
				theme={{
					fontFamily: 'Nunito sans, sans-serif',
					colorScheme: mode || 'light',
					primaryColor: 'violet',
					breakpoints: {
						xs: '500',
						sm: '800',
						md: '1000',
						lg: '1200',
						xl: '1400',
					},
				}}
			>
				<Notifications position='top-right' zIndex={99999} />
				<ModalsProvider>
					<Elements stripe={stripePromise}>
						<Component {...pageProps} />
					</Elements>
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
}
