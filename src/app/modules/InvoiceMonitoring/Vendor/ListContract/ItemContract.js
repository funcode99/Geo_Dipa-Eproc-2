import React, { useEffect, useLayoutEffect } from "react"; // useState
import { connect } from "react-redux";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import { Container, makeStyles, Paper } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Tabs from "../../../../components/tabs";
import Subheader from "../../../../components/subheader";
import { useSubheader } from "../../../../../_metronic/layout";
import ItemContractSummary from "./ItemContractSummary";
import ItemContractInvoice from "./ItemContractInvoice";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { getTerminProgress } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const TabLists = [
  {
    id: "summary",
    label: "Summary",
    icon: (
      <i
        className="fas fa-file-invoice mb-0 mr-2"
        style={{ color: "inherit" }}
      ></i>
    ),
  },
  {
    id: "document",
    label: "Document",
    icon: (
      <i className="fas fa-receipt mb-0 mr-2" style={{ color: "inherit" }}></i>
    ),
  },
  // {
  //   id: 'bkb',
  //   label: 'BKB',
  //   icon: <i className="fas fa-copy mb-0 mr-2" style={{ color: 'inherit' }}></i>,
  // },
  // {
  //   id: 'form-verifikasi',
  //   label: 'Form Verifikasi',
  //   icon: <i className="fas fa-tasks mb-0 mr-2" style={{ color: 'inherit' }}></i>,
  // },
  // {
  //   id: 'routing-slip',
  //   label: 'Routing Slip',
  //   icon: <i className="fas fa-sticky-note mb-0 mr-2" style={{ color: 'inherit' }}></i>,
  // },
];

const ItemContract = (props) => {
  const suhbeader = useSubheader();
  const { intl } = props;
  const termin = props.match.params.termin;
  const contract = props.match.params.contract;
  const [Toast, setToast] = useToast();
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);
  const [terminProgress, setTerminProgress] = React.useState(null);
  const [data, setData] = React.useState({});

  useLayoutEffect(() => {
    suhbeader.setTitle(
      intl.formatMessage({
        id: "TITLE.CONTRACT_TERM",
      })
    );
    suhbeader.setBreadcrumbs([
      {
        pathname: `/vendor/invoice_monitoring/contract`,
        title: intl.formatMessage({
          id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        }),
      },
      {
        pathname: `/vendor/invoice_monitoring/contract/${contract}`,
        title: intl.formatMessage({
          id: "TITLE.CONTRACT_ITEM",
        }),
      },
      {
        pathname: `/vendor/invoice_monitoring/contract/${contract}/${termin}`,
        title: data.termin_name || "",
      },
    ]);
  }, [data]);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }
  const getSetData = (data) => {
    setData(data);
  };

  const getTerminProgressData = () => {
    getTerminProgress(termin)
      .then((result) => {
        setTerminProgress(result.data.data?.progress_type);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  useEffect(getTerminProgressData, []);

  return (
    <Container className="px-0">
      <Toast />
      <Subheader
        text={(data?.contract_no || "") + " - " + (data.contract_name || "")}
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />
      <Paper className={classes.paper}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
          />
        </Container>
        <hr className="p-0 m-0" />
        <Container className="p-0">
          {tabActive === 0 && (
            <ItemContractSummary
              {...props}
              getData={getSetData}
              progressTermin={terminProgress}
            />
          )}
          {tabActive === 1 && (
            <ItemContractInvoice {...props} progressTermin={terminProgress} />
          )}
        </Container>
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, null)(ItemContract));
