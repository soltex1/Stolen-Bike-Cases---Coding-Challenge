"use strict";

import * as Bookshelf from "bookshelf";

const Case = (bookshelf: Bookshelf): object =>
  bookshelf.model("Case", {
    hasTimestamps: true,
    requireFetch: false,
    tableName: "case",
  });

module.exports = Case;
