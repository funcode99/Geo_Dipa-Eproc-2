import React from "react";

const StatusRemarks = ({ status, remarks, url, withFile }) => {
  const isRejected = status === "REJECTED";
  const isWaiting =
    withFile &&
    status === "WAITING" &&
    `${status} ${url ? "APPROVAL" : "UPLOAD"}`;

  return (
    <div className="d-flex flex-column flex-grow-1">
      <p className="text-dark-75 font-size-lg mb-1">
        {isWaiting || status || "-"}
      </p>
      <span className="text-muted font-weight-bold">
        {isRejected ? remarks : null}
      </span>
    </div>
  );
};

export default StatusRemarks;
