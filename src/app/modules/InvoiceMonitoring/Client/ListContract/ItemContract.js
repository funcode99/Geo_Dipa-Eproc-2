import React, { useEffect } from "react"; // useState
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
  Slide,
  Container,
  makeStyles,
  Paper,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import StyledSelect from "../../../../components/select-multiple";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import Steppers from "../../../../components/steppersCustom/Steppers";
import {
  getTerminProgress,
  getProgressTypes
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
  bodyDialog: {
    minHeight: "65vh",
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

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <h4>{children}</h4>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ItemContract = (props) => {
  const { intl } = props;
  const termin = props.match.params.termin;
  const suhbeader = useSubheader();
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [tabActive, setTabActive] = React.useState(0);
  const [dialogLeader, setDialogLeader] = React.useState(false);
  const [dataOne, setDataOne] = React.useState([]);
  const [dataOneValue, setDataOneValue] = React.useState([]);
  const [dataTwo, setDataTwo] = React.useState([]);
  const [dataTwoValue, setDataTwoValue] = React.useState([]);
  const [data, setData] = React.useState({});
  const [terminProgress, setTerminProgress] = React.useState(null);
  const [dataProgress, setDataProgress] = React.useState([]);

  suhbeader.setTitle(
    intl.formatMessage({
      id: "TITLE.CONTRACT_TERM",
    })
  );

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  function handleChangeTabTwo(event, newTabActive) {
    setDialogLeader(true);
  }

  const getSetData = (data) => {
    setData(data);
  };

  const getTerminProgressData = () => {
    getProgressTypes()
      .then((resultTypes) => {
        getTerminProgress(termin)
          .then((result) => {
            const progress = result.data.data ? result.data.data?.progress_type?.seq : 1
            const data = resultTypes.data.data.map(function (row) {
              return { label: row?.name, status: row.seq < progress ? "COMPLETE" : row.seq === progress ? "ON PROGRESS" : "NO STARTED" }
            })
            setDataProgress(data)
            setTerminProgress(result.data.data?.progress_type);
          })
          .catch((error) => {
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
          });
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  useEffect(getTerminProgressData, []);

  return (
    <Container className="px-0">
      <Toast />
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
          <DialogTitle
            id="alert-dialog-slide-title"
            onClose={() => {
              setDialogLeader(false);
            }}
          >
            <FormattedMessage id="TITLE.FOUND_SOMETHING" />
          </DialogTitle>
          <DialogContent className={classes.bodyDialog}>
            <div className="form-group row">
              <label htmlFor="notFit" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.MISMATCH" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  isDisabled={false}
                  options={dataOne}
                  value={dataOneValue}
                  id="notFit"
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
                <FormattedMessage id="TITLE.SUBBMITTEDTO" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  isDisabled={false}
                  options={dataTwo}
                  value={dataTwoValue}
                  id="toSend"
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
        text={(data?.contract_no || "") + " - " + (data.contract_name || "")}
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
            label: intl.formatMessage({
              id: "TITLE.CONTRACT_ITEM",
            }),
            to: `/client/invoice_monitoring/contract/${useParams().contract}`,
          },
          {
            label: data.termin_name,
            to: "/",
          },
        ]}
      />

      <Steppers steps={dataProgress} />
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
          {tabActive === 0 && (
            <ItemContractSummary {...props} getData={getSetData} />
          )}
          {tabActive === 1 && <ItemContractInvoice {...props} progressTermin={terminProgress} setProgressTermin={setTerminProgress} />}
          {tabActive === 2 && <ContractHardCopyDoc {...props} progressTermin={terminProgress} setProgressTermin={setTerminProgress} />}
          {tabActive === 3 && <ItemContractBKB {...props} progressTermin={terminProgress} setProgressTermin={setTerminProgress} />}
          {tabActive === 4 && <ItemContractFormVerification {...props} progressTermin={terminProgress} setProgressTermin={setTerminProgress} />}
          {tabActive === 5 && <ItemContractRoutingSlip {...props} progressTermin={terminProgress} setProgressTermin={setTerminProgress} />}
        </Container>
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, null)(ItemContract));
