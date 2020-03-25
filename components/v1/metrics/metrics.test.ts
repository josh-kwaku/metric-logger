import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import request from "supertest";
import app from "../../app";
import { MetricService } from "./metric_service";
import * as assert from "assert";
import IMetricModel from "./IMetric";

chai.use(chaiHttp);
const metricService = new MetricService();

const metric: IMetricModel = {
  key: "active_value",
  value: 21
};

describe("Metric Service Class", () => {
  describe("Log new metric", () => {
    it("should return true when a new metric is successfully logged", () => {
      assert.equal(metricService.logMetric(metric), true);
    });
  });

  describe("Sum metric by key", () => {
    it("when a valid key is supplied, it should return the correct sum", () => {
      assert.equal(metricService.sumMetricByKey(metric.key), metric.value);
    });

    it("when an invalid key is supplied, it should false", () => {
      assert.equal(metricService.sumMetricByKey("invalid_key"), false);
    });
  });
});

describe("Metric Logging Service", () => {
  describe("Add new metric", () => {
    it("when no key is provided, then it should return and a 404 error", () => {
      return request(app)
        .post("/api/v1/metric/")
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

    it("when a metric value is not supplied, then it should return a 400 bad request", () => {
      return request(app)
        .post("/api/v1/metric/active_value")
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.equal(false);
        });
    });

    it("when a valid metric value is supplied, then the metric should be saved and it should return a 200 OK", () => {
      return request(app)
        .post("/api/v1/metric/active_value")
        .send({ value: metric.value })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.empty;
        });
    });
  });

  describe("Sum metric by key", () => {
    it("when a valid key is supplied, then it should return the correct sum and a 200 OK", () => {
      return request(app)
        .get("/api/v1/metric/active_value/sum")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.keys("data", "success");
          expect(res.body.success).to.equal(true);
          expect(res.body.data.value).to.not.be.null;
          expect(res.body.data.value).to.equal(metric.value);
        });
    });

    it("when an invalid key is supplied, then it should return a 400 bad request", () => {
      return request(app)
        .get("/api/v1/metric/invalid_key/sum")
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.success).to.equal(false);
        })
        .catch(error => {
          throw error;
        });
    });
  });
});
