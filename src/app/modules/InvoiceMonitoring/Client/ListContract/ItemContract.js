import React, { useEffect, useLayoutEffect, useCallback, useMemo } from "react"; // useState
import { connect, useSelector, shallowEqual } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
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
import ItemContractPaid from "./ItemContractPaid";
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
  getProgressTypes,
  getListMismatch,
  getListMailTo,
  saveMismatch,
  getContractSummary,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { getRolesAudit } from "../../../Master/service/MasterCrud";
import * as reducer from "../../_redux/InvoiceMonitoringSlice";

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
    label: "Soft Copy Document",
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
  {
    id: "paid",
    label: "Paid Document",
    icon: (
      <i
        className="fas fa-file-invoice-dollar mb-0 mr-2"
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
  const contract = props.match.params.contract;
  const suhbeader = useSubheader();
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  let tabInvoice = useSelector(
    (state) => state.invoiceMonitoring.tabInvoice,
    shallowEqual
  );
  const [tabActive, setTabActive] = React.useState(Number(tabInvoice.tab) || 0);
  const [dialogLeader, setDialogLeader] = React.useState(false);
  const [dataOne, setDataOne] = React.useState([]);
  const [dataOneValue, setDataOneValue] = React.useState([]);
  const [dataTwo, setDataTwo] = React.useState([]);
  const [dataTwoValue, setDataTwoValue] = React.useState([]);
  const [dataDeskripsi, setDataDeskripsi] = React.useState("");
  const [data, setData] = React.useState({});
  const [terminProgress, setTerminProgress] = React.useState(null);
  const [dataProgress, setDataProgress] = React.useState([]);
  const [auditStaff, setAuditStaff] = React.useState(false);
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const data_login = useSelector((state) => state.auth.user.data, shallowEqual);
  const monitoring_role = data_login.monitoring_role
    ? data_login.monitoring_role
    : [];
  const [onSubmit, setOnSubmit] = React.useState(false);
  const [statusSubmit, setStatusSubmit] = React.useState(false);
  const isPaid = useMemo(
    () =>
      dataProgress?.find((el) => el.label === "Paid")?.status === "COMPLETE",
    [dataProgress]
  );

  useLayoutEffect(() => {
    suhbeader.setTitle(
      intl.formatMessage({
        id: "TITLE.CONTRACT_TERM",
      })
    );
    suhbeader.setBreadcrumbs([
      {
        pathname: `/client/invoice_monitoring/contract`,
        title: intl.formatMessage({
          id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        }),
      },
      {
        pathname: `/client/invoice_monitoring/contract/${contract}`,
        title: intl.formatMessage({
          id: "TITLE.CONTRACT_ITEM",
        }),
      },
      {
        pathname: `/client/invoice_monitoring/contract/${contract}/${termin}`,
        title: data.termin_name || "",
      },
    ]);
  }, [data]);

  function handleChangeTab(event, newTabActive) {
    tabInvoice.tab = Number(newTabActive);
    props.set_data_tab_invaoice(tabInvoice);
    setTabActive(newTabActive);
  }

  function handleChangeTabTwo(event, newTabActive) {
    setDialogLeader(true);
  }

  const getTerminProgressData = () => {
    getProgressTypes()
      .then((resultTypes) => {
        getTerminProgress(termin)
          .then((result) => {
            // const progress = result.data.data ? result.data.data?.progress_type?.seq : "2"
            // const name = result.data.data ? result.data.data?.progress_type?.ident_name : ""
            if (result.data?.data?.id && result?.data?.data?.data) {
              setDataProgress(result.data.data.data);
            } else if (result?.data?.data?.id && !result?.data?.data?.data) {
              const progress = 2;
              const data = resultTypes.data.data.map(function(row) {
                return {
                  label: row?.name,
                  status:
                    Number(row.seq) < progress
                      ? "COMPLETE"
                      : Number(row.seq) === progress
                      ? "ON PROGRESS"
                      : "NO STARTED",
                  ident_name: row.ident_name,
                };
              });
              setDataProgress(data);
            } else {
              const progress = 1;
              const data = resultTypes.data.data.map(function(row) {
                return {
                  label: row?.name,
                  status:
                    Number(row.seq) === progress ? "COMPLETE" : "NO STARTED",
                  ident_name: row.ident_name,
                };
              });
              setDataProgress(data);
            }
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

  const getMisMatch = () => {
    getListMismatch(contract, termin)
      .then(async (result) => {
        if (result.data && result.data.data) {
          var waiting = new Promise((resolve, reject) => {
            for (let i = 0; i < result.data.data.length; i++) {
              var data = result.data.data[i];
              data.label = data.group_name + " - " + data.ident_name;
              data.value = JSON.stringify(data);
              delete data.contract_id;
              delete data.document_name;
              delete data.document_name_eng;
              delete data.document_no;
              delete data.group_name;
              delete data.group_name_eng;
              delete data.ident_name;
              delete data.term_id;
              if (i === result.data.data.length - 1) resolve();
            }
          });
          await waiting;
          setDataOne(result.data?.data);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
    getListMailTo()
      .then(async (result) => {
        if (result.data && result.data.data) {
          var waiting = new Promise((resolve, reject) => {
            for (let i = 0; i < result.data.data.length; i++) {
              var data = result.data.data[i];
              data.label =
                data.full_name + " - " + data.code + " - " + data.email;
              data.value = JSON.stringify(data);
              delete data.code;
              delete data.email;
              delete data.full_name;
              delete data.party_id;
              delete data.purch_group_id;
              if (i === result.data.data.length - 1) resolve();
            }
          });
          await waiting;
          setDataTwo(result.data?.data);
        }
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const sendMismatch = (e) => {
    e.preventDefault();
    setOnSubmit(true);
    var data = {
      contract_id: contract,
      term_id: termin,
      mismatch_data: dataOneValue,
      remark: dataDeskripsi,
      mail_to: dataTwoValue,
      created_by_id: user_id,
    };
    saveMismatch(data)
      .then((result) => {
        setStatusSubmit(true);
        setTimeout(() => {
          setDialogLeader(false);
          setOnSubmit(false);
          setStatusSubmit(false);
        }, 2000);
      })
      .catch((err) => {
        setOnSubmit(false);
        setToast(
          intl.formatMessage({
            id: "REQ.REQUEST_FAILED",
          }),
          5000
        );
      });
  };

  const getRolesAuditData = useCallback(() => {
    getRolesAudit()
      .then((responseRoles) => {
        responseRoles["data"]["data"].map((item, index) => {
          if (
            monitoring_role.findIndex((element) => element === item.name) >= 0
          ) {
            if (monitoring_role.length === 1) {
              setAuditStaff(true);
            }
          }
        });
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, [intl, setToast]);

  useEffect(getMisMatch, []);
  useEffect(getTerminProgressData, []);
  useEffect(getRolesAuditData, []);

  const getContractData = useCallback(() => {
    getContractSummary(contract, termin)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, []);
  useEffect(getContractData, []);

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
        <form autoComplete="off" onSubmit={sendMismatch}>
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
                  onChange={(e) => {
                    setDataOneValue(e);
                  }}
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
                  value={dataDeskripsi}
                  onChange={(e) => {
                    setDataDeskripsi(e.target.value);
                  }}
                  required
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
                  onChange={(e) => {
                    setDataTwoValue(e);
                  }}
                  id="toSend"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                dataTwoValue?.length === 0 ||
                dataOneValue?.length === 0 ||
                onSubmit
              }
            >
              {!onSubmit && (
                <span>
                  <FormattedMessage id="TITLE.SAVE" />
                </span>
              )}
              {onSubmit &&
                (statusSubmit && onSubmit ? (
                  <div>
                    <span>
                      <FormattedMessage id="TITLE.UPDATE_DATA_SUCCESS" />
                    </span>
                    <span className="ml-2 fas fa-check"></span>
                  </div>
                ) : (
                  <div>
                    <span>
                      <FormattedMessage id="TITLE.WAITING" />
                    </span>
                    <span className="ml-2 mr-4 spinner spinner-white"></span>
                  </div>
                ))}
            </button>
          </DialogActions>
        </form>
      </Dialog>
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
            handleChangeTwo={handleChangeTabTwo}
            auditStaff={auditStaff}
            isPaid={isPaid}
          />
        </Container>
        <hr className="p-0 m-0" />
        <Container className="p-0">
          {tabActive === 0 && (
            <ItemContractSummary
              {...props}
              terminName={data.termin_name || ""}
            />
          )}
          {tabActive === 1 && (
            <ItemContractInvoice
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
              dataProgress={dataProgress}
              setDataProgress={setDataProgress}
            />
          )}
          {tabActive === 2 && (
            <ContractHardCopyDoc
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
              dataProgress={dataProgress}
              setDataProgress={setDataProgress}
            />
          )}
          {tabActive === 3 && (
            <ItemContractBKB
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
              dataProgress={dataProgress}
              setDataProgress={setDataProgress}
            />
          )}
          {tabActive === 4 && (
            <ItemContractFormVerification
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
              dataProgress={dataProgress}
              setDataProgress={setDataProgress}
            />
          )}
          {tabActive === 5 && (
            <ItemContractRoutingSlip
              {...props}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
              dataProgress={dataProgress}
              setDataProgress={setDataProgress}
            />
          )}
          {tabActive === 6 && (
            <ItemContractPaid
              {...props}
              terminName={data.termin_name || ""}
              progressTermin={terminProgress}
              setProgressTermin={setTerminProgress}
              dataProgress={dataProgress}
              setDataProgress={setDataProgress}
            />
          )}
        </Container>
      </Paper>
    </Container>
  );
};

export default injectIntl(connect(null, reducer.actions)(ItemContract));
