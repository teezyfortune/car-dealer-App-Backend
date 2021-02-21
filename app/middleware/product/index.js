import { ProductServices } from '../../services';
import { constants, Helper } from '../../utils';
import ApiError from '../../utils/error/api.error';

const { checkFileSize, checkFileType } = Helper;
const { constants: { RESOURCE_ALREADY_EXIST, RESOURCE_VERIFICATION_FAIL,
  RESOURCE_VERIFICATION_FAIL_MSG, ERROR_UPLOADING_FILE, ERROR_UPLOADING_FILE_MSG,
  RESOURCE_EXIST_VERIFICATION_FAIL, RESOURCE_EXIST_VERIFICATION_FAIL_MSG },
imageFileType: { ALLOWED_FILE_TYPE } } = constants;
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
      return product ? Helper.errorResponse(req, res, new ApiError({ status:
        400,
      message: RESOURCE_ALREADY_EXIST('Product') })) : next();
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL('PRODUCT');
      Helper.moduleErrLogMessager(e);
      Helper.errorResponse(req, res,
        new ApiError({ message: RESOURCE_VERIFICATION_FAIL_MSG('Product') }));
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
        : Helper.errorResponse(req, res, new ApiError({ status: 400,
          message: RESOURCE_ALREADY_EXIST('Product') }));
    } catch (e) {
      e.status = RESOURCE_VERIFICATION_FAIL('FILE_TYPE');
      Helper.moduleErrLogMessager(e);
      Helper.errorResponse(req, res, new ApiError({ message: RESOURCE_EXIST_VERIFICATION_FAIL_MSG('File type') }));
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
        : Helper.errorResponse(req, res, new ApiError({ status:
          400,
        message: 'File size too large' }));
    } catch (e) {
      e.status = RESOURCE_VERIFICATION_FAIL(' ');
      Helper.moduleErrLogMessager(e);
      Helper.errorResponse(req, res, new ApiError({ message:
        RESOURCE_EXIST_VERIFICATION_FAIL_MSG('File size') }));
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
      next();
    } catch (e) {
      e.status = ERROR_UPLOADING_FILE;
      Helper.moduleErrLogMessager(e);
      Helper.errorResponse(req, res, new ApiError({ message: ERROR_UPLOADING_FILE_MSG }));
    }
  }
}

export default ProductMiddleWare;
