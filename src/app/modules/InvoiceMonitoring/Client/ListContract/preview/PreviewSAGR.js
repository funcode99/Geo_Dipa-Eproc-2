import React, { useCallback, useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { useParams } from "react-router-dom";
import useToast from "../../../../../components/toast";
import {
  GoodReceipt,
  ServiceAcceptance,
} from "../../../../DeliveryMonitoring/pages/Termin/ServiceAccGR/components";
import { getSaGr } from "../../../_redux/InvoiceMonitoringCrud";

const PreviewSAGR = ({ intl }) => {
  const { contract, termin, type } = useParams();
  const [contentSAGR, setcontentSAGR] = useState(null);
  const [Toast, setToast] = useToast();

  const callApiSaGr = useCallback(() => {
    getSaGr(termin)
      .then((result) => {
        setcontentSAGR((prev) => ({
          ...prev,
          ...result.data.data,
        }));
      })
      .catch((err) => {
        setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
      });
  }, []);

  useEffect(callApiSaGr, []);

  return (
    <>
      <Toast />
      {/* {type === "GOODS" && (
        <div id="GOODS">
          <GoodReceipt data={contentSAGR} loading={false} />
        </div>
      )} */}
      {type === "SA" ? (
        <div id="SA">
          <ServiceAcceptance data={contentSAGR} loading={false} />
        </div>
      ) : (
        <div id="GOODS">
          <GoodReceipt data={contentSAGR} loading={false} />
        </div>
      )}
    </>
  );
};

export default injectIntl(PreviewSAGR);
