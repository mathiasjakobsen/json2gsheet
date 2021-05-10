"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _flat = _interopRequireDefault(require("flat"));

var _googleapis = require("googleapis");

var _util2 = require("../util");

var _auth = require("../auth");

var push = function push(config, id) {
  return read({
    config: config,
    id: id
  }).then(parse).then(flat).then(writeJsonToSheet)["catch"](function (err) {
    return console.error('Error on push:', err);
  });
};

var read = function read(_ref) {
  var config = _ref.config,
      id = _ref.id;
  var fileName = (0, _util2.getJSONFileName)(config.app.jsonFileName, id);
  return (0, _util.promisify)(_fs["default"].readFile)(fileName, 'utf-8').then(function (data) {
    return {
      config: config,
      id: id,
      data: data
    };
  });
};

var parse = function parse(_ref2) {
  var config = _ref2.config,
      id = _ref2.id,
      data = _ref2.data;
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      json: JSON.parse(data)
    });
  });
};

var flat = function flat(_ref3) {
  var config = _ref3.config,
      id = _ref3.id,
      json = _ref3.json;
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      json: (0, _flat["default"])(json)
    });
  });
};

var writeJsonToSheet = function writeJsonToSheet(_ref4) {
  var config = _ref4.config,
      id = _ref4.id,
      json = _ref4.json;
  var column = (0, _util2.getColumnById)(config.sheets.valueColumns, id);
  return (0, _auth.authorize)().then(function (auth) {
    return new Promise(function (resolve, reject) {
      return _googleapis.google.sheets('v4').spreadsheets.values.batchUpdate({
        spreadsheetId: config.sheets.spreadsheetId,
        auth: auth,
        resource: {
          data: [{
            range: (0, _util2.makeA1Notation)(config.sheets.sheetName, config.sheets.keyColumn.cellStart, config.sheets.keyColumn.column),
            values: Object.keys(json).map(function (key) {
              return [key];
            })
          }, {
            range: (0, _util2.makeA1Notation)(config.sheets.sheetName, column.cellStart, column.column),
            values: Object.values(json).map(function (val) {
              return [val];
            })
          }],
          valueInputOption: 'RAW'
        }
      }, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  });
};

module.exports = {
  push: push
};