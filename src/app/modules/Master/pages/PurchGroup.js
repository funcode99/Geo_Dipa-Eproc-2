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
import { getListPurchGroup, updatePurchGroup } from "../service/MasterCrud";
import useToast from "../../../components/toast";
import ButtonAction from "../../../components/buttonAction/ButtonAction";
import { useHistory, useParams, Link } from "react-router-dom";
import Tables from "../../../components/tableCustomV1/table";

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
const PurchGroup = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [filterTable, setFilterTable] = useState({});
  const [nameStateFilter, setNameStateFilter] = useState("");
  const [filterData] = useState([
    {
      title: intl.formatMessage({
        id: "TITLE.NAME",
      }),
      name: "name",
      type: "text",
    },
  ]);
  const [sortData, setSortData] = useState({
    name: "name",
    order: true,
  });
  const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [Toast, setToast] = useToast();
  const [err, setErr] = useState(false);
  const [paginations, setPaginations] = useState({
    numberColum: 0,
    page: 0,
    count: 0,
    rowsPerPage: 10,
  });
  const history = useHistory();
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const [dialogState, setDialogState] = useState({
    status: false,
    data: null,
  });
  const [onSubmit, setOnSubmit] = useState(false);
  const [statusSubmit, setStatusSubmit] = useState(false);
  const [errOnSubmit, setErrOnSubmit] = useState(false);
  const [paramsTable, setParamsTable] = useState("");
  const headerTable = [
    {
      title: intl.formatMessage({ id: "TITLE.TABLE_HEADER.NO" }),
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
        id: "TITLE.NAME",
      }),
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
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.USER_ROLES.CODE",
      }),
      name: "code",
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
        id: "TITLE.MAIL_CODE",
      }),
      name: "mail_code",
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
      title: intl.formatMessage({ id: "TITLE.FROM_DATE" }),
      name: "from_date",
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
      title: intl.formatMessage({ id: "TITLE.THRU_DATE" }),
      name: "thru_date",
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
      title: intl.formatMessage({ id: "TITLE.EMAIL" }),
      name: "email",
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

  const handleAction = (type, data) => {
    setDialogState({
      ...dialogState,
      status: true,
      data: Object.assign({}, data),
    });
  };

  const sendUpdate = () => {
    setOnSubmit(true);
    setErrOnSubmit(false);
    var data = {
      email: dialogState.data.email,
      updated_by_id: user_id,
      mail_code: dialogState.data.mail_code,
    };
    updatePurchGroup(dialogState.data.id, data)
      .then((result) => {
        setStatusSubmit(true);
        setTimeout(() => {
          let dataEdit_ = Object.assign({}, dialogState);
          dataEdit_.status = false;
          setDialogState({ ...dataEdit_ });
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

  const requestApi = (params) => {
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    setParamsTable(params);
    getListPurchGroup(params)
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
    getListPurchGroup(paramsTable)
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
        open={dialogState.status}
        keepMounted
        maxWidth={"sm"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Edit <FormattedMessage id="TITLE.PURCHASE_GROUPS" />
        </DialogTitle>
        <DialogContent>
          <div className="form-group row">
            <label htmlFor="static_1" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.NAME" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                disabled
                className="form-control"
                id="static_1"
                value={dialogState.data?.full_name || ""}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_2" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.CODE" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                disabled
                className="form-control"
                id="static_2"
                value={dialogState.data?.code || ""}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_3" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.FROM_DATE" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                disabled
                className="form-control"
                id="static_3"
                value={dialogState.data?.from_date || ""}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_4" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.THRU_DATE" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                disabled
                className="form-control"
                id="static_4"
                value={dialogState.data?.thru_date || ""}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_5" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.EMAIL" />
            </label>
            <div className="col-sm-7">
              <input
                type="email"
                className="form-control"
                id="static_5"
                disabled={onSubmit}
                value={dialogState.data?.email || ""}
                onChange={(e) => {
                  let dataEdit_ = Object.assign({}, dialogState);
                  dataEdit_.data.email = e.target.value;
                  setDialogState({ ...dataEdit_ });
                }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="static_6" className="col-sm-5 col-form-label">
              <FormattedMessage id="TITLE.MAIL_CODE" />
            </label>
            <div className="col-sm-7">
              <input
                type="text"
                className="form-control"
                id="static_6"
                disabled={onSubmit}
                value={dialogState.data?.mail_code || ""}
                onChange={(e) => {
                  let dataEdit_ = Object.assign({}, dialogState);
                  dataEdit_.data.mail_code = e.target.value;
                  setDialogState({ ...dataEdit_ });
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
              let dataEdit_ = Object.assign({}, dialogState);
              dataEdit_.status = false;
              setDialogState({ ...dataEdit_ });
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
            Master <FormattedMessage id="TITLE.PURCHASE_GROUPS" />
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
            hecto={8}
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
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.mail_code}</TableCell>
                  <TableCell>
                    {item.from_date
                      ? window
                          .moment(new Date(item.from_date))
                          .format("DD MMM YYYY")
                      : null}
                  </TableCell>
                  <TableCell>
                    {item.thru_date
                      ? window
                          .moment(new Date(item.thru_date))
                          .format("DD MMM YYYY")
                      : null}
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
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

export default injectIntl(connect(null, null)(PurchGroup));
