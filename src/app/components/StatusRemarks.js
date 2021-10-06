import React from "react";

const StatusRemarks = ({ status, remarks, url, withFile, approvedBy }) => {
  const isRejected = status === "REJECTED" ? remarks : "";
  const isApproved = status === "APPROVED" ? `by ${approvedBy}` : "";
  const isWaiting =
    status === "WAITING" && withFile
      ? `${status} ${url ? "APPROVAL" : "UPLOAD"}`
      : status;

  return (
    <div className="d-flex flex-column flex-grow-1">
      <p className="text-dark-75 font-size-lg mb-1">
        {isWaiting || status || "-"}
      </p>
      <span className="text-muted font-weight-bold">
        {isRejected || isApproved}
      </span>
    </div>
  );
};

export default StatusRemarks;
