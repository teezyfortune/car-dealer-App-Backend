import { constants, genericErrors, Helper } from '../utils';
import UserModel from '../models/admin';

const { hashPassword } = Helper;

const { generateToken } = Helper;
const { successResponse, serverError } = genericErrors;
const { LOGIN_SUCCESS, PASSWORD_UPDATE } = constants;

class AuthController {
  static async loginUser(req, res) {
    try {
      const { id: userId, email, isadmin } = req.data;
      const token = generateToken({ userId, email, isadmin });
      return successResponse(res, LOGIN_SUCCESS, { data: req.data, token });
    } catch (e) {
      serverError(res, 'Server Error');
    }
  }

  static async updatePassword(req, res) {
    try {
      const { hash: password, salt } = hashPassword(req.body.password);
      const user = new UserModel({ password, salt, id: req.data.id });
      await user.editUserPassword();
      return successResponse(res, PASSWORD_UPDATE);
    } catch (e) {
      serverError(res, 'Server Error');
    }
  }
}

export default AuthController;
