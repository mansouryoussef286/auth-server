import { CurrentUser } from '@App/-Domain/DTOs/CurrentUser.Model';

export namespace AuthorizationCodeFlowDTO {
	export class ReqModel {
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
