import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../Interfaces/auth-provider.interface';
import { Auth0Provider } from './Auth0.Service';

export enum AuthProviderEnum {
	Auth0 = 'Auth0'
}

@Injectable()
export class AuthProviderFactory {
	constructor(private Auth0Provider: Auth0Provider) {}

	getAuthProvider(provider: string): AuthProvider {
		switch (provider) {
			case AuthProviderEnum.Auth0:
				return this.Auth0Provider;
			default:
				throw new Error(`Unsupported provider: ${provider}`);
		}
	}
}
