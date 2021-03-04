import fs from 'fs';
import { extname } from 'path';
import AWS from '../../../config/aws';
import queries from '../../db/queries/product';
import db from '../../db';
import { Helper } from '../../utils';

const { getProductById, updateProduct, getAllProduct, getProductByName,
  getProductCount, findProductByName, deleteProduct } = queries;
const { AWS_BUCKET_NAME, S3 } = AWS;
const { fetchResourceByPage, calcPages } = Helper;
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
    const user = await db.oneOrNone(getProductById, items.id);
    const data = { ...user, ...items };
    return db.oneOrNone(updateProduct, [data.vehicle_type, data.product_name, data.image_url,
      data.vehicle_history, data.manufactured_date, data.id]);
  }

  /**
   * Delete product
   * @param {String} - product Id
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async deleteProductInfo(productId) {
    return db.oneOrNone(deleteProduct, [productId]);
  }

  /**
   * Get all products
   * @param {object} - product information
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async fetchAllProduct(page = 1, limit = 10) {
    const [count, products] = await fetchResourceByPage({
      page,
      limit,
      getCount: getProductCount,
      getResources: getAllProduct,
    });
    return {
      total: count.total,
      currentPage: page,
      totalPages: calcPages(count.total, limit),
      products
    };
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

  /**
   * Filter product
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async searchProductByName(name) {
    return db.manyOrNone(findProductByName, [name]);
  }
}
export default ProductServices;
