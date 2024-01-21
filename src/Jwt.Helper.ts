import { Config } from '@App/Config/App.Config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import * as fs from 'fs';

export const JwtOptions: JwtModuleAsyncOptions = {
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const Config = configService.get<Config>('Config');
		const privateKey = fs.readFileSync('Keys/decrypted-private-key.pem', 'utf8');
		const publicKey = fs.readFileSync('Keys/public-cert.pem', 'utf8');

		return {
			privateKey: privateKey,
			publicKey: publicKey,
			signOptions: {
				expiresIn: Config.Auth.Jwt.Lifespan,
				algorithm: 'RS256'
			}
		};
	},
	inject: [ConfigService]
};
