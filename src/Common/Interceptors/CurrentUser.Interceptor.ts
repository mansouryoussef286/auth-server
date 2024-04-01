// import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
// import { AsyncLocalStorage } from 'async_hooks';
// import { Observable } from 'rxjs';
// import { AccountModels } from '../../Features/Account/Account.Models';

// @Injectable()
// export class CurrentUserInterceptor implements NestInterceptor {
// 	constructor(private readonly AsyncLocalStorage: AsyncLocalStorage<AccountModels.JwtModel>) {}

// 	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
// 		// console.log('<CurrentUser.Interceptor>');

// 		const request = context.switchToHttp().getRequest();
// 		// console.log(request.user);

// 		// Add LogToken to use in database logging as no request can be catched
// 		this.AsyncLocalStorage.enterWith({ ...request.user, LogToken: request.headers['log-token'] });

// 		// console.log('</CurrentUser.Interceptor>');
// 		return next.handle();
// 	}
// }
