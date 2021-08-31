import React, { useState, useLayoutEffect } from "react";
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
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "./style";
import {
  getListTax,
  createGroupTax,
  editGroupTax,
} from "../service/MasterCrud";
import useToast from "../../../components/toast";
import ButtonAction from "../../../components/buttonAction/ButtonAction";
import { Link } from "react-router-dom";
import Tables from "../../../components/tableCustomV1/table";
import { useSubheader } from "../../../../_metronic/layout";

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
const Tax = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [Toast, setToast] = useToast();
  const [err, setErr] = useState(false);

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
        id: "TITLE.TYPE_TAX",
      }),
      name: "type_tax",
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
      title: intl.formatMessage({ id: "TITLE.GROUP_TAX" }),
      name: "group_tax",
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
        id: "TITLE.UPDATED_DATE",
      }),
      name: "date",
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
      title: intl.formatMessage({ id: "TITLE.UPDATE_BY" }),
      name: "update",
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
  const suhbeader = useSubheader();

  useLayoutEffect(() => {
    suhbeader.setBreadcrumbs([
      {
        pathname: `/client/master/tax`,
        title: "Master Tax",
      },
    ]);
  }, []);

  const handleAction = (type, data) => {
    setDialogState({
      ...dialogState,
      status: true,
      data: Object.assign({}, data),
      duplicateData: false,
    });
    setErrOnSubmit(false);
  };

  const handleCreate = () => {
    setDialogState({
      ...dialogState,
      status: true,
      data: {},
      duplicateData: false,
    });
    setErrOnSubmit(false);
  };

  const sendUpdate = (e) => {
    e.preventDefault();
    setOnSubmit(true);
    setErrOnSubmit(false);
    var data = {
      type_tax: dialogState.data.type_tax,
      group_tax: dialogState.data.group_tax,
    };
    if (dialogState.data.id) {
      data.updated_by_id = user_id;
      editGroupTax(dialogState.data.id, data)
        .then((result) => {
          if (result.data.message === "Duplicate Group Name") {
            let dataEdit_ = Object.assign({}, dialogState);
            dataEdit_.duplicateData = true;
            setDialogState({ ...dataEdit_ });
            setOnSubmit(false);
            // setErrOnSubmit(true);
          } else {
            setStatusSubmit(true);
            setTimeout(() => {
              let dataEdit_ = Object.assign({}, dialogState);
              dataEdit_.status = false;
              setDialogState({ ...dataEdit_ });
              setOnSubmit(false);
              setStatusSubmit(false);
              callApi();
            }, 2000);
          }
        })
        .catch((err) => {
          setOnSubmit(false);
          setErrOnSubmit(true);
        });
    } else {
      data.created_by_id = user_id;
      createGroupTax(data)
        .then((result) => {
          if (result.data.message === "Duplicate Group Name") {
            let dataEdit_ = Object.assign({}, dialogState);
            dataEdit_.duplicateData = true;
            setDialogState({ ...dataEdit_ });
            setOnSubmit(false);
            // setErrOnSubmit(true);
          } else {
            setStatusSubmit(true);
            setTimeout(() => {
              let dataEdit_ = Object.assign({}, dialogState);
              dataEdit_.status = false;
              setDialogState({ ...dataEdit_ });
              setOnSubmit(false);
              setStatusSubmit(false);
              callApi();
            }, 2000);
          }
        })
        .catch((err) => {
          setOnSubmit(false);
          setErrOnSubmit(true);
        });
    }
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
    getListTax(params)
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
    getListTax(paramsTable)
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
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Master <FormattedMessage id="TITLE.TAX" />
          </h2>
        </div>
      </div>
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
          <FormattedMessage id="TITLE.TAX" />
        </DialogTitle>
        <form onSubmit={sendUpdate}>
          <DialogContent>
            <div className="form-group row">
              <label htmlFor="static_1" className="col-sm-5 col-form-label">
                {/* <FormattedMessage id="TITLE.NAME" /> */}
                Type Pajak
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  id="static_1"
                  value={dialogState.data?.type_tax || ""}
                  onChange={(e) => {
                    let dataEdit_ = Object.assign({}, dialogState);
                    dataEdit_.data.type_tax = e.target.value;
                    setDialogState({ ...dataEdit_ });
                  }}
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="static_2" className="col-sm-5 col-form-label">
                {/* <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.CODE" /> */}
                Group Pajak
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  id="static_2"
                  value={dialogState.data?.group_tax || ""}
                  onChange={(e) => {
                    let dataEdit_ = Object.assign({}, dialogState);
                    dataEdit_.data.group_tax = e.target.value;
                    setDialogState({ ...dataEdit_ });
                  }}
                  required
                />
              </div>
            </div>
            {dialogState.duplicateData && !onSubmit && (
              <div>
                <p className="text-danger font-italic" style={{ fontSize: 11 }}>
                  Error: Duplicate Group Pajak
                </p>
              </div>
            )}
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
        </form>
      </Dialog>
      <Card className={classes.paper}>
        <CardHeader title="">
          <CardHeaderToolbar>
            <button className="btn btn-sm btn-primary" onClick={handleCreate}>
              <FormattedMessage id="BUTTON.CREATE" />
            </button>
          </CardHeaderToolbar>
        </CardHeader>
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
                  <TableCell>
                    <Link to={`/client/master/tax/${item.id}`}>
                      {item.type_tax}
                    </Link>
                  </TableCell>
                  <TableCell>{item.group_tax}</TableCell>
                  <TableCell>
                    {item.updated_at
                      ? window
                          .moment(new Date(item.updated_at))
                          .format("DD MMM YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>{item?.fullname}</TableCell>
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

export default injectIntl(connect(null, null)(Tax));
