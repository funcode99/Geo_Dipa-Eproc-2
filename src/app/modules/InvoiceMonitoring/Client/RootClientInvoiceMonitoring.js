import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// import { useSubheader } from "../../../../_metronic/layout";
import DashboardListContract from "./ListContract/DashboardListContract";
import ItemContract from "./ListContract/ItemContract";
import DashboardListSpt from "./ListSpt/DashboardListSpt";
import ItemSpt from "./ListSpt/ItemSpt";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

function RootClientInvoiceMonitoring(props) {
  // const suhbeader = useSubheader();
  // const { intl } = props;
  // suhbeader.setTitle(intl.formatMessage({
  //   id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
  // }));
  return (
    <Switch>
      <Redirect
        exact
        from="/client/invoice_monitoring"
        to="/client/invoice_monitoring/contract"
      />
      <Route
        path="/client/invoice_monitoring/contract/:termin/:contract"
        component={(props) => <ItemContract {...props} />}
        exact={true}
      />
      <Route
        path="/client/invoice_monitoring/contract"
        component={DashboardListContract}
      />
      <Route path="/client/invoice_monitoring/spt/:id" component={ItemSpt} />
      <Route
        path="/client/invoice_monitoring/spt"
        component={DashboardListSpt}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootClientInvoiceMonitoring));
