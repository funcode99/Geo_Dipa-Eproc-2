import React, { useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { makeStyles, TableRow, TableCell } from "@material-ui/core";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import { FormattedMessage, injectIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";
import { SubWrap } from "./style";
import { getListEmail } from "../service/MasterCrud";
import useToast from "../../../components/toast";
import { Link } from "react-router-dom";
import Tables from "../../../components/tableCustomV1/table";
import { useSubheader } from "../../../../_metronic/layout";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));
const Email = (props) => {
  const { intl } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [Toast, setToast] = useToast();
  const [err, setErr] = useState(false);
  const [paramsTable, setParamsTable] = useState("");
  const headerTable = [
    {
      title: intl.formatMessage({ id: "TITLE.TABLE_HEADER.NO" }),
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
        id: "TITLE.NAME",
      }),
      name: "name",
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
      title: intl.formatMessage({
        id: "TITLE.SCHEDULED",
      }),
      name: "schedule",
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
        id: "TITLE.UPDATED_DATE",
      }),
      name: "update_date",
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
        pathname: `/client/master/email`,
        title: "Master Email",
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
    getListEmail(params)
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

  return (
    <React.Fragment>
      <Toast />
      <div className="d-flex align-items-center flex-wrap mr-1">
        <SubWrap className="mr-2 iconWrap">
          <span className="svg-icon menu-icon">
            <SVG src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")} />
          </span>
        </SubWrap>
        <div className="d-flex align-items-baseline mr-5">
          <h2 className="text-dark font-weight-bold my-2 mr-5">
            Master <FormattedMessage id="TITLE.EMAIL" />
          </h2>
        </div>
      </div>
      <Card className={classes.paper}>
        <CardBody>
          <Tables
            dataHeader={headerTable}
            handleParams={requestApi}
            loading={loading}
            err={err}
            countData={data.count}
            hecto={8}
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
                    <Link to={`/client/master/email/${item.id}`}>
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.schedule ? "YES" : "NO"}</TableCell>
                  <TableCell>
                    {window
                      .moment(new Date(item.updated_at))
                      .format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              );
            })}
          </Tables>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(Email));
