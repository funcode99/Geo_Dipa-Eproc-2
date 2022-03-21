import React, {
  useState,
  // useEffect,
  // useCallback
} from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { getAllMismatch } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TableRow, TableCell } from "@material-ui/core";
import { Link } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";
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

function DashboardListMismatch(props) {
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const is_finance = useSelector(
    (state) => state.auth.user.data.is_finance,
    shallowEqual
  );
  const is_main = useSelector(
    (state) => state.auth.user.data.is_main,
    shallowEqual
  );

  const { intl } = props;
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [paramsTable, setParamsTable] = useState("");
  const [err, setErr] = useState(false);
  const [dialogLeader, setDialogLeader] = useState(false);
  const [dataOne, setDataOne] = useState([]);
  const [dataOneValue, setDataOneValue] = useState([]);
  const [dataTwo, setDataTwo] = useState([]);
  const [dataTwoValue, setDataTwoValue] = useState([]);
  const [dataDeskripsi, setDataDeskripsi] = React.useState("");
  const classes = useStyles();

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER",
      }),
      name: "contract_no",
      order: {
        active: true,
        status: true,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.PO_NUMBER" }),
      name: "po_no",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE",
      }),
      name: "procurement_title",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({ id: "TITLE.REPORT_BY" }),
      name: "report_by",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.LABEL.VENDOR",
      }),
      name: "vendor_name",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({
        id: "TITLE.STATUS",
      }),
      name: "status",
      order: {
        active: false,
        status: false,
      },
      filter: {
        active: false,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({ id: "TITLE.TABLE_HEADER.ACTION" }),
      name: "action",
      order: {
        active: false,
        status: false,
      },
      filter: {
        active: false,
        type: "text",
      },
    },
  ];

  const requestApi = (params) => {
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    setParamsTable(params);
    setLoading(false);
    getAllMismatch(params)
      .then((result) => {
        setLoading(false);
        setData({
          ...data,
          count: result.data.count || 0,
          data: result.data.data,
        });
      })
      .catch((err) => {
        setErr(true);
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  console.log("dataxxx", data.data);

  return (
    <React.Fragment>
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
        <form autoComplete="off">
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
                  isDisabled={true}
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
                  disabled={true}
                ></textarea>
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="toSend" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.SUBBMITTEDTO" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  isDisabled={true}
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
            <button className="btn btn-primary" type="button">
              <span
                onClick={() => {
                  setDialogLeader(false);
                }}
              >
                OK
              </span>
            </button>
          </DialogActions>
        </form>
      </Dialog>
      <Card>
        <CardBody>
          <Tables
            dataHeader={headerTable}
            handleParams={requestApi}
            loading={loading}
            err={err}
            countData={data.count}
            hecto={16}
          >
            {data.data.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>
                    {/* <Link
                      to={
                        "/client/invoice_monitoring/contract/" +
                        item.contract_id
                      }
                    >
                      {item.contract_no}
                    </Link> */}
                    {item.contract_no}
                  </TableCell>
                  <TableCell>{item.purch_order_no}</TableCell>
                  <TableCell>{item.contract_name}</TableCell>
                  <TableCell>{item.user_created}</TableCell>
                  <TableCell>{item.vendor_name}</TableCell>
                  <TableCell>
                    {!!item.complete ? (
                      <span className="label label-lg label-light-success label-inline font-weight-bold py-4">
                        {`COMPLETED`}
                      </span>
                    ) : (
                      <span className="label label-lg label-light-warning label-inline font-weight-bold py-4">
                        {`ON PROGRESS`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      type="buuton"
                      className="btn btn-sm"
                      onClick={() => {
                        setDataOneValue(item.mismatch_data);
                        setDataTwoValue(item.mail_to);
                        setDataDeskripsi(item.remark);
                        setDialogLeader(true);
                      }}
                    >
                      <i className="fas fa-info-circle text-danger"></i>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(DashboardListMismatch));
