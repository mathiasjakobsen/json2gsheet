"use strict";

var makeA1Notation = function makeA1Notation(sheetName, rangeA, rangeB) {
  return "'".concat(sheetName, "'!").concat(rangeA, ":").concat(rangeB);
};

var getColumnById = function getColumnById(columns, id) {
  var column = columns.filter(function (column) {
    return column.id === id;
  });

  if (column.length > 0) {
    return column[0];
  }

  throw new Error('ID does not exist. Add it in the configuration file.');
};

var deepGetObject = function deepGetObject(object, keys) {
  return keys.reduce(function (acc, key) {
    return acc && acc[key] ? acc[key] : null;
  }, object);
};

var getJSONFileName = function getJSONFileName(fileNameTemplate, id) {
  return fileNameTemplate.replace('$id', id);
};

module.exports = {
  deepGetObject: deepGetObject,
  getColumnById: getColumnById,
  getJSONFileName: getJSONFileName,
  makeA1Notation: makeA1Notation
};