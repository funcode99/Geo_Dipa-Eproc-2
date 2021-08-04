import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  makeStyles,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "./style";
import { getInvoiceAuthority, updateInvoiceAuthority } from "../service/MasterCrud";
import useToast from "../../../components/toast";
import ButtonAction from "../../../components/buttonAction/ButtonAction";
import Tables from "../../../components/tableCustomV1/table";
import { rupiah } from "../../../libs/currency";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const data_ops = [
  {
    label: "TITLE.EDIT",
    icon: "fas fa-edit text-success",
    type: "edit",
  },
];

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const InvoiceAuthority = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [dialogState, setDialogState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [paramsTable, setParamsTable] = useState("");
  const [Toast, setToast] = useToast();
  const [err, setErr] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [onSubmit, setOnSubmit] = useState(false);
  const [statusSubmit, setStatusSubmit] = useState(false);
  const [errOnSubmit, setErrOnSubmit] = useState(false);

  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  const headerTable = [
    {
      title: intl.formatMessage({ id: "TITLE.TABLE_HEADER.NO" }),
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
      title: intl.formatMessage({ id: "TITLE.AUTHORITY" }),
      name: "name",
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
      title: intl.formatMessage({ id: "TITLE.MASTER_DATA.ROLES.TABLE_HEADER.MIN" }),
      name: "min_value",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: false,
        type: "number",
      },
    },
    {
      title: intl.formatMessage({ id: "TITLE.MASTER_DATA.ROLES.TABLE_HEADER.MAX" }),
      name: "max_value",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: false,
        type: "number",
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
    console.log(params)
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    setParamsTable(params);
    getInvoiceAuthority(params)
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

  const callApi = () => {
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    getInvoiceAuthority(paramsTable)
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

  const sendUpdate = () => {
    setOnSubmit(true);
    setErrOnSubmit(false);
    var data = {
      id: dataEdit.id,
      min_value: dataEdit.min_value,
      max_value: dataEdit.max_value,
      user_id: user_id,
    };
    updateInvoiceAuthority(data)
      .then((result) => {
        setStatusSubmit(true);
        setTimeout(() => {
          setDialogState(false);
          setOnSubmit(false);
          setStatusSubmit(false);
          callApi();
        }, 2000);
      })
      .catch((err) => {
        setOnSubmit(false);
        setErrOnSubmit(true);
      });
  };

  const handleAction = (type, data) => {
    setDataEdit(data);
    setDialogState(true);
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
        <DialogTitle id="alert-dialog-title">
          Edit <FormattedMessage id="MENU.MASTER_DATA.INVOICE_AUTHORITY" />
        </DialogTitle>
        <DialogContent>
          <div className="form-group row">
            <label htmlFor="static_1" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.AUTHORITY" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                disabled
                className="form-control"
                id="static_1"
                value={dataEdit?.name || ""}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_2" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.MIN" />
            </label>
            <div className="col-sm-7">
              <input
                type="number"
                min="0"
                className="form-control"
                id="static_2"
                disabled={onSubmit}
                value={dataEdit?.min_value || 0}
                onChange={(e) => {
                  let dataEdit_ = Object.assign({}, dataEdit);
                  var s = e.target.value.replace(/[^.\d]/g, "");
                  while (s.charAt(0) === "0") {
                    s = s.substring(1);
                  }
                  dataEdit_.min_value = s;
                  setDataEdit({ ...dataEdit_ });
                }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_2" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.MASTER_DATA.ROLES.TABLE_HEADER.MAX" />
            </label>
            <div className="col-sm-7">
              <input
                type="number"
                min="0"
                className="form-control"
                id="static_2"
                disabled={onSubmit}
                value={dataEdit?.max_value || 0}
                onChange={(e) => {
                  let dataEdit_ = Object.assign({}, dataEdit);
                  var s = e.target.value.replace(/[^.\d]/g, "");
                  while (s.charAt(0) === "0") {
                    s = s.substring(1);
                  }
                  dataEdit_.max_value = s;
                  setDataEdit({ ...dataEdit_ });
                }}
              />
            </div>
          </div>
          {errOnSubmit && !onSubmit && (
            <div>
              <p className="text-danger font-italic" style={{ fontSize: 11 }}>
                Error: <FormattedMessage id="REQ.UPDATE_FAILED" />
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={onSubmit}
            className={`btn btn-primary font-weight-bold btn-sm`}
            onClick={() => {
              sendUpdate();
            }}
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
          <button
            onClick={() => {
              setDialogState(false);
            }}
            disabled={onSubmit}
            className="btn btn-sm btn-danger"
          >
            <FormattedMessage id="TITLE.CANCEL" />
          </button>
        </DialogActions>
      </Dialog>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Master <FormattedMessage id="MENU.MASTER_DATA.INVOICE_AUTHORITY" />
          </h2>
        </div>
      </div>
      <Card className={classes.paper}>
        <CardBody>
          <Tables
            dataHeader={headerTable}
            handleParams={requestApi}
            loading={loading}
            err={err}
            countData={data.count}
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

                  <TableCell>{item.name}</TableCell>
                  <TableCell>{rupiah(item.min_value)}</TableCell>
                  <TableCell>{rupiah(item.max_value)}</TableCell>
                  <TableCell>
                    <ButtonAction
                      data={item}
                      handleAction={handleAction}
                      ops={data_ops}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(InvoiceAuthority));
