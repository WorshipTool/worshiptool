'use server'
import './test.css'

export const TestServer = async ({ show }: { show: boolean }) => {
	return (
		<>
			<div className={show ? '' : 'hidden'}>Ahoojda</div>
		</>
	)
}
