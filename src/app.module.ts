import { Module } from '@nestjs/common';
import { AppController } from '@App/app.controller';
import { ConfigurationModule } from '@App/Config/Configuration.module';
import { AuthModule } from '@App/-App/Auth/Auth.Module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from '@App/-Data/TypeOrm/TypeOrmOptions';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptions } from './Jwt.Helper';

@Module({
	imports: [
		ConfigurationModule,
		TypeOrmModule.forRootAsync(TypeOrmOptions),
		{
			...JwtModule.registerAsync(JwtOptions),
			global: true // to register only once and be accessed across the whole app
		},
		AuthModule
	],
	controllers: [AppController],
	providers: []
})
export class AppModule {}
