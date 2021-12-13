import React from "react";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";

const SectionHeader = ({}) => {
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
              <span>PT. GEO DIPA ENERGI</span>
              <span>Plant Bandung</span>
              <span>Jl. Aditiawan Kv. 55</span>
              <span>Jaksel</span>
            </div>
          </div>
          <div className="row col-sm-6 mr-0">
            <div className="col-sm-6 border d-flex flex-column">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
