import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSubheader } from "_metronic/layout";

import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import {
  ContractsAddendumPage,
  ContractAddendumDetail,
  AddContractAddendum,
  AddendumListPage,
  AddendumRequestListPage,
  DraftAddendumPage,
  DraftRequestPage,
  UserApprovalAddendumPage,
} from "app/modules/AddendumContract/pages/index";

function RootClientAddendum() {
  const subheader = useSubheader();
  subheader.setTitle("Addendum Contract");

  return (
    <Switch>
      <Route
        path="/client/addendum-contract/list-contract-po"
        component={ContractsAddendumPage}
      />
      <Route
        path="/client/addendum-contract/add-addendum/:contract_id"
        component={AddContractAddendum}
        exact={true}
      />

      {/* isi kontrak sebelum addendum */}
      <Route
        path="/client/addendum-contract/contract/:contract_id"
        component={ContractAddendumDetail}
        exact={true}
      />
      <Route
        path="/client/addendum-contract/draft/:draft_id"
        component={DraftAddendumPage}
        exact={true}
      />
      <Route
        path="/client/addendum-contract/approval/:contract_id/:addendum_id"
        component={UserApprovalAddendumPage}
        exact={true}
      />
      <Route
        path="/client/addendum-contract/draft-request/:contract_id/:addendum_id"
        component={DraftRequestPage}
        exact={true}
      />
      <Route
        path="/client/addendum-contract/list-addendum-request"
        component={AddendumRequestListPage}
      />
      <Route
        path="/client/addendum-contract/list-of-addendum"
        component={AddendumListPage}
      />
      {/* <Route 
                path="/client/percobaan"
                component={reactSelect}
                exact={true}
            /> */}
    </Switch>
  );
}

export default injectIntl(connect(null, null)(RootClientAddendum));
