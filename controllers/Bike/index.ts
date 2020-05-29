"use strict";

// Load modules
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Boom from "@hapi/boom";

interface Handlers {
  list: object;
  register: object;
  update: object;
  delete: object;
}

const handlers = {} as Handlers;

// Get all bikes
handlers.list = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the bikes from the database
    const bikes = await new request.server.plugins.database.Bike().fetchAll();

    return h.response(bikes);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

// Registers a bike
handlers.register = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Knex plugin
    const knex = request.server.plugins.database.knex;

    const bike = await knex.transaction(async function (trx) {
      // Check if the bike already exists
      let bike = await new request.server.plugins.database.Bike()
        .query({
          where: { name: request.payload.name },
          orWhere: { model: request.payload.model },
        })
        .fetch({}, { transacting: trx });

      if (bike) {
        throw new Error("INVALID_BIKE");
      }

      bike = await new request.server.plugins.database.Bike().save(
        {
          name: request.payload.name,
          model: request.payload.model,
        },
        {
          method: "insert",
          transacting: trx,
        }
      );

      // Check if there is any officer available
      const officer = await new request.server.plugins.database.Officer()
        .where({ is_busy: false })
        .fetch();

      // Register the case
      await new request.server.plugins.database.Case().save(
        {
          bike_id: bike.get("id"),
          officer_id: officer ? officer.get("id") : null,
          state: "PROCESSING",
        },
        {
          method: "insert",
          transacting: trx,
        }
      );

      if (officer) {
        // Update the officer state
        await officer.save(
          {
            is_busy: true,
          },
          {
            transactiong: trx,
          }
        );
      }

      return bike;
    });

    return h.response(bike);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

// Updates a bike
handlers.update = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the bike from the database
    const bike = await new request.server.plugins.database.Bike()
      .where({ id: request.params.bikeId })
      .fetch();

    if (!bike) {
      throw new Error("BIKE_NOT_FOUND");
    }

    await bike.save(
      {
        name: request.payload.name || bike.get("name"),
        model: request.payload.model || bike.get("model"),
      },
      { method: "update" }
    );

    return h.response(bike);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

// Deletes a bike
handlers.delete = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Fetch the bike from the database
    const bike = await new request.server.plugins.database.Bike()
      .where({ id: request.params.bikeId })
      .fetch();

    if (!bike) {
      throw new Error("BIKE_NOT_FOUND");
    }

    await bike.destroy();

    return h.response({});
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

const routes: Array<object> = [
  {
    method: "GET",
    path: "/api/bikes",
    handler: handlers.list,
  },
  {
    method: "PUT",
    path: "/api/bikes",
    handler: handlers.register,
  },
  {
    method: "PATCH",
    path: "/api/bikes/{bikeId}",
    handler: handlers.update,
  },
  {
    method: "DELETE",
    path: "/api/bikes/{bikeId}",
    handler: handlers.delete,
  },
];

export = {
  name: "user",
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
