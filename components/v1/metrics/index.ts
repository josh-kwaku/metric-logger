import express, { response } from "express";
import { NextFunction } from "connect";
import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import { MetricController } from './metric_controller';
import { IResponse } from '../../../utils/IResponse';
import { AppError } from '../../../utils/error';

const metricController = new MetricController();
const router = express.Router();

const addParamToReqBody = function(req: Request<ParamsDictionary, any, any>, res: Response<any>, next:NextFunction) {
    for (let [key, value] of Object.entries(req.params)) {
        req.body[key] = value;
    }
    next();
}

const handleResponse =  function(response: IResponse, res: Response<any>, sendBody: boolean) {
    let resp = Object.assign({}, response);
    delete resp.httpCode;
    sendBody ? res.status(response.httpCode).send(resp) : res.status(response.httpCode).send()
}

router.get('/', (req, res) => {
    res.status(200).send("Metric route");
})

router.post('/:key', addParamToReqBody, (req, res) => {
   metricController.saveMetric(req.body).then((result: IResponse) => {
       handleResponse(result, res, false)
   }).catch((error: IResponse) => {
       handleResponse(error, res, true);
   })
});

router.get('/:key/sum', (req, res) => {
    metricController.sumMetricByKey(req.params.key).then((result: IResponse) => {
        handleResponse(result, res, true)
    }).catch((error: IResponse) => {
        handleResponse(error, res, true);
    }) 
});

export default router;