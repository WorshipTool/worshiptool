import { Link } from '@/common/ui/Link/Link'

export default function ErrorPage() {
	return (
		<div
			style={{
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'end',
					alignItems: 'center',
					// gap: '1rem',
				}}
			>
				<h1>
					<strong>Stránka nenalezena</strong>
				</h1>
				<p style={{ textAlign: 'center' }}>
					Zdá se, že jsi zabloudil do neprobádaných končin aplikace.
					<br />
					Můžeš zkusit jít cestou zpět na hlavní stránku.
				</p>

				<Link
					to="home"
					params={{
						hledat: '',
					}}
				>
					JÍT DOMŮ
				</Link>
			</div>
		</div>
	)
}
