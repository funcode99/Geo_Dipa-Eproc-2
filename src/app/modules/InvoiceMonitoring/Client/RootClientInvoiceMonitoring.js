import React from "react";
import {
    Route, 
    Switch,
    Redirect
} from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import DashboardListContract from "./ListContract/DashboardListContract";
import ItemContract from "./ListContract/ItemContract";
import {
  injectIntl 
} from "react-intl";
import { connect } from "react-redux";

function RootClientInvoiceMonitoring(props) {
  const suhbeader = useSubheader();
  const { intl } = props;
  suhbeader.setTitle(intl.formatMessage({
    id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
  }));
  return (
        <Switch>
          <Redirect exact from="/client/invoice_monitoring" to="/client/invoice_monitoring/list" />
          <Route
            path="/client/invoice_monitoring/list"
            component={DashboardListContract}
          />
          <Route
            path="/client/invoice_monitoring/item"
            component={ItemContract}
          />
        </Switch>
  );
}
export default injectIntl(connect(null, null)(RootClientInvoiceMonitoring));