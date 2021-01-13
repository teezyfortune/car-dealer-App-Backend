import queries from '../db/migrations/queries/product';
import db from '../db';
import { Helper } from '../utils';

const { createProduct } = queries;

/**
 * @class ProductModel
 */
class ProductModel {
  /**
   * This is a constructor for creating an instance of product.
   * @param { Object } proDetails - contains the required properties for creating
   * the admin.
   * @returns { ProductModel } - An instance of the product.
   * @constructor ProductModel
   */

  constructor(prodDetails) {
    this.id = Helper.generateUUID();
    this.product_type = prodDetails.type;
    this.product_name = prodDetails.name;
    this.image_url = prodDetails.file;
    this.vehicle_history = prodDetails.description;
    this.manufactured_date = prodDetails.manufacturedDate;
  }

  /**
   * Persists a new product to the DB.
   * @memberof ProductModel
   * @returns { Promise<Object | Error> } A promise that resolves or rejects
   * with a log object or a DB Error.
   */
  async save() {
    return db.one(createProduct,
      [this.id, this.product_type, this.product_name,
        this.image_url, this.vehicle_history, this.manufactured_date]);
  }
}

export default ProductModel;
