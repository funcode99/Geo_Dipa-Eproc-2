import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useSubheader } from '../../../_metronic/layout';
// import DeliveryMonitoring from "./DeliveryMonitoring";
// import ItemDeliveryMonitoring from "./ItemDeliveryMonitoring";

// import { DeliveryMonitoring } from "./pages/DeliveryMonitoringCopy";

import {
  // FormattedMessage,
  injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
// import DeliveryDocument from "./pages/DeliveryDocument";
// import { useSelector } from "react-redux";

// import { DeliveryMonitoring } from '../DeliveryMonitoring2/pages/DeliveryMonitoring';

import {
  ContractsPage,
  ContractDetailPage,
  TerminPage,
  TerminPage2,
} from './pages';

function DeliveryMonitoringRoutes(props) {
  // const { user } = useSelector((state) => state.auth);
  // const { intl } = props;
  const suhbeader = useSubheader();
  suhbeader.setTitle('Delivery Monitoring');
  return (
    <Switch>
      <Redirect
        from="/delivery_monitoring"
        exact={true}
        to="/delivery_monitoring/contract"
      />

      <Route
        path="/delivery_monitoring/contract/termin"
        component={TerminPage}
      />

      <Route
        path="/delivery_monitoring/contract/:id/item"
        component={TerminPage2}
      />

      <Route
        path="/delivery_monitoring/contract/:id"
        component={ContractDetailPage}
        exact={true}
      />

      <Route path="/delivery_monitoring/contract" component={ContractsPage} />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(DeliveryMonitoringRoutes));
