import bcrypt from 'bcrypt';
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
}
export default Helpers;
