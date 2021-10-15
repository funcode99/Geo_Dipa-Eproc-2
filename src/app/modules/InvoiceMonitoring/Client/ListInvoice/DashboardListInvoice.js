import React, { useState, useLayoutEffect, useEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import {
  getAllInvoice,
  getAllProgressTypeGroup,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TableRow, TableCell } from "@material-ui/core";
import { Link } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";
import { rupiah } from "../../../../libs/currency";
import * as reducer from "../../_redux/InvoiceMonitoringSlice";
import { useSubheader } from "../../../../../_metronic/layout";

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
  let tabInvoice = useSelector(
    (state) => state.invoiceMonitoring.tabInvoice,
    shallowEqual
  );
  const suhbeader = useSubheader();

  useLayoutEffect(() => {
    suhbeader.setBreadcrumbs([
      {
        pathname: `/client/invoice_monitoring/invoice_document`,
        title: intl.formatMessage({
          id: "MENU.INVOICE_MONITORING.INVOICE_DOCUMENT",
        }),
      },
    ]);
  }, []);

  const [headerTable, setHeaderTable] = useState([
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
        type: "date",
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
        type: "collection",
        data: [
          {
            value: "SUMMARY",
            label: "Summary",
    },
    {
            value: "BILLING_SOFTCOPY",
            label: "Billing Softcopy",
      },
          {
            value: "SUPPORT_DELIVERABLES_SOFTCOPY",
            label: "Support & Deliverables Softcopy",
          },
          {
            value: "TAX",
            label: "Tax",
          },
          {
            value: "HARDCOPY",
            label: "Hardcopy Document",
          },
          {
            value: "PARK_AP",
            label: "Park AP",
          },
          {
            value: "PARK_BAYAR",
            label: "Park Bayar",
          },
          {
            value: "BKB",
            label: "BKB",
          },
          {
            value: "READY_TO_PAY",
            label: "Ready To Pay",
          },
          {
            value: "PAID",
            label: "Paid",
          },
        ],
      },
    },
    {
      title: intl.formatMessage({
        id: "TITLE.PROCESS",
      }),
      name: "process_name",
      order: {
        active: false,
        status: false,
      },
      filter: {
        active: true,
        type: "collection",
        data: [],
      },
    },
  ]);

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

  const callApi = () => {
    getAllProgressTypeGroup()
      .then((result) => {
        console.log("result.data", result.data.data);
        var data = Object.assign([], headerTable);
        result.data.data.forEach((element) => {
          var item = {
            value: element.ident_name,
            label: element.name,
          };
          data[data.length - 1].filter.data.push(item);
        });
        setHeaderTable(data);
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

  useEffect(callApi, []);

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
            hecto={25}
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
                    <Link
                      to={`/client/invoice_monitoring/contract/${item.contract_id}/${item.term_id}`}
                      onClick={() => {
                        tabInvoice.tab = 1;
                        tabInvoice.tabInvoice = 1;
                        props.set_data_tab_invaoice(tabInvoice);
                      }}
                    >
                      {item?.invoice_no}
                    </Link>
                  </TableCell>
                  <TableCell>{item.purch_order_no}</TableCell>
                  <TableCell>{item.contract_no}</TableCell>
                  <TableCell>{item.contract_title}</TableCell>
                  <TableCell>{item.term_name}</TableCell>
                  <TableCell>{rupiah(item.term_amount || 0)}</TableCell>
                  <TableCell>
                    {item.invoice_date
                      ? window
                          .moment(new Date(item.invoice_date))
                          .format("DD MMM YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>
                    {item.payment_deadline
                      ? window
                          .moment(new Date(item.payment_deadline))
                          .format("DD MMM YYYY")
                      : ""}
                  </TableCell>
                  <TableCell>{item.user_created}</TableCell>
                  <TableCell>{item.vendor_name}</TableCell>
                  <TableCell>{item.spt_no}</TableCell>
                  <TableCell>{item.routing_slip}</TableCell>
                  <TableCell>{item.process_name}</TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, reducer.actions)(DashboardListInvoice));
