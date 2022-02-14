import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// import { useSubheader } from "../../../../_metronic/layout";
import DashboardListContract from "./ListContract/DashboardListContract";
import ItemContract from "./ListContract/ItemContract";
import ListTermContract from "./ListContract/ListTermContract";
import DashboardListInvoice from "./ListInvoice/DashboardListInvoice";
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
      <Redirect
        exact
        from="/vendor/invoice_monitoring"
        to="/vendor/invoice_monitoring/contract"
      />
      <Route
        path="/vendor/invoice_monitoring/contract/:contract/:termin"
        component={(props) => <ItemContract {...props} />}
        exact={true}
      />
      <Route
        path="/vendor/invoice_monitoring/contract/:contract"
        component={(props) => <ListTermContract {...props} />}
        exact={true}
      />
      <Route
        path="/vendor/invoice_monitoring/contract"
        component={DashboardListContract}
      />
      <Route
        path="/vendor/invoice_monitoring/invoice_document"
        component={DashboardListInvoice}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootVendorInvoiceMonitoring));
