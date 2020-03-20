import logger from "./logger";
import { AppError } from './error';

export class ErrorHandler {
    public async handleError(error: AppError): Promise<any> {
        // add logger here
        logger.error(error);

        if(!error.isOperational) { // restart the server whenever a programming error occurs
            process.exit(1);
        }
    }
}