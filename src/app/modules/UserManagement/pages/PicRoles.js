import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import useToast from "../../../components/toast";
import { TablePagination } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  getVendors,
  getContractByPic,
  assignPic,
} from "../_redux/UserManagementCrud";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import StyledSelect from "../../../components/select-multiple";
import { getContractVendor } from "../../InvoiceMonitoring/_redux/InvoiceMonitoringCrud";
import Tables from "../../../components/tableCustomV1/table";
import TableOnly from "../../../components/tableCustomV1/tableOnly";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, disabled } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <h4>{children}</h4>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
          disabled={disabled}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function PicRoles(props) {
  const { intl } = props;
  const [Toast, setToast] = useToast();
  const picTableRef = useRef(null);
  const invoice_monitoring_type = "INVOICE";
  const delivery_monitoring_type = "DELIVERY";
  const [contractVendor, setContractVendor] = useState([]);
  const [dialogState, setDialogState] = useState(false);
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const [picId, setPicId] = useState("");
  const [picInvoiceData, setPicInvoiceData] = useState([]);
  const [picDeliveryData, setPicDeliveryData] = useState([]);
  const [dataUser, setDataUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [paramsTable, setParamsTable] = useState("");
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const headerTable = [
    {
      title: intl.formatMessage({ id: "TITLE.NO" }),
      name: "no",
      order: {
        active: false,
        status: true,
      },
      filter: {
        active: false,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_CODE",
      }),
      name: "code",
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
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_NAME",
      }),
      name: "name",
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
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.STATUS",
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
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.PIC",
      }),
      name: "pic",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
  ];
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [dataSecond, setDataSecond] = useState([]);
  const headerTableSecond = [
    {
      title: intl.formatMessage({ id: "TITLE.NO" }),
      name: "no",
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
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.EMAIL",
      }),
      name: "email",
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
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.NAME",
      }),
      name: "name",
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
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR",
      }),
      name: "role_vendor",
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
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.ACTIVE",
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
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.TABLE_HEAD.ACTION",
      }),
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
  const handleModal = (index) => {
    setDataUser(dataSecond[index]);
    setDialogState(true);
    setPicId(dataSecond[index].pic_id);
    getContractByPic(dataSecond[index].pic_id).then((result) => {
      setPicInvoiceData(result.data.data.invoice_data);
      setPicDeliveryData(result.data.data.delivery_data);
    });
  };

  const handleClick = (e, index) => {
    e.preventDefault();
    const vendor_id = data.data[index].vendor_id;
    getContractVendor(vendor_id, "").then((result) => {
      const data = result.data.data.map(function(row) {
        return { value: row.contract_id, label: row.contract_no };
      });
      setContractVendor(data);
    });
    setDataSecond(data.data[index].pic_data);
    picTableRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDelivery = (e) => {
    setPicDeliveryData(e);
  };

  const handleInvoice = (e) => {
    setPicInvoiceData(e);
  };

  const handleSubmit = () => {
    setLoading(true);
    var data = {
      invoice_data: picInvoiceData,
      delivery_data: picDeliveryData,
      created_by_id: user_id,
      pic_id: picId,
      invoice_monitoring_type: invoice_monitoring_type,
      delivery_monitoring_type: delivery_monitoring_type,
    };
    assignPic(data)
      .then((response) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
        setDialogState(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        setLoading(false);
      });
  };

  const requestApi = (params) => {
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    setParamsTable(params);
    getVendors(params)
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

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={dialogState}
        keepMounted
        maxWidth={"sm"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form noValidate autoComplete="off">
          <DialogTitle
            id="alert-dialog-slide-title"
            onClose={() => {
              setDialogState(false);
            }}
            disabled={loading}
          >
            <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.MODAL.MODAL_TITLE" />
          </DialogTitle>
          <DialogContent>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.NAME" />
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  defaultValue={dataUser.full_name}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.EMAIL" />
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  defaultValue={dataUser.email}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.DELIVERY_CONTRACT" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  options={contractVendor}
                  value={picDeliveryData}
                  isMulti
                  placeholder={intl.formatMessage({
                    id:
                      "TITLE.USER_MANAGEMENT.PIC_ROLES.MULTI_SELECT.PLACEHOLDER",
                  })}
                  onChange={handleDelivery}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.INVOICE_CONTRACT" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  options={contractVendor}
                  value={picInvoiceData}
                  isMulti
                  placeholder={intl.formatMessage({
                    id:
                      "TITLE.USER_MANAGEMENT.PIC_ROLES.MULTI_SELECT.PLACEHOLDER",
                  })}
                  onChange={handleInvoice}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setDialogState(false)}
              disabled={loading}
            >
              <span>
                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
              </span>
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              <span>
                <FormattedMessage id="TITLE.UPDATE" />
              </span>
              {loading && (
                <span
                  className="spinner-border spinner-border-sm ml-1"
                  aria-hidden="true"
                ></span>
              )}
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
            hecto={7}
          >
            {data.data.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>
                    {index +
                      1 +
                      Number(
                        new URLSearchParams(paramsTable).get("numberColum")
                      )}
                  </TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <a href="#" onClick={(e) => handleClick(e, index)}>
                      {item.full_name}
                    </a>
                  </TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell
                    style={{ maxWidth: "225px" }}
                    className="text-truncate"
                  >
                    {item.pic_vendor}
                  </TableCell>
                </TableRow>
              );
            })}
          </Tables>

          <TableOnly
            dataHeader={headerTableSecond}
            loading={loadingSecond}
            hecto={7}
            ref={picTableRef}
          >
            {dataSecond.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.vendor_name}</TableCell>
                  <TableCell>
                    {!item.active && (
                      <span className="text-danger">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.NONACTIVE" />
                      </span>
                    )}
                    {item.active && (
                      <span className="text-success">
                        <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.ACTIVE" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button className="btn" onClick={() => handleModal(index)}>
                      <i className="fas fa-edit text-primary pointer"></i>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableOnly>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(PicRoles));
