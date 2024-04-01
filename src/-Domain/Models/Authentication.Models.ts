export namespace AuthenticationModels {
	export class JwtAccessToken {
		Id: number;
		Email: string;
	}

	export class JwtRefreshToken {
		Id: number;
		Email: string;
	}
}
