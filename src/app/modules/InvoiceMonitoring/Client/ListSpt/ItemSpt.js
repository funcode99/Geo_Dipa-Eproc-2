import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Container, makeStyles, Paper } from "@material-ui/core";
// import Tabs from "../../../../components/tabs";
import Subheader from "../../../../components/subheader";
// import { useSubheader } from "../../../../../_metronic/layout";
import { getItemSpt } from "../../_redux/InvoiceMonitoringCrud";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import LinearProgress from "@material-ui/core/LinearProgress";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const ItemSpt = (props) => {
  const { intl, match } = props;
  const classes = useStyles();
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const print = () => {
    var printContents = window.$("#printSPT").html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  const getDataSpt = () => {
    console.log("result", data);
    getItemSpt(match.params.id)
      .then((result) => {
        setLoading(false);
        console.log("result", result.data.data);
        setData(result.data.data);
      })
      .catch((err) => {
        //   setErr(true);
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  useEffect(getDataSpt, []);

  return (
    <React.Fragment>
      <Toast />
      <Container className="px-0">
        <Subheader
          text={data?.spt_no}
          IconComponent={
            <i className="fas fa-file-invoice-dollar text-light mx-1"></i>
          }
        />
      </Container>
      <Paper className={classes.paper}>
        <Card>
          {loading && <LinearProgress color="secondary" />}
          <CardHeader title="">
            <CardHeaderToolbar>
              <button
                type="button"
                onClick={print}
                className="btn btn-sm btn-primary"
              >
                <i className="fas fa-print"></i>
                <FormattedMessage id="TITLE.PRINT" /> From Verifikasi
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody id="printSPT">
            <div>
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="text-uppercase">
                    <FormattedMessage id="TITLE.PAYMENT_SPT" />
                  </h3>
                  <h6>
                    <FormattedMessage id="TITLE.ATTACHMENT_LETTER_NO_SPT" />{" "}
                    {data?.spt_no}
                  </h6>
                </div>
              </div>
              <div className="row mt-5">
                <table className="table table-bordered table-responsive mt-5">
                  <thead>
                    <tr>
                      <td className="td-3">
                        <FormattedMessage id="TITLE.TABLE_HEADER.NO" />
                      </td>
                      <td className="td-20">
                        <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />
                      </td>
                      <td className="td-20">
                        <FormattedMessage id="TITLE.NEWS" />
                      </td>
                      <td className="td-12">
                        <FormattedMessage id="TITLE.NOMINAL" />
                      </td>
                      <td className="td-10">
                        <FormattedMessage id="TITLE.ACCOUNT_NUMBER" />
                      </td>
                      <td className="td-25">
                        <FormattedMessage id="TITLE.BANK_NAME" />
                      </td>
                      <td className="td-10">
                        <FormattedMessage id="TITLE.NO_DOC_SAP" />
                      </td>
                    </tr>
                  </thead>
                  {data &&
                    data.list &&
                    data.list.map((item, index) => {
                      return item.data && item.data.length === 1 ? (
                        <tbody key={index.toString()}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item.data[0].vendor_name}</td>
                            <td>{item.data[0].transfer_news}</td>
                            <td>{rupiah(item.data[0].sub_total)}</td>
                            <td>{item.data[0].account_number}</td>
                            <td>{item.data[0].bank_name}</td>
                            <td>{item.data[0].no_doc_sap}</td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody key={index.toString()}>
                          <tr>
                            <td rowSpan={item.data.length}>{index + 1}</td>
                            <td rowSpan={item.data.length}>
                              {item.data[0].vendor_name}
                            </td>
                            <td>{item.data[0].transfer_news}</td>
                            <td>{rupiah(item.data[0].sub_total)} </td>
                            <td rowSpan={item.data.length}>
                              {item.account_number}
                            </td>
                            <td rowSpan={item.data.length}>
                              {item.data[0].bank_name}
                            </td>
                            <td>{item.data[0].no_doc_sap}</td>
                          </tr>
                          {item.data.slice(1).map((items, indexs) => {
                            return (
                              <tr key={indexs.toString()}>
                                <td>{items.transfer_news}</td>
                                <td>{rupiah(items.sub_total)}</td>
                                <td>{items.no_doc_sap}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      );
                    })}
                </table>
              </div>
            </div>
          </CardBody>
        </Card>
      </Paper>
    </React.Fragment>
  );
};
export default injectIntl(connect(null, null)(ItemSpt));
