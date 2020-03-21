import logger from "./logger";
import { AppError } from './error';

export class ErrorHandler {
    public handleError(error: AppError) {
        // add logger here
        logger.error(error);
        
        if(!error.isOperational) { // restart the server whenever a programming error occurs
            process.exit(1);
        }
    }
}