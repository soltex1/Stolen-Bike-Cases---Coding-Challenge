"use strict";

import * as Bookshelf from "bookshelf";

const Case = (bookshelf: Bookshelf): object =>
  bookshelf.model("Case", {
    hasTimestamps: true,
    requireFetch: false,
    tableName: "case",
    bike: function () {
      return this.hasOne("Bike", "id", "bike_id");
    },
    officer: function () {
      return this.hasOne("Officer", "id", "officer_id");
    },
  });

module.exports = Case;
