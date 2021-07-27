import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  makeStyles,
} from "@material-ui/core";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "./style";
import {
  asyncService,
  asyncSchedule,
  asyncItem,
  asyncHistory,
} from "../service/MasterCrud";
import useToast from "../../../components/toast";
import { Form, Row, Col } from "react-bootstrap";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const AsyncData = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [poService, setPoService] = useState(false);
  const [poSchedule, setPoSchedule] = useState(false);
  const [poItem, setPoItem] = useState(false);
  const [poHistory, setPoHistory] = useState(false);
  const [poAsync, setPoAsync] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [errLoadingSync, setErrLoadingSync] = useState(false);
  const [statusSync, setStatusSync] = useState(false);
  const [errSync, setErrSync] = useState({ status: false, message: "" });
  const [stateSync, stateErrSync] = useState("");

  const handleAsync = (e) => {
    e.preventDefault();
    let errSyncs_ = Object.assign({}, errSync);
    errSyncs_.status = false;
    setErrSync({
      ...errSyncs_,
    });
    setLoadingSync(true);
    setErrLoadingSync(false);
    setStatusSync(true);
    const data = new FormData(e.target);
    let numberPo = data.get("numberPo");
    if (stateSync === "service") {
      asyncService(numberPo)
        .then(async (result) => {
          setStatusSync(false);
          setTimeout(() => {
            setLoadingSync(false);
          }, 2000);
        })
        .catch(async (err) => {
          let errSyncs = Object.assign({}, errSync);
          if (err.response?.data.message === "Number Purch Order Invalid.") {
            errSyncs.status = true;
            errSyncs.message = err.response?.data.message;
            setErrSync({
              ...errSyncs,
            });
          } else {
            setErrLoadingSync(true);
          }
          setStatusSync(false);
          setLoadingSync(false);
        });
    } else if (stateSync === "schedule") {
      asyncSchedule(numberPo)
        .then(async (result) => {
          setStatusSync(false);
          setTimeout(() => {
            setLoadingSync(false);
          }, 2000);
        })
        .catch(async (err) => {
          let errSyncs = Object.assign({}, errSync);
          if (err.response?.data.message === "Number Purch Order Invalid.") {
            errSyncs.status = true;
            errSyncs.message = err.response?.data.message;
            setErrSync({
              ...errSyncs,
            });
          } else {
            setErrLoadingSync(true);
          }
          setStatusSync(false);
          setLoadingSync(false);
        });
    } else if (stateSync === "item") {
      asyncItem(numberPo)
        .then(async (result) => {
          setStatusSync(false);
          setTimeout(() => {
            setLoadingSync(false);
          }, 2000);
        })
        .catch(async (err) => {
          let errSyncs = Object.assign({}, errSync);
          if (err.response?.data.message === "Number Purch Order Invalid.") {
            errSyncs.status = true;
            errSyncs.message = err.response?.data.message;
            setErrSync({
              ...errSyncs,
            });
          } else {
            setErrLoadingSync(true);
          }
          setStatusSync(false);
          setLoadingSync(false);
        });
    } else if (stateSync === "history") {
      asyncHistory(numberPo)
        .then(async (result) => {
          setStatusSync(false);
          setTimeout(() => {
            setLoadingSync(false);
          }, 2000);
        })
        .catch(async (err) => {
          let errSyncs = Object.assign({}, errSync);
          if (err.response?.data.message === "Tidak memiliki History") {
            errSyncs.status = true;
            errSyncs.message = err.response?.data.message;
            setErrSync({
              ...errSyncs,
            });
          } else {
            setErrLoadingSync(true);
          }
          setStatusSync(false);
          setLoadingSync(false);
        });
    }
  };

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={poItem}
        keepMounted
        maxWidth={"xs"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.FEATURES" />
        </DialogTitle>
        <DialogContent>
          <div>
            <ul>
              <li>
                Melakukan Sinkronisasi Data berdasarkan nomor Purch Order SAP.
              </li>
              <li>Menambahkan Item PO berdasarkan data SAP.</li>
              <li>
                Melakukan penyamaan data dengan data SAP.
                <ul>
                  <li>Penyamaan data QUANTITY mengikuti data SAP.</li>
                  <li>Penyamaan data SHORT_TEXT mengikuti data SAP.</li>
                  <li>Penyamaan data NET_PRICE mengikuti data SAP.</li>
                </ul>
              </li>
              <li>Menjalankan Async PO Schedules.</li>
              <li>Menjalankan Async PO Service.</li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setPoItem(false);
            }}
          >
            <FormattedMessage id="TITLE.UNDERSTAND" />
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={poService}
        keepMounted
        maxWidth={"xs"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.FEATURES" />
        </DialogTitle>
        <DialogContent>
          <div>
            <ul>
              <li>
                Melakukan Sinkronisasi Data berdasarkan nomor Purch Order SAP.
              </li>
              <li>Menambahkan Item Sevice berdasarkan data SAP.</li>
              <li>
                Melakukan penyamaan data dengan data SAP.
                <ul>
                  <li>Penyamaan data PCKG_NO mengikuti data SAP.</li>
                  <li>Penyamaan data EXT_LINE mengikuti data SAP.</li>
                  <li>Penyamaan data SHORT_TEXT mengikuti data SAP.</li>
                  <li>Penyamaan data ACTUAL_QTY mengikuti data SAP.</li>
                  <li>Penyamaan data BASE_UOM mengikuti data SAP.</li>
                  <li>Penyamaan data GR_PRICE mengikuti data SAP.</li>
                </ul>
              </li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setPoService(false);
            }}
          >
            <FormattedMessage id="TITLE.UNDERSTAND" />
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={poSchedule}
        keepMounted
        maxWidth={"xs"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.FEATURES" />
        </DialogTitle>
        <DialogContent>
          <div>
            <ul>
              <li>
                Melakukan Sinkronisasi Data berdasarkan nomor Purch Order SAP.
              </li>
              <li>
                Menambahkan Item Schedules berdasarkan data SAP dimana data
                tersebut belum ada di database Eproc.
              </li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setPoSchedule(false);
            }}
          >
            <FormattedMessage id="TITLE.UNDERSTAND" />
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={poHistory}
        keepMounted
        maxWidth={"xs"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.FEATURES" />
        </DialogTitle>
        <DialogContent>
          <div>
            <ul>
              <li>
                Melakukan Sinkronisasi Data berdasarkan nomor Purch Order SAP.
              </li>
              <li>
                Menambahkan Item History berdasarkan data SAP dimana data
                tersebut belum ada di database Eproc.
              </li>
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setPoHistory(false);
            }}
          >
            <FormattedMessage id="TITLE.UNDERSTAND" />
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={poAsync}
        keepMounted
        maxWidth={"sm"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.SYNCHRONIZE" />
        </DialogTitle>
        <Form id="asyncData" onSubmit={handleAsync}>
          <DialogContent>
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Form.Label column md="4">
                    <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.PO_NUMBER" />
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="number"
                      name="numberPo"
                      disabled={loadingSync}
                    />
                  </Col>
                </Form.Group>
                {errLoadingSync && !loadingSync && (
                  <div>
                    <p
                      className="text-danger font-italic"
                      style={{ fontSize: 11 }}
                    >
                      Error: <FormattedMessage id="TITLE.ERROR_REQUEST" />
                    </p>
                  </div>
                )}
                {errSync.status && (
                  <Form.Group as={Row}>
                    <Form.Label column md="12" className="text-danger">
                      <FormattedMessage id="TITLE.INFORMATION_OR_NOTE" />
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control
                        as="textarea"
                        disabled={true}
                        rows={8}
                        value={errSync.message}
                        onChange={(e) => {}}
                      />
                    </Col>
                  </Form.Group>
                )}
              </Col>
            </Row>
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-sm btn-primary"
              type="submit"
              disabled={loadingSync}
            >
              {!statusSync && !loadingSync && (
                <>
                  <i className="fas fa-sync-alt p-0 mr-2"></i>
                  <FormattedMessage id="TITLE.START_SYNC" />
                </>
              )}
              {statusSync && loadingSync && (
                <>
                  <i className="fas fa-sync-alt fa-spin p-0 mr-2"></i>
                  <FormattedMessage id="TITLE.WAITING" />
                </>
              )}
              {!statusSync && loadingSync && (
                <>
                  <i className="fas fa-check p-0 mr-2"></i>
                  <FormattedMessage id="TITLE.DONE_DATA_SYNC" />
                </>
              )}
            </button>
            <button
              className="btn btn-sm btn-danger"
              type="button"
              disabled={loadingSync}
              onClick={() => {
                let errSyncs = Object.assign({}, errSync);
                errSyncs.status = false;
                setErrSync({
                  ...errSyncs,
                });
                setPoAsync(false);
                document.getElementById("asyncData").reset();
              }}
            >
              <FormattedMessage id="TITLE.CANCEL" />
            </button>
          </DialogActions>
        </Form>
      </Dialog>
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            <FormattedMessage id="TITLE.SYNCHRONIZE_DATA" />
          </h2>
        </div>
      </div>
      <div className={`card card-custom card-stretch gutter-b mt-5`}>
        {/* Head */}
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Data
            </span>
            <span className="text-muted mt-3 font-weight-bold font-size-sm">
              <FormattedMessage id="TITLE.FEATURES_SYNCHRONIZE_DATA" />
            </span>
          </h3>
          <div className="card-toolbar"></div>
        </div>
        {/* Body */}
        <div className="card-body pt-3 pb-0">
          <div className="table-responsive">
            <table className="table table-borderless table-vertical-center">
              <thead>
                <tr>
                  <th className="p-0" style={{ width: "50px" }} />
                  <th className="p-0" style={{ minWidth: "200px" }} />
                  <th className="p-0" style={{ minWidth: "225px" }} />
                  <th className="p-0" style={{ minWidth: "150px" }} />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pl-0 py-4">
                    <div className="symbol symbol-50 symbol-light mr-1">
                      <span className="symbol-label">
                        <h1 className="h-50 align-self-center">P</h1>
                      </span>
                    </div>
                  </td>
                  <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg user-select-none">
                      <FormattedMessage id="TITLE.PO_SERVICES" />
                    </span>
                    <div>
                      <span className="font-weight-bolder text-muted font-size-xs">
                        <FormattedMessage id="TITLE.SPAN_PO_ASYNC" />
                      </span>
                    </div>
                  </td>
                  <td className="text-left">
                    <span
                      className="btn btn-light btn-sm text-warning"
                      onClick={() => {
                        setPoService(true);
                      }}
                    >
                      <i className="fas fa-info-circle text-warning"></i>
                      <FormattedMessage id="TITLE.FEATURES" />
                    </span>
                  </td>
                  <td className="text-left pr-0">
                    <span
                      className="btn btn-light btn-sm text-primary"
                      onClick={() => {
                        stateErrSync("service");
                        setPoAsync(true);
                      }}
                    >
                      <i className="fas fa-sync text-primary"></i>
                      <FormattedMessage id="TITLE.SYNCHRONIZE_DATA" />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="pl-0 py-4">
                    <div className="symbol symbol-50 symbol-light mr-1">
                      <span className="symbol-label">
                        <h1 className="h-50 align-self-center">P</h1>
                      </span>
                    </div>
                  </td>
                  <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg user-select-none">
                      <FormattedMessage id="TITLE.PO_SCHEDULES" />
                    </span>
                    <div>
                      <span className="font-weight-bolder text-muted font-size-xs">
                        <FormattedMessage id="TITLE.SPAN_PO_ASYNC" />
                      </span>
                    </div>
                  </td>
                  <td className="text-left">
                    <span
                      className="btn btn-light btn-sm text-warning"
                      onClick={() => {
                        setPoSchedule(true);
                      }}
                    >
                      <i className="fas fa-info-circle text-warning"></i>
                      <FormattedMessage id="TITLE.FEATURES" />
                    </span>
                  </td>
                  <td className="text-left pr-0">
                    <span
                      className="btn btn-light btn-sm text-primary"
                      onClick={() => {
                        stateErrSync("schedule");
                        setPoAsync(true);
                      }}
                    >
                      <i className="fas fa-sync text-primary"></i>
                      <FormattedMessage id="TITLE.SYNCHRONIZE_DATA" />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="pl-0 py-4">
                    <div className="symbol symbol-50 symbol-light mr-1">
                      <span className="symbol-label">
                        <h1 className="h-50 align-self-center">P</h1>
                      </span>
                    </div>
                  </td>
                  <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg user-select-none">
                      <FormattedMessage id="TITLE.PO_ITEM" />
                    </span>
                    <div>
                      <span className="font-weight-bolder text-muted font-size-xs">
                        <FormattedMessage id="TITLE.SPAN_PO_ASYNC" />
                      </span>
                    </div>
                  </td>
                  <td className="text-left">
                    <span
                      className="btn btn-light btn-sm text-warning"
                      onClick={() => {
                        setPoItem(true);
                      }}
                    >
                      <i className="fas fa-info-circle text-warning"></i>
                      <FormattedMessage id="TITLE.FEATURES" />
                    </span>
                  </td>
                  <td className="text-left pr-0">
                    <span
                      className="btn btn-light btn-sm text-primary"
                      onClick={() => {
                        stateErrSync("item");
                        setPoAsync(true);
                      }}
                    >
                      <i className="fas fa-sync text-primary"></i>
                      <FormattedMessage id="TITLE.SYNCHRONIZE_DATA" />
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="pl-0 py-4">
                    <div className="symbol symbol-50 symbol-light mr-1">
                      <span className="symbol-label">
                        <h1 className="h-50 align-self-center">P</h1>
                      </span>
                    </div>
                  </td>
                  <td className="pl-0">
                    <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg user-select-none">
                      <FormattedMessage id="TITLE.PO_HISTORY" />
                    </span>
                    <div>
                      <span className="font-weight-bolder text-muted font-size-xs">
                        <FormattedMessage id="TITLE.SPAN_PO_ASYNC" />
                      </span>
                    </div>
                  </td>
                  <td className="text-left">
                    <span
                      className="btn btn-light btn-sm text-warning"
                      onClick={() => {
                        setPoHistory(true);
                      }}
                    >
                      <i className="fas fa-info-circle text-warning"></i>
                      <FormattedMessage id="TITLE.FEATURES" />
                    </span>
                  </td>
                  <td className="text-left pr-0">
                    <span
                      className="btn btn-light btn-sm text-primary"
                      onClick={() => {
                        stateErrSync("history");
                        setPoAsync(true);
                      }}
                    >
                      <i className="fas fa-sync text-primary"></i>
                      <FormattedMessage id="TITLE.SYNCHRONIZE_DATA" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(AsyncData));
