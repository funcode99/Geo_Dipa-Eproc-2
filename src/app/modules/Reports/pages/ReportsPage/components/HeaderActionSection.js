import React from "react";
import { DownloadExcel, FilterDate, FilterUnit } from "./buttons";

const HeaderActionSection = ({ downloadProps, data }) => {
  return (
    <div className="d-flex flex-row align-items-center">
      <div style={{ flex: 1 }}>
        <h3 className="font-weight-bolder text-dark">Reports Table</h3>
      </div>
      <div className="d-flex flex-row">
        <FilterDate />
        <FilterUnit />
        <DownloadExcel {...downloadProps} data={data} />
      </div>
    </div>
  );
};

export default HeaderActionSection;
