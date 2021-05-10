"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _googleAuthLibrary = require("google-auth-library");

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
/**
 * Authorize to get a Google Auth client with client secret.
 *
 * @async
 * @returns The Google Auth client.
 */

function authorize() {
  return _authorize.apply(this, arguments);
}

function _authorize() {
  _authorize = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var auth;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            auth = new _googleAuthLibrary.GoogleAuth({
              scopes: SCOPES,
              keyFile: 'client_secret.json'
            });
            _context.next = 3;
            return auth.getClient();

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _authorize.apply(this, arguments);
}

module.exports = {
  authorize: authorize
};