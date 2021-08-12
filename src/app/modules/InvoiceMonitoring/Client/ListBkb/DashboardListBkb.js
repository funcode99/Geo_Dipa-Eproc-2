import React, {
  useState,
  // useEffect,
  // useCallback
} from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  // FormattedMessage,
  injectIntl,
} from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { getAllBkb } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { TableRow, TableCell } from "@material-ui/core";
import { Link } from "react-router-dom";
import Tables from "../../../../components/tableCustomV1/table";

function DashboardListBkb(props) {
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
      title: intl.formatMessage({ id: "TITLE.NO_BKB" }),
      name: "bkb_no",
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
      title: intl.formatMessage({ id: "CONTRACT_DETAIL.LABEL.GROUP" }),
      name: "group",
      order: {
        active: true,
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
    setLoading(false);
    getAllBkb(params)
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
            hecto={9}
          >
            {data.data.map((item, index) => {
              return (
                <TableRow key={index.toString()}>
                  <TableCell>
                    <Link
                      to={
                        "/client/invoice_monitoring/contract/" +
                        item.contract_id +
                        "/" +
                        item.term_id
                      }
                    >
                      {item.bkb_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.contract?.user_group?.party?.full_name}
                  </TableCell>
                  <TableCell>{item.vendor?.party?.full_name}</TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(DashboardListBkb));
