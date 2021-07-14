import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import UploadInput from "../../../../../../components/input/UploadInput";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return ["Document Ready", "Upload Signed Document", "Approval"];
}

export default function StepperDoc({ renderBtns, active, taskNews, isReject }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <Typography>
              {taskNews
                ? "Dokumen BAPP siap diunduh."
                : "Menunggu kelengkapan form."}
            </Typography>
            {/* <UploadInput /> */}
          </div>
        );
      case 1:
        return (
          <div>
            <Typography>
              {isReject
                ? "Dokumen yang telah anda masukkan ditolak, mohon upload dokumen lain."
                : "Upload Dokumen yang telah ditandatangani kedua belah pihak."}
            </Typography>
            {isReject && taskNews?.reject_text && (
              <React.Fragment>
                <strong>Alasan penolakan :</strong>
                <Typography>{taskNews?.reject_text}</Typography>
              </React.Fragment>
            )}
          </div>
        );
      case 2:
        return "Menunggu proses approval.";
      case 3:
        return `Tahapan proses pada dokumen BAPP telah selesai.`;
      default:
        return "Unknown step";
    }
  }

  const stepUsed = active !== undefined ? active : activeStep;

  return (
    <div className={classes.root}>
      <Stepper activeStep={stepUsed} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(index)}
              {renderBtns(index)}
              {/* <Typography>{getStepContent(index)}</Typography> */}
              {/* <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={stepUsed === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {stepUsed === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div> */}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {/* {stepUsed === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )} */}
    </div>
  );
}
