"use strict";

import * as Bookshelf from "bookshelf";

const Bike = (bookshelf: Bookshelf): object =>
  bookshelf.model("Bike", {
    hasTimestamps: true,
    requireFetch: false,
    tableName: "bike",
  });

module.exports = Bike;
