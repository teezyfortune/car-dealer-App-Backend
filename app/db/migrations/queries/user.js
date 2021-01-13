export default {
  findUser: 'SELECT * FROM users WHERE email = ($1)',
  updatePassword: 'UPDATE users SET password = $1, salt = $2 WHERE id = $3',
  findUserById: 'SELECT * FROM users WHERE id = $1',
  updateEmail: 'UPDATE users SET email = $1 WHERE id = $2'
};
