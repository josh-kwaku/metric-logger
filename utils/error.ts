import { HttpStatusCode } from './http_status_codes';

/**
 * Custom Error Object
 */
export class AppError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;
  
    constructor(name: string, httpCode: HttpStatusCode, description: string, isOperational: boolean) {
      super(description);
  
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  
      this.name = name;
      this.httpCode = httpCode;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this);
    }
}