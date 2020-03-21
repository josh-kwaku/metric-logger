import IMetric from './IMetric';
import * as fs from 'fs';
import * as path from 'path';
import { AppError } from '../../../utils/error';
import { ErrorHandler } from '../../../utils/error_handler';
import { HttpStatusCode } from '../../../utils/http_status_codes';
import { CommonErrors } from '../../../utils/common_errors';

const errorHandler = new ErrorHandler();

const pathToMetricFile = path.join(process.cwd(), 'logs/');
// const pathToMetricFile = path.join('/user/lola/metrics.txt');

export class MetricService {
    constructor() {}

    public writeMetricToFile(object: IMetric): Promise<any> {
        return new Promise((resolve, reject) => {
            const date = new Date();
            const content = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}\t${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\tkey:${object.key}\tvalue:${object.value}\n`;

            this.writeToFile(content, object.key).then(contentWasWritten => {
                if (contentWasWritten) {
                    resolve(true);
                }
            }).catch((error: AppError) => {
                reject(error);
            })
        })
    }

    private writeToFile(content: string, key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.writeFile(pathToMetricFile + `${key}.txt`, content, {
                flag: 'a'}, (err) => {
                    if(err) {
                        let error = new AppError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR, CommonErrors.SERVER_ERROR, true);

                        errorHandler.handleError(error);
                        reject(error); 
                    }
                    resolve(true);
                });
        });
    }

    public getMetricByKey(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.readMetricFile(key).then(data => {
                resolve(data)
            }).catch((error: AppError) => {
                reject(error);
            })
        })
    }

    public sumMetricByKey() {

    }

    private readMetricFile(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(pathToMetricFile + `${key}.txt`, (err, data) => {
                if (err) {
                    let error = new AppError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR, CommonErrors.SERVER_ERROR, true);
    
                            errorHandler.handleError(error);
                            reject(error);
                }
                console.log(data);
                resolve(data);
            })
        });
    }
}