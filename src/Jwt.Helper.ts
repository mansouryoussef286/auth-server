import { AppConfig, Config } from '@App/Config/App.Config';
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class JwtHelper {
	constructor(private AppConfig: AppConfig) {}

	GenerateJwtToken(data) {
		let token = jsonwebtoken.sign(data, this.AppConfig.Config.Auth.Jwt.Key, {
			expiresIn: this.AppConfig.Config.Auth.Jwt.Lifespan
		});
		return token;
	}

	DecodeJwtToken(token) {
		var decoded = jsonwebtoken.verify(token, this.AppConfig.Config.Auth.Jwt.Key);
		return decoded;
	}
}

export const JwtOptions: JwtModuleAsyncOptions = {
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const Config = configService.get<Config>('Config');
		return {
			secret: Config.Auth.Jwt.Key,
			signOptions: {
				expiresIn: Config.Auth.Jwt.Lifespan
			}
		};
	},
	inject: [ConfigService]
};
