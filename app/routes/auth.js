import { Router } from 'express';
import AuthController from '../controllers/auth';
import AuthMiddlewareController from '../middleware/auth';
import { adminLoginSchema, forgotPasswordSchema } from '../validations/auth';
import validateUserInput from '../middleware/admin';

const { loginUser, updatePassword } = AuthController;
const { checkIfUserEmailExist, checkIfPasswordExist } = AuthMiddlewareController;

const authRoute = Router();

authRoute.post('/login', validateUserInput(adminLoginSchema), checkIfUserEmailExist, checkIfPasswordExist, loginUser);
authRoute.patch(
  '/change-password',
  validateUserInput(forgotPasswordSchema),
  checkIfUserEmailExist,
  updatePassword
);

export default authRoute;
