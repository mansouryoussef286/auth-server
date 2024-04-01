import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthProviderEnum, AuthProviderFactory } from '@App/-Domain/Services/Providers/auth-provider.factory';
import { AuthorizationCodeFlowDTO } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { AuthProvider } from '@App/-Domain/Interfaces/auth-provider.interface';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { RefreshTokenDTO } from '@App/-Domain/DTOs/RefreshToken.Models';

@Controller('authenticate')
export class AuthController {
	private _AuthProvider: AuthProvider;

	constructor(private AuthProviderFactory: AuthProviderFactory) {
		this._AuthProvider = this.AuthProviderFactory.getAuthProvider(AuthProviderEnum.Auth0);
	}

	@Post()
	Login(@Body() AuthReqModel: AuthorizationCodeFlowDTO.ReqModel): Promise<any> {
		return this._AuthProvider.authenticate(AuthReqModel);
	}

	@Post('refresh-token')
	@UseGuards(RefreshTokenGuard)
	RefreshToken(
		@Body() RefreshTokenReqModel: RefreshTokenDTO.ReqModel
	): Promise<RefreshTokenDTO.ResModel> {
		return this._AuthProvider.RefreshAccessToken(RefreshTokenReqModel);
	}
}
