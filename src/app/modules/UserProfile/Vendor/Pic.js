/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useSelector,
  shallowEqual,
  connect,
  // useDispatch
} from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
// import SVG from "react-inlinesvg";
import { ModalProgressBar } from "../../../../_metronic/_partials/controls";
// import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import * as auth from "../../Auth";
import {
  getVendors,
  getContractByPic,
  assignPic,
  getContractVendor,
} from "./_redux/authCrud";
import { FormattedMessage, injectIntl } from "react-intl";
import { Alert } from "react-bootstrap";
import useToast from "../../../components/toast";
import TableOnly from "../../../components/tableCustomV1/tableOnly";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import StyledSelect from "../../../components/select-multiple";

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

function Pic(props) {
  // Fields
  const { intl } = props;
  const [loading, setloading] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [Toast, setToast] = useToast();
  const [alert, setAlert] = useState({
    status: false,
    message: "",
    variant: "primary",
  });
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
  const [dataUser, setDataUser] = useState({});
  const [dialogState, setDialogState] = useState(false);
  const [picId, setPicId] = useState("");
  const user = useSelector((state) => state.auth.user, shallowEqual);
  const [picInvoiceData, setPicInvoiceData] = useState([]);
  const [picDeliveryData, setPicDeliveryData] = useState([]);
  const invoice_monitoring_type = "INVOICE";
  const delivery_monitoring_type = "DELIVERY";
  const [contractVendor, setContractVendor] = useState([]);

  const callApiPic = () => {
    setLoadingSecond(true);
    getVendors(
      `filter=%7B%22filter-name%22%3A%22${user.data.vendor_full_name}%22%7D&sort=%7B%22name%22%3A%22code%22%7D&numberColum=0&page=1&count=6&rowsPerPage=100`
    )
      .then((result) => {
        setLoadingSecond(false);
        setDataSecond(result.data.data[0].pic_data);
      })
      .catch((err) => {
        setLoadingSecond(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
    getContractVendor(
      user.data.vendor_id,
      "filter=%7B%7D&sort=%7B%22name%22%3A%22contract_date%22%2C%22order%22%3Atrue%7D&numberColum=0&page=1&count=0&rowsPerPage=100"
    ).then((result) => {
      const data = result.data.data.map(function(row) {
        return { value: row.contract_id, label: row.contract_no };
      });
      setContractVendor(data);
    });
  };
  useEffect(callApiPic, []);

  const handleModal = (index) => {
    setDataUser(dataSecond[index]);
    setDialogState(true);
    setPicId(dataSecond[index].pic_id);
    getContractByPic(dataSecond[index].pic_id).then((result) => {
      setPicInvoiceData(result.data.data.invoice_data);
      setPicDeliveryData(result.data.data.delivery_data);
    });
  };

  const handleSubmit = () => {
    setloading(true);
    var data = {
      invoice_data: picInvoiceData,
      delivery_data: picDeliveryData,
      created_by_id: user.data.user_id,
      pic_id: picId,
      invoice_monitoring_type: invoice_monitoring_type,
      delivery_monitoring_type: delivery_monitoring_type,
    };
    assignPic(data)
      .then((response) => {
        setloading(false);
        setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
        setDialogState(false);
      })
      .catch((error) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        setloading(false);
      });
  };

  const handleDelivery = (e) => {
    setPicDeliveryData(e);
  };

  const handleInvoice = (e) => {
    setPicInvoiceData(e);
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
      <div className="card card-custom">
        <div className="card-header py-3">
          <div className="card-title align-items-start flex-column">
            <h3 className="card-label font-weight-bolder text-dark">
              <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.PIC" />
            </h3>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              <FormattedMessage id="TITLE.USER_MANAGEMENT.PIC_ROLES.MODAL.MODAL_TITLE" />
            </span>
          </div>
        </div>
        <div className="card-body">
          <TableOnly
            dataHeader={headerTableSecond}
            loading={loadingSecond}
            hecto={5}
          >
            {dataSecond.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.full_name}</TableCell>
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
        </div>
      </div>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, auth.actions)(Pic));
