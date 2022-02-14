import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import './ModalSession.css';
import { MODAL } from './ModalService';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class ModalCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogState: true
        }
    }

    loginPage() {
        if (this.props.data?.status) {
            window.location.replace(window.location.origin)
        } else {
            MODAL.hide()
        }
    }

    render() {
        const { dialogState } = this.state;
        return (
            <Dialog
                open={dialogState}
                keepMounted
                // onClose={this.handleOk.bind(this)}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className={`${!this.props.data?.status ? "text-danger" : null}`}>{this.props.data?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <h4>{this.props.data?.body}</h4>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={this.loginPage.bind(this)} className={`btn btn-sm ${this.props.data?.status ? "btn-primary" : "btn-secondary"}`}>
                        {this.props.data?.button}
                    </button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default ModalCreate;