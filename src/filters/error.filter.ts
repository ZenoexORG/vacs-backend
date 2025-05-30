import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import {
	ApplicationError, DatabaseError, ValidationError, AuthorizationError,
	NotFoundError, ConflictError, ForbiddenError
} from "../shared/errors/application.errors";
import { ReportError } from "../shared/errors/report.errors";
import { TimezoneService } from "src/shared/services/timezone.service";

@Catch(ApplicationError)
export class ErrorFilter implements ExceptionFilter {
	private readonly logger = new Logger(ErrorFilter.name);
	constructor(private readonly timezoneService: TimezoneService) { }
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "An unexpected error occurred";

		if (exception instanceof ValidationError) {
			status = HttpStatus.BAD_REQUEST;
			message = exception.message;
		} else if (exception instanceof AuthorizationError) {
			status = HttpStatus.UNAUTHORIZED;
			message = exception.message;
		} else if (exception instanceof DatabaseError) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			message = "Database operation failed";
		} else if (exception instanceof ReportError) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			message = "Report operation failed";
		} else if (exception instanceof NotFoundError) {
			status = HttpStatus.NOT_FOUND;
			message = exception.message;
		} else if (exception instanceof ConflictError) {
			status = HttpStatus.CONFLICT;
			message = exception.message;
		} else if (exception instanceof ForbiddenError) {
			status = HttpStatus.FORBIDDEN;
			message = exception.message;
		}		
		response.status(status).json({
			statusCode: status,
			message: message,
			error: exception.name,
			details: exception instanceof ValidationError ? exception.details : undefined,
			timestamp: this.timezoneService.toTimezone(new Date()),
		});
	}
}