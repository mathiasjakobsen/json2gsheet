"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _fs = _interopRequireDefault(require("fs"));

var getConfig = function getConfig() {
  return parse(read());
};

var read = function read() {
  return _fs["default"].readFileSync('json2gsheet.config.json', 'utf-8');
};

var parse = function parse(data) {
  return JSON.parse(data);
};

module.exports = {
  getConfig: getConfig
};