import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import request from "supertest";
import app from '../../app';
chai.use(chaiHttp);

describe('Metric Logging Service', () => {
    describe("Add new metric", () => {
        it('when no key is provided, then it should return and a 404 error', () =>{
            return request(app).post('/api/v1/metric/')
                .then((res) => {
                    expect(res).to.have.status(404);
                })
                .catch(error => {
                    throw error
                })
        })

        it('when a metric value is not supplied, then it should return a 400 bad request', () => {
            return request(app).post('/api/v1/metric/active_value')
                .then((res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.success).to.equal(false);
                })
                .catch(error => {
                    throw error
                })
        })

        it('when a valid metric value is supplied, then the metric should be saved and it should return a 200 OK', () => {
            return request(app).post('/api/v1/metric/active_value')
                .send({value: 19})
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.empty;
                })
                .catch(error => {
                    throw error
                })
        })
    });

    describe("Sum metric by key", () => {
        it('when a valid key is supplied, then it should return the sum and a 200 OK', () => {
            return request(app).get('/api/v1/metric/active_value/sum')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.keys('data', 'success');
                    expect(res.body.success).to.equal(true);
                    expect(res.body.data.value).to.not.be.null
                    expect(res.body.data.value).to.not.be.below(0)
                })
                .catch(error => {
                    throw error
                })
        })

        it('when an invalid key is supplied, then it should return a 400 bad request', () => {
            return request(app).get('/api/v1/metric/invalid_key/sum')
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.success).to.equal(false);
            })
            .catch(error => {
                throw error
            })
        })
    })
});