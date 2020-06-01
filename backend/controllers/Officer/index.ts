"use strict";

// Load modules
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Boom from "@hapi/boom";

// Load child controllers
import Case = require("./Case");

interface Handlers {
  list: object;
  register: object;
  update: object;
  delete: object;
}

const handlers = {} as Handlers;

// Get all officers
handlers.list = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the officers from the database
    const officers = await new request.server.plugins.database.Officer().fetchAll();

    return h.response(officers);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

// Registers a officer
handlers.register = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Knex plugin
    const knex = request.server.plugins.database.knex;

    const officer = await knex.transaction(async function (trx) {
      // Check if the officer already exists
      let officer = await new request.server.plugins.database.Officer()
        .where({ name: request.payload.name })
        .fetch({}, { transacting: trx });

      if (officer) {
        throw new Error("INVALID_OFFICER");
      }

      // Register the officer
      officer = await new request.server.plugins.database.Officer().save(
        {
          name: request.payload.name,
        },
        { method: "insert", transacting: trx }
      );

      // Check if there is cases unassigned
      const officerCase = await new request.server.plugins.database.Case()
        .where({ officer_id: null })
        .fetch({}, { transacting: trx });

      if (officerCase) {
        // Update the case by assigning the case to the officer
        await officerCase.save(
          {
            officer_id: officer.get("id"),
          },
          {
            method: "update",
            transacting: trx,
          }
        );

        // Update the officer state
        await officer.save(
          {
            is_busy: true,
          },
          {
            method: "update",
            transacting: trx,
          }
        );
      }

      return officer;
    });

    return h.response(officer);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

// Updates a officer
handlers.update = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the officer from the database
    const officer = await new request.server.plugins.database.Officer()
      .where({ id: request.params.officerId })
      .fetch();

    if (!officer) {
      throw new Error("OFFICER_NOT_FOUND");
    }

    await officer.save(
      {
        name: request.payload.name || officer.get("name"),
      },
      { method: "update" }
    );

    return h.response(officer);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

// Deletes a officer
handlers.delete = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the officer from the database
    const officer = await new request.server.plugins.database.Officer()
      .where({ id: request.params.officerId })
      .fetch();

    if (!officer) {
      throw new Error("OFFICER_NOT_FOUND");
    }

    await officer.destroy();

    return h.response({});
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

const routes: Array<object> = [
  {
    method: "GET",
    path: "/api/officers",
    handler: handlers.list,
  },
  {
    method: "PUT",
    path: "/api/officers",
    handler: handlers.register,
  },
  {
    method: "PATCH",
    path: "/api/officers/{officerId}",
    handler: handlers.update,
  },
  {
    method: "DELETE",
    path: "/api/officers/{officerId}",
    handler: handlers.delete,
  },
];

export = {
  name: "officer",
  version: "1.0.0",
  register: async function (server): Promise<void> {
    try {
      // Register routes
      await server.route(routes);

      // Register controllers
      await server.register([Case]);
    } catch (e) {
      server.log(["error"], e);
    }
  },
};
