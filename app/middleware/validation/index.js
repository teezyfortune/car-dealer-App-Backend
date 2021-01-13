import { genericErrors, Helper } from '../../utils';

const { validateInput } = Helper;
const { badRequest, serverError } = genericErrors;

class ValidationMiddleware {
  static validateUserInput(schema) {
    return async (req, res, next) => {
      try {
        await validateInput(schema, req.body);
        next();
      } catch (e) {
        badRequest(res, { message: e.details[0].message });
      }
    };
  }

  static async validateFile(req, res, next) {
    try {
      return req.files === null ? badRequest(res, 'PLease select a file to upload') : next();
    } catch (error) {
      serverError(res, 'Internal server error');
    }
  }
}

export default ValidationMiddleware;
