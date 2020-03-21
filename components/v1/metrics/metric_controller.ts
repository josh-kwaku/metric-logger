import IMetricModel from "./IMetric";
import { IResponse } from "../../../utils/IResponse";
import { HttpStatusCode } from '../../../utils/http_status_codes';
import { CommonErrors } from '../../../utils/common_errors';
import { AppError } from '../../../utils/error';
import { MetricService } from './metric_service';
import { MetricValidator } from "./metric_validator";

const metricValidator = new MetricValidator();
const metricService = new MetricService();

export class MetricController {
    constructor(){}

    saveMetric(requestObject: IMetricModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const isValid = metricValidator.validateNewMetricPayload(requestObject);
            if (!isValid) {
                let response: IResponse = {
                    success: false,
                    message: CommonErrors.BAD_PARAMETERS,
                    httpCode: HttpStatusCode.BAD_REQUEST,
                    data: {}
                }
                reject(response);
            }
            else metricService.writeMetricToFile(requestObject).then((isSuccess: boolean) => {
                let response: IResponse = {
                    httpCode: HttpStatusCode.OK
                }
                if (isSuccess) resolve(response)
            }).catch((error: AppError) => {
                let response: IResponse = {
                    success: false,
                    message: error.message,
                    httpCode: error.httpCode,
                    data: {}
                }
                reject(response);
            })
        })
    }

    public sumMetricByKey(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            metricService.sumMetricByKey(key).then(sum => {
                let response: IResponse = {
                    httpCode: HttpStatusCode.OK,
                    data: {
                        value: sum
                    },
                    success: true
                }
                resolve(response);
            }).catch((error: AppError) => {
                let response: IResponse = {
                    success: false,
                    message: error.message,
                    httpCode: error.httpCode,
                    data: {}
                }
                reject(response);
            })
        })
    }
}

