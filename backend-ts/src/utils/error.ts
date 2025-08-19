export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number = 500, message: string) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}