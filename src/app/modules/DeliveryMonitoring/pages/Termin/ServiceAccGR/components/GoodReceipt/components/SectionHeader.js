import React, { useMemo } from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import { formatSADate } from "../../../../../../../../libs/date";

const client = {
  name: "PT. GEO DIPA ENERGI",
  address1: "Plant Pusat",
  address2: "Aldevco Octagon, Jl. Warung Jati",
  address3: "Barat 75",
};

const SectionHeader = ({ news, header, fullData, hideLogo }) => {
  const tab1 = useMemo(
    () => [
      { value: client?.name },
      { value: client?.address1 },
      { value: client?.address2 },
      { value: client?.address3 },
    ],
    [client]
  );
  const address = useMemo(
    () => fullData?.contract?.plant_authority?.sap_address.split("-"),
    [fullData]
  );
  const tab2 = useMemo(
    () => [
      { label: "Number", value: header?.mat_doc || "-" },
      { label: "Page", value: "1 of 1" },
      {
        label: "Posting Date",
        value: formatSADate(header?.pstng_date) || "-",
      },
      {
        label: "Document Date",
        value: formatSADate(news?.date) || "-",
      },
    ],
    [header]
  );
  return (
    <div className={"row"}>
      <div className="col-sm-4 d-flex align-items-center">
        {!hideLogo && (
          <img
            src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
            alt="IconGde"
          />
        )}
      </div>
      <div className="col-sm-8">
        <div className="row d-flex justify-content-end">
          <div className="col-sm-6 mr-6"></div>
          <div className="col-sm-6">
            <h4>GOOD RECEIPT</h4>
          </div>
        </div>
        <div className="row mr-0">
          <div className="col-sm-6 border mr-3">
            <div className="d-flex flex-column">
              {address?.length &&
                address?.map((el, id) => <span key={id}>{el}</span>)}
              {!address?.length &&
                tab1?.map((el, id) => <span key={id}>{el.value}</span>)}
            </div>
          </div>
          <div className="row col-sm-6 mr-0">
            {tab2.map((el, id) => (
              <div key={id} className="col-sm-6 border d-flex flex-column">
                <span>{el.label}</span>
                <span>{el.value}</span>
              </div>
            ))}
            {/* <div className="col-sm-6 border d-flex flex-column">
              <span>Number</span>
              <span>12441245123</span>
            </div>
            <div className="col-sm-6 border d-flex flex-column">
              <span>Page</span>
              <span>1 of 1</span>
            </div>
            <div className="col-sm-6 border d-flex flex-column">
              <span>Posting Date:</span>
              <span>11.11.2020</span>
            </div>
            <div className="col-sm-6 border d-flex flex-column">
              <span>Document Date:</span>
              <span>01.10.2020</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
