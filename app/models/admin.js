import db from '../db/setup/postgres';
import user from '../db/migrations/queries/user';

const { updatePassword } = user;

class UserModel {
  constructor(items) {
    this.password = items.password;
    this.salt = items.salt;
    this.id = items.id;
  }

  async editUserPassword() {
    return db.oneOrNone(updatePassword, [this.password, this.salt, this.id]);
  }
}

export default UserModel;
