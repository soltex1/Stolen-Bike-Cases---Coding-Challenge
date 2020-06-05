"use strict";

import * as Bookshelf from "bookshelf";

const Officer = (bookshelf: Bookshelf): object =>
  bookshelf.model("Officer", {
    hasTimestamps: true,
    requireFetch: false,
    tableName: "officer",
    cases: function() {
      return this.hasMany('Case', 'officer_id', 'id');
    }
  });

module.exports = Officer;
