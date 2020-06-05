import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Bike from "./components/Bike";
import Case from "./components/Case";
import Main from "./components/Main";
import Officer from "./components/Officer";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/bikes" component={Bike} />
        <Route path="/cases" component={Case} />
        <Route path="/officers" component={Officer} />
        <Route path="/" component={Main} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
