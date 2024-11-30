export class ApplicationError extends Error {
  constructor(message = "Not found", options?: ErrorOptions) {
    super(message, options);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends Error {
  public fieldErrors: Record<string, string[] | undefined>;

  constructor(
    fieldErrors: Record<string, string[] | undefined>,
    message = "Validation failed!",
    options?: ErrorOptions
  ) {
    super(message, options);

    this.fieldErrors = fieldErrors;
    this.name = "ValidationError";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class AuthenticationError extends ApplicationError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor() {
    super("Resource not found");
    this.name = "NotFoundError";
  }
}

export class TokenError extends ApplicationError {
  constructor(message = "Invalid code!") {
    super(message);
    this.name = "TokenExpiredError";
  }
}
