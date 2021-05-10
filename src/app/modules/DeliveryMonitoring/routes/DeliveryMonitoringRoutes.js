import React from "react";
import { 
    Redirect, 
    Route, 
    Switch 
} from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
// import DeliveryMonitoring from "./DeliveryMonitoring";
// import ItemDeliveryMonitoring from "./ItemDeliveryMonitoring";

// import { DeliveryMonitoring } from "./pages/DeliveryMonitoringCopy";

import { 
  // FormattedMessage, 
  injectIntl 
} from "react-intl";
import { connect } from "react-redux";
// import DeliveryDocument from "./pages/DeliveryDocument";
// import { useSelector } from "react-redux";

// import { DeliveryMonitoring } from '../DeliveryMonitoring2/pages/DeliveryMonitoring';

import { 
  ContractsPage,
  ContractDetailPage,
  TerminPage,
} from '../pages';

function DeliveryMonitoringRoutes(props) {
  // const { user } = useSelector((state) => state.auth);
  // const { intl } = props;
  const suhbeader = useSubheader();
  suhbeader.setTitle("Delivery Monitoring");
  return (
        <Switch>
          <Redirect
            from="/user/delivery_monitoring"
            exact={true}
            to="/user/delivery_monitoring/dashboard"
          />
          <Route
            path="/user/delivery_monitoring/dashboard"
            component={ContractsPage}
          />

          <Route
            path="/user/delivery_monitoring/item"
            component={TerminPage}
          />

          <Route
            path="/user/delivery_monitoring/:id"
            component={ContractDetailPage}
          />
          
        </Switch>
  );
}
export default injectIntl(connect(null, null)(DeliveryMonitoringRoutes));