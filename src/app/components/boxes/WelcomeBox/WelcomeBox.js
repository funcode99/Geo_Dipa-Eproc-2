import { Paper } from "@material-ui/core";
import React from "react";
import IL_Welcome from "../../../modules/DeliveryMonitoring/assets/ilustration/IL_Welcome";

const WelcomeBox = () => {
  return (
    <Paper
      className={"d-flex justify-content-center align-items-center mt-8 p-12"}
      style={{
        height: "60vh",
        flexDirection: "column",
      }}
    >
      <IL_Welcome />
      <p className="text-dark-75 font-size-lg mt-3">Welcome onboard !</p>
    </Paper>
  );
};

export default WelcomeBox;
