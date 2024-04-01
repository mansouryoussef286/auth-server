import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { WinstonService } from '@App/Common/Logs/Winston.Helper';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	// constructor(private readonly WinstonService: WinstonService) {}
	constructor() {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		console.log('<Logging.Interceptor>');

		const request = context.switchToHttp().getRequest();
		request.StartTime = Date.now(); // to use in logging errors

		// console.log('remoteAddress: ' + request.connection.remoteAddress);

		return next.handle().pipe(
			tap(() => {
				console.log(`After... ${Date.now() - request.StartTime}ms`);
				console.log('</Logging.Interceptor>');
				// this.WinstonService.EndPoint(request);
			})
		);
	}
}
