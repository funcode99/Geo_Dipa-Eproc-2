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
} from "../../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "../style";
import {
  getTaxItem,
  createGroupTaxItem,
  editGroupTaxItem,
} from "../../service/MasterCrud";
import useToast from "../../../../components/toast";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import { useParams } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";
import { useSubheader } from "../../../../../_metronic/layout";

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

const ItemTax = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [paramsTable, setParamsTable] = useState("");
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
  const { id } = useParams();
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
        id: "TITLE.TAX_NAME",
      }),
      name: "description",
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
      title: intl.formatMessage({ id: "TITLE.TAX_VALUE" }),
      name: "value",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "number",
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
      {
        pathname: `/client/master/tax/${id}`,
        title: data?.group_tax || "",
      },
    ]);
  }, [data]);

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
    var data_ = {
      master_tax_id: data.id,
      description: dialogState.data.description,
      value: dialogState.data.value,
    };
    if (dialogState.data.id) {
      data_.updated_by_id = user_id;
      editGroupTaxItem(dialogState.data.id, data_)
        .then((result) => {
          if (result.data.message === "Duplicate Tax Name") {
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
      data_.created_by_id = user_id;
      createGroupTaxItem(data_)
        .then((result) => {
          if (result.data.message === "Duplicate Tax Name") {
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
    setData({});
    setErr(false);
    setParamsTable(params);
    getTaxItem(id, params)
      .then((result) => {
        setLoading(false);
        setData(result.data.data);
      })
      .catch((err) => {
        setErr(true);
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  const callApi = () => {
    setLoading(true);
    setData({});
    setErr(false);
    getTaxItem(id, paramsTable)
      .then((result) => {
        setLoading(false);
        setData(result.data.data);
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
        <div className="d-flex align-items-baseline mr-5 w-75">
          <h2 className="text-dark font-weight-bold my-2 mr-5 text-truncate">
            {data?.type_tax + " - " + data?.group_tax || "-"}
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
                <FormattedMessage id="TITLE.TYPE_TAX" />
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  id="static_1"
                  disabled
                  value={data?.type_tax || ""}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="static_2" className="col-sm-5 col-form-label">
                <FormattedMessage id="TITLE.GROUP_TAX" />
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  id="static_2"
                  disabled
                  value={data?.group_tax || ""}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="static_3" className="col-sm-5 col-form-label">
                <FormattedMessage id="TITLE.TAX_NAME" />
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  id="static_3"
                  value={dialogState.data?.description || ""}
                  onChange={(e) => {
                    let dataEdit_ = Object.assign({}, dialogState);
                    dataEdit_.data.description = e.target.value;
                    setDialogState({ ...dataEdit_ });
                  }}
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="static_4" className="col-sm-5 col-form-label">
                <FormattedMessage id="TITLE.TAX_VALUE" />
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  id="static_4"
                  value={dialogState.data?.value || ""}
                  onChange={(e) => {
                    let dataEdit_ = Object.assign({}, dialogState);
                    dataEdit_.data.value = e.target.value;
                    setDialogState({ ...dataEdit_ });
                  }}
                  required
                />
              </div>
            </div>
            {dialogState.duplicateData && !onSubmit && (
              <div>
                <p className="text-danger font-italic" style={{ fontSize: 11 }}>
                  Error: Duplicate Tax Name
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
            {data &&
              data.data &&
              data.data.map((item, index) => {
                return (
                  <TableRow key={index.toString()}>
                    <TableCell>
                      {index +
                        1 +
                        Number(
                          new URLSearchParams(paramsTable).get("numberColum")
                        )}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.value + "%"}</TableCell>
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

export default injectIntl(connect(null, null)(ItemTax));
