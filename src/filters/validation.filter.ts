import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationError[], host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Format validation errors in a consistent way
        const formattedErrors = this.formatErrors(exception);

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            errors: formattedErrors,
            timestamp: new Date().toISOString(),
        });
    }

    private formatErrors(errors: ValidationError[]): Record<string, string[]> {
        const result: Record<string, string[]> = {};

        errors.forEach(error => {
            result[error.property] = Object.values(error.constraints || {});

            if (error.children?.length) {
                const childErrors = this.formatErrors(error.children);
                Object.entries(childErrors).forEach(([key, value]) => {
                    result[`${error.property}.${key}`] = value;
                });
            }
        });

        return result;
    }
}