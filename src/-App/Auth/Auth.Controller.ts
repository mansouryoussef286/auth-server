import {
  AuthProviderEnum,
  AuthProviderFactory,
} from '@App/-Domain/Services/auth-provider.factory';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthModels } from './Auth.Models';

@Controller('authenticate')
export class AuthController {
  constructor(private AuthProviderFactory: AuthProviderFactory) {}

  @Post()
  Login(
    @Body()
    AuthorizationCodeFlowReqModel: AuthModels.AuthorizationCodeFlowReqModel,
  ): Promise<any> {
    return this.AuthProviderFactory.getAuthProvider(
      AuthProviderEnum.Auth0,
    ).authenticate(AuthorizationCodeFlowReqModel.Code);
  }
}
