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

function Dashboard(props) {
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
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between">
            <h6>Overview</h6>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              //   value={age}
              //   onChange={handleChange}
              defaultValue={10}
            >
              <MenuItem value={10}>Harian</MenuItem>
              <MenuItem value={20}>Bulanan</MenuItem>
              <MenuItem value={30}>Tahunan</MenuItem>
            </Select>
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
