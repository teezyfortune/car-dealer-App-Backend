import { constants, Helper } from '../../utils';
import ProductModel from '../../models/products';
import { ProductServices } from '../../services';
import DBError from '../../utils/error/db.error';
import ApiError from '../../utils/error/api.error';

const { successResponse } = Helper;
const { constants: {
  FETCH_DATA_ERROR, FETCH_DATA_ERROR_MSG, FETCH_DATA_SUCCESS,
  RESOURCE_CREATE_ERROR_STATUS,
  RESOURCE_UPDATE_FAIL_STATUS,
  RESOURCE_UPDATE_SUCCESS, RESOURCE_DELETE_FAIL,
  RESOURCE_DELETE_SUCCESS, RESOURCE_DELETE_FAIL_STATUS,
  RESOURCE_CREATE_SUCCESS } } = constants;
const { updateProductInfo, fetchAllProduct, fetchProduct,
  searchProductByName, deleteProductInfo } = ProductServices;

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
      return successResponse(res, { message: RESOURCE_CREATE_SUCCESS('Product'), data });
    } catch (e) {
      const dbError = new DBError({
        status: RESOURCE_CREATE_ERROR_STATUS('PRODUCT'),
        message: e.message });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: e.message, }));
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
      const product = await updateProductInfo({
        ...req.body, id: req.params.productId });
      return successResponse(res, {
        message: RESOURCE_UPDATE_SUCCESS('Product'),
        data: product, });
    } catch (e) {
      const dbError = new DBError({
        status: RESOURCE_UPDATE_FAIL_STATUS('PRODUCT'),
        message: e.message });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: e }));
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
      const { page, limit } = req.query;
      const product = await fetchAllProduct(page, limit);
      return successResponse(res, { message: FETCH_DATA_SUCCESS('Products'), data: product });
    } catch (e) {
      const dbError = new DBError({
        status: FETCH_DATA_ERROR('PRODUCT'),
        message: e.message });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: FETCH_DATA_ERROR_MSG('Products') }));
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
      return successResponse(res, { message: FETCH_DATA_SUCCESS('Product'),
        data: product });
    } catch (e) {
      const dbError = new DBError({
        status: FETCH_DATA_ERROR('PRODUCT'),
        message: e.message });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: FETCH_DATA_ERROR_MSG('Product') }));
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
  static async fetchVehicleByName(req, res, next) {
    try {
      const product = await searchProductByName(req.query.name);
      return successResponse(res, { message: FETCH_DATA_SUCCESS('Product name'), product });
    } catch (e) {
      const dbError = new DBError({
        status: FETCH_DATA_ERROR('PRODUCT_NAME'),
        message: e.message });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: FETCH_DATA_ERROR_MSG('Product name') }));
    }
  }

  /**
   *  Delete product
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing all admin information
   * @memberof ProductController
   */
  static async removeProduct(req, res, next) {
    try {
      await deleteProductInfo(req.params.productId);
      return successResponse(res, { message: RESOURCE_DELETE_SUCCESS('Product') });
    } catch (e) {
      const dbError = new DBError({
        status: RESOURCE_DELETE_FAIL_STATUS('PRODUCT'),
        message: e.message });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: RESOURCE_DELETE_FAIL('Product') }));
    }
  }
}

export default ProductController;
