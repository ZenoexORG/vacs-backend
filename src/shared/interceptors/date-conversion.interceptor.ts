import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATE_FIELDS_KEY } from '../decorators/date-conversion.decorator';
import * as moment from 'moment-timezone';

@Injectable()
export class DateConversionInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map(data => {				
                const dateFields = this.reflector.get<string[]>(
                    DATE_FIELDS_KEY, context.getHandler()
                ) || [];
                if (dateFields.length === 0) return data;                                
                return this.convertDates(data, dateFields);
            })
        )
    }

    private convertDates(data: any, dateFields: string[]): any {
        if (!data) return data;
        
        // Handle paginated responses with data array property
        if (data.data && Array.isArray(data.data)) {
            const result = {...data};
            result.data = data.data.map(item => this.convertObjectDates(item, dateFields));
            return result;
        }
        
        // Handle arrays
        if (Array.isArray(data)) {
            return data.map(item => this.convertObjectDates(item, dateFields));
        }
                
        return this.convertObjectDates(data, dateFields);
    }
    
    private convertObjectDates(obj: any, dateFields: string[]): any {
        if (!obj || typeof obj !== 'object') return obj;
        
        const result = {...obj};
        
        for (const field of dateFields) {
            if (field in result && this.isDateValue(result[field])) {                
                result[field] = moment.utc(result[field]).tz('America/Bogota').format();
            }
        }
        
        return result;
    }

    private isDateValue(value: any): boolean {
        return value instanceof Date || 
               (typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid());
    }
}