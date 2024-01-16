export namespace Auth0Models {
	export class TokenResponse {
		access_token: string;
		id_token: string;
		scope: string;
		expires_in: number;
		token_type: string;
	}
	export class ProviderUser {
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
}
