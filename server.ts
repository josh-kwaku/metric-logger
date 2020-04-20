// require('dotenv').config();
import app from './components/app';
import { ErrorHandler } from "./utils/error_handler";
import { AppError } from './utils/error';

const errorHandler = new ErrorHandler();
const port = process.env.PORT || 8000;

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    throw reason;
});
  
process.on('uncaughtException', (error: AppError) => {
    errorHandler.handleError(error);
});

app.listen(port, () => {
    console.log(`Server Listening On Port ${port}\nPress Ctrl-C to stop it\n`);
});
