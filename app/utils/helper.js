import bcrypt from 'bcrypt';
import uuidV4 from 'uuid/dist/v4';
import jwt from 'jsonwebtoken';
import { sha256 } from 'js-sha256';
import env from '../../config/env';
import db from '../db';
import constants from './constants';
import DBError from './error/db.error';
import genericError from './error/generic';

const { serverError } = genericError;
const { constants: { SUCCESS_RESPONSE, FAIL, SUCCESS } } = constants;
const signOption = {
  issuer: 'cardealer',
  subject: 'Authentication Bearer',
  expiresIn: '2hrs'
};

/**
 * contains Helper method
 * @class Helper
 *
 */
class Helper {
  /**
   * @static
   * @memberof Helper
   * @param {number} - number of rounds
   * @return {salt}: It generate a unique salt;
   */
  static generateSalt(number) {
    return bcrypt.genSaltSync(number);
  }

  /**
   * @static
   * @memberof Helper
   * @param {String} - salt generated with number
   * @param {String} - plain password supplied
   * @return {hash}: It generate hash with salt;
   *
   */
  static generateHash(salt, plain) {
    const hash = sha256.hmac.create(salt);
    hash.update(plain);
    return hash.hex();
  }

  /**
   * @static
   * @memberof Helper
   * @param {String }- Plain password supplied;
   * @return {salt}: It generate a unique salt;
   *
   */

  static hashPassword(plain) {
    const salt = Helper.generateSalt(8);
    return {
      salt,
      hash: Helper.generateHash(salt, plain)
    };
  }
  /**
   * @static
   * @memberof Helper
   * @param {
   * } number
   * @return {Boolean}: It returns true if the hash matches otherwise false
   *
   */

  static comparePassword(hash, salt, plain) {
    const newHash = Helper.generateHash(salt, plain);
    return hash === newHash;
  }

  /** Generate json token asynchronously
   * @static
   * @memberof Helper
   * @param {String|Object|buffer}
   * @param {String} - Secret key to sign the jwt
    @param {Object} - JWT sign options
   * @return {token}: Jwt token
   *
   */

  static generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, signOption);
  }

  /** Verify token
   * @static
   * @memberof Helper
   * @param {token}
   * @param {String} - Secret key to sign the jwt
   * @return {Object} - Decoded object is return if token is valid otherwise return token error
   *
   */
  static verifyToken(token) {
    return jwt.sign(token, env.JWT_SECRET, signOption);
  }

  /**
   * Checks for token in the authorization and x-access-token header properties.
   * @static
   * @private
   * @param {object} authorization - The headers object
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   *
   */
  static checkAuthorizationToken(authorization) {
    let bearerToken = null;
    if (authorization) {
      const token = authorization.split(' ')[1];
      bearerToken = token || authorization;
    }
    return bearerToken;
  }

  /**
   * Adds jwt token to object.
   * @static
   * @param { Object } user - New User Instance.
   * @memberof Helper
   * @returns {object } - A new object containing essential user properties and jwt token.
   */
  static addTokenToData(user) {
    const { id, email, created_at, is_admin } = user;
    const token = Helper.generateToken({ id, email, is_admin });
    return { id, email, created_at, token, is_admin };
  }

  /**
   * Adds jwt token to object.
   * @static
   * @param { Object } user - New User Instance.
   * @memberof Helper
   * @returns {object } - A new object containing essential user properties and jwt token.
   */
  static generateUUID() {
    const id = uuidV4();
    return id;
  }

  /**
   * Check for filesType type
   * @static
   * @param {any} parameter - Value to check
   * @memberof Helper
   * @returns { Boolean } -  It returns true or false.
   */
  static checkFileType(allowedFile, file) {
    const isValidFile = allowedFile.includes(file);
    return !!isValidFile;
  }

  /**
   * @param {file} file - The file to be uploaded;
   * @param {limit} limit - Limit set for the file
   * @returns {string}
   * @memberof Helper
   */
  static checkFileSize(file, limit) {
    if (file.size <= limit) {
      return true;
    }
    return false;
  }

  /**
   * @static
   * @param { Joi } schema - The validation schema.
   * @param { Object } object - The data to be validated
   * @memberof Helper
   * @returns { boolean }
   */
  static async validateInput(schema, object) {
    return schema.validateAsync(object);
  }

  /**
   * Fetches a pagination collection of a resource.
   * @static
   * @param {Object} options - configuration options.
   * @param {number} options.page - Current page e.g: 1 represents first
   * 30 records by default and 2 represents the next 30 records.
   * @param {number} options.limit - Max number of records.
   * @param {number} options.getCount - Max number of records.
   * @param {number} options.getResources - Max number of records.
   * @param {Array} options.params - Extra parameters for the get resources query.
   * @param {Array} options.countParams - Extra parameters for the get counts query.
   * @memberof Helper
   * @returns {Promise} - Returns a promise array of the count anf the resources
   */
  static async fetchResourceByPage({
    page,
    limit,
    getCount,
    getResources,
    params = [],
    countParams = []
  }) {
    const offSet = (page - 1) * limit;
    const fetchCount = db.one(getCount, [...countParams]);
    const fetchCountResource = db.any(getResources, [offSet, limit, ...params]);
    return Promise.all([fetchCount, fetchCountResource]);
  }

  /**
   * calculate number of pages
   * @static
   * @param { Number } total - Total number of a particular resource.
   * @param { Number } limit - The total number of resource to be displayed per page
   * @memberof Helper
   * @returns { Number } - Returns the display page value.
   */
  static calcPages(total, limit) {
    const displayPage = Math.floor(total / limit);
    return total % limit ? displayPage + 1 : displayPage;
  }

  /**
   * Generates log for api errors.
   * @static
   * @private
   * @param {object} error - The API error object.
   * @param {Request} req - Request object.
   * @memberof Helper
   * @returns {String} - It returns null.
   */
  static apiErrLogMessager(error, req) {
    logger.error(
      `${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }

  /**
   * Creates DB Error object and logs it with respective error message and status.
   * @static
   * @param { String | Object } data - The data.
   * @memberof Helper
   * @returns { Object } - It returns an Error Object.
   */
  static makeError({ error, status }) {
    const dbError = new DBError({
      status,
      message: error.message
    });
    Helper.moduleErrLogMessager(dbError);
    return dbError;
  }

  /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - An object containing response properties.
   * @param {object} options.data - The payload.
   * @param {string} options.message -  HTTP Status code.
   * @param {number} options.code -  HTTP Status code.
   * @memberof Helper
   * @returns {JSON} - A JSON success response.
   */
  static successResponse(
    res,
    { data, message = SUCCESS_RESPONSE, code = 200 }
  ) {
    return res.status(code).json({
      status: SUCCESS,
      message,
      data
    });
  }

  /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {object} error - The error object.
   * @param {number} error.status -  HTTP Status code, default is 500.
   * @param {string} error.message -  Error message.
   * @param {object|array} error.errors -  A collection of  error message.
   * @memberof Helper
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse(req, res, error) {
    const aggregateError = { ...serverError, ...error };
    Helper.apiErrLogMessager(aggregateError, req);
    return res.status(aggregateError.status).json({
      status: FAIL,
      message: aggregateError.message,
      errors: aggregateError.errors
    });
  }

  /**
   * Generates log for module errors.
   * @static
   * @param {object} error - The module error object.
   * @memberof Helper
   * @returns { Null } -  It returns null.
   */
  static moduleErrLogMessager(error) {
    return logger.error(`${error.status} - ${error.name} - ${error.message}`);
  }
}

export default Helper;
