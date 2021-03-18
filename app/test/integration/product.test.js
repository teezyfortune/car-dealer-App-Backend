/* eslint-disable max-lines-per-function */
import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import app from '../../../index';
import * as adminFixtures from '../fixtures/admin';

const path = 'app/test/integration/elipse.png';
chai.use(chaiHttp);
let adminToken;
let productId;
describe('Product API', () => {
  it('Should login admin before creating product', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(adminFixtures.correctLogin)
      .end((err, res) => {
        adminToken = res.body.data.token;
        expect(res.status).to.equal(200);
        done(err);
      });
  });
  it('Should create new product', (done) => {
    chai.request(app)
      .post('/api/v1/admin/product')
      .set('authorization', adminToken)
      .field('name', faker.name.firstName())
      .field('type', 'car')
      .field('manufacturedDate', '2021-03-03')
      .field('description', 'kkfkffkwkckkdkkcdkkkcfkfvkfvfvfkfvjfvbfvjfvjvf')
      .attach('file', path)
      .end((err, res) => {
        productId = res.body.data.id;
        expect(res.status).to.equal(200);
        done(err);
      });
  });
  it('Should fetch all products', (done) => {
    chai.request(app)
      .get('/api/v1/admin/products')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('object');
        done(err);
      });
  });
  it('Should fetch product by product id', (done) => {
    chai.request(app)
      .get(`/api/v1/admin/${productId}/product`)
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });
  it('Should update product', (done) => {
    chai.request(app)
      .patch(`/api/v1/admin/${productId}/product`)
      .set({ Authorization: adminToken })
      .field('manufactured_date', '2020-03-01')
      .field('vehicle_type', 'lorry')
      .attach('file', path)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });
  it('Should delete product', (done) => {
    chai.request(app)
      .delete(`/api/v1/admin/${productId}/product`)
      .set({ Authorization: adminToken })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });
});
