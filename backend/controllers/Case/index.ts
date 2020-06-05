"use strict";

// Load modules
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Boom from "@hapi/boom";

interface Handlers {
  list: object;
}

const handlers = {} as Handlers;

// Get all cases
handlers.list = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the cases from the database
    const bikes = await new request.server.plugins.database.Case().fetchAll({
      withRelated: ["bike", "officer"],
    });

    return h.response(bikes);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

const routes: Array<object> = [
  {
    method: "GET",
    path: "/api/cases",
    handler: handlers.list,
  },
];

export = {
  name: "case",
  version: "1.0.0",
  register: async function (server): Promise<void> {
    try {
      // Register routes
      await server.route(routes);
    } catch (e) {
      server.log(["error"], e);
    }
  },
};
