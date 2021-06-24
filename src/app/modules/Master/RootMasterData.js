import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSubheader } from "../../../_metronic/layout";
import DocTypes from "./pages/DocumentType";
import Periode from "./pages/Periode";
import Roles from "./pages/Roles";
import InvoicePeriode from "./pages/InvoicePeriode";
import ServiceLevelAgreement from "./pages/ServiceLevelAgreement";
import AsyncData from "./pages/AsyncData";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

function RootMasterData() {
  const subheader = useSubheader();
  // const { intl } = props;
  subheader.setTitle("MASTER DATA");
  return (
    <Switch>
      <Redirect exact from="/client/master" to="/master/document_types" />
      <Route path="/client/master/document_types" component={DocTypes} />
      <Route path="/client/master/periode" component={Periode} />
      <Route path="/client/master/roles" component={Roles} />
      <Route path="/client/master/invoice_periode" component={InvoicePeriode} />
      <Route
        path="/client/master/service_level_agreement"
        component={ServiceLevelAgreement}
      />
      <Route path="/client/master/async" component={AsyncData} />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootMasterData));
