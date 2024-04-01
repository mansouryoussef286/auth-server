import { Module } from '@nestjs/common';
import { AppController } from '@App/app.controller';
import { ConfigurationModule } from '@App/Config/Configuration.module';
import { AuthModule } from '@App/-App/Auth/Auth.Module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from '@App/-Data/TypeOrm/TypeOrmOptions';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptions } from './Jwt.Helper';
import { RefreshJwtStrategy } from './Common/Auth/RefreshToken-Strategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './Common/Interceptors/CurrentUser.Interceptor';
import { LoggingInterceptor } from './Common/Interceptors/Logging.Interceptor';
import { CommonModule } from './Common/Common.Module';

@Module({
	imports: [
		ConfigurationModule,
		TypeOrmModule.forRootAsync(TypeOrmOptions),
		{
			...JwtModule.registerAsync(JwtOptions),
			global: true // to register only once and be accessed across the whole app
		},
		CommonModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [
		RefreshJwtStrategy,
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }
	]
})
export class AppModule {}
