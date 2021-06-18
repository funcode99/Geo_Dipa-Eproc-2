import React from "react"; // useState
import { connect } from "react-redux";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import { Container, makeStyles, Paper } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Tabs from "../../../../components/tabs";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSubheader } from "../../../../../_metronic/layout";
import ItemContractSummary from "./ItemContractSummary";
import ItemContractInvoice from "./ItemContractInvoice";
import ItemContractBKB from "./ItemContractBKB";
import ItemContractRoutingSlip from "./ItemContractRoutingSlip";
import ItemContractFormVerification from "./ItemContractFormVerification";
import ContractHardCopyDoc from "./ContractHardCopyDoc";
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
  {
    id: "hardCopy",
    label: "Hard Copy Document",
    icon: (
      <i
        className="fas fa-file-contract mb-0 mr-2"
        style={{ color: "inherit" }}
      ></i>
    ),
  },
  {
    id: "bkb",
    label: "BKB",
    icon: (
      <i className="fas fa-copy mb-0 mr-2" style={{ color: "inherit" }}></i>
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
    id: "routing-slip",
    label: "Routing Slip",
    icon: (
      <i
        className="fas fa-sticky-note mb-0 mr-2"
        style={{ color: "inherit" }}
      ></i>
    ),
  },
];

const ItemContract = (props) => {
  const suhbeader = useSubheader();
  const { intl } = props;
  suhbeader.setTitle(
    intl.formatMessage({
      id: "TITLE.USER_PROFILE.PERSONAL_INFORMATION.INPUT.CONTRACT",
    }) +
      " Term " +
      useParams().termin
  );
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <Container className="px-0">
      <Subheader
        text="012.PJ/PST.30-GDE/IX/2020-1000014263"
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: "Contract Item",
            to: `/client/invoice_monitoring/contract/${useParams().contract}`,
          },
          {
            label: `Contract Term 1`,
            to: "/",
          },
        ]}
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
          {tabActive === 0 && <ItemContractSummary {...props} />}
          {tabActive === 1 && <ItemContractInvoice {...props} />}
          {tabActive === 2 && <ContractHardCopyDoc />}
          {tabActive === 3 && <ItemContractBKB />}
          {tabActive === 4 && <ItemContractFormVerification />}
          {tabActive === 5 && <ItemContractRoutingSlip />}
        </Container>
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, null)(ItemContract));
