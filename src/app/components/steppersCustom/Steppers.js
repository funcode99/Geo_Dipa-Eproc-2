import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import "./styles.scss";

function getSteps() {
  return [
    {
      label: "Data 1",
      status: "COMPLETE",
    },
    {
      label: "Data 2",
      status: "COMPLETE",
    },
    {
      label: "Data 3",
      status: "COMPLETE",
    },
    {
      label: "Data 4",
      status: "COMPLETE",
    },
    {
      label: "Data 5",
      status: "ON PROGRESS",
    },
    {
      label: "Data 6",
      status: "NO STARTED",
    },
    {
      label: "Data 7",
      status: "NO STARTED",
    },
  ];
}

const Steppers = (props) => {
  const { drafting, steps = getSteps() } = props;
  const slicedSteps = steps.slice(drafting ? 3 : 0);
  return (
    <React.Fragment>
      {steps && steps.length > 0 && (
        <Stepper alternativeLabel>
          {slicedSteps.map((item, index) => (
            <Step
              key={index.toString()}
              // key={(index + 3).toString()}
              completed={
                item.status === "COMPLETE" || item.status === "done"
                  ? true
                  : false
              }
              active={
                item.status === "ON PROGRESS" || item.status === "on"
                  ? true
                  : false
              }
            >
              <StepLabel>{item.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </React.Fragment>
  );
};

export default injectIntl(connect(null, null)(Steppers));
