import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSubheader } from "../../../_metronic/layout";
import DocTypes from "./pages/DocumentType";
import Periode from "./pages/Periode";
import Roles from "./pages/Roles";
import InvoicePeriode from "./pages/InvoicePeriode";
import ServiceLevelAgreement from "./pages/ServiceLevelAgreement";
import AsyncData from "./pages/AsyncData";
import Email from "./pages/Email";
import ItemEmail from "./pages/Email/ItemEmail";
import PurchGroup from "./pages/PurchGroup";
import Tax from "./pages/Tax";
import InvoiceAuthority from "./pages/InvoiceAuthority";
import ItemTax from "./pages/Tax/ItemTax";
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
      <Route path="/client/master/invoice_authority" component={InvoiceAuthority} />
      <Route path="/client/master/invoice_periode" component={InvoicePeriode} />
      <Route
        path="/client/master/service_level_agreement"
        component={ServiceLevelAgreement}
      />
      <Route path="/client/master/async" component={AsyncData} />
      <Route path="/client/master/email/:id" component={ItemEmail} />
      <Route path="/client/master/email" component={Email} />
      <Route path="/client/master/purch_group" component={PurchGroup} />
      <Route path="/client/master/tax/:id" component={ItemTax} />
      <Route path="/client/master/tax" component={Tax} />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootMasterData));
