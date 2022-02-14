import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
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
import {
  getAllPlant,
  getAllPeriod,
  getAllDataInvoiceDashboard,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";
import { useSubheader } from "../../../../../_metronic/layout";
import { Demo1Dashboard } from "../../../../../_metronic/_partials/dashboards/Demo1Dashboard";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Dashboard(props) {
  const { intl, plant_data } = props;
  const [range, setRange] = useState({
    ident_name: "day",
    name: "Harian",
  });
  const [unit, setUnit] = useState({
    plant_id: null,
    name: "Semua",
  });
  const [plant, setPlant] = useState([
    {
      plant_id: "",
      name: "Semua",
    },
  ]);
  const [period, setPeriod] = useState([]);
  const [err, setErr] = useState(false);
  const [dialogSync, setDialogSync] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [errLoadingSync, setErrLoadingSync] = useState(false);
  const [statusSync, setStatusSync] = useState(false);
  const [errSync, setErrSync] = useState({ status: false, message: "" });
  const [date, setDate] = useState({ date_start: null, date_finish: null });
  const [Toast, setToast] = useToast();
  const [dataOverview, setDataOverview] = useState({});
  const suhbeader = useSubheader();
  const [optionChart, setOptionChart] = useState({
    chart: {
      type: "donut",
    },
    series: [],
    labels: ["New Invoice", "Active Invoice", "Paid Invoice"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          size: "0%",
        },
      },
    },
  });

  useLayoutEffect(() => {
    suhbeader.setBreadcrumbs([
      {
        pathname: `/client/invoice_monitoring/dashboard`,
        title: intl.formatMessage({ id: "MENU.DASHBOARD" }),
      },
    ]);
  }, []);

  useEffect(() => {
    if (document.querySelector("#chart")) {
      const myNode = document.getElementById("chart");
      myNode.innerHTML = "";
      var chart = new ApexCharts(document.querySelector("#chart"), optionChart);
      chart.render();
    }
  }, [optionChart]);

  const callApiPlant = useCallback(() => {
    setPlant(plant_data);
    if (!!plant_data.length) {
      setUnit({
        ...unit,
        name: plant_data?.[0]?.name,
        plant_id: plant_data?.[0]?.plant_id,
      });
    }

    // getAllPlant()
    //   .then((result) => {
    //     var data = Object.assign([], plant);
    //     var data_ = data.concat(result.data.data);
    //     setPlant(data_);
    //   })
    //   .catch((err) => {
    //     setToast(
    //       intl.formatMessage({
    //         id: "REQ.REQUEST_FAILED",
    //       }),
    //       5000
    //     );
    //   });
  }, [plant_data, setPlant, setUnit]);

  const callApiPeriod = () => {
    getAllPeriod()
      .then((result) => {
        var data = result.data.data;
        setPeriod(data);
      })
      .catch((err) => {
        setToast(
          intl.formatMessage({
            id: "REQ.REQUEST_FAILED",
          }),
          5000
        );
      });
  };

  const callApidataInvoice = () => {
    console.log("unit", unit);
    getAllDataInvoiceDashboard(
      range.ident_name,
      unit.plant_id || null,
      date.date_start,
      date.date_finish
    )
      .then((result) => {
        var data = result.data.data;
        setDataOverview(data);
        var series = [];
        series.push(data.invoice_hari_ini);
        series.push(data.invoice_active);
        series.push(data.total_invoice_dibayar);
        setOptionChart({ ...optionChart, series });
      })
      .catch((err) => {
        setToast(
          intl.formatMessage({
            id: "REQ.REQUEST_FAILED",
          }),
          5000
        );
      });
  };

  useEffect(callApiPlant, []);
  useEffect(callApiPeriod, []);
  useEffect(callApidataInvoice, [range, unit, date]);

  const handleAsyncSpt = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setDate({
      ...date,
      date_start: data.get("date_start"),
      date_finish: data.get("date_finish"),
    });
    setRange({
      ...range,
      ident_name: "by_date",
      name:
        window.moment(new Date(data.get("date_start"))).format("DD MMM YYYY") +
        "-" +
        window.moment(new Date(data.get("date_finish"))).format("DD MMM YYYY"),
    });
    setDialogSync(false);
  };
  return (
    <React.Fragment>
      <Toast />
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
                      name="date_start"
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
                      name="date_finish"
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
                  <i className="fas fa-check p-0 mr-2"></i>
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
      <Demo1Dashboard />
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between mt-5">
            <h6>Overview</h6>
            <div className="d-flex">
              <Dropdown className="mx-2">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {unit.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {plant.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index.toString()}
                        onClick={() => {
                          setUnit({
                            ...unit,
                            name: item.name,
                            plant_id: item.plant_id,
                          });
                        }}
                      >
                        {item.name}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="mx-2">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {range.name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {period.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index.toString()}
                        onClick={() => {
                          if (item.ident_name === "by_date") {
                            setDialogSync(true);
                          } else {
                            setRange({
                              ...range,
                              ident_name: item.ident_name,
                              name: item.period_name,
                            });
                            setDate({
                              ...date,
                              date_start: null,
                              date_finish: null,
                            });
                          }
                        }}
                      >
                        {item.period_name}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-3 p-1">
              <Card className="border pointer hover">
                <CardBody className="p-1">
                  <div className="d-flex">
                    <div className="p-3 w-25">
                      <div className="symbol symbol-40 mr-1">
                        <span
                          className="symbol-label rounded-circle"
                          style={{ border: "2px solid" }}
                        >
                          <h1 className="h-50 align-self-center">
                            {/* <i className="fas fa-file-invoice-dollar fa-sm text-white"></i> */}
                            {dataOverview?.total_invoice_count || 0}
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto">
                          {rupiah(dataOverview?.total_invoice || 0)}
                        </h3>
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
                          <h1 className="h-50 align-self-center text-white">
                            {/* <i className="fas fa-calculator fa-sm text-white"></i> */}
                            {dataOverview?.invoice_hari_ini_count || 0}
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto text-primary">
                          {rupiah(dataOverview?.invoice_hari_ini || 0)}
                        </h3>
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
                        <span className="symbol-label bg-success rounded-circle">
                          <h1 className="h-50 align-self-center text-white">
                            {/* <i className="fas fa-calculator fa-sm text-white"></i> */}
                            {dataOverview?.invoice_active_count || 0}
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto text-success">
                          {rupiah(dataOverview?.invoice_active || 0)}
                        </h3>
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
                        <span className="symbol-label bg-warning rounded-circle">
                          <h1 className="h-50 align-self-center text-white">
                            {/* <i className="fas fa-receipt fa-sm text-white"></i> */}
                            {dataOverview?.total_invoice_dibayar_count || 0}
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto text-warning">
                          {rupiah(dataOverview?.total_invoice_dibayar || 0)}
                        </h3>
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
                        <span className="symbol-label bg-danger rounded-circle">
                          <h1 className="h-50 align-self-center text-white">
                            {/* <i className="fas fa-calculator fa-sm text-white"></i> */}
                            {dataOverview?.out_sla_25_count || 0}
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto text-danger">
                          {rupiah(dataOverview?.out_sla_25 || 0)}
                        </h3>
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
                        <span className="symbol-label bg-danger rounded-circle">
                          <h1 className="h-50 align-self-center text-white">
                            {/* <i className="fas fa-calculator fa-sm text-white"></i> */}
                            {dataOverview?.out_sla_30_count || 0}
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto text-danger">
                          {rupiah(dataOverview?.out_sla_30 || 0)}
                        </h3>
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
                        <span className="symbol-label bg-danger rounded-circle">
                          <h1 className="h-50 align-self-center">
                            <i className="fas fa-cash-register fa-sm text-white"></i>
                          </h1>
                        </span>
                      </div>
                    </div>
                    <div className="py-3 w-75">
                      <div className="d-flex">
                        <h3 className="m-auto text-danger">
                          {dataOverview?.average || 0}
                        </h3>
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
              {/* <Card className="border">
                <CardBody className="p-1">
                  <div className={`card card-custom card-stretch`}>

                    <div className="card-header border-0 pt-5">
                      <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark">
                          Invoice Milestone
                        </span>
                      </h3>
                      <div className="card-toolbar"></div>
                    </div>

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
                              <th
                                className="p-0"
                                style={{ minWidth: "200px" }}
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
                                {
                                  //<div className="symbol symbol-50 symbol-light mr-1">
                                  //<span className="symbol-label">
                                  //  <h1 className="h-50 align-self-center">
                                  //    P
                                  //  </h1>
                                  //</span>
                                  //</div>
                                }
                                PT ABC
                              </td>
                              <td className="pl-0">
                                <span className="">PST-GA Manager</span>
                              </td>
                              <td className="pl-0">
                                <span className="">Termin 1</span>
                              </td>
                              <td className="pl-0">
                                <span className="">Rp. 1.000.000</span>
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
              </Card> */}
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

const mapState = (state) => {
  return {
    plant_data: state.auth.user.data.plant_data,
  };
};

export default injectIntl(connect(mapState, null)(Dashboard));
