/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";

const SummaryStatsDM = ({ data, className, authStatus, openModal }) => {
  return (
    <div className={`card card-custom bg-gray-100 ${className}`}>
      {/* Header */}
      <div className="card-header border-0 bg-danger py-5">
        <h3 className="card-title font-weight-bolder text-white">
          Summary Contract
        </h3>
      </div>
      {/* Stat */}
      <div className="card-spacer mt10">
        {/* <div className="row m-0"> */}
        <div className=" bg-light-warning px-8 py-3 rounded-xl mb-7">
          <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
            <span className="text-warning font-weight-bolder d-block font-size-lg">
              {data?.on_progress}
            </span>
          </span>
          <Link
            // to={`/${authStatus}/delivery-monitoring/contract`}
            className="text-warning font-weight-bold font-size-h6"
            onClick={() => openModal("onprogress")}
          >
            On Progress
          </Link>
        </div>
        <div className=" bg-light-primary px-8 py-3 rounded-xl mb-7">
          <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
            <span className="text-primary font-weight-bolder d-block font-size-lg">
              {data?.sagr}
            </span>
          </span>
          <Link
            // to={`/${authStatus}/delivery-monitoring/contract`}
            className="text-primary font-weight-bold font-size-h6"
            onClick={() => openModal("success")}
          >
            Success
          </Link>
        </div>
        <div className=" bg-light-danger px-8 py-3 rounded-xl mb-7">
          <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
            <span className="text-danger font-weight-bolder d-block font-size-lg">
              {data?.overdue}
            </span>
          </span>
          <Link
            // to={`/${authStatus}/delivery-monitoring/contract`}
            className="text-danger font-weight-bold font-size-h6"
            onClick={() => openModal("overdue")}
          >
            Overdue
          </Link>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default SummaryStatsDM;
