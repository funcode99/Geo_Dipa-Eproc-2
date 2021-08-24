import React, { useState, useLayoutEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import {
  getContractMainFinance,
  getContractUnitFinance,
  getContractUser,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TableRow, TableCell } from "@material-ui/core";
import { Link } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";
import { rupiah } from "../../../../libs/currency";
import { useSubheader } from "../../../../../_metronic/layout";

function DashboardListContract(props) {
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
      title: intl.formatMessage({
        id: "TITLE.NO",
      }),
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
        id: "CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER",
      }),
      name: "contract_no",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.PO_NUMBER" }),
      name: "po_no",
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
        id: "CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE",
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
        id: "TITLE.TOTAL_AMOUNT",
      }),
      name: "amount",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.PO_DATE" }),
      name: "po_date",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.CONTRACT_DATE" }),
      name: "contract_date",
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
      title: intl.formatMessage({ id: "TITLE.CONTRACT_END_DATE" }),
      name: "end_date",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.GROUP" }),
      name: "group",
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
        id: "CONTRACT_DETAIL.LABEL.VENDOR",
      }),
      name: "vendor_name",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.TABLE_HEAD.STATUS" }),
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
  const suhbeader = useSubheader();

  useLayoutEffect(() => {
    suhbeader.setBreadcrumbs([
      {
        pathname: `/client/invoice_monitoring/contract`,
        title: intl.formatMessage({
          id: "MENU.DELIVERY_MONITORING.LIST_CONTRACT_PO",
        }),
      },
    ]);
  }, []);

  const requestApi = (params) => {
    setLoading(true);
    setData({
      ...data,
      count: 0,
      data: [],
    });
    setErr(false);
    setParamsTable(params);
    if (is_finance && is_main) {
      getContractMainFinance(params)
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
    } else if (is_finance) {
      getContractUnitFinance(user_id, params)
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
    } else {
      getContractUser(user_id, params)
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
    }
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
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>
                    <Link
                      to={
                        "/client/invoice_monitoring/contract/" +
                        item.contract_id
                      }
                    >
                      {item.contract_no}
                    </Link>
                  </TableCell>
                  <TableCell>{item.purch_order_no}</TableCell>
                  <TableCell>{item.contract_name}</TableCell>
                  <TableCell>{rupiah(item.contract_value || 0)}</TableCell>
                  <TableCell>
                    {window
                      .moment(new Date(item.po_date))
                      .format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>
                    {window
                      .moment(new Date(new Date(item.contract_date)))
                      .format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>
                    {window
                      .moment(new Date(new Date(item.contract_end_date)))
                      .format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>{item.purch_group_name}</TableCell>
                  <TableCell>{item.vendor_name}</TableCell>
                  <TableCell>----------</TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(DashboardListContract));
