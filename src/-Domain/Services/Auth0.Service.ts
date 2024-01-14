import axios from 'axios';
import { AuthProvider } from '../Interfaces/auth-provider.interface';
import { AuthorizationCodeFlow } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { IClientRepository } from '@App/-Domain/Interfaces/Repositories/IClient.Repository';
import { Client } from '@App/-Domain/Entities/Client.Model';
import { AppConfig } from '@App/Config/App.Config';

export class TokenResponse {
	access_token: string;
	id_token: string;
	scope: string;
	expires_in: number;
	token_type: string;
}

export class Auth0Provider implements AuthProvider {
	constructor(
		private AppConfig: AppConfig,
		private ClientRepository: IClientRepository
	) {}

	async authenticate(reqModel: AuthorizationCodeFlow.ReqModel): Promise<string> {
		let client: Client = await this.ClientRepository.findByApiId(reqModel.ApiId);

		const apiUrl = `${this.AppConfig.Config.Provider.Auth0.TenantDomain}/oauth/token`;
		// create a wrapper for axios
		const response: TokenResponse = await axios.post(apiUrl, {
			grant_type: 'authorization_code',
			client_id: client.ProviderClientId,
			client_secret: client.ProviderClientSecret,
			code: reqModel.Code,
			redirect_uri: 'http://localhost:4200/auth'
		});
		// check if the response is success this means the auth is ok
		// generate jwt access token
		// generate jwt refresh token
		// generate current user object
		console.log(response);

		return '';
	}
}
