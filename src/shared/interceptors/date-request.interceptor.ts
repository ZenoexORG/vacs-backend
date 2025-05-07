import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { DATE_FIELDS_KEY } from '../decorators/date-conversion.decorator';

@Injectable()
export class DateRequestInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) { }

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const dateFields = this.reflector.get<string[]>(
			DATE_FIELDS_KEY,
			context.getHandler()
		) || [];

		if (dateFields.length > 0) {
			const request = context.switchToHttp().getRequest();
			if (request.body) {
				request.body = this.convertToUTC(request.body, dateFields);
			}
		}

		return next.handle();
	}

	private convertToUTC(data: any, dateFields: string[]): any {
		if (!data) return data;

		if (Array.isArray(data)) {
			return data.map(item => this.convertToUTC(item, dateFields));
		}

		if (typeof data === 'object' && data !== null) {
			const result = { ...data };

			dateFields.forEach(field => {
				if (field in result && this.isLocalDateValue(result[field])) {
					result[field] = moment(result[field]).utc().format();
				}
			});

			return result;
		}

		return data;
	}

	private isLocalDateValue(value: any): boolean {
		return typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid();
	}
}