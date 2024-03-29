import React from "react";

const StatusRemarks = ({
  status,
  remarks,
  url,
  withFile,
  approvedBy,
  className,
  role,
}) => {
  const isRejected = status === "REJECTED" || status === "CANCELED";
  const isApproved = status === "APPROVED";
  const isWaiting = status === "WAITING";
  const approvedText = isApproved ? `by ${approvedBy}` : "";
  const rejectText = isRejected ? remarks : "";
  const waitingText =
    isWaiting && withFile
      ? `${status} ${url ? `APPROVAL ${role}` : `UPLOAD`}`
      : status;
  const colorScheme = isApproved
    ? "primary"
    : isRejected
    ? "danger"
    : "warning";

  // if (isApproved) {
  return (
    <div className={`d-flex flex-column align-items-start ${className}`}>
      <span
        className={`label label-sm label-light-${colorScheme} label-inline mr-2`}
      >
        {waitingText || status || "-"}&nbsp;
        <span
          style={{
            fontWeight: "bold",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {`  ` + approvedText}
        </span>
      </span>
      {isRejected && (
        <span className="text-muted font-weight-bold">{rejectText}</span>
      )}
    </div>
  );
  // }

  // return (
  //   <div className="d-flex flex-column flex-grow-1">
  //     <p className="text-dark-75 font-size-lg mb-1">
  //       {isWaiting || status || "-"}
  //     </p>
  //     <span className="text-muted font-weight-bold">
  //       {isRejected || approvedText}
  //     </span>
  //   </div>
  // );
};

export default StatusRemarks;
