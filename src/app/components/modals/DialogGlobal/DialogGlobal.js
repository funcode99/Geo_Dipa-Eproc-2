import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";

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

class DialogGlobal extends React.Component {
  state = {
    open: false,
  };

  open = () => {
    this.setState({
      open: true,
    });
  };

  close = () => {
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
    const { children, title, textYes, textNo, btnAction } = this.props;
    return (
      <div>
        <Dialog
          onClose={this.close}
          aria-labelledby="customized-dialog-title"
          open={this.state.open}
          maxWidth={"sm"}
          fullWidth={true}
        >
          <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
          <DialogContent dividers>{children}</DialogContent>
          <DialogActions>
            {btnAction}
            <Button
              variant="contained"
              className={"bg-primary text-light"}
              onClick={this.handleYes}
            >
              {textYes ? textYes : <FormattedMessage id="TITLE.SAVE" />}
            </Button>
            <Button
              variant="contained"
              className={"bg-danger text-light"}
              onClick={this.close}
            >
              {textNo ? textNo : <FormattedMessage id="TITLE.CANCEL" />}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DialogGlobal;
