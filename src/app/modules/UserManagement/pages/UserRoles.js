import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import useToast from "../../../components/toast";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Checkbox,
  FormControlLabel,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  getBuyers,
  getRoles,
  assignBuyers,
} from "../_redux/UserManagementCrud";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import StyledSelect from "../../../components/select-multiple";
import {
  MAIN_ROLES_AUTHORITY,
  UNIT_ROLES_AUTHORITY,
} from "../../../../redux/BaseHost";
import Tables from "../../../components/tableCustomV1/table";

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

function UserRoles(props) {
  const { intl } = props;
  const [Toast, setToast] = useToast();
  const [dialogState, setDialogState] = useState(false);
  const [isMainPlant, setIsMainPlant] = useState(false);
  const [mainRoles, setMainRoles] = useState([]);
  const [unitRoles, setUnitRoles] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState({});
  const [err, setErr] = useState(false);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [paramsTable, setParamsTable] = useState("");

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
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.USER_ROLES.CODE",
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
        id: "TITLE.USER_MANAGEMENT.USER_ROLES.NAME",
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
        id: "TITLE.USER_MANAGEMENT.USER_ROLES.PLANT",
      }),
      name: "plant",
      order: {
        active: false,
        status: false,
      },
      filter: {
        active: true,
        type: "text",
      },
    },
    {
      title: intl.formatMessage({
        id: "TITLE.USER_MANAGEMENT.USER_ROLES.ROLE",
      }),
      name: "role",
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

  const getRolesData = useCallback(() => {
    try {
      getRoles(MAIN_ROLES_AUTHORITY).then((response) => {
        setMainRoles(response.data.data);
      });
      getRoles(UNIT_ROLES_AUTHORITY).then((response) => {
        setUnitRoles(response.data.data);
      });
    } catch {
      setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
    }
  }, [intl, setToast]);

  useEffect(getRolesData, []);

  const handleModal = (index) => {
    setDataUser(data.data[index]);
    setRolesData(data.data[index].roles_data);
    setDialogState(true);
    setIsMainPlant(
      data.data[index].plant_data.some(
        (item) => item.plant_id === "f7fa30ab-1c4e-472f-a0d0-45b0a9b3fc69"
      )
    );
  };

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      setRolesData([...rolesData, e.target.value]);
    } else {
      setRolesData(
        rolesData.filter(function(row) {
          return row !== e.target.value;
        })
      );
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    var data = {
      data: rolesData,
      buyer_id: dataUser.buyer_id,
      user_id: user_id,
    };
    assignBuyers(data)
      .then((response) => {
        getBuyers(paramsTable).then((result) => {
          setLoading(false);
          setData({
            ...data,
            data: result.data.data,
          });
          setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
          setDialogState(false);
        });
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
    getBuyers(params)
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
            <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.MODAL.MODAL_TITLE" />
          </DialogTitle>
          <DialogContent>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.CODE" />
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  disabled
                  className="form-control"
                  defaultValue={dataUser.code}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.NAME" />
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
                <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.PLANT" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  isDisabled={true}
                  value={dataUser.plant_data}
                  isMulti
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.PURCH_GROUP" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  isDisabled={true}
                  value={dataUser.purch_group_data}
                  isMulti
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.EPROC_ROLE" />
              </label>
              <div className="col-sm-9">
                <StyledSelect
                  isDisabled={true}
                  value={dataUser.eproc_roles_data}
                  isMulti
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="static_1" className="col-sm-3 col-form-label">
                <FormattedMessage id="TITLE.USER_MANAGEMENT.USER_ROLES.ROLE" />
              </label>
              <div className="col-sm-9">
                {isMainPlant &&
                  mainRoles.map((item, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="col-sm-12 mb-0"
                        control={
                          <Checkbox
                            checked={rolesData?.includes(item.id)}
                            value={item.id}
                            color="secondary"
                            onChange={handleCheckbox}
                            className="py-1"
                          />
                        }
                        label={item.name}
                      />
                    );
                  })}
                {!isMainPlant &&
                  unitRoles.map((item, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="col-sm-12 mb-0"
                        control={
                          <Checkbox
                            checked={rolesData?.includes(item.id)}
                            value={item.id}
                            color="secondary"
                            onChange={handleCheckbox}
                            className="py-1"
                          />
                        }
                        label={item.name}
                      />
                    );
                  })}
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
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.plant}</TableCell>
                  <TableCell>{item.role_name}</TableCell>
                  <TableCell>
                    <button className="btn" onClick={() => handleModal(index)}>
                      <i className="fas fa-edit text-primary pointer"></i>
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

export default injectIntl(connect(null, null)(UserRoles));
