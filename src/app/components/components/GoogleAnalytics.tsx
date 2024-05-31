import Script from 'next/script'

export const GoogleAnalytics = () => {
	const MEASUREMENT_ID = 'G-1BHSYS3YY2'
	return (
		<>
			<Script
				strategy="lazyOnload"
				src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
			/>

			<Script id="" strategy="lazyOnload">
				{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              });
          `}
			</Script>
		</>
	)
}
