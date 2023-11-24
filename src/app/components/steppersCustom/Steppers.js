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
  const { intl, steps = getSteps() } = props;
//  const [activeStep, setActiveStep] = React.useState(null);
//  React.useEffect(() => {
//    setActiveStep(
//      steps.findIndex((item) => {
//        return item.status === "ON PROGRESS";
//      })
//    );
//  }, [steps]);

  return (
    <React.Fragment>
      {steps && steps.length > 0 && (
        <Stepper alternativeLabel>
          {steps.map((item, index) => (
            <Step
              key={index.toString()}
              completed={item.status === "COMPLETE" ? true : false}
              active={item.status === "ON PROGRESS" ? true : false}
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
