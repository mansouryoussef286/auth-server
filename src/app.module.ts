import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigurationModule } from './Config/Configuration.module';
import { AuthModule } from './-App/Auth/Auth.Module';

@Module({
  imports: [ConfigurationModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
