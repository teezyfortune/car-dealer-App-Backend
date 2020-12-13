import User from '../services/admin';
import { genericErrors, constants, Helper } from '../utils';

const { notFoundError, serverError, badRequest } = genericErrors;
const { INVALID_USER } = constants;
const { fetchUser } = User;
const { comparePassword } = Helper;

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
      const isPassword = comparePassword(
        req.data.password,
        req.data.salt,
        req.body.password
      );
      if (isPassword) {
        return next();
      }
      return badRequest(res, INVALID_USER);
    } catch (e) {
      return serverError(res, e.message);
    }
  }
}

export default AuthMiddleWare;
