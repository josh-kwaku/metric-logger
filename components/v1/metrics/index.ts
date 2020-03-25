import express, { response } from "express";
import { NextFunction } from "connect";
import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import { MetricController } from "./metric_controller";
import { IResponse } from "../../../utils/IResponse";
import { AppError } from "../../../utils/error";

const metricController = new MetricController();
const router = express.Router();

const addParamToReqBody = function(
  req: Request<ParamsDictionary, any, any>,
  res: Response<any>,
  next: NextFunction
) {
  for (let [key, value] of Object.entries(req.params)) {
    req.body[key] = value;
  }
  next();
};

const handleResponse = function(
  response: IResponse,
  res: Response<any>,
  sendBody: boolean
) {
  let resp = Object.assign({}, response);
  delete resp.httpCode;
  sendBody
    ? res.status(response.httpCode).send(resp)
    : res.status(response.httpCode).send();
};

router.get("/", (req, res) => {
  res.status(200).send("Metric route");
});

router.post("/:key", addParamToReqBody, (req, res) => {
  let response = metricController.logMetric(req.body);
  handleResponse(response, res, response.success === false ? true : false);
});

router.get("/:key/sum", (req, res) => {
  let response = metricController.sum(req.params.key);
  handleResponse(response, res, true);
});

export default router;
