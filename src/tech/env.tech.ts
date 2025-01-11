import { configDotenv } from 'dotenv'
import config from 'typed-env'

configDotenv()

const env = config({
	NEXT_PUBLIC_BACKEND_URL: { type: 'string' },
	NEXT_PUBLIC_FRONTEND_URL: { type: 'string' },
	NEXT_PUBLIC_FRONTEND_HOSTNAME: { type: 'string' },

	NEXT_PUBLIC_TEMPORARILY_UNAVAILABLE: { type: 'boolean' },
	NEXT_PUBLIC_DONT_USE_SUBDOMAINS: { type: 'boolean', optional: true },
	NEXT_PUBLIC_DISABLE_WEBSOCKETS: { type: 'boolean', optional: true },
})

export default env
