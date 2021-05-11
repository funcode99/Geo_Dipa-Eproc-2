import React, { useState } from 'react';
import {
    connect 
} from "react-redux";
import { 
    // FormattedMessage, 
    injectIntl 
} from "react-intl";
import {
    AppBar,
    Tabs,
    Tab,
    Typography,
    Box 
} from '@material-ui/core';
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

function ItemContract(props) {
    const suhbeader = useSubheader();
    // const { intl } = props;
    suhbeader.setTitle("012.PJ/PST.30-GDE/IX/2020-1000014263");
    const [valueTab, setvalueTab] = useState(4);

    return (
        <React.Fragment>
            <AppBar position="static" style={{background: 'white'}}>
                <Tabs value={valueTab} onChange={(event, id) => { setvalueTab(id)}} indicatorColor="secondary" textColor="secondary" variant="scrollable" scrollButtons="auto" aria-label="tabs example">
                    <Tab label={<><div><i className="fas fa-file-invoice" style={{color: 'inherit'}}></i><span className="mx-2">Summary</span></div></>} />
                    <Tab label={<><div><i className="fas fa-receipt" style={{color: 'inherit'}}></i><span className="mx-2">Invoice</span></div></>} />
                    <Tab label={<><div><i className="fas fa-copy" style={{color: 'inherit'}}></i><span className="mx-2">BKB</span></div></>} />
                    <Tab label={<><div><i className="fas fa-tasks" style={{color: 'inherit'}}></i><span className="mx-2">Form Verifikasi</span></div></>} />
                    <Tab label={<><div><i className="fas fa-sticky-note" style={{color: 'inherit'}}></i><span className="mx-2">Routing Slip</span></div></>} />
                </Tabs>
            </AppBar>
            <TabPanel value={valueTab} index={0}>
                <ItemContractSummary />
            </TabPanel>
            <TabPanel value={valueTab} index={1}>
                <ItemContractInvoice />
            </TabPanel>
            <TabPanel value={valueTab} index={2}>
                <ItemContractBKB />
            </TabPanel>
            <TabPanel value={valueTab} index={3}>
                <ItemContractFormVerification />
            </TabPanel>
            <TabPanel value={valueTab} index={4}>
                <ItemContractRoutingSlip />
            </TabPanel>
        </React.Fragment>
    );
}

export default injectIntl(connect(null, null)(ItemContract));