import bcrypt from 'bcrypt';
import uuidV4 from 'uuid/dist/v4';
import jwt from 'jsonwebtoken';
import { sha256 } from 'js-sha256';
import env from '../../config/env';

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
class Helpers {
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
    const salt = Helpers.generateSalt(8);
    return {
      salt,
      hash: Helpers.generateHash(salt, plain)
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
    const newHash = Helpers.generateHash(salt, plain);
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
    return jwt.sign(token, env.JWT_SECRET);
  }

  /**
   * Checks for token in the authorization and x-access-token header properties.
   * @static
   * @private
   * @param {object} authorization - The headers object
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
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
   * @memberof Helpers
   * @returns {object } - A new object containing essential user properties and jwt token.
   */
  static addTokenToData(user) {
    const { id, email, created_at, is_admin } = user;
    const token = Helpers.generateToken({ id, email, is_admin });
    return { id, email, created_at, token, is_admin };
  }

  /**
   * Adds jwt token to object.
   * @static
   * @param { Object } user - New User Instance.
   * @memberof Helpers
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
   * @memberof Helpers
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
}

export default Helpers;
