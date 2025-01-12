export const getMailBody = (payload: any) => {
	return `<div
			style="border: 1px solid #ccc; padding: 20px; font-family: Arial, sans-serif"
		>
			<h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 15px">
				Hello ${payload?.name}
			</h2>
		
			<div
				style="
					border: 1px solid #ddd;
					padding: 15px;
					background-color: #f9f9f9;
					margin-bottom: 15px;
				"
			>
				Your payment for ${payload?.payment?.title} - ${payload?.payment?.amount} BDT is ${payload?.status}.
			</div>
		
			<p style="font-size: 14px; color: #2c3e50">Thanks</p>
			<p
				style="
					font-size: 14px;
					font-weight: bold;
					color: #2980b9;
					text-decoration: none;
				"
			>
				<a href="https://payguard.vercel.app" target="_blank">PayGuard</a>
			</p>
		</div>
		`;
};
