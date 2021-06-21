import React, {
    useState
} from 'react';
import {
    Slide,
    IconButton
} from '@material-ui/core';
import {
    connect
} from "react-redux";
import {
    injectIntl
} from "react-intl";
import {
    Card,
    CardBody
} from "../../../../../_metronic/_partials/controls";
import Navs from '../../../../components/navs';
import ContractInvoicePage from './ContractBillingDocument/ContractInvoicePage';
import ContractSprPage from './ContractBillingDocument/ContractSprPage';
import ContractReceiptPage from './ContractBillingDocument/ContractReceiptPage';
import ContractTaxPage from './ContractBillingDocument/ContractTaxPage';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(3),
        top: theme.spacing(0),
        backgroundColor: "#187de4",
        "&:hover": {
            background: "#f00",
        },
    }
});

const useStyles = makeStyles((theme => ({
    textHover: {
        "&:hover i": {
            color: "#181C32 !important"
        },
    },
    textDisabled: {
        backgroundColor: "#F3F6F9"
    }
})))

export const DialogTitleFile = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <i className="fas fa-times text-light"></i>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ItemContractInvoice(props) {

    const navLists = [
        {
            id: 'SPR',
            label: 'SPR'
        },
        {
            id: 'Invoice',
            label: 'Invoice'
        },
        {
            id: 'Kwitansi',
            label: 'Kwitansi'
        },
        {
            id: 'Faktur',
            label: 'Faktur Pajak'
        },
    ];

    const [navActive, setNavActive] = useState(navLists[0].id);
    const classes = useStyles()

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <Navs
                        navLists={navLists}
                        handleSelect={(selectedKey) => setNavActive(selectedKey)}
                    />

                    {navActive === 'SPR' && (
                        <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                            <ContractSprPage {...props} classes={classes} dialogTitleFile={DialogTitleFile} transition={Transition} />
                        </div>
                    )}

                    {navActive === 'Invoice' && (
                        <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                            <ContractInvoicePage {...props} classes={classes} dialogTitleFile={DialogTitleFile} transition={Transition} />
                        </div>
                    )}

                    {navActive === 'Kwitansi' && (
                        <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                            <ContractReceiptPage {...props} classes={classes} dialogTitleFile={DialogTitleFile} transition={Transition} />
                        </div>
                    )}

                    {navActive === 'Faktur' && (
                        <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
                            <ContractTaxPage {...props} classes={classes} dialogTitleFile={DialogTitleFile} transition={Transition} />
                        </div>
                    )}

                </CardBody>
            </Card>
        </React.Fragment>
    )
}
export default injectIntl(connect(null, null)(ItemContractInvoice));