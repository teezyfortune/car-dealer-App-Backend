import user from '../../db/migrations/queries/user';
import db from '../../db/setup/postgres';

const { findUser, updatePassword } = user;

/**
 *  Interface for user methods
 * @class
 *
 */
class UserServices {
  /**
   * Find user
   * @param {email} - Email provided by the user
   * @memberof UserServices
   * @returns {promise} - returns an object otherwise return null
   */
  static async fetchUser(userEmail) {
    return db.oneOrNone(findUser, [userEmail]);
  }

  static async updateUserPassword(items) {
    return db.oneOrNone(updatePassword, [items]);
  }

  static async fetchUserById(userId) {
    return db.oneOrNone(findUser, [userId]);
  }
}

export default UserServices;
