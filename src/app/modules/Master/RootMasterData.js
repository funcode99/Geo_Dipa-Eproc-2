import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSubheader } from "../../../_metronic/layout";
import DocTypes from "./pages/DocumentType";
import Periode from "./pages/Periode";
import Roles from "./pages/Roles";
import ServiceLevelAgreement from "./pages/ServiceLevelAgreement";
// import ItemContract from "./ListContract/ItemContract";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

function RootMasterData() {
  const subheader = useSubheader();
  // const { intl } = props;
  subheader.setTitle("MASTER DATA");
  return (
    <Switch>
      <Redirect exact from="/client/master" to="/master/document_types" />

      <Route path="/master/document_types" component={DocTypes} />
      <Route path="/master/periode" component={Periode} />
      <Route path="/master/roles" component={Roles} />
      <Route
        path="/client/master/service_level_agreement"
        component={ServiceLevelAgreement}
      />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootMasterData));
