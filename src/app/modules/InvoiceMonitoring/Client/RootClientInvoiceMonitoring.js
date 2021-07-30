import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// import { useSubheader } from "../../../../_metronic/layout";
import DashboardListContract from "./ListContract/DashboardListContract";
import ItemContract from "./ListContract/ItemContract";
import DashboardListSpt from "./ListSpt/DashboardListSpt";
import ItemSpt from "./ListSpt/ItemSpt";
import ListTermContract from "./ListContract/ListTermContract";
import DashboardListMismatch from "./ListMismatch/DashboardListMismatch";
import DashboardListBkb from "./ListBkb/DashboardListBkb";
import Dashboard from "./Dashboard/Dashboard";
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
        to="/client/invoice_monitoring/dashboard"
      />
      <Route
        path="/client/invoice_monitoring/contract/:contract/:termin"
        component={(props) => <ItemContract {...props} />}
        exact={true}
      />
      <Route
        path="/client/invoice_monitoring/contract/:contract"
        component={(props) => <ListTermContract {...props} />}
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
      <Route
        path="/client/invoice_monitoring/mismatch"
        component={DashboardListMismatch}
      />
      <Route
        path="/client/invoice_monitoring/bkb"
        component={DashboardListBkb}
      />
      <Route
        path="/client/invoice_monitoring/dashboard"
        component={Dashboard}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootClientInvoiceMonitoring));
