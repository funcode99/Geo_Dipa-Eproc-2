import React from "react";
import { Route, Switch } from "react-router-dom";
// import { useSubheader } from "_metronic/layout";

import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import { experiment } from "app/modules/_Percobaan/Pages/index";

function Root() {
  return (
    <Switch>
      <Route path="/client/exp" component={experiment} exact={true} />
    </Switch>
  );
}

export default injectIntl(connect(null, null)(Root));
