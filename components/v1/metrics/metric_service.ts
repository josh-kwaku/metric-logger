import IMetric from './IMetric';
import { FileSystem } from '../../../utils/filesystem';
import * as path from 'path';
import { AppError } from '../../../utils/error';
import { ErrorHandler } from '../../../utils/error_handler';
import { HttpStatusCode } from '../../../utils/http_status_codes';
import { CommonErrors } from '../../../utils/common_errors';

const errorHandler = new ErrorHandler();
const fileSystem = new FileSystem();

const pathToMetricFile = path.join(process.cwd(), 'logs/');
const MS_PER_HOUR = 36e5;
// const pathToMetricFile = path.join('/user/lola/metrics.txt');

class MetricObject {
    timestamp: number;
    date: string;
    time: string;
    key: string;
    value: number;
    constructor(metric_array: Array<string>) {
        this.timestamp = Number(metric_array[0]);
        this.date = metric_array[1];
        this.time = metric_array[2];
        this.key = metric_array[3].split(":")[1];
        this.value = Number(metric_array[4].split(":")[1]);
    }
}

export class MetricService {
    constructor() {}

    public writeMetricToFile(object: IMetric): Promise<any> {
        return new Promise((resolve, reject) => {
            const date = new Date();
            const content = `${date.getTime()}\t${date.getDate()}/${date.getMonth()}/${date.getFullYear()}\t${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\tkey:${object.key}\tvalue:${object.value}\n`;

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
            let result = fileSystem.writeToFile(pathToMetricFile + `${key}.txt`, content);
            if (result === true) resolve(result)

            // an error occurred
            result = result as Error
            let error = new AppError(result.message,HttpStatusCode.INTERNAL_SERVER_ERROR, CommonErrors.SERVER_ERROR, true);

            errorHandler.handleError(error);
            reject(error);
        });
    }

    public getMetricByKey(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.readMetricFile(key).then(data => {
                resolve(data);
            }).catch((error: AppError) => {
                reject(error);
            })
        })
    }

    public sumMetricByKey(key: string) {
        return new Promise((resolve, reject) => {
            this.readMetricFile(key).then((lines: Array<string>) => {
                const sum = this.sum(lines);
                resolve(sum);
            }).catch((error: AppError) => {
                reject(error);
            })
        })
    }

    private sum(lines: Array<string>): number {
        let sum = 0;
        for (let line of lines) {
            if (line.length <= 0) continue;
            let metricObject = new MetricObject(line.split("\t"));
            let today = new Date();
            if ( this.dateDifferenceInHours(today, new Date(Number(metricObject.timestamp))) <= 1) {
                sum += Math.round(metricObject.value);
            }
        }
        return sum
    }

    private dateDifferenceInHours(a: Date, b: Date) {
        return Math.floor(Math.abs((a.getTime() - b.getTime()) / MS_PER_HOUR));
    }

    private readMetricFile(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fileSystem.readFile(pathToMetricFile + `${key}.txt`, (err, file_contents) => {
                if (err) {
                    let error = new AppError(err.message, HttpStatusCode.BAD_REQUEST, 
                    CommonErrors.BAD_PARAMETERS, true);
    
                    errorHandler.handleError(error);
                    reject(error);    
                }
                else resolve(fileSystem.splitLines(file_contents));
            });
        });
    }
}