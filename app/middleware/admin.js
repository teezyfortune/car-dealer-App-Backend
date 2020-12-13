import { genericErrors } from '../utils';

const { badRequest } = genericErrors;
const validateUserInput = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (e) {
    badRequest(res, { message: e.details[0].message });
  }
};

export default validateUserInput;
