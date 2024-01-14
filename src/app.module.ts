import { Module } from '@nestjs/common';
import { AppController } from '@App/app.controller';
import { ConfigurationModule } from '@App/Config/Configuration.module';
import { AuthModule } from '@App/-App/Auth/Auth.Module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptions } from '@App/-Data/TypeOrm/TypeOrmOptions';

@Module({
	imports: [ConfigurationModule, TypeOrmModule.forRootAsync(TypeOrmOptions), AuthModule],
	controllers: [AppController],
	providers: []
})
export class AppModule {}
