import User from '../../services/admin';
import { genericErrors, constants, Helper } from '../../utils';

const { notFoundError, serverError, badRequest, unauthorizeError } = genericErrors;
const { INVALID_USER, ERROR_CHECKING_TOKEN, UNAUTHORIZED_TOKEN } = constants;
const { fetchUser } = User;
const { comparePassword, checkAuthorizationToken, verifyToken } = Helper;

class AuthMiddleWare {
  static async checkIfUserEmailExist(req, res, next) {
    try {
      req.data = await fetchUser(req.body.email);
      if (req.data) {
        return next();
      }
      return notFoundError(res, INVALID_USER);
    } catch (e) {
      return serverError(res, e.message);
    }
  }

  static checkIfPasswordExist(req, res, next) {
    try {
      const isPassword = comparePassword(req.data.password, req.data.salt,
        req.body.password);
      if (isPassword) {
        return next();
      }
      return badRequest(res, INVALID_USER);
    } catch (e) {
      return serverError(res, e.message);
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
    if (!token) {
      return unauthorizeError(res, UNAUTHORIZED_TOKEN);
    }
    try {
      const decoded = verifyToken(token);
      req.data = decoded;
      next();
    } catch (err) {
      serverError(res, ERROR_CHECKING_TOKEN);
    }
  }
}

export default AuthMiddleWare;
