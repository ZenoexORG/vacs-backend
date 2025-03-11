import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { hours } from '@nestjs/throttler';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const response = context.switchToHttp().getResponse<Response>();
		response.clearCookie('token', { httpOnly: true, secure: true });

		return next.handle().pipe(
			tap((data) => {
				const token = data.access_token;

				response.cookie('token', token, {
					signed: true,
					httpOnly: true,
					secure: true,
					maxAge: hours(12),
				});
			})
		);
	}
}
