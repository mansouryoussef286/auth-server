import { Module } from '@nestjs/common';
import { AuthController } from './Auth.Controller';
import { AuthProviderFactory } from '@App/-Domain/Services/auth-provider.factory';

@Module({
	imports: [],
	controllers: [AuthController],
	providers: [AuthProviderFactory]
})
export class AuthModule {}
