import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useSubheader } from '../../../_metronic/layout';

import {
  // FormattedMessage,
  injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';

import { ContractsPage, ContractDetailPage, TerminPage } from './pages';

function RootDeliveryMonitoring(props) {
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
        path="/delivery_monitoring/contract/:contract_id/task"
        component={TerminPage}
      />

      <Route
        path="/delivery_monitoring/contract/:contract_id"
        component={ContractDetailPage}
        exact={true}
      />

      <Route path="/delivery_monitoring/contract" component={ContractsPage} />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootDeliveryMonitoring));
