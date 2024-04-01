import { AuthenticationModels } from '@App/-Domain/Models/Authentication.Models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private readonly AsyncLocalStorage: AsyncLocalStorage<AuthenticationModels.JwtAccessToken>) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		this.AsyncLocalStorage.enterWith({ ...request.user });
		return next.handle();
	}
}
