import { ProductServices } from '../../services';
import { genericErrors, constants, Helper } from '../../utils';

const { serverError, conflictError, badRequest } = genericErrors;
const { checkFileSize, checkFileType } = Helper;
const { ERROR_VERIFY_PRODUCT_NAME, imageFileType: { ALLOWED_FILE_TYPE } } = constants;
const { findProductByName, upload } = ProductServices;

/**
 * Contains Methods that validates products
 * @class ProductMiddleWare
 *
 *
 */
class ProductMiddleWare {
  /**
   * Check if a product has already been uploaded
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static async checkIfProductExist(req, res, next) {
    try {
      const product = await findProductByName(req.body.name);
      return product ? conflictError(res, 'Product already exist')
        : next();
    } catch (e) {
      return serverError(res, ERROR_VERIFY_PRODUCT_NAME);
    }
  }

  /**
   * @static
   * @param {request} req - request made through the endpoint
   * @param {response} res - response gotten from the API
   * @param {function} next - The function that calls the next handler
   * @returns {Boolean} - It returns true if the file meets the specified limit and otherwise
   * @memberof DocumentMiddleware
   *
   */
  static async checkProductFileType(req, res, next) {
    try {
      const fileType = checkFileType(ALLOWED_FILE_TYPE, req.files.file.mimetype);
      return fileType ? next()
        : badRequest(res, 'Invalid file type');
    } catch (e) {
      return serverError(res, 'Error Uploading Document');
    }
  }

  /**
   * @static
   * @param {request} req - request made through the endpoint
   * @param {response} res - response gotten from the API
   * @param {function} next - The function that calls the next handler
   * @returns {Boolean} - It returns true if the file meets the specified limit and otherwise
   * @memberof DocumentMiddleware
   *
   */
  static async checkProductFileSize(req, res, next) {
    try {
      const fileSize = checkFileSize(req.files.file, 3000000);
      return fileSize
        ? next()
        : badRequest(res, 'File size too large');
    } catch (e) {
      return serverError(res, 'Internal sever error');
    }
  }

  /**
   * @static
   * @param {request} req - request made through the endpoint
   * @param {response} res - response gotten from the API
   * @param {function} next - The function that calls the next handler
   * @returns {String} - The URl for the uploaded image from data.Location
   * @memberof DocumentMiddleware
   *
   */
  static async uploadFile(req, res, next) {
    try {
      const { tempFilePath: path, name: fileName } = req.files.file;
      const data = await upload(path, fileName);
      req.body.file = data.Location;
      console.log('Am here');
      next();
      console.log('Am here too');
    } catch (e) {
      console.log('errrr', e);
     return serverError(res, 'Error uploading your file');
    }
  }
}

export default ProductMiddleWare;
