import { constants, Helper } from '../../utils';
import DBError from '../../utils/error/db.error';
import ApiError from '../../utils/error/api.error';

import { AdminServices } from '../../services';

const { updateUserPassword } = AdminServices;

const { hashPassword } = Helper;

const { addTokenToData, successResponse } = Helper;
const { constants: { LOGIN_SUCCESS, PASSWORD_UPDATE,
  RESOURCE_EXIST_VERIFICATION_FAIL, RESOURCE_EXIST_VERIFICATION_FAIL_MSG,
  RESOURCE_UPDATE_FAIL, RESOURCE_UPDATE_FAIL_STATUS } } = constants;

/**
 *  Interface for user methods
 * @class
 *
 */
class AuthController {
  /**
   * SIgn in admin
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing all admin information
   * @memberof AdminController
   */
  static async loginUser(req, res, next) {
    try {
      const data = addTokenToData(req.data);
      return successResponse(res, { message: LOGIN_SUCCESS, data });
    } catch (e) {
      const dbError = new DBError({
        status: RESOURCE_EXIST_VERIFICATION_FAIL('ADMIN'),
        message: e.message
      });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message:
         RESOURCE_EXIST_VERIFICATION_FAIL_MSG('Admin') }));
    }
  }

  /**
   * Update password
   * @param {object} req - The request made to the endpoint
   * @param {object} res - The response from the endpoint
   * @param {function} next - The method that calls the next handler
   * @returns { ARRAY/JSON } A JSON array containing updated password
   * @memberof AuthController
   */

  static async updatePassword(req, res, next) {
    try {
      const { hash: password, salt } = hashPassword(req.body.password);
      await updateUserPassword({ password, salt, id: req.data.id });
      return successResponse(res, { message: PASSWORD_UPDATE });
    } catch (e) {
      const dbError = new DBError({
        status: RESOURCE_UPDATE_FAIL_STATUS('ADMIN_PASSWORD'),
        message: e.message
      });
      Helper.moduleErrLogMessager(dbError);
      next(new ApiError({ message: RESOURCE_UPDATE_FAIL('Admin password') }));
    }
  }
}

export default AuthController;
