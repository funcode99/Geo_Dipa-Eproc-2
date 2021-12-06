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
      {/* Body */}
      <div className="card-body p-0 position-relative overflow-hidden">
        {/* Stat */}
        <div className="card-spacer mt25">
          <div className="row m-0">
            <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
              <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                <span className="text-warning font-weight-bolder d-block font-size-lg">
                  {data?.on_progress}
                </span>
              </span>
              <Link
                // to={`/${authStatus}/delivery-monitoring/contract`}
                className="text-warning font-weight-bold font-size-h6"
                onClick={openModal}
              >
                On Progress
              </Link>
            </div>
            <div className="col bg-light-primary px-6 py-8 rounded-xl mr-7 mb-7">
              <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                <span className="text-primary font-weight-bolder d-block font-size-lg">
                  {data?.sagr}
                </span>
              </span>
              <Link
                // to={`/${authStatus}/delivery-monitoring/contract`}
                className="text-primary font-weight-bold font-size-h6"
                onClick={openModal}
              >
                Success
              </Link>
            </div>
            <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7 mb-7">
              <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                <span className="text-danger font-weight-bolder d-block font-size-lg">
                  {data?.overdue}
                </span>
              </span>
              <Link
                // to={`/${authStatus}/delivery-monitoring/contract`}
                className="text-danger font-weight-bold font-size-h6"
                onClick={openModal}
              >
                Overdue
              </Link>
            </div>
          </div>
        </div>

        {/* Resize */}
        <div className="resize-triggers">
          <div className="expand-trigger">
            <div style={{ width: "411px", height: "461px" }} />
          </div>
          <div className="contract-trigger" />
        </div>
      </div>
    </div>
  );
};

export default SummaryStatsDM;
