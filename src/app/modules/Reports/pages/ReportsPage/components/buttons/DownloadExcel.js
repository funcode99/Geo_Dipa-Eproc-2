import React, { useEffect, useState } from "react";
import { formatDateWTime } from "../../../../../../libs/date";

const DownloadExcel = ({ ExcelDownloder, data, type, query }) => {
  const [forceDisable, setForceDisable] = useState(false);
  useEffect(() => {
    setForceDisable(true);
    setTimeout(() => {
      setForceDisable(false);
    }, 150);
  }, [query]);

  if (!data.length || forceDisable) {
    return (
      <button className="btn btn-success btn-sm px-5 ml-3" disabled>
        Download
      </button>
    );
  }
  const dateBase = new Date();
  return (
    <ExcelDownloder
      data={{
        Sheet1: data,
      }}
      filename={"Laporan-" + formatDateWTime(dateBase)}
      type={type}
      className="btn btn-success btn-sm px-5 ml-3"
    >
      {"Download"}
    </ExcelDownloder>
  );
};

export default DownloadExcel;
