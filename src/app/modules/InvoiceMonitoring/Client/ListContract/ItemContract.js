import React, { useState } from 'react';
import {
    connect 
} from "react-redux";
import { 
    // FormattedMessage, 
    injectIntl 
} from "react-intl";
import {
    Typography,
    Box,
    Container,
    makeStyles,
    Paper
} from '@material-ui/core';
import {
  useParams
} from "react-router-dom";
import { PageTitle, Tabs } from '../../../DeliveryMonitoring/components';
import { useSubheader } from "../../../../../_metronic/layout";
import ItemContractSummary from './ItemContractSummary';
import ItemContractInvoice from './ItemContractInvoice';
import ItemContractBKB from './ItemContractBKB';
import ItemContractRoutingSlip from './ItemContractRoutingSlip';
import ItemContractFormVerification from './ItemContractFormVerification';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box pt={3} px={0}>
            <Typography component={'div'}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
    },
}));

const TabLists = [
  {
    id: 'summary',
    label: 'Summary',
    icon: <i className="fas fa-file-invoice mb-0 mr-2" style={{color: 'inherit'}}></i>,
  },
  {
    id: 'invoice',
    label: 'Invoice',
    icon: <i className="fas fa-receipt mb-0 mr-2" style={{color: 'inherit'}}></i>,
  },
  {
    id: 'bkb',
    label: 'BKB',
    icon: <i className="fas fa-copy mb-0 mr-2" style={{color: 'inherit'}}></i>,
  },
  {
    id: 'form-verifikasi',
    label: 'Form Verifikasi',
    icon: <i className="fas fa-tasks mb-0 mr-2" style={{color: 'inherit'}}></i>,
  },
  {
    id: 'routing-slip',
    label: 'Routing Slip',
    icon: <i className="fas fa-sticky-note mb-0 mr-2" style={{color: 'inherit'}}></i>,
  },
];

const ItemContract = (props) => {
    const suhbeader = useSubheader();
    const { intl } = props;
    suhbeader.setTitle(intl.formatMessage({
      id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.CONTRACT",
    }) + " Term " + useParams().id);
    const classes = useStyles();
    const [tabActive, setTabActive] = React.useState(0);

    function handleChangeTab(event, newTabActive) {
      setTabActive(newTabActive);
    }

    return (
            <Container>
                <PageTitle title="012.PJ/PST.30-GDE/IX/2020-1000014263" icon={<i class="fas fa-file-invoice-dollar text-light mx-1"></i>} />
                <Paper className={classes.paper}>
                    <Container>
                    <Tabs
                        tabActive={tabActive}
                        handleChange={handleChangeTab}
                        tabLists={TabLists}
                    />
                    </Container>
                    <hr className="p-0 m-0" />
                    <Container>
                    {tabActive === 0 && <ItemContractSummary />}
                    {tabActive === 1 && <ItemContractInvoice />}
                    {tabActive === 2 && <ItemContractBKB />}
                    {tabActive === 3 && <ItemContractFormVerification />}
                    {tabActive === 4 && <ItemContractRoutingSlip />}
                    </Container>
                </Paper>
                </Container>
    );
}

export default injectIntl(connect(null, null)(ItemContract));