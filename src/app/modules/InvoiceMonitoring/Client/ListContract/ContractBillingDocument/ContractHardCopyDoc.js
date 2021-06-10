import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
// import {
//   Card,
//   CardBody,
//   CardFooter,
// } from "../../../../../../_metronic/_partials/controls";
// import {
//   getContractSummary,
//   saveInvoice,
//   getInvoice,
// } from "../../../_redux/InvoiceMonitoringCrud";
// import useToast from "../../../../../components/toast";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { rupiah } from "../../../../../libs/currency";
import ButtonAction from "../../../../../components/buttonAction/ButtonAction";

const data_ops = [
  {
    label: "TITLE.ACCEPT_DOCUMENT",
    icon: "fas fa-check-circle text-success",
    type: "accept",
  },
  {
    label: "TITLE.REJECT_DOCUMENT",
    icon: "fas fa-times-circle text-warning",
    type: "reject",
  },
];

function ContractHardCopyDoc(props) {
  function handleAction(type, data) {
    console.log("type", type);
    console.log("data", data);
  }
  return (
    <React.Fragment>
      <div className="table-wrapper-scroll-y my-custom-scrollbar">
        <div className="segment-table">
          <div className="hecto-8">
            <table className="table-bordered overflow-auto">
              <thead>
                <tr>
                  <th className="bg-primary text-white align-middle td-40">
                    nama Dokumen
                  </th>
                  <th className="bg-primary text-white align-middle td-25">
                    tanggal dokumen
                  </th>
                  <th className="bg-primary text-white align-middle td-25">
                    lihat dokumen
                  </th>
                  <th className="bg-primary text-white align-middle td-10">
                    aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SPP</td>
                  <td>-</td>
                  <td className="align-middle text-center">-</td>
                  <td className="align-middle">
                    <ButtonAction
                      data={"1"}
                      handleAction={handleAction}
                      ops={data_ops}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Invoice</td>
                  <td>-</td>
                  <td className="align-middle text-center">-</td>
                  <td className="align-middle">
                    <ButtonAction
                      data={"1"}
                      handleAction={handleAction}
                      ops={data_ops}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Kwitansi</td>
                  <td>-</td>
                  <td className="align-middle text-center">-</td>
                  <td className="align-middle">
                    <ButtonAction
                      data={"1"}
                      handleAction={handleAction}
                      ops={data_ops}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Faktur pajak</td>
                  <td>-</td>
                  <td className="align-middle text-center">-</td>
                  <td className="align-middle">
                    <ButtonAction
                      data={"1"}
                      handleAction={handleAction}
                      ops={data_ops}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ContractHardCopyDoc));
