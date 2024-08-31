const db = require('../db/db');

const User = {
    findByEmail: (email, callback) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.query(query, [email], (err, results) => {
        if (err) callback(err, null);
        else callback(null, results[0]);
      });
    }
  };
  
  module.exports = User;