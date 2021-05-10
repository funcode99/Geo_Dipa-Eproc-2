import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSubheader } from '../../../_metronic/layout';
import DocTypes from './DocumentType';
// import ItemContract from "./ListContract/ItemContract";
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

function RootMasterData(props) {
  const suhbeader = useSubheader();
  const { intl } = props;
  suhbeader.setTitle(
    intl.formatMessage({
      id: 'MENU.MASTER_DATA.DOCUMENT_TYPES',
    })
  );
  return (
    <Switch>
      <Redirect exact from="/master" to="/master/document_types" />

      <Route path="/master/document_types" component={DocTypes} />
    </Switch>
  );
}
export default injectIntl(connect(null, null)(RootMasterData));
