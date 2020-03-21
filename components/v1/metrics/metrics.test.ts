import chai, {expect} from "chai";
import chaiHttp from "chai-http";
import request from "supertest";
import app from '../../app';

const should = chai.should();
// const expect = chai.expect;
chai.use(chaiHttp);


// const server = supertest.agent('http://localhost:3000/api/v1')

describe('Metric Logging Service', () => {
    describe("Add new metric", () => {
        it('when no key is provided, then it should return and a 404 error', () =>{
            return request(app).post('/api/v1/metric/')
                .expect(404)
        })

        it('when a metric value is not supplied, then it should return a 400 bad request', (done) => {
            chai.request(app)
                .post('/api/v1/metric/900')
                .send({value: 8})
                .end((err, res) => {
                    console.log(err)
                    res.status.should.equal(400);
                    res.body.success.should.equal(false);
                    done();
                })
        })
    });

})