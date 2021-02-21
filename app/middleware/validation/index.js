import { genericErrors, Helper, constants } from '../../utils';
import ApiError from '../../utils/error/api.error';

const { validateInput } = Helper;
const { badRequest, } = genericErrors;
const { constants: { ERROR_VALIDATING_FILE } } = constants;

class ValidationMiddleware {
  static validateUserInput(schema) {
    return async (req, res, next) => {
      try {
        await validateInput(schema, req.body);
        next();
      } catch (e) {
        Helper.errorResponse(req, res, new ApiError({
          status: 400, message: e.details[0].message }));
      }
    };
  }

  static async validateFile(req, res, next) {
    try {
      return req.files === null ? badRequest(res, 'PLease select a file to upload') : next();
    } catch (error) {
      Helper.errorResponse(req, res, new ApiError({
        message: ERROR_VALIDATING_FILE }));
    }
  }
}

export default ValidationMiddleware;
