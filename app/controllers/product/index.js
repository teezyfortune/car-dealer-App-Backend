import { constants, genericErrors } from '../../utils';
import ProductModel from '../../models/products';
import { ProductServices } from '../../services';

const { successResponse, serverError } = genericErrors;
const { PRODUCT_CREATED_SUCCESSFULLY,
  PRODUCT_UPDATED_SUCCESSFULLY,
  PRODUCT_FETCHED_SUCCESSFULLY,
  ERROR_CREATING_PRODUCT, ERROR_UPDATING_PRODUCT } = constants;
const { updateProductInfo, fetchAllProduct, fetchProduct } = ProductServices;

/**
 *  Contains several methods that controls product
 * @class ProductControl
 *
 */
class ProductController {
  /**
   *  Create new products
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing all admin information
   * @memberof ProductController
   */
  static async saveProduct(req, res, next) {
    try {
      const product = new ProductModel(req.body);
      const data = await product.save();
      return successResponse(res, PRODUCT_CREATED_SUCCESSFULLY, data);
    } catch (e) {
      next(e);
      return serverError(res, ERROR_CREATING_PRODUCT);
    }
  }

  /**
   *  Update product
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing all admin information
   * @memberof ProductController
   */
  static async updateProduct(req, res, next) {
    try {
      const product = await updateProductInfo(req.body);
      return successResponse(res, { message: PRODUCT_UPDATED_SUCCESSFULLY, data: product, });
    } catch (e) {
      next(e);
      serverError(res, ERROR_UPDATING_PRODUCT);
    }
  }

  /**
   *  Get all products
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing all admin information
   * @memberof ProductController
   */
  static async fetchAllVehicleProduct(req, res, next) {
    try {
      const product = await fetchAllProduct();
      return successResponse(res, PRODUCT_FETCHED_SUCCESSFULLY, product);
    } catch (e) {
      next(e);
      serverError(res, ERROR_UPDATING_PRODUCT);
    }
  }

  /**
   *  Get One product
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing all admin information
   * @memberof ProductController
   */
  static async fetchOneVehicleProduct(req, res, next) {
    try {
      const product = await fetchProduct(req.params.productId);
      return successResponse(res, PRODUCT_FETCHED_SUCCESSFULLY, product);
    } catch (e) {
      next(e);
      serverError(res, ERROR_UPDATING_PRODUCT);
    }
  }
}

export default ProductController;
