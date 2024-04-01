import { AuthorizationCodeFlowDTO } from '@App/-Domain/DTOs/AuthorizationCodeFlow.Models';
import { RefreshTokenDTO } from '../DTOs/RefreshToken.Models';

export interface AuthProvider {
	authenticate(code: AuthorizationCodeFlowDTO.ReqModel): Promise<AuthorizationCodeFlowDTO.ResModel>;
	RefreshAccessToken(reqModel: RefreshTokenDTO.ReqModel): Promise<RefreshTokenDTO.ResModel>;
}
