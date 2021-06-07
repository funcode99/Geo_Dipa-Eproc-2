import React from "react";
import {
  Route,
  Switch,
  // Redirect
} from "react-router-dom";
// import { useSubheader } from "../../../../_metronic/layout";
import DashboardListContract from "./ListContract/DashboardListContract";
import ItemContract from "./ListContract/ItemContract";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

function RootVendorInvoiceMonitoring(props) {
  // const suhbeader = useSubheader();
  // const { intl } = props;
  // suhbeader.setTitle(intl.formatMessage({
  //   id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
  // }));
  return (
    <Switch>
      {/* <Redirect exact from="/client" to="/client/invoice_monitoring" /> */}
      <Route
        path="/vendor/invoice_monitoring/:termin/:contract"
        component={(props) => <ItemContract {...props} />}
        exact={true}
      />
      <Route
        path="/vendor/invoice_monitoring"
        component={DashboardListContract}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootVendorInvoiceMonitoring));
