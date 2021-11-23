import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
});

export default function PaginationNotif({ onChange, total_page, page }) {
  const classes = useStyles();
  const theme = useTheme();
  //   const [activeStep, setActiveStep] = React.useState(0);
  const activeStep = page - 1;
  const step = total_page;

  const handleNext = React.useCallback(() => {
    onChange({ page: page + 1 });
  }, [page, onChange]);
  const handleBack = React.useCallback(() => {
    onChange({ page: page - 1 });
  }, [page, onChange]);

  return (
    <MobileStepper
      variant="text"
      steps={step}
      position="static"
      activeStep={activeStep}
      className={classes.root}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === step - 1}
        >
          Next
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );
}
