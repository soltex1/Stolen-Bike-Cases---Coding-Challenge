"use strict";

// Load modules
import * as Path from "path";
import * as Fs from "fs";
import * as Knex from "knex";
import * as Bookshelf from "bookshelf";

exports.plugin = {
  name: "database",
  version: "1.0.0",
  register: async function (server, options): Promise<void> {
    try {
      // Setting up the database connection
      const knex = Knex({
        client: "pg",
        connection: options.connection,
      });

      // Run a dummy query to test connection
      await knex.raw("select 1+1 as result");

      server.expose("knex", knex);

      const bookshelf = Bookshelf(knex);

      if (!Fs.existsSync(Path.join(__dirname, "../models"))) {
        // Do something
        throw new Error("Database models not found");
      }

      Fs.readdir(Path.join(__dirname, "../models"), (err, files) => {
        files.forEach(async (file) => {
          if (file.endsWith(".js")) {
            const name = file.split(".js")[0];
            const model = require(Path.join(__dirname, "../models/", name))(
              bookshelf
            );

            // Expose the model
            server.expose(name, model);
          }
        });
      });

      server.log("database", "Database models loaded.");
    } catch (e) {
      server.log("auth", `Database models failed to load: ${e.message}`);
      process.exit(1);
    }
  },
};
