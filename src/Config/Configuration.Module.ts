import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppConfig } from './App.Config';
import { ConfigModule } from '@nestjs/config';
import Configuration from './Configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [Configuration],
			isGlobal: true,
			cache: true
		})
	],
	providers: [AppConfig],
	exports: [AppConfig]
})
export class ConfigurationModule {}
