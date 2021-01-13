import { constants, genericErrors, Helper } from '../../utils';
import { AdminServices } from '../../services';

const { updateUserPassword } = AdminServices;

const { hashPassword } = Helper;

const { addTokenToData } = Helper;
const { successResponse, serverError } = genericErrors;
const { LOGIN_SUCCESS, PASSWORD_UPDATE } = constants;

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
  static async loginUser(req, res) {
    try {
      const data = addTokenToData(req.data);
      return successResponse(res, LOGIN_SUCCESS, data);
    } catch (e) {
      serverError(res, 'Server Error');
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

  static async updatePassword(req, res) {
    try {
      const { hash: password, salt } = hashPassword(req.body.password);
      await updateUserPassword({ password, salt, id: req.data.id });
      return successResponse(res, PASSWORD_UPDATE);
    } catch (e) {
      serverError(res, 'Server Error');
    }
  }
}

export default AuthController;
