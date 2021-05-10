"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _util = require("util");

var _flat = require("flat");

var _googleapis = require("googleapis");

var _util2 = require("../util");

var _auth = require("../auth");

var pull = function pull(config, id) {
  return readSheetToJson({
    config: config,
    id: id
  }).then(assemble).then(compact).then(deepSortByKey).then(stringify).then(ensureEOL).then(write)["catch"](function (err) {
    return console.error('Error on pull:', err);
  });
};

var readSheetToJson = function readSheetToJson(_ref) {
  var config = _ref.config,
      id = _ref.id;
  var column = (0, _util2.getColumnById)(config.sheets.valueColumns, id);
  return (0, _auth.authorize)().then(function (auth) {
    return new Promise(function (resolve, reject) {
      return _googleapis.google.sheets('v4').spreadsheets.values.batchGet({
        spreadsheetId: config.sheets.spreadsheetId,
        auth: auth,
        ranges: [(0, _util2.makeA1Notation)(config.sheets.sheetName, config.sheets.keyColumn.cellStart, config.sheets.keyColumn.column), (0, _util2.makeA1Notation)(config.sheets.sheetName, column.cellStart, column.column)]
      }, function (err, result) {
        if (err) reject(err);
        resolve({
          config: config,
          id: id,
          data: result.data.valueRanges
        });
      });
    });
  });
};

var assemble = function assemble(_ref2) {
  var config = _ref2.config,
      id = _ref2.id,
      data = _ref2.data;

  var _data = (0, _slicedToArray2["default"])(data, 2),
      keyCol = _data[0],
      valueCol = _data[1];

  var json = keyCol.values.map(function (k, i) {
    return (// a zip function
      [k[0], _getColumnValue(valueCol, i)]
    );
  }).reduce(function (acc, cur) {
    acc[cur[0]] = cur[1];
    return acc;
  }, {});
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      json: json
    });
  });
};

var _getColumnValue = function _getColumnValue(col, rowIndex) {
  if (col.values === undefined) {
    // The whole column is empty
    return '';
  } else if (col.values[rowIndex] === undefined) {
    // The specific row in the column is empty
    return '';
  } else if (col.values[rowIndex].length === 0) {
    // First row empty, second row is non-empty.
    // In this case, the first row will be empty array, instead of undefined.
    return '';
  }

  return col.values[rowIndex][0];
};

var compact = function compact(_ref3) {
  var config = _ref3.config,
      id = _ref3.id,
      json = _ref3.json;
  var skipEmptyValue = (0, _util2.deepGetObject)(config, ['app', 'command', 'pull', 'skipEmptyValue']);
  var result;

  if (skipEmptyValue === true) {
    result = Object.keys(json).reduce(function (acc, key) {
      if (json[key] !== '') acc[key] = json[key];
      return acc;
    }, {});
  } else {
    result = json;
  }

  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      json: result
    });
  });
};

var deflat = function deflat(_ref4) {
  var config = _ref4.config,
      id = _ref4.id,
      json = _ref4.json;
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      json: (0, _flat.unflatten)(json)
    });
  });
};

var deepSortByKey = function deepSortByKey(_ref5) {
  var config = _ref5.config,
      id = _ref5.id,
      json = _ref5.json;
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      json: _deepSortByKey(json)
    });
  });
};

var _deepSortByKey = function _deepSortByKey(json) {
  return Object.keys(json).sort().reduce(function (acc, key) {
    Object.prototype.toString.call(json[key]) === '[object Object]' ? acc[key] = _deepSortByKey(json[key]) : acc[key] = json[key];
    return acc;
  }, {});
};

var stringify = function stringify(_ref6) {
  var config = _ref6.config,
      id = _ref6.id,
      json = _ref6.json;
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      data: JSON.stringify(json, null, 2)
    });
  });
};

var ensureEOL = function ensureEOL(_ref7) {
  var config = _ref7.config,
      id = _ref7.id,
      data = _ref7.data;
  return new Promise(function (resolve) {
    return resolve({
      config: config,
      id: id,
      data: data + _os["default"].EOL
    });
  });
};

var write = function write(_ref8) {
  var config = _ref8.config,
      id = _ref8.id,
      data = _ref8.data;
  var fileName = (0, _util2.getJSONFileName)(config.app.jsonFileName, id);
  return (0, _util.promisify)(_fs["default"].writeFile)(fileName, data, 'utf-8');
};

module.exports = {
  pull: pull,
  assemble: assemble,
  compact: compact,
  deepSortByKey: deepSortByKey,
  ensureEOL: ensureEOL
};