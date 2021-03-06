"use strict";

// Load child controllers
import Bike = require("./Bike");
import Case = require("./Case");
import Officer = require("./Officer");

exports.plugin = {
  name: "controllers",
  version: "1.0.0",
  register: async function (server): Promise<void> {
    try {
      // Register controllers
      await server.register([Bike, Case, Officer]);

      server.log("controllers", "Controllers loaded.");
    } catch (e) {
      server.log(["error"], e);
    }
  },
};
