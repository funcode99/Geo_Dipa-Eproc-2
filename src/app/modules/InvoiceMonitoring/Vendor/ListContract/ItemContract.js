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
import ItemContractRoutingSlip from "./ItemContractRoutingSlip";
import ItemContractFormVerification from "./ItemContractFormVerification";
import { getAllProgressTypeGroup, getTerminProgressVendor, getTerminProgress } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import Steppers from "../../../../components/steppersCustom/Steppers";
import ItemContractPaid from "./ItemContractPaid";

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
    label: "Soft Copy Document",
    icon: (
      <i className="fas fa-receipt mb-0 mr-2" style={{ color: "inherit" }}></i>
    ),
  },
  {
    id: "form-verifikasi",
    label: "Form Verifikasi",
    icon: (
      <i className="fas fa-tasks mb-0 mr-2" style={{ color: "inherit" }}></i>
    ),
  },
  {
    id: "paid",
    label: "Paid Document",
    icon: (
      <i
        className="fas fa-sticky-note mb-0 mr-2"
        style={{ color: "inherit" }}
      ></i>
    ),
  },
  // {
  //   id: "routing-slip",
  //   label: "Routing Slip",
  //   icon: (
  //     <i
  //       className="fas fa-sticky-note mb-0 mr-2"
  //       style={{ color: "inherit" }}
  //     ></i>
  //   ),
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
  const [dataProgress, setDataProgress] = React.useState([]);

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
    getTerminProgressVendor(termin)
      .then((result) => {
        if (result.data?.data.length) {
          const data = result.data.data.map(function (row) {
            return {
              label: row?.name,
              status: row?.complete_status
                ? "COMPLETE"
                : row?.on_progress_status
                  ? "ON PROGRESS"
                  : "NO STARTED",
              ident_name: row.ident_name,
            };
          });
          setDataProgress(data);
        } else {
          getAllProgressTypeGroup()
            .then((resultTypes) => {
              const data = resultTypes.data.data.map(function (row) {
                return {
                  label: row?.name,
                  status: "NO STARTED",
                  ident_name: row.ident_name,
                };
              });
              setDataProgress(data);
            })
        }
        getTerminProgress(termin)
          .then((resultProgressIdentName) => {
            setTerminProgress(resultProgressIdentName.data.data?.progress_type);
          })
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
        text={data.termin_name || ""}
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />
      <Steppers steps={dataProgress} />
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
              terminName={data.termin_name || ""}
            />
          )}
          {tabActive === 1 && (
            <ItemContractInvoice {...props} progressTermin={terminProgress} />
          )}
          {tabActive === 2 && (
            <ItemContractFormVerification
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
            />
          )}
          {tabActive === 3 && (
            <ItemContractPaid
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
            />
          )}
          {/* {tabActive === 3 && (
            <ItemContractRoutingSlip
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
            />
          )} */}
        </Container>
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, null)(ItemContract));
