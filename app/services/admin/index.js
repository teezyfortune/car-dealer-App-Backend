import query from '../../db/queries/user';
import db from '../../db/setup/postgres';

const { findUser, findUserById, updatePassword } = query;

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
    const user = db.oneOrNone(findUserById, items.id);
    const data = { ...user, ...items };
    return db.oneOrNone(updatePassword, [data.salt, data.hash, data.id]);
  }
}

export default UserServices;
