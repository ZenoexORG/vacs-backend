
export class ApplicationError extends Error {
	constructor(message: string, public readonly originalError?: any) {
		super(message);
		this.name = 'ApplicationError';
	}
}

export class DatabaseError extends ApplicationError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'DatabaseError';
	}
}

export class ValidationError extends ApplicationError {
	constructor(message: string, public readonly details?: any) {
		super(message);
		this.name = 'ValidationError';
		this.details = details;
	}
}

export class AuthorizationError extends ApplicationError {
	constructor(message: string = 'Unauthorized access') {
		super(message);
		this.name = 'AuthorizationError';
	}
}

export class NotFoundError extends ApplicationError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'NotFoundError';
	}
}

export class ConflictError extends ApplicationError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'ConflictError';
	}
}

export class ForbiddenError extends ApplicationError {
	constructor(message: string, public readonly originalError?: any) {
		super(message, originalError);
		this.name = 'ForbiddenError';
	}
}