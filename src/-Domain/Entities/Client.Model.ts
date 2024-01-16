export class Client {
	Id: number;
	ApiId: string | null;
	ApiSecret: string | null;
	ProviderClientId: string;
	ProviderClientSecret: string;
	RedirectUrl: string | null;
	IsActive: boolean;
}
