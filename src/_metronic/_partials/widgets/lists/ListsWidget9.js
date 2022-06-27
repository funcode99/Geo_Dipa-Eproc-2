/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "react-bootstrap";
import { DropdownCustomToggler, DropdownMenuMyActivity } from "../../dropdowns";
import PerfectScrollbar from "react-perfect-scrollbar";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  getActivityPeriod,
  getActivities,
  getActivity,
} from "../_redux/WidgetCrud";
import useToast from "../../../../app/components/toast";
import { shallowEqual, useSelector } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Form, Row, Col } from "react-bootstrap";

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ListsWidget9({ className }) {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState([]);
  const [indentPeriod, setIndentPeriod] = useState(null);
  const [activities, setActivities] = useState([]);
  const [myActivity, setMyActivity] = useState([]);
  const [date, setDate] = useState({ date_start: null, date_finish: null });
  const [Toast, setToast] = useToast();
  const [dialogSync, setDialogSync] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [errSync, setErrSync] = useState({ status: false, message: "" });
  const [errLoadingSync, setErrLoadingSync] = useState(false);
  const [statusSync, setStatusSync] = useState(false);
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  const callActivityPeriod = () => {
    setLoading(true);
    getActivityPeriod()
      .then((result) => {
        callActivities();
        setPeriod(result.data.data);
      })
      .catch((err) => {
        setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 5000);
      });
  };

  const callActivities = () => {
    getActivities()
      .then((result) => {
        setActivities(result.data.data);
        callActivity();
      })
      .catch((err) => {
        setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 5000);
      });
  };

  const callActivity = () => {
    setLoading(true);
    getActivity(
      user_id,
      "my_activity",
      indentPeriod,
      date.date_start,
      date.date_finish
    )
      .then((result) => {
        setMyActivity(result.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 5000);
      });
  };

  useEffect(callActivityPeriod, []);
  useEffect(callActivity, [indentPeriod, date]);

  const handlePeriod = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setDate({
      ...date,
      date_start: data.get("date_start"),
      date_finish: data.get("date_finish"),
    });

    setIndentPeriod("by_date");
    setDialogSync(false);
  };

  const handlePeriodDialog = (name, ident) => {
    if (name === "no_date") {
      setIndentPeriod(ident);
      setDate({
        ...date,
        date_start: null,
        date_finish: null,
      });
      // callActivity();
    } else {
      setDialogSync(true);
    }
  };

  return (
    <>
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
        <Form id="asyncData" onSubmit={handlePeriod}>
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
      <div className={`card card-custom  ${className}`}>
        {/* Header */}
        <div className="card-header align-items-center border-0 mt-4">
          <h3 className="card-title align-items-start flex-column">
            <span className="font-weight-bolder text-dark">
              Invoice Activity
            </span>
            {/* <span className="text-muted mt-3 font-weight-bold font-size-sm">
              890,344 Sales
            </span> */}
          </h3>
          <div className="card-toolbar">
            <Dropdown className="dropdown-inline" alignRight>
              <Dropdown.Toggle
                id="dropdown-toggle-top"
                as={DropdownCustomToggler}
              >
                <i className="fas fa-calendar-day"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                <DropdownMenuMyActivity
                  dataPeriod={period}
                  handle={handlePeriodDialog}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        {/* Body */}
        <div className="card-body pt-4">
          <PerfectScrollbar
            options={perfectScrollbarOptions}
            className="scroll pr-7 mr-n7"
            style={{
              maxHeight: "calc(100%)",
              position: "relative",
            }}
          >
            <div className="timeline timeline-6 mt-3">
              {loading ? (
                <div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                  <div className="timeline-item align-items-start">
                    <Skeleton animation="wave" className="w-100" />
                  </div>
                </div>
              ) : (
                myActivity.map((item, index) => {
                  return (
                    <div
                      className="timeline-item align-items-start cursor-pointer text-hover-primary"
                      key={index.toString()}
                    >
                      <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                        {window
                          .moment(new Date(item.created_at))
                          .format("HH:mm")}
                      </div>

                      <div className="timeline-badge">
                        <i className="fa fa-genderless text-success icon-xl"></i>
                      </div>

                      <div className="timeline-content font-weight-bolder font-size-sm text-dark-75 pl-3">
                        <span className="text-muted">
                          Nomor Kontrak{" "}
                          <span className="text-danger">
                            {item.contract_no + " (" + item.vendor_name + ")"}
                          </span>
                          -{" "}
                        </span>
                        {`${item.activity_name}(${item.name_user})`}
                        <span className="text-muted">
                          (
                          {window
                            .moment(new Date(item.created_at))
                            .format("DD MM YYYY")}
                          )
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* 

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  10:00
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-success icon-xl"></i>
                </div>

                <div className="timeline-content d-flex">
                  <span className="font-weight-bolder text-dark-75 pl-3 font-size-lg">
                    AEOL meeting
                  </span>
                </div>
              </div>

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  14:37
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-danger icon-xl"></i>
                </div>

                <div className="timeline-content font-weight-bolder font-size-lg text-dark-75 pl-3">
                  Make deposit{` `}
                  <a href="#" className="text-primary">
                    USD 700
                  </a>
                  . to ESL
                </div>
              </div>

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  16:50
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-primary icon-xl"></i>
                </div>

                <div className="timeline-content font-weight-mormal font-size-lg text-muted pl-3">
                  Indulging in poorly driving and keep structure keep great
                </div>
              </div>

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  21:03
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-danger icon-xl"></i>
                </div>

                <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-lg">
                  New order placed{` `}
                  <a href="#" className="text-primary">
                    #XF-2356
                  </a>
                  .
                </div>
              </div>

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  23:07
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-info icon-xl"></i>
                </div>

                <div className="timeline-content font-weight-mormal font-size-lg text-muted pl-3">
                  Outlines keep and you honest. Indulging in poorly driving
                </div>
              </div>

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  16:50
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-primary icon-xl"></i>
                </div>

                <div className="timeline-content font-weight-mormal font-size-lg text-muted pl-3">
                  Indulging in poorly driving and keep structure keep great
                </div>
              </div>

              <div className="timeline-item align-items-start">
                <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg">
                  21:03
                </div>

                <div className="timeline-badge">
                  <i className="fa fa-genderless text-danger icon-xl"></i>
                </div>

                <div className="timeline-content font-weight-bolder font-size-lg text-dark-75 pl-3">
                  New order placed {` `}
                  <a href="#" className="text-primary">
                    #XF-2356
                  </a>
                  .
                </div>
              </div> */}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  );
}
