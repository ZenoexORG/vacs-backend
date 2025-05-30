import { Logger } from '@nestjs/common';
import { DatabaseError, ValidationError, ConflictError, ForbiddenError, NotFoundError } from '../errors/application.errors';
import { ReportDataFetchError } from '../errors/report.errors';

export function handleDatabaseError(
	error: any,
	operation: string,
	context: Record<string, any> = {},
	logger: Logger
): never {
	if (error.name && [
		'NotFoundError',
		'ValidationError',
		'ConflictError',
		'ForbiddenError',
		'AuthorizationError',
		'ReportError',
		'ReportGenerationError',
		'ReportDataFetchError',
	].includes(error.name)) {
		throw error;
	}
	logger.debug(
		`Database error during ${operation} operation: ${error.message}`,
	);
	throw new DatabaseError(`Database error during ${operation}`, error);
}

export function handleReportDataError(
	error: any,
	operation: string,
	context: Record<string, any> = {},
	logger: Logger
): never {
	logger.debug(
		`Error fetching report data: ${operation}`,
		{ error: error.message, context, stack: error.stack }
	);

	if (error.code && error.code.startsWith('23')) {
		throw new DatabaseError(`Database constraint violation during ${operation}`, error);
	}

	throw new ReportDataFetchError(`Failed to retrieve ${operation}`, error);
}

export function handleNotFoundError(entity: string, identifier: string | number, logger: Logger): never {
	const message = `${entity} with identifier ${identifier} not found`;
	logger.debug(message);
	throw new NotFoundError(message);
}

export function handleValidationError(
	message: string,
	details: Record<string, any> = {},
	logger: Logger
): never {
	logger.debug(`Validation error: ${message}`);
	throw new ValidationError(message, details);
}

export function handleConflictError(
	message: string,
	context: Record<string, any> = {},
	logger: Logger
): never {
	logger.debug(`Conflict error: ${message}`, { context });
	throw new ConflictError(message);
}

export function handleForbiddenError(
	message: string,
	context: Record<string, any> = {},
	logger: Logger
): never {
	logger.debug(`Forbidden error: ${message}`, { context });
	throw new ForbiddenError(message);
}