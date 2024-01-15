import { AuthorizationCodeFlow } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';

export interface AuthProvider {
	authenticate(code: AuthorizationCodeFlow.ReqModel): Promise<AuthorizationCodeFlow.ResModel>;
	dec(token: string): any;
}
