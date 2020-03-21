import express from "express";
import { NextFunction } from "connect";
import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import { MetricController } from './metric_controller';
import { IResponse } from '../../../utils/IResponse';
import { AppError } from '../../../utils/error';

const metricController = new MetricController();
const router = express.Router();

const addParamToReqBody = function(req: Request<ParamsDictionary, any, any>, res: Response<any>, next:NextFunction) {
    for (let [key, value] of Object.entries(req.params)) {
        // if (Number(value) !== NaN) next(); // don't allow numeric keys
        req.body[key] = value;
    }
    console.log("req body: ", req.body);
    next();
}

router.get('/', (req, res) => {
    res.status(200).send("Metric route");
})

router.post('/:key', addParamToReqBody, (req, res) => {
   metricController.saveMetric(req.body).then((response: IResponse) => {
       console.log("got here");
       res.status(response.httpCode).send();  
   }).catch((error: IResponse) => {
       let err = Object.assign({}, error);
       delete err.httpCode;
       res.status(error.httpCode).send(err);
   })
});

router.get('/:key/sum', (req, res) => {
    res.status(200).send({sum: 0});
});

export default router;