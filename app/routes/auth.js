import { Router } from 'express';
import AuthController from '../controllers/auth';
import { adminLoginSchema, forgotPasswordSchema } from '../validations/auth';
import { ValidationMiddleware, AuthMiddleWare } from '../middleware';

const { loginUser, updatePassword } = AuthController;
const { checkIfUserEmailExist, checkIfPasswordExist } = AuthMiddleWare;
const { validateUserInput } = ValidationMiddleware;

const authRoute = Router();

authRoute.post('/login', validateUserInput(adminLoginSchema), checkIfUserEmailExist, checkIfPasswordExist, loginUser);
authRoute.patch(
  '/change-password',
  validateUserInput(forgotPasswordSchema),
  checkIfUserEmailExist,
  updatePassword
);

export default authRoute;
