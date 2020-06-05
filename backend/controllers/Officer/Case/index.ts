"use strict";

// Load modules
import { Request, ResponseToolkit } from "@hapi/hapi";
import * as Boom from "@hapi/boom";

interface Handlers {
  mark: object;
}

const handlers = {} as Handlers;

// Mark the officer's case as resolved
handlers.mark = async (
  request: Request,
  h: ResponseToolkit
): Promise<object> => {
  try {
    // Knex plugin
    const knex = request.server.plugins.database.knex;

    const officerCase = await knex.transaction(async function (trx) {
      // Fetch the officer from the database
      const officer = await new request.server.plugins.database.Officer()
        .where({ id: request.params.officerId })
        .fetch();

      if (!officer) {
        throw new Error("OFFICER_NOT_FOUND");
      }

      // Fetch the officer's case from the database
      let officerCase = await new request.server.plugins.database.Case()
        .where({ officer_id: officer.get("id"), state: "PROCESSING" })
        .fetch({ withRelated: ["bike", "officer"] });

      if (!officerCase) {
        throw new Error("CASE_NOT_FOUND");
      }

      // Update the officer's case
      await officerCase.save(
        {
          state: "RESOLVED",
        },
        {
          method: "update",
          transacting: trx,
        }
      );

      // Update the officer's state
      await officer.save(
        {
          is_busy: false,
        },
        {
          method: "update",
          transacting: trx,
        }
      );

      // Check if there are cases unassigned
      let newOfficerCase = await new request.server.plugins.database.Case()
        .where({ officer_id: null, state: "PROCESSING" })
        .fetch({ withRelated: ["bike", "officer"] }, { transacting: trx });

      if (newOfficerCase) {
        // Update the case by assigning the case to the officer
        await newOfficerCase.save(
          {
            state: "PROCESSING",
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

      return newOfficerCase ? [officerCase, newOfficerCase] : [officerCase];
    });

    return h.response(officerCase);
  } catch (e) {
    request.server.log(["error"], e);
    return Boom.badRequest(e);
  }
};

const routes: Array<object> = [
  {
    method: "POST",
    path: "/api/officers/{officerId}/case",
    handler: handlers.mark,
  },
];

export = {
  name: "officer-case",
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
