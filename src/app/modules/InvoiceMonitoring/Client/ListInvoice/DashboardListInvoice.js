import React, {
  useState,
  // useEffect,
  // useCallback
} from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { getAllInvoice } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TableRow, TableCell } from "@material-ui/core";
import { Link } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";

function DashboardListInvoice(props) {
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );
  const is_finance = useSelector(
    (state) => state.auth.user.data.is_finance,
    shallowEqual
  );
  const is_main = useSelector(
    (state) => state.auth.user.data.is_main,
    shallowEqual
  );

  const { intl } = props;
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [paramsTable, setParamsTable] = useState("");
  const [err, setErr] = useState(false);

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
      title: intl.formatMessage({ id: "TITLE.INVOICE_NUMBER" }),
      name: "invoice_number",
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
      title: intl.formatMessage({ id: "TITLE.PO_NUMBER" }),
      name: "po",
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
        id: "TITLE.CONTRACT_NO",
      }),
      name: "contract_no",
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
        id: "TITLE.PROCUREMENT_TITLE",
      }),
      name: "procurement_title",
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
        id: "TITLE.TERMIN",
      }),
      name: "termin",
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
        id: "TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.TERMIN_AMMOUNT",
      }),
      name: "termin_amount",
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
        id: "TITLE.DATE_OF_INVOICE",
      }),
      name: "date_invoice",
      order: {
        active: true,
        status: false,
      },
      filter: {
        active: true,
        type: "date",
      },
    },
    {
      title: intl.formatMessage({
        id: "TITLE.PAYMENT_DEADLINE",
      }),
      name: "payment_deadline",
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
        id: "TITLE.USER",
      }),
      name: "user",
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
        id: "TITLE.USER_MANAGEMENT.PIC_ROLES.VENDOR_NAME",
      }),
      name: "vendor",
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
        id: "TITLE.SPT_NO",
      }),
      name: "spt",
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
        id: "TITLE.ROUTING_SLIP_POSITION",
      }),
      name: "routing_slip_position",
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
        id: "TITLE.STATUS",
      }),
      name: "status",
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
    getAllInvoice(params)
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
        setToast(
          intl.formatMessage({
            id: "REQ.REQUEST_FAILED",
          }),
          5000
        );
      });
  };

  return (
    <React.Fragment>
      <Toast />
      <Card>
        <CardBody>
          <Tables
            dataHeader={headerTable}
            handleParams={requestApi}
            loading={loading}
            err={err}
            countData={data.count}
            hecto={20}
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
                    {/* <Link
                      to={
                        "/client/invoice_monitoring/contract/" +
                        item.contract_id +
                        "/" +
                        item.term_id
                      }
                    >
                      {item.invoice_no}
                    </Link> */}
                    {item.invoice_no}
                  </TableCell>
                  <TableCell>{item.purch_order_no}</TableCell>
                  <TableCell>{item.contract_no}</TableCell>
                  <TableCell>Judul Pengadaan</TableCell>
                  <TableCell>Termin</TableCell>
                  <TableCell>Termin Amount</TableCell>
                  <TableCell>Tanggal Invoice</TableCell>
                  <TableCell>Payment Deadline</TableCell>
                  <TableCell>{item.created_by_name}</TableCell>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell>{item.spt_no}</TableCell>
                  <TableCell>Routing SLip Position</TableCell>
                  <TableCell>{item.paid_satus?.toUpperCase()}</TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(DashboardListInvoice));
