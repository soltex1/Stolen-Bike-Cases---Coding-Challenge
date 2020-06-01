"use strict";

// Load modules
import * as Path from "path";

const manifest = {
  server: {
    host: process.env.HOSTNAME,
    port: process.env.PORT,
    routes: {
      files: {
        relativeTo: Path.join(__dirname, "../public/client"),
      },
      cors: true,
    },
  },
  register: {
    plugins: [
      {
        plugin: require("@hapi/good"),
        options: {
          ops: {
            interval: 60000,
          },
          reporters: {
            myConsoleReporter: [
              {
                module: "@hapi/good-squeeze",
                name: "Squeeze",
                args: [{ log: "*", response: "*", ops: "*" }],
              },
              {
                module: "@hapi/good-console",
                args: [
                  {
                    format: "YYYY-MM-DD/HH:mm:ss:SSS",
                    utc: false,
                    color: true,
                  },
                ],
              },
              "stdout",
            ],
          },
        },
      },
      {
        plugin: require("inert"),
      },
      {
        plugin: Path.join(__dirname, "../controllers"),
        options: {},
      },
      {
        plugin: Path.join(__dirname, "../plugins/database"),
        options: {
          connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
          },
        },
      },
    ],
  },
};

module.exports = manifest;
