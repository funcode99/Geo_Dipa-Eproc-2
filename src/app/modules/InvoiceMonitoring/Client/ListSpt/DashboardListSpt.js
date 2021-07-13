import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { getListSpt, getAsyncSpt } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Form, Row, Col } from "react-bootstrap";
import Tables from "../../../../components/tableCustomV1/table";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DashboardListSpt(props) {
  const { intl } = props;
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [paramsTable, setParamsTable] = useState("");
  const [err, setErr] = useState(false);
  const [dialogSync, setDialogSync] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [errLoadingSync, setErrLoadingSync] = useState(false);
  const [statusSync, setStatusSync] = useState(false);
  const [errSync, setErrSync] = useState({ status: false, message: "" });

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
      title: intl.formatMessage({ id: "TITLE.SPT_NO" }),
      name: "no_spt",
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
      title: intl.formatMessage({ id: "TITLE.CEK_NO" }),
      name: "no_cek",
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
      title: intl.formatMessage({ id: "TITLE.TOTAL_PAYMENT" }),
      name: "total_payment",
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
      title: intl.formatMessage({ id: "TITLE.ACCOUNT_NUMBER" }),
      name: "account_number",
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
      title: intl.formatMessage({ id: "TITLE.DATE" }),
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
  ];

  const requestApi = (params) => {
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    setParamsTable(params);
    getListSpt(params)
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
    getListSpt(paramsTable)
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

  const handleAsyncSpt = (e) => {
    e.preventDefault();
    setLoadingSync(true);
    setErrLoadingSync(false);
    setStatusSync(true);
    const data = new FormData(e.target);
    let dataRequest = {
      start_date: data.get("startDate"),
      end_date: data.get("endDate"),
    };
    getAsyncSpt(dataRequest)
      .then(async (result) => {
        setStatusSync(false);
        let errSyncs = Object.assign({}, errSync);
        if (result.data.data.message !== "Done Process || ") {
          errSyncs.status = true;
          errSyncs.message = result.data.data.message;
          setErrSync({
            ...errSyncs,
          });
        }
        setTimeout(() => {
          setLoadingSync(false);
          callApi();
        }, 2000);
      })
      .catch(async (err) => {
        setStatusSync(false);
        setLoadingSync(false);
        setErrLoadingSync(true);
      });
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
        <CardHeader title="">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={() => {
                setDialogSync(true);
              }}
              className="btn btn-sm btn-primary"
            >
              <i className="fas fa-sync-alt p-0"></i>
              <span className="ml-2">Syncronice</span>
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
                    <Link to={`/client/invoice_monitoring/spt/${item.id}`}>
                      {item.spt_no}
                    </Link>
                  </TableCell>
                  <TableCell>{item.cek_giro}</TableCell>
                  <TableCell>{rupiah(item.sub_total)}</TableCell>
                  <TableCell>{item.account_number}</TableCell>
                  <TableCell>
                    {window.moment(new Date(item.date)).format("DD MMM YYYY")}
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

export default injectIntl(connect(null, null)(DashboardListSpt));
