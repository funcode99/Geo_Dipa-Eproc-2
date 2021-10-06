import { Paper } from "@material-ui/core";
import React from "react";
import IL_NoData from "../../../modules/DeliveryMonitoring/assets/ilustration/IL_NoData";

const NoDataBox = ({ text }) => {
  return (
    <Paper
      className={"d-flex justify-content-center align-items-center mt-3"}
      style={{
        height: "30vh",
        flexDirection: "column",
      }}
    >
      <IL_NoData />
      <p className="text-dark-75 font-size-lg mt-3">{text}</p>
    </Paper>
  );
};

export default NoDataBox;
