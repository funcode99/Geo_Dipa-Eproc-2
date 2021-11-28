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
  GRPage,
  DetailGRPage,
  SAPage,
  DetailSAPage,
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
        path="/client/delivery-monitoring/contract/task/:task_id/:tab"
        component={TerminPageNew}
      />
      <Route
        path="/client/delivery-monitoring/contract/task/:task_id"
        component={TerminPageNew}
      />
      <Route
        path="/client/delivery-monitoring/contract/:contract_id/:tab"
        component={ContractDetailPage}
        exact={true}
      />
      <Route
        path="/client/delivery-monitoring/contract/:contract_id"
        component={ContractDetailPage}
        exact={true}
      />
      <Route
        path="/client/delivery-monitoring/gr/:task_id/:gr_id"
        component={DetailGRPage}
      />
      <Route
        path="/client/delivery-monitoring/sa/:task_id/:sa_id"
        component={DetailSAPage}
      />
      <Route
        path="/client/delivery-monitoring/contract"
        component={ContractsPage}
      />
      <Route path="/client/delivery-monitoring/gr" component={GRPage} />
      <Route path="/client/delivery-monitoring/sa" component={SAPage} />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootClientDelivery));
