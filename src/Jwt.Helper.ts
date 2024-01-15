import { Config } from '@App/Config/App.Config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JwtOptions: JwtModuleAsyncOptions = {
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const Config = configService.get<Config>('Config');

		return {
			privateKey: Config.Auth.Jwt.PrivateKey,
			publicKey: Config.Auth.Jwt.PublicKey,
			signOptions: {
				expiresIn: Config.Auth.Jwt.Lifespan,
				algorithm: 'RS256'
			}
		};
	},
	inject: [ConfigService]
};
