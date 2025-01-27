"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var pool = require('./database');
var protect = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token, decoded, _yield$pool$execute, _yield$pool$execute2, users;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
            _context.next = 18;
            break;
          }
          _context.prev = 1;
          token = req.headers.authorization.split(' ')[1];
          decoded = jwt.verify(token, process.env.JWT_SECRET); // Fetch user from MySQL
          _context.next = 6;
          return pool.execute('SELECT id, email, name FROM users WHERE id = ?', [decoded.id]);
        case 6:
          _yield$pool$execute = _context.sent;
          _yield$pool$execute2 = (0, _slicedToArray2["default"])(_yield$pool$execute, 1);
          users = _yield$pool$execute2[0];
          if (!(users.length === 0)) {
            _context.next = 11;
            break;
          }
          return _context.abrupt("return", next(new AppError('User not found', 401)));
        case 11:
          req.user = users[0];
          next();
          _context.next = 18;
          break;
        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", next(new AppError('Not authorized, token failed', 401)));
        case 18:
          if (token) {
            _context.next = 20;
            break;
          }
          return _context.abrupt("return", next(new AppError('Not authorized, no token', 401)));
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 15]]);
  }));
  return function protect(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var generateToken = function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
var login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$body, email, password, _yield$pool$execute3, _yield$pool$execute4, users, user, isMatch;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context2.prev = 1;
          _context2.next = 4;
          return pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        case 4:
          _yield$pool$execute3 = _context2.sent;
          _yield$pool$execute4 = (0, _slicedToArray2["default"])(_yield$pool$execute3, 1);
          users = _yield$pool$execute4[0];
          if (!(users.length === 0)) {
            _context2.next = 9;
            break;
          }
          return _context2.abrupt("return", next(new AppError('Invalid email or password', 401)));
        case 9:
          user = users[0]; // Compare passwords
          _context2.next = 12;
          return bcrypt.compare(password, user.password);
        case 12:
          isMatch = _context2.sent;
          if (!isMatch) {
            _context2.next = 17;
            break;
          }
          res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
          });
          _context2.next = 18;
          break;
        case 17:
          return _context2.abrupt("return", next(new AppError('Invalid email or password', 401)));
        case 18:
          _context2.next = 23;
          break;
        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](1);
          next(_context2.t0);
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 20]]);
  }));
  return function login(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var register = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body2, name, email, password, _yield$pool$execute5, _yield$pool$execute6, existingUser, salt, hashedPassword, _yield$pool$execute7, _yield$pool$execute8, result, userId;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password;
          _context3.prev = 1;
          _context3.next = 4;
          return pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        case 4:
          _yield$pool$execute5 = _context3.sent;
          _yield$pool$execute6 = (0, _slicedToArray2["default"])(_yield$pool$execute5, 1);
          existingUser = _yield$pool$execute6[0];
          if (!(existingUser.length > 0)) {
            _context3.next = 9;
            break;
          }
          return _context3.abrupt("return", res.status(400).json('User already exists'));
        case 9:
          _context3.next = 11;
          return bcrypt.genSalt(10);
        case 11:
          salt = _context3.sent;
          _context3.next = 14;
          return bcrypt.hash(password, salt);
        case 14:
          hashedPassword = _context3.sent;
          _context3.next = 17;
          return pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        case 17:
          _yield$pool$execute7 = _context3.sent;
          _yield$pool$execute8 = (0, _slicedToArray2["default"])(_yield$pool$execute7, 1);
          result = _yield$pool$execute8[0];
          userId = result.insertId;
          res.status(201).json({
            id: userId,
            name: name,
            email: email,
            token: generateToken(userId)
          });
          _context3.next = 27;
          break;
        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](1);
          next(_context3.t0);
        case 27:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 24]]);
  }));
  return function register(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
module.exports = {
  protect: protect,
  generateToken: generateToken,
  login: login,
  register: register
};