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
  UserApprovalAddendumPage,
} from "app/modules/AddendumContract/pages/index";

function RootVendorAddendum(props) {
  const subheader = useSubheader();
  subheader.setTitle("Addendum Contract");

  return (
    <Switch>
      <Route
        path="/vendor/addendum-contract/list-contract-po"
        component={ContractsAddendumPage}
      />
      <Route
        path="/vendor/addendum-contract/add-addendum/:contract_id"
        component={AddContractAddendum}
        exact={true}
      />
      <Route
        path="/vendor/addendum-contract/contract/:contract_id"
        component={ContractAddendumDetail}
        exact={true}
      />
      <Route
        path="/vendor/addendum-contract/approval/:approval_id"
        component={UserApprovalAddendumPage}
        exact={true}
      />
      <Route
        path="/vendor/addendum-contract/draft/:draft_id"
        component={DraftAddendumPage}
        exact={true}
      />
      <Route
        path="/vendor/addendum-contract/list-addendum-request"
        component={AddendumRequestListPage}
      />
      <Route
        path="/vendor/addendum-contract/list-of-addendum"
        component={AddendumListPage}
      />
    </Switch>
  );
}

export default injectIntl(connect(null, null)(RootVendorAddendum));
