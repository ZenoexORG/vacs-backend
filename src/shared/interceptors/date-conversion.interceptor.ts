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
            result.data = data.data.map(item => this.processObject(item, dateFields));
            return result;
        }
        
        // Handle arrays
        if (Array.isArray(data)) {
            return data.map(item => this.processObject(item, dateFields));
        }
                
        return this.processObject(data, dateFields);
    }
    
    private processObject(obj: any, dateFields: string[]): any {
        if (!obj || typeof obj !== 'object') return obj;
        
        const result = {...obj};
        
        for (const field of dateFields) {
            if (field.includes('.') || field.includes('[]')) {
                this.convertNestedDate(result, field);
            } else if (field in result && this.isDateValue(result[field])) {
                result[field] = moment.utc(result[field]).tz('America/Bogota').format();
            }
        }
        
        return result;
    }

    private convertNestedDate(obj: any, path: string): void {
        // Handle array notation like 'history[].created_at'
        if (path.includes('[]')) {
            const [arrayName, ...restPath] = path.split('[].');
            
            if (obj[arrayName] && Array.isArray(obj[arrayName])) {
                for (const item of obj[arrayName]) {
                    this.convertNestedDate(item, restPath.join('.'));
                }
            }
            return;
        }

        // Handle dot notation like 'history.created_at'
        const parts = path.split('.');
        const [current, ...rest] = parts;
        
        if (rest.length === 0) {
            // We've reached the actual field
            if (obj[current] && this.isDateValue(obj[current])) {
                obj[current] = moment.utc(obj[current]).tz('America/Bogota').format();
            }
        } else if (obj[current]) {
            // Continue traversing
            if (Array.isArray(obj[current])) {
                // If we encounter an array, process each item
                for (const item of obj[current]) {
                    this.convertNestedDate(item, rest.join('.'));
                }
            } else if (typeof obj[current] === 'object') {
                // If we encounter an object, continue with the path
                this.convertNestedDate(obj[current], rest.join('.'));
            }
        }
    }

    private isDateValue(value: any): boolean {
        return value instanceof Date || 
               (typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid());
    }
}