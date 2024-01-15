import { Module } from '@nestjs/common';
import { AuthController } from './Auth.Controller';
import { ConfigurationModule } from '@App/Config/Configuration.module';
import { Auth0Provider } from '@App/-Domain/Services/Auth0.Service';
import { AuthProviderFactory } from '@App/-Domain/Services/auth-provider.factory';
import { DataModule } from '@App/-Data/Data.Module';

@Module({
	imports: [ConfigurationModule, DataModule],
	controllers: [AuthController],
	providers: [AuthProviderFactory, Auth0Provider]
})
export class AuthModule {}
