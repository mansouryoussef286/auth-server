import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@App/app.module';
import { Config } from '@App/Config/App.Config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const config = configService.get<Config>('Config');

	await app.listen(config.Server.Port).then(async () => {
		const url = await app.getUrl();
		console.log(`ENV = ${config.Env}`);
		console.log(`Server running on ${url}`);
		// console.log(`Swagger running on ${url}/swagger`);
	});
}
bootstrap();
