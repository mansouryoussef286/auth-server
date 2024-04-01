import { AuthenticationModels } from '@App/-Domain/Models/Authentication.Models';
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class UserHelper {
	constructor(private readonly AsyncLocalStorage: AsyncLocalStorage<AuthenticationModels.JwtAccessToken>) {}

	GetCurrentUser() {
		return this.AsyncLocalStorage.getStore();
	}
}
