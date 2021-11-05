import React, { useState, useEffect } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Container,
  makeStyles,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@material-ui/core";
// import Tabs from "../../../../components/tabs";
import Subheader from "../../../../components/subheader";
// import { useSubheader } from "../../../../../_metronic/layout";
import {
  getItemSpt,
  uploadProofOfPayment,
} from "../../_redux/InvoiceMonitoringCrud";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import LinearProgress from "@material-ui/core/LinearProgress";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect, useSelector, shallowEqual } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [dialogPayment, setDialogPayment] = useState(false);
  const [data, setData] = useState({});
  const user_id = useSelector(
    (state) => state.auth.user.data.user_id,
    shallowEqual
  );

  const initialValues = {};

  const InvoiceSchema = Yup.object().shape({
    paid_date: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

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

  const formik = useFormik({
    initialValues,
    validationSchema: InvoiceSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      values.created_by_id = user_id;
      uploadProofOfPayment(match.params.id, values)
        .then((result) => {
          setLoading(false);
          setDialogPayment(false);
          getDataSpt();
          setToast(intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }), 5000);
        })
        .catch((err) => {
          //   setErr(true);
          setLoading(false);
          setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    },
  });

  return (
    <React.Fragment>
      <Toast />
      <Dialog
        open={dialogPayment}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth={true}
      >
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-slide-title">
            <FormattedMessage id="TITLE.PROOF_OF_PAYMENT" />
          </DialogTitle>
          <DialogContent>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">
                <FormattedMessage id="TITLE.DATE_PAID" />
              </label>
              <div className="col-sm-8">
                <input
                  type="date"
                  className="form-control"
                  {...formik.getFieldProps("paid_date")}
                />
                {formik.touched.paid_date && formik.errors.paid_date && (
                  <span className="text-center text-danger">
                    {formik.errors.paid_date}
                  </span>
                )}
              </div>
            </div>
            {/* <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.INVOICE_DOCUMENT.REJECTED.REJECT_BODY" />
            <textarea
              rows="2"
              cols=""
              className="form-control"
              placeholder="komentar"
              disabled={loading}
              {...formik.getFieldProps("rejected_remark")}
            ></textarea>
            {formik.touched.rejected_remark && formik.errors.rejected_remark ? (
              <span className="text-center text-danger">
                {formik.errors.rejected_remark}
              </span>
            ) : null} */}
          </DialogContent>
          <DialogActions>
            <button
              className="btn btn-secondary"
              onClick={() => setDialogPayment(false)}
              disabled={loading}
            >
              <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
            </button>
            <button
              className="btn btn-primary"
              disabled={
                loading || (formik.touched && !formik.isValid) || !formik.dirty
              }
            >
              <span>
                <FormattedMessage id="TITLE.SAVE" />
              </span>
              {loading && (
                <span
                  className="spinner-border spinner-border-sm ml-1"
                  aria-hidden="true"
                ></span>
              )}
            </button>
          </DialogActions>
        </form>
      </Dialog>
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
                className="btn btn-sm btn-primary mx-1"
                onClick={() => {
                  setDialogPayment(true);
                }}
                disabled={loading}
              >
                <i className="fas fa-file-upload"></i>
                <FormattedMessage id="TITLE.PROOF_OF_PAYMENT" />
              </button>
              <button
                type="button"
                onClick={print}
                className="btn btn-sm btn-primary mx-1"
              >
                <i className="fas fa-print"></i>
                <FormattedMessage id="TITLE.PRINT" /> From Verifikasi
              </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody id="printSPT">
            <div>
              <div className="row">
                <div className="col-sm-7">
                  <h3 className="text-uppercase">
                    <FormattedMessage id="TITLE.PAYMENT_SPT" />
                  </h3>
                  <h6>
                    <FormattedMessage id="TITLE.ATTACHMENT_LETTER_NO_SPT" />{" "}
                    {data?.spt_no}
                  </h6>
                </div>
                <div className="col-sm-5">
                  <h3 className="text-uppercase">
                    <FormattedMessage id="TITLE.DATE_PAID" />
                    {moment(new Date()).format("DD MMM YYYY")}
                  </h3>
                  {/* <h6 className="text-truncate">
                    <FormattedMessage id="TITLE.PROOF_OF_PAYMENT" />:
                    {data?.spt_no}
                  </h6> */}
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
