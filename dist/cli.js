#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("./index"));

var cli = function cli() {
  var help = "\n  json2gsheet - Serializes JSON data to Google Sheets, and vice versa.\n\n  Usage: json2gsheet <push|pull> <id>\n\n  Subcommands:\n\n    push - Push local JSON data to Google Sheets\n    pull - Pull Google Sheets data to local JSON file\n\n  Arguments:\n\n    id - An ID for identifying which JSON file to read or write\n";

  if (process.argv.length < 4) {
    console.log('Too few arguments.');
    console.log(help);
    process.exit(0);
  }

  var subcommand = process.argv[2];
  var id = process.argv[3];

  var config = _index["default"].getConfig();

  switch (subcommand) {
    case 'push':
      _index["default"].push(config, id);

      break;

    case 'pull':
      _index["default"].pull(config, id);

      break;

    default:
      console.log('Invalid subcommand.');
      console.log(help);
      process.exit(0);
  }
};

cli();