import axios from 'axios';
import { AuthProvider } from '../Interfaces/auth-provider.interface';
import { AuthorizationCodeFlow } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { Client } from '@App/-Domain/Entities/Client.Model';
import { AppConfig } from '@App/Config/App.Config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CurrentUser } from '../DTOs/CurrentUser.Model';

export class TokenResponse {
	access_token: string;
	id_token: string;
	scope: string;
	expires_in: number;
	token_type: string;
}
export class User {
	email: string;
	email_verified: boolean;
	family_name: string;
	given_name: string;
	locale: string;
	name: string;
	nickname: string;
	picture: string;
	sub: string;
	updated_at: Date;
}

@Injectable()
export class Auth0Provider implements AuthProvider {
	constructor(
		private AppConfig: AppConfig,
		private JwtService: JwtService,
		private ClientRepository: IClientRepository
	) {}

	async authenticate(reqModel: AuthorizationCodeFlow.ReqModel): Promise<AuthorizationCodeFlow.ResModel> {
		let client: Client = await this.ClientRepository.findByApiId(reqModel.ApiId);

		const tokenApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/oauth/token`;
		const userApiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/userinfo`;
		let accessToken: string;
		let refreshToken: string;
		let currentUser: CurrentUser;
		// create a wrapper for axios
		try {
			let getTokenResponse: any = await axios.post(tokenApiUrl, {
				grant_type: 'authorization_code',
				client_id: client.ProviderClientId,
				client_secret: client.ProviderClientSecret,
				code: reqModel.Code,
				redirect_uri: 'http://localhost:4200/auth'
			});
			let tokenResponse: TokenResponse = getTokenResponse.data;

			let userInfoResponse: any = await axios.get(userApiUrl, {
				headers: {
					Authorization: `Bearer ${tokenResponse.access_token}`
				}
			});
			let user: User = userInfoResponse.data;

			// check with users db table to add him if new

			console.log(user);
			accessToken = this.GenerateAccessToken(user);
			refreshToken = this.GenerateRefreshToken(user);
			currentUser = this.GenerateCurrentUser(user);
		} catch (error) {
			console.log(error);
		}
		return {
			AccessToken: accessToken,
			RefreshToken: refreshToken,
			CurrentUser: currentUser
		};
	}

	GenerateAccessToken(user: User): string {
		const accessToken =
			'Bearer ' +
			this.JwtService.sign({
				Email: user.email
			} as any);
		return accessToken;
	}

	GenerateRefreshToken(user: User): string {
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

	GenerateCurrentUser(user: User): CurrentUser {
		const currentUser = {
			FirstName: user.given_name,
			LastName: user.family_name,
			Email: user.email,
			ProfilePicturePath: user.picture
		} as CurrentUser;
		return currentUser;
	}

	dec(token: string) {
		let x = this.JwtService.verify(token);
		return x;
	}
}
