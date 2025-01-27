"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var pool = require('../config/database');
exports.VendorSearch = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$query, latitude, longitude, service, query, queryParams, _yield$pool$execute, _yield$pool$execute2, results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, latitude = _req$query.latitude, longitude = _req$query.longitude, service = _req$query.service;
          query = "\n        SELECT DISTINCT v.*, s.name as service_name\n        FROM vendors v\n        JOIN vendor_services vs ON v.id = vs.vendor_id\n        JOIN services s ON vs.service_id = s.id\n        WHERE 1=1\n    ";
          queryParams = [];
          if (latitude && longitude) {
            query += " AND (\n            6371 * acos(\n                cos(radians(?)) * cos(radians(v.latitude)) * \n                cos(radians(v.longitude) - radians(?)) + \n                sin(radians(?)) * sin(radians(v.latitude))\n            ) <= 10\n        )";
            queryParams.push(latitude, longitude, latitude);
          }
          if (service) {
            query += " AND s.name LIKE ?";
            queryParams.push("%".concat(service, "%"));
          }
          _context.prev = 5;
          _context.next = 8;
          return pool.execute(query, queryParams);
        case 8:
          _yield$pool$execute = _context.sent;
          _yield$pool$execute2 = (0, _slicedToArray2["default"])(_yield$pool$execute, 1);
          results = _yield$pool$execute2[0];
          res.status(200).json({
            success: true,
            Data: results
          });
          _context.next = 17;
          break;
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](5);
          res.status(500).json({
            error: _context.t0.message
          });
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 14]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();