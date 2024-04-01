import { Module } from '@nestjs/common';
import { AuthController } from './Auth.Controller';
import { ConfigurationModule } from '@App/Config/Configuration.module';
import { Auth0Provider } from '@App/-Domain/Services/Providers/Auth0.Service';
import { AuthProviderFactory } from '@App/-Domain/Services/Providers/auth-provider.factory';
import { DataModule } from '@App/-Data/Data.Module';
import { ClientsService } from '@App/-Domain/Services/Clients.Service';
import { UsersService } from '@App/-Domain/Services/Users.Service';
import { CommonModule } from '@App/Common/Common.Module';

@Module({
	imports: [ConfigurationModule, DataModule,CommonModule],
	controllers: [AuthController],
	providers: [AuthProviderFactory, Auth0Provider, ClientsService, UsersService]
})
export class AuthModule {}
