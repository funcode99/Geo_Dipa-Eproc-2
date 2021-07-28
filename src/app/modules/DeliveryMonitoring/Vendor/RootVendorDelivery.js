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

function RootVendorDelivery(props) {
  // const { user } = useSelector((state) => state.auth);
  // const { intl } = props;
  const suhbeader = useSubheader();
  suhbeader.setTitle("Delivery Monitoring");
  return (
    <Switch>
      <Redirect
        from="/vendor/delivery-monitoring"
        exact={true}
        to="/vendor/delivery-monitoring/contract"
      />

      <Route
        path="/vendor/delivery-monitoring/contract/task/:task_id"
        component={TerminPageNew}
      />
      {/* <Route
        path="/vendor/delivery-monitoring/contract/task/:task_id"
        component={TerminPage}
      /> */}

      <Route
        path="/vendor/delivery-monitoring/contract/:contract_id"
        component={ContractDetailPage}
        exact={true}
      />

      <Route
        path="/vendor/delivery-monitoring/contract"
        component={ContractsPage}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootVendorDelivery));
