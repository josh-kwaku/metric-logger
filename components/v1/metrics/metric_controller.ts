import IMetricModel from "./IMetric";
import { IResponse } from "../../../utils/IResponse";
import { HttpStatusCode } from "../../../utils/http_status_codes";
import { CommonErrors } from "../../../utils/common_errors";
import { AppError } from "../../../utils/error";
import { MetricService } from "./metric_service";
import { MetricValidator } from "./metric_validator";

const metricValidator = new MetricValidator();
const metricService = new MetricService();

export class MetricController {
  constructor() {}

  logMetric(requestObject: IMetricModel): IResponse {
    const isValid = metricValidator.validateNewMetricPayload(requestObject);
    if (!isValid) {
      let response: IResponse = {
        success: false,
        message: CommonErrors.BAD_PARAMETERS,
        httpCode: HttpStatusCode.BAD_REQUEST,
        data: {}
      };
      return response;
    } else {
      metricService.logMetric(requestObject);
      let response: IResponse = {
        httpCode: HttpStatusCode.OK
      };
      return response;
    }
  }

  public sum(key: string): IResponse {
    let result = metricService.sumMetricByKey(key);
    if (result === false) {
      let response: IResponse = {
        success: false,
        message: CommonErrors.WRONG_KEY,
        httpCode: HttpStatusCode.BAD_REQUEST,
        data: {}
      };
      return response;
    } else {
      let response: IResponse = {
        httpCode: HttpStatusCode.OK,
        data: {
          value: result as number
        },
        success: true
      };
      return response;
    }
  }
}
