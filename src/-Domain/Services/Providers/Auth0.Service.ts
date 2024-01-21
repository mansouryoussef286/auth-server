import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

import { AppConfig } from '@App/Config/App.Config';

import { AuthProvider } from '@App/-Domain/Interfaces/auth-provider.interface';
import { AuthorizationCodeFlow } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { CurrentUser } from '@App/-Domain/DTOs/CurrentUser.Model';
import { Client } from '@App/-Domain/Entities/Client.Model';
import { ClientsService } from '@App/-Domain/Services/Clients.Service';
import { UsersService } from '@App/-Domain/Services/Users.Service';
import { Auth0Models } from '@App/-Domain/Models/Auth0.Models';

@Injectable()
export class Auth0Provider implements AuthProvider {
	constructor(
		private AppConfig: AppConfig,
		private JwtService: JwtService,
		private ClientsService: ClientsService,
		private UsersService: UsersService
	) {}

	async authenticate(reqModel: AuthorizationCodeFlow.ReqModel): Promise<AuthorizationCodeFlow.ResModel> {
		let resModel: AuthorizationCodeFlow.ResModel = new AuthorizationCodeFlow.ResModel();
		resModel.Success = true;

		// create a wrapper for axios
		try {
			let tokenResponse: Auth0Models.TokenResponse = await this.ValidateCodeAndGetToken(reqModel);
			let providerUser: Auth0Models.ProviderUser = await this.GetProviderUserInfo(tokenResponse);
			// console.log(providerUser);

			// check with users db table to add him if new
			this.UsersService.CheckUserInDB(providerUser);

			resModel.AccessToken = this.GenerateAccessToken(providerUser);
			resModel.RefreshToken = this.GenerateRefreshToken(providerUser);
			resModel.CurrentUser = this.GenerateCurrentUser(providerUser);
		} catch (error) {
			resModel.Success = false;
			// console.log(error);
		}
		return resModel;
	}

	async ValidateCodeAndGetToken(reqModel: AuthorizationCodeFlow.ReqModel): Promise<Auth0Models.TokenResponse> {
		const tokenApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/oauth/token`;

		let client: Client = await this.ClientsService.FindByApiId(reqModel.ApiId);
		if (!client) throw new UnauthorizedException();

		let getTokenResponse: any = await axios.post(tokenApiUrl, {
			grant_type: 'authorization_code',
			client_id: client.ProviderClientId,
			client_secret: client.ProviderClientSecret,
			code: reqModel.Code,
			redirect_uri: client.RedirectUrl
		});
		let tokenResponse: Auth0Models.TokenResponse = getTokenResponse.data;
		return tokenResponse;
	}

	async GetProviderUserInfo(tokenResponse: Auth0Models.TokenResponse): Promise<Auth0Models.ProviderUser> {
		const userApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/userinfo`;
		let userInfoResponse: any = await axios.get(userApiUrl, {
			headers: {
				Authorization: `Bearer ${tokenResponse.access_token}`
			}
		});
		let user: Auth0Models.ProviderUser = userInfoResponse.data;
		return user;
	}

	GenerateAccessToken(user: Auth0Models.ProviderUser): string {
		const accessToken =
			'Bearer ' +
			this.JwtService.sign({
				Email: user.email
			} as any);
		return accessToken;
	}

	GenerateRefreshToken(user: Auth0Models.ProviderUser): string {
		const refreshToken = this.JwtService.sign(
			{
				Email: user.email
			} as any,
			{
				expiresIn: this.AppConfig.Config.Auth.Jwt.RefreshTokenSpan
			}
		);
		// we should add this refresh token to the contact in db
		// so every user should have a valid refresh token with him then remove on logout
		return refreshToken;
	}

	GenerateCurrentUser(user: Auth0Models.ProviderUser): CurrentUser {
		const currentUser = {
			FirstName: user.given_name,
			LastName: user.family_name,
			Email: user.email,
			ProfilePicturePath: user.picture
		} as CurrentUser;
		return currentUser;
	}
}
