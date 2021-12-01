import React from "react";
import ActivityDM from "./components/ActivityDM";
import ToDoDM from "./components/ToDoDM";

const DashboardDM = () => {
  return (
    <div className={"row"}>
      <div className="col-lg-6 col-xxl-6" style={{ maxHeight: "95vh" }}>
        <ToDoDM className="card-stretch gutter-b" />
      </div>
      <div className="col-lg-6 col-xxl-6" style={{ maxHeight: "95vh" }}>
        <ActivityDM className="card-stretch gutter-b" checked />
      </div>
    </div>
  );
};

export default DashboardDM;
