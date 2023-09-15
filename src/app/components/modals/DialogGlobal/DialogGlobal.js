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

import {
  compose,
  spacing,
  palette,
  styleFunctionSx
} from "@material-ui/system"

import { styled } from "@material-ui/styles"

import CloseIcon from "@material-ui/icons/Close"
import { FormattedMessage } from "react-intl"

const styleFunction = styleFunctionSx(compose(spacing, palette))
const DialogActionsCustom = styled(MuiDialogActions)(styleFunction)
const DialogContentCustom = styled(MuiDialogContent)(styleFunction)

const Transition = React.forwardRef(function Transition(props, ref) {
  console.log(props)
  console.log(ref)
  return <Slide direction="up" ref={ref} {...props} />
})

// oalah ternyata seperti ini cara styling nya
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

const customStyles = () => ({
  root: {
    minHeight: 0
  }
})



const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose } = props
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
  }

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props;
    if (visible !== undefined) {
      if (visible !== prevProps.visible) this.setState({ open: visible })
    }
  }

  open = () => {
    this.setState({
      open: true,
    })
  }

  close = () => {
    const { onClose } = this.props
    if (typeof onClose === "function") onClose()
    this.setState({ open: false })
  }

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
      yesButton = false,
      noButton = false
    } = this.props
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

          {
            !yesButton && (
              <DialogContent dividers>{this.state.open && children}</DialogContent>
            )
          }

          {
            yesButton && (
              <DialogContentCustom
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {children}
              </DialogContentCustom>
            )
          }


          <DialogActionsCustom
            sx={{
              justifyContent: 'center',
              gap: '10px 40px',
              flexWrap: 'wrap'
            }}
          >
            
              {yesButton && (
                  <Button
                    variant="contained"
                    className={"bg-primary text-light border border-light shadow-none"}
                  >
                    Yes
                  </Button>
              )}

              {noButton && (  
                  <Button
                    variant="contained"
                    className={"bg-light text-primary border border-primary shadow-none"}
                    onClick={this.close}
                  >
                    No
                  </Button>
              )}

          </DialogActionsCustom>

          <DialogActions>
            
            {btnAction}

            {isCancel && (
              <Button
                variant="contained"
                className={"bg-danger text-light"}
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
