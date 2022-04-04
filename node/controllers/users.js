const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connector = require('../connect');
const authenticationMiddleware = require('../middlewares/authentication');
exports.createUsersTable = (req, res) => {
  var sql =
    'create table users(email varchar(100) PRIMARY KEY UNIQUE,password varchar(100) not null,name varchar(100),dob date)';
  connector.query(sql, function (err, results) {
    res.json({ err, results });
  });
};
exports.createUser = (req, res) => {
  const { email, password, name, dob } = req.body;
  try {
    let salt = bcrypt.genSaltSync(10);
    encryptedPassword = bcrypt.hashSync(password, salt);
    console.log(encryptedPassword);
  } catch (err) {
    res.json(err);
  }
  var sql = `insert into users (email,password,name,dob) values (?,?,?,?)`;
  connector.query(
    sql,
    [email, encryptedPassword, name, dob],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.json({ status: 0, data: 'user already exists' });
        } else {
          res.json(err);
        }
      } else {
        res.json({ status: 1, data: 'user created successfully' });
      }
    }
  );
};
exports.getUsers = (req, res) => {
  var sql = 'select * from users';
  connector.query(sql, function (err, results) {
    res.json({ err, results });
  });
};
exports.getUser = [
  authenticationMiddleware,
  (req, res) => {
    var sql = `select * from users where email=?`;
    connector.query(sql, [req.params.email], function (err, results) {
      if (err) {
        res.json(err);
      }
      if (results.length === 0) {
        res.json({ status: 0, data: 'user not found' });
      } else {
        res.json({ status: 1, data: results[0] });
      }
    });
  },
];
exports.loginUser = async (req, res) => {
  var sql = `select * from users where email=?`;
  connector.query(sql, [req.body.email], (err, results) => {
    if (results.length === 0) {
      res.json({ status: 0, data: 'user not found' });
    } else {
      const passCorrect = bcrypt.compareSync(
        req.body.password,
        results[0].password
      );
      if (!passCorrect) {
        res.json({ status: 0, data: 'user credentials wrong' });
      }
      const payload = {
        user: {
          email: req.body.email,
        },
      };
      jwt.sign(payload, 'secretString', { expiresIn: 1200 }, (err, token) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ status: 1, token: token });
        }
      });
    }
  });
};
exports.listUsers = [
  authenticationMiddleware,
  (req, res) => {
    var sql = 'select * from users';
    connector.query(sql, function (err, results) {
      if (err) {
        res.json(err);
      } else {
        res.json(results);
      }
    });
  },
];
exports.editUser = [
  authenticationMiddleware,
  (req, res) => {
    const { email, password, name, dob } = req.body;
    let encryptedPassword;
    try {
      let salt = bcrypt.genSaltSync(10);
      encryptedPassword = bcrypt.hashSync(password, salt);
    } catch (err) {
      res.json(err);
    }
    var sql = `update users set email=?,password=?,name=?,dob=? where email=?`;
    connector.query(
      sql,
      [email, encryptedPassword, name, dob, email],
      function (err, results) {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            res.json({ status: 0, data: 'user already exists' });
          } else {
            res.json(err);
          }
        } else {
          res.json({ status: 1, data: 'user details modified successfully' });
        }
      }
    );
  },
];
