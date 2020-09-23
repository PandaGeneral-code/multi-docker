import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Home } from "../Home/Home";

export const Root = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} path="/" />
      </Switch>
    </Router>
  );
};
