import { CurrentUser } from '@App/-Domain/DTOs/CurrentUser.Model';
import { ApiKeys } from './ApiKeys.interface';

export namespace RefreshTokenDTO {
	export class ReqModel implements ApiKeys {
		UserId!: number;
		AccessToken!: string;
		RefreshToken!: string;
		ApiId!: string;
		ApiSecret!: string;
	}

	export class ResModel {
		Success: boolean;
		AccessToken: string;
		RefreshToken: string;
	}
}
