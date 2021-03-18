import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import * as adminFixture from '../fixtures/admin';

chai.use(chaiHttp);

describe('Admin login', () => {
  it('Should login admin with correct details', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminFixture.correctLogin)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });
  it('Should return invalid credentials', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminFixture.wrongLogin)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done(err);
      });
  });
});
