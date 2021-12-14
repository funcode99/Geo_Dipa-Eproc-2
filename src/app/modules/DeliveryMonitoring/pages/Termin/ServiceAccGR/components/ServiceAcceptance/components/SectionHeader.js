import React, { useMemo } from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";
import { formatSADate } from "../../../../../../../../libs/date";

const client = {
  name: "PT. GEO DIPA ENERGI",
  address1: "Plant Bandung",
  address2: "Jl. Aditiawarman Kv.55",
  address3: "Jaksel",
};

const SectionHeader = ({ header }) => {
  const tab1 = useMemo(
    () => [
      { value: client?.name },
      { value: client?.address1 },
      { value: client?.address2 },
      { value: client?.address3 },
    ],
    [client]
  );
  const tab2 = useMemo(
    () => [
      { label: "Number", value: header?.sheet_no || "-" },
      { label: "Page", value: "1 of 1" },
      {
        label: "Posting Date",
        value: formatSADate(header?.post_date) || "-",
      },
      {
        label: "Document Date",
        value: formatSADate(header?.doc_date) || "-",
      },
    ],
    [header]
  );
  return (
    <div className={"row"}>
      <div className="col-sm-4 d-flex align-items-center">
        <img
          src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
          alt="IconGde"
        />
      </div>
      <div className="col-sm-8">
        <div className="row d-flex justify-content-end">
          <div className="col-sm-6 mr-6"></div>
          <div className="col-sm-6">
            <h4>SERVICE ACCEPTANCE</h4>
          </div>
        </div>
        <div className="row mr-0">
          <div className="col-sm-6 border mr-3">
            <div className="d-flex flex-column">
              {tab1.map((el, id) => (
                <span key={id}>{el.value}</span>
              ))}
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
