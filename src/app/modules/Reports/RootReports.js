import React from "react";
import { injectIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { useSubheader } from "../../../_metronic/layout";
import ReportsPage from "./pages/ReportsPage";

function RootReports(props) {
  const { user } = useSelector((state) => state.auth);
  const { intl } = props;
  const suhbeader = useSubheader();
  suhbeader.setTitle(
    intl.formatMessage({
      id: "TITLE.REPORTS",
    })
  );
  return (
    <div className="d-flex flex-row">
      <div className="flex-row-fluid ml-lg-8">
        <Switch>
          <Route path="/client/reports" component={ReportsPage} />
        </Switch>
      </div>
    </div>
  );
}
export default injectIntl(RootReports);
