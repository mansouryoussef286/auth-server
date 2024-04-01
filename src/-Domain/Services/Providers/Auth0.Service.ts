import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

import { AppConfig } from '@App/Config/App.Config';

import { AuthProvider } from '@App/-Domain/Interfaces/auth-provider.interface';
import { AuthorizationCodeFlowDTO } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { CurrentUser } from '@App/-Domain/DTOs/CurrentUser.Model';
import { Client } from '@App/-Domain/Entities/Client.Model';
import { ClientsService } from '@App/-Domain/Services/Clients.Service';
import { UsersService } from '@App/-Domain/Services/Users.Service';
import { Auth0Models } from '@App/-Domain/Models/Auth0.Models';
import { AuthenticationModels } from '@App/-Domain/Models/Authentication.Models';
import { RefreshTokenDTO } from '@App/-Domain/DTOs/RefreshToken.Models';
import { User } from '@App/-Domain/Entities/User.Model';
import { ApiKeys } from '@App/-Domain/DTOs/ApiKeys.interface';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';

@Injectable()
export class Auth0Provider implements AuthProvider {
	constructor(
		private AppConfig: AppConfig,
		private JwtService: JwtService,
		private ClientsService: ClientsService,
		private UsersService: UsersService,
		private UserHelper: UserHelper
	) {}

	async authenticate(reqModel: AuthorizationCodeFlowDTO.ReqModel): Promise<AuthorizationCodeFlowDTO.ResModel> {
		let resModel: AuthorizationCodeFlowDTO.ResModel = new AuthorizationCodeFlowDTO.ResModel();
		resModel.Success = true;

		// create a wrapper for axios
		try {
			const client = await this.CheckClient(reqModel);
			const tokenResponse: Auth0Models.TokenResponse = await this.ValidateCodeAndGetIPToken(
				reqModel.Code,
				client
			);

			const providerUser: Auth0Models.ProviderUser = await this.GetProviderUserInfo(tokenResponse);
			providerUser.refresh_token = tokenResponse.refresh_token;
			const user = await this.UsersService.CheckUserInDBByEmail(providerUser);

			resModel.AccessToken = this.GenerateAccessToken(user);
			resModel.RefreshToken = this.GenerateRefreshToken(user);
			resModel.CurrentUser = this.GenerateCurrentUser(user);
		} catch (error) {
			resModel.Success = false;
			// console.log(error);
		}
		return resModel;
	}

	private async CheckClient(reqModel: ApiKeys): Promise<Client> {
		const client: Client = await this.ClientsService.FindByApiId(reqModel.ApiId);
		if (!client) throw new UnauthorizedException("client doesn't exist");
		if (!client.IsActive) throw new UnauthorizedException("client isn't active");
		if (client.ApiSecret != reqModel.ApiSecret) throw new UnauthorizedException('incorrect secret key');

		return client;
	}

	private async ValidateCodeAndGetIPToken(code: string, client: Client): Promise<Auth0Models.TokenResponse> {
		const tokenApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/oauth/token`;

		let getTokenResponse: any = await axios.post(tokenApiUrl, {
			grant_type: 'authorization_code',
			client_id: client.ProviderClientId,
			client_secret: client.ProviderClientSecret,
			code: code,
			redirect_uri: client.RedirectUrl
		});
		let tokenResponse: Auth0Models.TokenResponse = getTokenResponse.data;

		return tokenResponse;
	}

	private async ValidateIPRefreshTokenAndGetIPToken(
		ipRefreshToken: string,
		client: Client
	): Promise<Auth0Models.TokenResponse> {
		const tokenApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/oauth/token`;
		let getTokenResponse: any = await axios.post(tokenApiUrl, {
			grant_type: 'refresh_token',
			client_id: client.ProviderClientId,
			client_secret: client.ProviderClientSecret,
			refresh_token: ipRefreshToken
		});
		let tokenResponse: Auth0Models.TokenResponse = getTokenResponse.data;
		return tokenResponse;
	}

	private async GetProviderUserInfo(tokenResponse: Auth0Models.TokenResponse): Promise<Auth0Models.ProviderUser> {
		const userApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/userinfo`;
		let userInfoResponse: any = await axios.get(userApiUrl, {
			headers: {
				Authorization: `Bearer ${tokenResponse.access_token}`
			}
		});
		let user: Auth0Models.ProviderUser = userInfoResponse.data;
		return user;
	}

	private GenerateAccessToken(user: User): string {
		const accessToken =
			'Bearer ' +
			this.JwtService.sign({
				Id: user.Id,
				Email: user.Email
			} as AuthenticationModels.JwtAccessToken);
		return accessToken;
	}

	private GenerateRefreshToken(user: User): string {
		const refreshToken = this.JwtService.sign(
			{
				Email: user.Email,
				Id: user.Id
			} as AuthenticationModels.JwtRefreshToken,
			{
				expiresIn: this.AppConfig.Config.Auth.Jwt.RefreshTokenSpan
			}
		);
		// we should add this refresh token to the contact in db
		// so every user should have a valid refresh token with him then remove on logout
		return refreshToken;
	}

	private GenerateCurrentUser(user: User): CurrentUser {
		const currentUser = {
			Id: user.Id,
			FirstName: user.FirstName,
			LastName: user.LastName,
			Email: user.Email,
			ProfilePicturePath: user.ProfilePicPath
		} as CurrentUser;
		return currentUser;
	}

	async RefreshAccessToken(reqModel: RefreshTokenDTO.ReqModel): Promise<RefreshTokenDTO.ResModel> {
		let resModel: RefreshTokenDTO.ResModel = new RefreshTokenDTO.ResModel();
		resModel.Success = true;
		try {
			const currentUser = this.UserHelper.GetCurrentUser();
			const client = await this.CheckClient(reqModel);
			const user = await this.UsersService.FindById(reqModel.UserId);

			if (!user) throw new NotFoundException();
			if (user.Id != currentUser.Id) throw new UnauthorizedException();

			const refreshToken = user.Auth0RefreshToken;
			const tokenResponse: Auth0Models.TokenResponse = await this.ValidateIPRefreshTokenAndGetIPToken(
				refreshToken,
				client
			);

			let providerUser: Auth0Models.ProviderUser = await this.GetProviderUserInfo(tokenResponse);
			providerUser.Id = user.Id;
			providerUser.refresh_token = tokenResponse.refresh_token;
			await this.UsersService.UpdateUserFromIp(providerUser);

			resModel.AccessToken = this.GenerateAccessToken(user);
			resModel.RefreshToken = this.GenerateRefreshToken(user);
		} catch (error) {
			resModel.Success = false;
		}

		return resModel;
	}
}
