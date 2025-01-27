"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var express = require('express');
var cors = require('cors');
var fs = require('fs');
var pool = require('./config/database');
var routes = require('./routes/routes');
var authRoutes = require('./routes/auth');
var app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());
var PORT = process.env.PORT || 4000;
var initializeDatabase = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var schema, queries, _iterator, _step, query;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          pool.getConnection().then(function () {
            console.log('Connected to the MySQL database!');
          })["catch"](function (err) {
            console.error('Error connecting to the database:', err);
          });
          _context.prev = 2;
          schema = fs.readFileSync('./models/Schema.sql', 'utf8');
          queries = schema.split(';').filter(function (query) {
            return query.trim();
          });
          _iterator = _createForOfIteratorHelper(queries);
          _context.prev = 6;
          _iterator.s();
        case 8:
          if ((_step = _iterator.n()).done) {
            _context.next = 14;
            break;
          }
          query = _step.value;
          _context.next = 12;
          return pool.query(query);
        case 12:
          _context.next = 8;
          break;
        case 14:
          _context.next = 19;
          break;
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](6);
          _iterator.e(_context.t0);
        case 19:
          _context.prev = 19;
          _iterator.f();
          return _context.finish(19);
        case 22:
          _context.next = 27;
          break;
        case 24:
          _context.prev = 24;
          _context.t1 = _context["catch"](2);
          console.error('Error executing schema:', _context.t1.message);
        case 27:
          _context.next = 33;
          break;
        case 29:
          _context.prev = 29;
          _context.t2 = _context["catch"](0);
          console.error('Database connection failed:', _context.t2.message);
          process.exit(1); // Exit the process if the connection fails
        case 33:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 29], [2, 24], [6, 16, 19, 22]]);
  }));
  return function initializeDatabase() {
    return _ref.apply(this, arguments);
  };
}();
var startServer = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return initializeDatabase();
        case 2:
          // Ensure the database is connected
          app.listen(PORT, function () {
            return console.log("Server running on port ".concat(PORT));
          });
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function startServer() {
    return _ref2.apply(this, arguments);
  };
}();
startServer();
app.use('/api', authRoutes);
app.use('/api', routes);