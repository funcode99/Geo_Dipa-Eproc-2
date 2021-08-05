import React, {
  useState,
  useEffect,
  // useCallback
} from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { Select, MenuItem } from "@material-ui/core";
import ApexCharts from "apexcharts";
import { Dropdown, Form, Row, Col } from "react-bootstrap";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Dashboard(props) {
  const [range, setRange] = useState("Harian");
  const [err, setErr] = useState(false);
  const [dialogSync, setDialogSync] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [errLoadingSync, setErrLoadingSync] = useState(false);
  const [statusSync, setStatusSync] = useState(false);
  const [errSync, setErrSync] = useState({ status: false, message: "" });

  useEffect(() => {
    var options = {
      chart: {
        type: "donut",
      },
      series: [44, 55, 13, 43, 22],
      responsive: [
        {
          //   breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
    if (document.querySelector("#chart")) {
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    }
  }, []);

  const handleAsyncSpt = (e) => {
    e.preventDefault();
  };
  return (
    <React.Fragment>
      <Dialog
        open={dialogSync}
        keepMounted
        maxWidth={"sm"}
        fullWidth={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="TITLE.RANGE_BY_DATE" />
        </DialogTitle>
        <Form id="asyncData" onSubmit={handleAsyncSpt}>
          <DialogContent>
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Form.Label column md="4">
                    <FormattedMessage id="TITLE.START_DATE" />
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="date"
                      name="startDate"
                      disabled={loadingSync}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column md="4">
                    <FormattedMessage id="TITLE.END_DATE" />
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="date"
                      name="endDate"
                      disabled={loadingSync}
                      max={new Date().toISOString().split("T")[0]}
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
                  <i class="fas fa-check p-0 mr-2"></i>
                  <FormattedMessage id="TITLE.SAVE" />
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
                setDialogSync(false);
                document.getElementById("asyncData").reset();
              }}
            >
              <FormattedMessage id="TITLE.CANCEL" />
            </button>
          </DialogActions>
        </Form>
      </Dialog>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between">
            <h6>Overview</h6>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {range}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setRange("Harian");
                  }}
                >
                  Harian
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("Bulanan");
                  }}
                >
                  Bulanan
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("Tahunan");
                  }}
                >
                  Tahunan
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("Pusat");
                  }}
                >
                  Pusat
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("Dieng");
                  }}
                >
                  Dieng
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("Patuha");
                  }}
                >
                  Patuha
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("PMU");
                  }}
                >
                  PMU
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRange("EMU");
                  }}
                >
                  EMU
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setDialogSync(true);
                  }}
            >
                  By Date
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="row my-4">
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          Total Invoice
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          New Invoice
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          Active Invoice
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          Paid Invoice
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          Out Of SLA Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          Out Of SLA
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span className="symbol-label bg-primary rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-file-invoice-dollar fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h6 className="m-0 text-primary">Rp</h6>
                        <h3 className="m-0 text-primary">290.000.000</h3>
                      </div>
                      <div className="text-center font-size-xs">
                        <span className="font-weight-bold text-secondary">
                          SLA Avarage
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-8 p-1">
              <Card className="border">
                <CardBody className="p-1">
                  <div className={`card card-custom card-stretch`}>
                    {/* Head */}
                    <div className="card-header border-0 pt-5">
                      <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                          Invoice Milestone
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
                              <th
                                className="p-0"
                                style={{ minWidth: "150px" }}
                              />
                              <th
                                className="p-0"
                                style={{ minWidth: "200px" }}
                              />
                              <th
                                className="p-0"
                                style={{ minWidth: "225px" }}
                              />
                              <th
                                className="p-0"
                                style={{ minWidth: "150px" }}
                              />
                              <th
                                className="p-0"
                                style={{ minWidth: "150px" }}
                              />
                              <th
                                className="p-0"
                                style={{ minWidth: "150px" }}
                              />
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="pl-0 py-4">
                                {/* <div className="symbol symbol-50 symbol-light mr-1">
                                  <span className="symbol-label">
                                    <h1 className="h-50 align-self-center">
                                      P
                                    </h1>
                                  </span>
                                </div> */}
                                PT ABC
                              </td>
                              <td className="pl-0">
                                <span className="">PST-GA Manager</span>
                              </td>
                              <td className="text-left">
                                <span
                                  className=""
                                  onClick={() => {
                                    // setPoService(true);
                                  }}
                                >
                                  Document Softcopy Keluar
                                </span>
                              </td>
                              <td className="text-left pr-0">
                                <span
                                  className=""
                                  onClick={() => {
                                    // stateErrSync("service");
                                    // setPoAsync(true);
                                  }}
                                >
                                  Pembayaran
                                </span>
                              </td>
                              <td className="text-left pr-0">
                                <span
                                  className=""
                                  onClick={() => {
                                    // stateErrSync("service");
                                    // setPoAsync(true);
                                  }}
                                >
                                  20 Hari
                                </span>
                              </td>
                              <td className="text-left pr-0">
                                <span
                                  className="btn btn-light btn-sm text-primary"
                                  onClick={() => {
                                    // stateErrSync("service");
                                    // setPoAsync(true);
                                  }}
                                >
                                  Send Reminder
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-md-4 p-1">
              <div id="chart"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(Dashboard));
