import { CurrentUser } from '@App/-Domain/DTOs/CurrentUser.Model';
import { ApiKeys } from './ApiKeys.interface';

export namespace AuthorizationCodeFlowDTO {
	export class ReqModel implements ApiKeys{
		Code!: string;
		ApiId!: string;
		ApiSecret!: string;
	}

	export class ResModel {
		Success: boolean;
		AccessToken: string;
		RefreshToken: string;
		CurrentUser: CurrentUser;
	}
}
