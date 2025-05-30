import { ApplicationError } from './application.errors';

export class ReportError extends ApplicationError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'ReportError';
	}
}

export class ReportGenerationError extends ReportError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'ReportGenerationError';
	}
}

export class ReportDataFetchError extends ReportError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'ReportDataFetchError';
	}
}

