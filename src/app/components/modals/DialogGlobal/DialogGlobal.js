import React from "react";
import {
  withStyles,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  IconButton,
  Typography,
  CircularProgress,
  Slide,
} from "@material-ui/core";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
// import MuiDialogContent from "@material-ui/core/DialogContent";
// import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import { FormattedMessage } from "react-intl";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

class DialogGlobal extends React.PureComponent {
  state = {
    open: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props;
    if (visible !== undefined) {
      if (visible !== prevProps.visible) this.setState({ open: visible });
    }
  }

  open = () => {
    this.setState({
      open: true,
    });
  };

  close = () => {
    const { onClose } = this.props;
    if (typeof onClose === "function") onClose();
    this.setState({ open: false });
  };

  handleYes = () => {
    const { onYes } = this.props;
    if (typeof onYes === "function") onYes();
    // this.close();
  };
  handleNo = () => {
    const { onNo } = this.props;
    if (typeof onNo === "function") onNo();
    this.close();
  };

  render() {
    const {
      children,
      title,
      textYes,
      textNo,
      btnAction,
      btnYesProps,
      btnNoProps,
      loading,
      disableBackdropClick = true,
      isSubmit = true,
      isCancel = true,
      maxWidth,
    } = this.props;
    return (
      <div>
        <Dialog
          onClose={this.close}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
          maxWidth={maxWidth || "sm"}
          fullWidth={true}
          disableBackdropClick={disableBackdropClick}
          TransitionComponent={Transition}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.close}>
            {title}
          </DialogTitle>
          <DialogContent dividers>{this.state.open && children}</DialogContent>

          <DialogActions>
            {btnAction}

            {isCancel && (
              <Button
                variant="contained"
                className={"bg-danger text-light "}
                onClick={this.close}
                {...btnNoProps}
              >
                {textNo ? textNo : <FormattedMessage id="TITLE.CANCEL" />}
              </Button>
            )}
            {isSubmit && (
              <Button
                variant="contained"
                className={"bg-primary text-light"}
                onClick={this.handleYes}
                {...btnYesProps}
                disabled={loading || btnYesProps?.disabled}
              >
                {loading && (
                  <CircularProgress
                    size="0.875rem"
                    className="mr-3"
                    color="inherit"
                  />
                )}
                {textYes ? textYes : <FormattedMessage id="TITLE.SAVE" />}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DialogGlobal;
