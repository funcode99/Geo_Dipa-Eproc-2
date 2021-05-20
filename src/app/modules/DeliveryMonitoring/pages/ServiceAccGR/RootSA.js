import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSubheader } from '../../../_metronic/layout';
// import DocTypes from './pages/DocumentType';
// import Periode from './pages/Periode';
// import SAList from './pages/ServiceAccList/ServiceAccList';
import SADetail from './pages/ServiceAccDetail/ServiceAccDetail';
// import ItemContract from "./ListContract/ItemContract";
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

const RootSA = () => {
  const subheader = useSubheader();
  // const { intl } = props;
  subheader.setTitle('SA');
  return (
    <Switch>
      <Redirect exact from="/test" to="/test/service_acceptance" />

      {/* <Route path="/test/service_acceptance" component={SAList} /> */}
      <Route path="/test/service_acceptance2" component={SADetail} />
      {/* <Route path="/master/document_types" component={DocTypes} />
      <Route path="/master/periode" component={Periode} /> */}
    </Switch>
  );
};

export default injectIntl(connect(null, null)(RootSA));
