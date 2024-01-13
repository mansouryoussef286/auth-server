import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../Interfaces/auth-provider.interface';
import { Auth0Provider } from './Auth0.Service';

export enum AuthProviderEnum {
	Auth0 = 'Auth0'
}

@Injectable()
export class AuthProviderFactory {
	getAuthProvider(provider: string): AuthProvider {
		switch (provider) {
			case AuthProviderEnum.Auth0:
				return new Auth0Provider();
			default:
				throw new Error(`Unsupported provider: ${provider}`);
		}
	}
}
