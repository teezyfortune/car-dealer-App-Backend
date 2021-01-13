import fs from 'fs';
import { extname } from 'path';
import AWS from '../../../config/aws';
import queries from '../../db/migrations/queries/product';
import db from '../../db';

const { getProductById, updateProduct, getAllProduct, getProductByName } = queries;
const { AWS_BUCKET_NAME, S3 } = AWS;
console.log(AWS_BUCKET_NAME);
/**
 * Interface for product methods
 *  @class ProductService
 */
class ProductServices {
/**
   * Find Product by id
   * @param {string} - Id - product id
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async fetchProduct(productId) {
    return db.oneOrNone(getProductById, [productId]);
  }

  /**
   * Update product
   * @param {object} - product information
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async updateProductInfo(items) {
    const user = db.oneOrNone(getProductById, items.id);
    const data = { ...user, ...items };
    return db.oneOrNone(updateProduct, [data.product_type, data.product_name, data.image_url]);
  }

  /**
   * Get all products
   * @param {object} - product information
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async fetchAllProduct() {
    return db.manyOrNone(getAllProduct,);
  }

  /**
   * Get products by name
   * @param {String} - product name
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async findProductByName(name) {
    return db.oneOrNone(getProductByName, [name]);
  }

  /**
   *
   * @param {file} file - The path name to the file
   * @param {name} name - The original file name o
   * @returns {Promise/Error} - it returns an object if everything is fine and otherwise
   */
  static async upload(file, name) {
    const content = fs.readFileSync(file);
    const ext = extname(name);
    const date = new Date();
    const fileName = `${date.valueOf()}${Math.random()
      .toString(32)
      .substring(2)}${ext}`;
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
      Body: content,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };
    return S3.upload(params).promise();
  }
}
export default ProductServices;
