import { CurrentUser } from '@App/-Domain/DTOs/CurrentUser.Model';

export namespace RefreshTokenDTO {
	export class ReqModel {
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
