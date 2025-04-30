import {Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { path } from 'pdfkit';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const dataToRemove = {}
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',          
          path : '/',
        }

        if (data && data.token){
          response.cookie('token', data.token, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 12, // 12 hours
          });          
          dataToRemove['token'] = true;
        }
        if (data && data.viewPermissions) {
          response.cookie('viewPermissions', data.viewPermissions, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 12, // 12 hours
          });
          dataToRemove['viewPermissions'] = true;
        }
        if (Object.keys(dataToRemove).length > 0) {
          const { token, viewPermissions, ...rest } = data;
          return rest;
        }
        return data;
      }),
    );
  }
}