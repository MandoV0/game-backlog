export class ApiError extends Error {
  statusCode: number;
  cause?: Error;

  constructor(statusCode: number = 500, message: string, options?: { cause?: Error }) {
    super(message);
    this.statusCode = statusCode;
    this.cause = options?.cause;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}