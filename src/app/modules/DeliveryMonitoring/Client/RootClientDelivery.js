import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";

import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import { connect } from "react-redux";

import {
  ContractsPage,
  ContractDetailPage,
  TerminPage,
  TerminPageNew,
} from "../pages";

function RootClientDelivery(props) {
  // const { user } = useSelector((state) => state.auth);
  // const { intl } = props;
  const suhbeader = useSubheader();
  suhbeader.setTitle("Delivery Monitoring");
  return (
    <Switch>
      <Redirect
        from="/client/delivery-monitoring"
        exact={true}
        to="/client/delivery-monitoring/contract"
      />

      <Route
        path="/client/delivery-monitoring/contract/task/:task_id"
        component={TerminPageNew}
      />
      {/* <Route
        path="/client/delivery-monitoring/contract/task/:task_id"
        component={TerminPage}
      /> */}

      <Route
        path="/client/delivery-monitoring/contract/:contract_id"
        component={ContractDetailPage}
        exact={true}
      />

      <Route
        path="/client/delivery-monitoring/contract"
        component={ContractsPage}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootClientDelivery));
