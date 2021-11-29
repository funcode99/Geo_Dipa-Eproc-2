import React from "react";
import ToDoDM from "./components/ToDoDM";

const DashboardDM = () => {
  return (
    <div className={"row"}>
      <div className="col-lg-6 col-xxl-4" style={{ maxHeight: "95vh" }}>
        <ToDoDM className="card-stretch gutter-b" />
      </div>
    </div>
  );
};

export default DashboardDM;
