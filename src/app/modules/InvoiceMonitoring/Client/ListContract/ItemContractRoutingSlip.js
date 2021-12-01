import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Card,
  CardBody,
  //   CardFooter,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import // Table,
// Form,
// Col,
// Row,
// Pagination
"react-bootstrap";
import // Dialog,
// DialogActions,
// DialogContent,
// DialogTitle,
// Slide
"@material-ui/core";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { getRoutingSlip } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../../../components/toast";
import { rupiah } from "../../../../libs/currency";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

function ItemContractRoutingSlip(props) {
  const { intl } = props;
  const contract_id = props.match.params.contract;
  const termin = props.match.params.termin;
  const [Toast, setToast] = useToast();

  const [loading, setLoading] = useState(false);
  const [slipData, setSlipData] = useState({});

  const print = () => {
    var printContents = window.$("#printRoutingSlip").html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };

  const callApiRoutingSlip = () => {
    setLoading(true);
    getRoutingSlip(termin)
      .then((result) => {
        setLoading(false);
        setSlipData(result.data.data);
      })
      .catch((err) => {
        setLoading(false);
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  };

  useEffect(callApiRoutingSlip, []);

  return (
    <React.Fragment>
      <Toast />
      <Card>
        <CardHeader title="">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={print}
              className="btn btn-sm btn-primary"
            >
              <i className="fas fa-print"></i>
              <FormattedMessage id="TITLE.PRINT" /> Routing Slip
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody id="printRoutingSlip">
          <div>
            <div className="row">
              <div className="col-sm-12">
                <div className="d-flex justify-content-center">
                  <div>
                    <img
                      src={toAbsoluteUrl("/media/logos/icon-gde.png")}
                      alt="IconGde"
                    />
                  </div>
                  <div className="text-center ml-5">
                    <h4 className="text-uppercase mt-4">PT Geo Dipa Energi</h4>
                    <h4 className="text-uppercase">Routing Slip</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-2">
                    <span>Nama Supplier</span>
                  </div>
                  <div className="col-sm-10">
                    <span>{slipData?.vendor?.party?.full_name}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2">
                    <span>No. Invoice</span>
                  </div>
                  <div className="col-sm-10">
                    <span>{slipData?.invoice_no}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2">
                    <span>Tanggal Invoice</span>
                  </div>
                  <div className="col-sm-10">
                    <span>
                      {slipData?.invoice_date
                        ? window
                            .moment(new Date(slipData?.invoice_date))
                            .format("DD MMM YYYY")
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <table
                className="table table-bordered"
                style={{ minHeight: 300 }}
              >
                <thead>
                  <tr>
                    <td className="td-1">No</td>
                    <td className="td-16 text-center">Dokument Status</td>
                    <td className="td-18 text-center">Pejabat Keuangan</td>
                    <td className="td-11 text-center">Tanggal Masuk</td>
                    <td className="td-6 text-center">Jam Masuk</td>
                    <td className="td-11 text-center">Tanggal Keluar</td>
                    <td className="td-6 text-center">Jam Keluar</td>
                    <td className="td-10 text-center">Durasi</td>
                    <td className="td-21 text-center">Keterangan</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    <tr>
                      <td>1</td>
                      <td>-</td>
                      <td>{slipData?.sa_gr_creator?.party?.full_name}</td>
                      <td className="text-center">-</td>
                      <td className="text-center">-</td>
                      <td className="text-center">
                        {slipData?.sa_gr_date_out
                          ? window
                              .moment(new Date(slipData?.sa_gr_date_out))
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.sa_gr_date_out
                          ? window
                              .moment(new Date(slipData?.sa_gr_date_out))
                              .format("HH:mm")
                          : "-"}
                      </td>
                      <td className="text-center">-</td>
                      <td>SA / GR Terbit</td>
                    </tr>
                  }
                  {(slipData?.support_deliverables_document_softcopy_date_out ||
                    slipData?.support_deliverables_document_softcopy_date_in) && (
                    <tr>
                      <td>2</td>
                      <td>Verification Process</td>
                      <td>
                        {
                          slipData?.support_deliverbables_creator?.party
                            ?.full_name
                        }
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_in
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_in
                                )
                              )
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_in
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_in
                                )
                              )
                              .format("HH:mm")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_out
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_out
                                )
                              )
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_out
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_out
                                )
                              )
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(
                              new Date(
                                slipData?.support_deliverables_document_softcopy_date_out
                              )
                            )
                            .diff(
                              window.moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_in
                                )
                              )
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.support_deliverables_document_softcopy_date_in &&
                            slipData?.support_deliverables_document_softcopy_date_out ? (
                              <div>
                                {days > 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Softcopy Dokumen Pendukung</td>
                    </tr>
                  )}
                  {(slipData?.support_deliverables_document_softcopy_date_out ||
                    slipData?.support_deliverables_document_softcopy_date_in) && (
                    <tr>
                      <td>3</td>
                      <td>Verification Process</td>
                      <td>
                        {
                          slipData?.support_deliverbables_creator?.party
                            ?.full_name
                        }
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_in
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_in
                                )
                              )
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_in
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_in
                                )
                              )
                              .format("HH:mm")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_out
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_out
                                )
                              )
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.support_deliverables_document_softcopy_date_out
                          ? window
                              .moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_out
                                )
                              )
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(
                              new Date(
                                slipData?.support_deliverables_document_softcopy_date_out
                              )
                            )
                            .diff(
                              window.moment(
                                new Date(
                                  slipData?.support_deliverables_document_softcopy_date_in
                                )
                              )
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.support_deliverables_document_softcopy_date_in &&
                            slipData?.support_deliverables_document_softcopy_date_out ? (
                              <div>
                                {days > 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Softcopy Dokumen Deliverables</td>
                    </tr>
                  )}
                  {slipData?.billing_document_softcopy_date_in && (
                    <tr>
                      <td>4</td>
                      <td>Tax Process</td>
                      <td>{slipData?.billing_creator?.party?.full_name}</td>
                      <td className="text-center">
                        {window
                          .moment(
                            new Date(
                              slipData?.billing_document_softcopy_date_in
                            )
                          )
                          .format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">
                        {window
                          .moment(
                            new Date(
                              slipData?.billing_document_softcopy_date_in
                            )
                          )
                          .format("HH:mm")}
                      </td>
                      <td className="text-center">
                        {slipData?.billing_document_softcopy_date_out
                          ? window
                              .moment(
                                new Date(
                                  slipData?.billing_document_softcopy_date_out
                                )
                              )
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.billing_document_softcopy_date_out
                          ? window
                              .moment(
                                new Date(
                                  slipData?.billing_document_softcopy_date_out
                                )
                              )
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(
                              new Date(
                                slipData?.billing_document_softcopy_date_out
                              )
                            )
                            .diff(
                              window.moment(
                                new Date(
                                  slipData?.billing_document_softcopy_date_in
                                )
                              )
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.billing_document_softcopy_date_in &&
                            slipData?.billing_document_softcopy_date_out ? (
                              <div>
                                {days > 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Tax Verification</td>
                    </tr>
                  )}
                  {slipData?.hardcopy_date_in && (
                    <tr>
                      <td>5</td>
                      <td>Verification Process</td>
                      <td>{slipData?.hardcopy_creator?.party?.full_name}</td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.hardcopy_date_in))
                          .format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.hardcopy_date_in))
                          .format("HH:mm")}
                      </td>
                      <td className="text-center">
                        {slipData?.hardcopy_date_out
                          ? window
                              .moment(new Date(slipData?.hardcopy_date_out))
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.hardcopy_date_out
                          ? window
                              .moment(new Date(slipData?.hardcopy_date_out))
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(new Date(slipData?.hardcopy_date_out))
                            .diff(
                              window.moment(
                                new Date(slipData?.hardcopy_date_in)
                              )
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.hardcopy_date_in &&
                            slipData?.hardcopy_date_out ? (
                              <div>
                                {days > 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Hardcopy Dokumen</td>
                    </tr>
                  )}
                  {slipData?.park_ap_date_in && (
                    <tr>
                      <td>6</td>
                      <td>Accounting Process</td>
                      <td>{slipData?.park_ap_creator?.party?.full_name}</td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.park_ap_date_in))
                          .format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.park_ap_date_in))
                          .format("HH:mm")}
                      </td>
                      <td className="text-center">
                        {slipData?.park_ap_date_out
                          ? window
                              .moment(new Date(slipData?.park_ap_date_out))
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.park_ap_date_out
                          ? window
                              .moment(new Date(slipData?.park_ap_date_out))
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(new Date(slipData?.park_ap_date_out))
                            .diff(
                              window.moment(new Date(slipData?.park_ap_date_in))
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.park_ap_date_in &&
                            slipData?.park_ap_date_out ? (
                              <div>
                                {days > 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Approve Park AP Dokumen</td>
                    </tr>
                  )}
                  {slipData?.park_byr_date_in && (
                    <tr>
                      <td>7</td>
                      <td>Treasury Process</td>
                      <td>{slipData?.park_byr_creator?.party?.full_name}</td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.park_byr_date_in))
                          .format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.park_byr_date_in))
                          .format("HH:mm")}
                      </td>
                      <td className="text-center">
                        {slipData?.park_byr_date_out
                          ? window
                              .moment(new Date(slipData?.park_byr_date_out))
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.park_byr_date_out
                          ? window
                              .moment(new Date(slipData?.park_byr_date_out))
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(new Date(slipData?.park_byr_date_out))
                            .diff(
                              window.moment(
                                new Date(slipData?.park_byr_date_in)
                              )
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.park_byr_date_in &&
                            slipData?.park_byr_date_out ? (
                              <div>
                                {days > 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Approve Park BYR Dokumen</td>
                    </tr>
                  )}
                  {slipData?.spt_date_in && (
                    <tr>
                      <td>8</td>
                      <td>Treasury Process</td>
                      <td>{slipData?.spt_creator?.party?.full_name}</td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.spt_date_in))
                          .format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.spt_date_in))
                          .format("HH:mm")}
                      </td>
                      <td className="text-center">
                        {slipData?.spt_date_out
                          ? window
                              .moment(new Date(slipData?.spt_date_out))
                              .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.spt_date_out
                          ? window
                              .moment(new Date(slipData?.spt_date_out))
                              .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(new Date(slipData?.spt_date_out))
                            .diff(
                              window.moment(new Date(slipData?.spt_date_in))
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.spt_date_in && slipData?.spt_date_out ? (
                              <div>
                                {days !== 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>SPT Dokumen</td>
                    </tr>
                  )}
                  {slipData?.spt_date_in && (
                    <tr>
                      <td>9</td>
                      <td>Finished</td>
                      <td>{slipData?.paid?.spt_creator?.party?.full_name}</td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.spt_date_in))
                          .format("DD MMM YYYY")}
                      </td>
                      <td className="text-center">
                        {window
                          .moment(new Date(slipData?.spt_date_in))
                          .format("HH:mm")}
                      </td>
                      <td className="text-center">
                        {slipData?.paid?.created_at
                          ? window
                            .moment(new Date(slipData?.paid?.created_at))
                            .format("DD MMM YYYY")
                          : "-"}
                      </td>
                      <td className="text-center">
                        {slipData?.paid?.created_at
                          ? window
                            .moment(new Date(slipData?.paid?.created_at))
                            .format("HH:mm")
                          : "-"}
                      </td>
                      {(() => {
                        var duration = window.moment.duration(
                          window
                            .moment(new Date(slipData?.paid?.created_at))
                            .diff(
                              window.moment(new Date(slipData?.spt_date_in))
                            )
                        );
                        const days = Math.floor(duration.asDays());
                        duration.subtract(window.moment.duration(days, "days"));
                        const hours = duration.hours();
                        duration.subtract(
                          window.moment.duration(hours, "hours")
                        );
                        const minutes = duration.minutes();
                        duration.subtract(
                          window.moment.duration(minutes, "minutes")
                        );
                        return (
                          <td className="text-center">
                            {slipData?.spt_date_in && slipData?.paid?.created_at ? (
                              <div>
                                {days !== 0 && (
                                  <span>
                                    {days} <FormattedMessage id="SPAN.DAYS" />
                                  </span>
                                )}
                                {hours > 0 && (
                                  <span>
                                    {hours} <FormattedMessage id="SPAN.HOURS" />
                                  </span>
                                )}
                                <span>
                                  {minutes}{" "}
                                  <FormattedMessage id="SPAN.MINUTES" />
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })()}
                      <td>Paid Dokumen</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* <div className="row border">
              <div
                className="col-sm border-right text-center"
                style={{ backgroundColor: "whitesmoke" }}
              >
                <span style={{ fontSize: 10 }}>Diisi Oleh</span>
                <div>Finance</div>
              </div>
              <div
                className="col-sm border-right text-center"
                style={{ backgroundColor: "whitesmoke" }}
              >
                <span style={{ fontSize: 10 }}>Diisi Oleh</span>
                <div>Budget</div>
              </div>
              <div
                className="col-sm text-center"
                style={{ backgroundColor: "whitesmoke" }}
              >
                <span style={{ fontSize: 10 }}>Diisi Oleh</span>
                <div>Accounting</div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Uraian</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Jumlah</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Anggaran</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Jumlah</span>
                  </div>
                </div>
              </div>
              <div className="col-sm text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Akun</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Jumlah</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-left">
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>1. Tagihan</span>
                  </div>
                  <div className="col-sm-6">
                    <span>{rupiah(slipData?.bkb?.sub_total).slice(3)}</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>2. Potongan</span>
                  </div>
                  <div className="col-sm-6">
                    <span>171.666.000</span>
                  </div>
                </div>
                {slipData?.tax?.tax_selected?.map((item, index) => {
                  const data = JSON.parse(item?.value)
                  return (
                    <div className="row mt-3" key={index}>
                      <div className="col-sm-6 border-right">
                        <span className="pl-3">{data.description} - {data.value}%</span>
                      </div>
                      <div className="col-sm-6">
                        <span>({rupiah(data.tax_value).slice(3)})</span>
                      </div>
                    </div>
                  )
                })}
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span className="pl-3">Denda</span>
                  </div>
                  <div className="col-sm-6">({rupiah(slipData?.invoice?.penalty).slice(3)})</div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 border-right">
                    <span>3. Jumlah Dibayar</span>
                  </div>
                  <div className="col-sm-6">
                    <span>{rupiah(slipData?.bkb?.total_amount).slice(3)}</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-left">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Anggaran</span>
                  </div>
                  <div className="col-sm-6"><span>Jumlah</span></div>
                </div>
              </div>
              <div className="col-sm text-left">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Kode Akun</span>
                  </div>
                  <div className="col-sm-6"><span>Jumlah</span></div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Tanggal Masuk</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Tanggal Keluar</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Tanggal Masuk</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Tanggal Keluar</span>
                  </div>
                </div>
              </div>
              <div className="col-sm text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>Tanggal Masuk</span>
                  </div>
                  <div className="col-sm-6">
                    <span>Tanggal Keluar</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span>20 Mei 2020</span>
                  </div>
                  <div className="col-sm-6">
                    <span>20 Mei 2020</span>
                  </div>
                </div>
              </div>
              <div className="col-sm border-right text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span></span>
                  </div>
                  <div className="col-sm-6">
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="col-sm text-center">
                <div className="row">
                  <div className="col-sm-6 border-right">
                    <span></span>
                  </div>
                  <div className="col-sm-6">
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row border">
              <div className="col-sm border-right text-center">
                <span>Tanda Tangan &#38; Nama</span>
              </div>
              <div className="col-sm border-right text-center">
                <span>Tanda Tangan &#38; Nama</span>
              </div>
              <div className="col-sm text-center">
                <span>Tanda Tangan &#38; Nama</span>
              </div>
            </div>
            <div className="row border">
              <div
                className="col-sm border-right d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span className="mx-auto">Merry</span>
              </div>
              <div
                className="col-sm border-right d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span></span>
              </div>
              <div
                className="col-sm border-right d-flex align-items-end"
                style={{ height: 80 }}
              >
                <span></span>
              </div>
            </div> */}
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractRoutingSlip));
