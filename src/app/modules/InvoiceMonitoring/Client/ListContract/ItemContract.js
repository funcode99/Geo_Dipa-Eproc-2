import React from "react"; // useState
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { useParams } from "react-router-dom";
import Tabs from "../../../../components/tabsCustomV1";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSubheader } from "../../../../../_metronic/layout";
import ItemContractSummary from "./ItemContractSummary";
import ItemContractInvoice from "./ItemContractInvoice";
import ItemContractBKB from "./ItemContractBKB";
import ItemContractRoutingSlip from "./ItemContractRoutingSlip";
import ItemContractFormVerification from "./ItemContractFormVerification";
import ContractHardCopyDoc from "./ContractHardCopyDoc";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Container,
  makeStyles,
  Paper,
} from "@material-ui/core";
import StyledSelect from "../../../../components/select-multiple";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [dialogLeader, setDialogLeader] = React.useState(false);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  function handleChangeTabTwo(event, newTabActive) {
    setDialogLeader(true);
    // console.log("event", event);
    // console.log("newTabActive", newTabActive);
  }

  return (
    <Container className="px-0">
      <Dialog
        open={dialogLeader}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="md"
        fullWidth={true}
      >
        <form noValidate autoComplete="off">
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.FOUND_SOMETHING" />
          </DialogTitle>
          <DialogContent>
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-3 col-form-label">
                Letak Ketidak Sesuaian
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="staticEmail"
                  defaultValue="Test"
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputNote" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.INFORMATION" />
              </label>
              <div className="col-sm-9">
                <textarea
                  rows=""
                  cols=""
                  id="inputNote"
                  className="form-control"
                ></textarea>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="toSend" className="col-sm-3 col-form-label">
                Diajukan Kepada
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="toSend"
                  defaultValue="Test"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setDialogLeader(false)}
            >
              <span>
                <FormattedMessage id="TITLE.SEND" />
              </span>
            </button>
          </DialogActions>
        </form>
      </Dialog>
      <Subheader
        text="012.PJ/PST.30-GDE/IX/2020-1000014263"
        IconComponent={
          <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: intl.formatMessage({
              id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
            }),
            to: `/client/invoice_monitoring/contract`,
          },
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
            handleChangeTwo={handleChangeTabTwo}
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
