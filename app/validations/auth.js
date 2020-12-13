import Joi from 'joi';
import { emailCheck, password } from './generic';

const adminLoginSchema = Joi.object({
  email: emailCheck(Joi),
  password: password(Joi)
});

const forgotPasswordSchema = Joi.object({
  email: emailCheck(Joi),
  password: password(Joi)
});

export { adminLoginSchema, forgotPasswordSchema };
