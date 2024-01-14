import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Config } from '@App/Config/App.Config';
// import { LoggingModule } from '@App/Common/Logging/Logging.Module';
// import { Logger, LoggerToken } from '@App/Common/Logging/Logger.Interface';

export const TypeOrmOptions: TypeOrmModuleAsyncOptions = {
	// https://docs.nestjs.com/techniques/database
	imports: [ConfigModule /*, LoggingModule*/],
	useFactory: async (configService: ConfigService /*, LoggerService: Logger*/) => {
		const Config = configService.get<Config>('Config');
		// console.log(__dirname + '/../Features/**/Data/Entities/*.Entity{.ts,.js}');
		return {
			type: 'mysql',
			host: Config.Database.Host,
			username: Config.Database.Username,
			password: Config.Database.Password,
			database: Config.Database.Name,
			autoLoadEntities: true,
			synchronize: false,
			options: {
				trustServerCertificate: true
				// encrypt: false //to remove TLS connection deprecation using ip not dns
			},
			retryAttempts: 1,
			retryDelay: 3000,
			pool: {
				max: Config.Database.Max,
				min: Config.Database.Min,
				idleTimeoutMillis: Config.Database.Idle
			}
			// logger: LoggerService
		};
	},
	inject: [ConfigService /*, LoggerToken*/]
};
