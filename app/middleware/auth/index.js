import User from '../../services/admin';
import { Helper, genericErrors, constants } from '../../utils';
import ApiError from '../../utils/error/api.error';

const { fetchUser } = User;
const { comparePassword, checkAuthorizationToken, verifyToken } = Helper;
const { constants: { RESOURCE_EXIST_VERIFICATION_FAIL_MSG,
  RESOURCE_EXIST_VERIFICATION_FAIL } } = constants;
class AuthMiddleWare {
  static async checkIfUserEmailExist(req, res, next) {
    try {
      req.data = await fetchUser(req.body.email);
      return req.data ? next() : Helper.errorResponse(req, res, genericErrors.inValidLogin);
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL_MSG('ADMIN');
      Helper.moduleErrLogMessager(e);
      Helper.errorResponse(req, res, new ApiError({
        message: RESOURCE_EXIST_VERIFICATION_FAIL('Admin') }));
    }
  }

  static checkIfPasswordExist(req, res, next) {
    try {
      const isPassword = comparePassword(req.data.password, req.data.salt,
        req.body.password);
      return isPassword ? next() : Helper.errorResponse(req, res, genericErrors.inValidLogin);
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL('PASSWORD');
      Helper.moduleErrLogMessager(e);
      Helper.errorResponse(req, res, new ApiError({
        message: RESOURCE_EXIST_VERIFICATION_FAIL_MSG('Password') }));
    }
  }

  /**
   * Aggregates a search for the access token in a number of places.
   * @static
   * @private
   * @param {Request} req - The express request object.
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   */
  static checkToken(req) {
    const {
      headers: { authorization }
    } = req;

    const bearerToken = checkAuthorizationToken(authorization);
    return (
      bearerToken
      || req.headers['x-access-token']
      || req.headers.token
      || req.body.token
    );
  }

  /**
   * Verifies the validity of a user's access token or and the presence of it.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static authenticate(req, res, next) {
    const token = AuthMiddleWare.checkToken(req);
    try {
      const decoded = verifyToken(token);
      req.data = decoded;
      next();
      Helper.errorResponse(req, res, genericErrors.unAuthorized);
    } catch (err) {
      Helper.errorResponse(req, res, genericErrors.authRequired);
    }
  }
}

export default AuthMiddleWare;
