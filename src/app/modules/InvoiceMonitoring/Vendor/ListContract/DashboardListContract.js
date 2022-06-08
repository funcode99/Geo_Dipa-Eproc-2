import React, { useState, useLayoutEffect } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers/AssetsHelpers";
import {
  getContractVendor,
  getContractPic,
} from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TableRow, TableCell } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";
import { useSubheader } from "../../../../../_metronic/layout";

function DashboardListContract(props) {
  const { intl } = props;
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [err, setErr] = useState(false);
  const dataUser = useSelector((state) => state.auth.user.data);
  const [paramsTable, setParamsTable] = useState("");

  const headerTable = [
    {
      title: intl.formatMessage({
        id: "CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.PO_DATE" }),
      name: "po_date",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.CONTRACT_DATE" }),
      name: "contract_date",
      order: {
        active: true,
        status: true,
        type: true,
      },
      filter: {
        active: false,
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
        active: false,
        status: false,
      },
      filter: {
        active: false,
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
        pathname: `/vendor/invoice_monitoring/contract`,
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
    if (dataUser.main_vendor) {
      getContractVendor(dataUser.vendor_id, params)
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
          setToast(err.response?.data.message, 5000);
        });
    } else {
      getContractPic(dataUser.user_id, params)
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
          setToast(err.response?.data.message, 5000);
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
            hecto={14}
          >
            {data.data.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>
                    <Link
                      to={
                        "/vendor/invoice_monitoring/contract/" +
                        item.contract_id
                      }
                    >
                      {item.contract_no}
                    </Link>
                  </TableCell>
                  <TableCell>{item.purch_order_no}</TableCell>
                  <TableCell>{item.contract_name}</TableCell>
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
