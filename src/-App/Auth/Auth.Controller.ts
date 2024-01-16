import { Body, Controller, Post } from '@nestjs/common';
import { AuthProviderEnum, AuthProviderFactory } from '@App/-Domain/Services/Providers/auth-provider.factory';
import { AuthorizationCodeFlow } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { AuthProvider } from '@App/-Domain/Interfaces/auth-provider.interface';

@Controller('authenticate')
export class AuthController {
	private _AuthProvider: AuthProvider;

	constructor(private AuthProviderFactory: AuthProviderFactory) {
		this._AuthProvider = this.AuthProviderFactory.getAuthProvider(AuthProviderEnum.Auth0);
	}

	@Post()
	Login(@Body() AuthReqModel: AuthorizationCodeFlow.ReqModel): Promise<any> {
		return this._AuthProvider.authenticate(AuthReqModel);
	}
}
