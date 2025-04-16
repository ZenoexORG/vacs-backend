import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-timezone';

@Injectable()
export class UTCToLocalInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		return next.handle().pipe(
			map(data => this.convertDatesToLocal(data))
		);
	}

	private convertDatesToLocal(data: any): any {
		if (Array.isArray(data)) {
			return data.map(item => this.convertDatesToLocal(item));
		} else if (typeof data === 'object' && data !== null) {
			const convertedData: any = {};
			for (const key of Object.keys(data)) {
				const value = data[key];
				if (value instanceof Date || this.looksLikeDate(value)) {
					convertedData[key] = moment(value).tz('America/Bogota').format(); // formato ISO 8601 en hora local
				} else if (typeof value === 'object') {
					convertedData[key] = this.convertDatesToLocal(value);
				} else {
					convertedData[key] = value;
				}
			}
			return convertedData;
		}
		return data;
	}

	private looksLikeDate(value: any): boolean {
		if (typeof value !== 'string') return false;
		const m = moment(value, moment.ISO_8601, true);
		return m.isValid() && m.isUTC();
	}
}
