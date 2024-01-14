import { Module } from '@nestjs/common';
import { AuthProviderFactory } from '@App/-Domain/Services/auth-provider.factory';
import { Auth0Provider } from '@App/-Domain/Services/Auth0.Service';

@Module({
	imports: [],
	providers: [AuthProviderFactory, Auth0Provider],
	exports: [AuthProviderFactory, Auth0Provider]
})
export class DomainModule {}
