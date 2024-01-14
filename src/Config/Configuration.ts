import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
	Env: process.env.ENV,
	Version: process.env.APP_VERSION,
	Server: {
		Host: process.env.SERVER_HOST,
		Port: parseInt(process.env.SERVER_PORT, 10)
	},
	Database: {
		Host: process.env.DATABASE_HOSTT,
		Name: process.env.DATABASE_NAME,
		Username: process.env.DATABASE_USERNAMEE,
		Password: process.env.DATABASE_PASSWORDD,
		Min: parseInt(process.env.DATABASE_POOL_MIN, 10),
		Max: parseInt(process.env.DATABASE_POOL_MAX, 10),
		Idle: parseInt(process.env.DATABASE_POOL_IDLE, 10)
	},
	Provider: {
		Auth0: {
			TenantDomain: process.env.PROVIDER_Auth0_TENANT_DOMAIN
		}
	}
}));
