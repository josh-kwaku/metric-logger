import Joi from "@hapi/joi";

export class MetricValidator {
    validateNewMetricPayload(payload: any): boolean{
        const schema = Joi.object().keys({
            value: Joi.number().required(),
            key: Joi.string()
        });
        const result = schema.validate(payload);
        return result.error === undefined ? true : false
    }
}