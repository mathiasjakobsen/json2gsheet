"use strict";

var _command = require("./command");

var _config = require("./config");

module.exports = {
  getConfig: _config.getConfig,
  pull: _command.pull,
  push: _command.push
};