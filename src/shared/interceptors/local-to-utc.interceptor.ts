import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';

@Injectable()
export class LocalToUTCInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest();
		if (request.body) {
			request.body = this.convertDatesToUTC(request.body);
		}
		return next.handle();
	}

	private convertDatesToUTC(data: any): any {
		if (Array.isArray(data)) {
			return data.map(item => this.convertDatesToUTC(item));
		} else if (typeof data === 'object' && data !== null) {
			const convertedData: any = {};
			for (const key of Object.keys(data)) {
				const value = data[key];
				if (typeof value === 'string' && this.looksLikeDate(value)) {
					convertedData[key] = moment.tz(value, 'America/Bogota').toDate();
				} else if (typeof value === 'object') {
					convertedData[key] = this.convertDatesToUTC(value);
				} else {
					convertedData[key] = value;
				}
			}
			return convertedData;
		}
		return data;
	}

	private looksLikeDate(value: string): boolean {
		if (typeof value !== 'string') return false;
		const m = moment(value, moment.ISO_8601, true);
		return m.isValid() && !m.isUTC();
	}
}
