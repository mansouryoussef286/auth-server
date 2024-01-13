import { Controller, Get } from '@nestjs/common';
import { AppConfig } from './Config/App.Config';

@Controller()
export class AppController {
	constructor(private AppConfig: AppConfig) {}

	@Get()
	getHello(): string {
		return `Hello this is Auth-Server version ${this.AppConfig.Config.Version}`;
	}
}
