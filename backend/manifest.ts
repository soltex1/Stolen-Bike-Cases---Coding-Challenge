"use strict";

import * as Path from "path";

const config: string =
  typeof process.env.NODE_ENV === "string"
    ? Path.join(__dirname, "config", process.env.NODE_ENV + ".ts")
    : "./config/development";

const manifest = require(config);

module.exports = manifest;
