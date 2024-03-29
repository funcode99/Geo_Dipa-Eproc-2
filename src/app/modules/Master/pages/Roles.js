import React, {
    // useState 
} from 'react';
import {
    connect
} from "react-redux";
import {
    injectIntl
} from "react-intl";
import {
    Container,
    makeStyles,
    Paper
} from '@material-ui/core';
import Tabs from '../../../components/tabs';
import RolesPage from './RolesPages/RolesPage';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
import {
    SubWrap,
} from './style';
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
    },
}));

const TabLists = [
    {
        id: 'bkb',
        label: 'BKB',
        icon: <i className="fas fa-copy mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'verification',
        label: 'Verification',
        icon: <i className="fas fa-clipboard-check mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'approval',
        label: 'Approval',
        icon: <i className="fas fa-file-invoice-dollar mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'accept',
        label: 'Acceptance',
        icon: <i className="fas fa-file-alt mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'accept_tax',
        label: 'Acceptance Tax',
        icon: <i className="fas fa-file-alt mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'accounting',
        label: 'Park AP',
        icon: <i className="fas fa-file-contract mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'park_byr',
        label: 'Park BYR',
        icon: <i className="fas fa-file-contract mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'delivery',
        label: 'Delivery',
        icon: <i className="fas fa-file-alt mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'signed_giro',
        label: 'Signed Giro',
        icon: <i className="fas fa-file-alt mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'termin_authorization',
        label: 'Termin Authorization',
        icon: <i className="fas fa-file-alt mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    }
];

const Roles = (props) => {
    const classes = useStyles();
    const [tabActiveMain, setTabActiveMain] = React.useState(0);
    const [tabActiveUnit, setTabActiveUnit] = React.useState(0);

    function handleChangeTabMain(event, newTabActive) {
        setTabActiveMain(newTabActive);
    }

    function handleChangeTabUnit(event, newTabActive) {
        setTabActiveUnit(newTabActive);
    }

    return (
        <Container className="px-0">
            <div className="d-flex align-items-center flex-wrap mr-1">
                <SubWrap className="mr-2 iconWrap">
                    <span className="svg-icon menu-icon">
                        <SVG src={toAbsoluteUrl('/media/svg/icons/Home/Book-open.svg')} />
                    </span>
                </SubWrap>
                <div className="d-flex align-items-baseline mr-5">
                    <h2 className="text-dark font-weight-bold my-2 mr-5">
                        Master Roles
                    </h2>
                </div>
            </div>
            <Paper className={classes.paper}>
                <Container>
                    <div className="d-flex align-items-baseline pt-3">
                        <h2 className="text-dark font-weight-bold my-2">
                            Roles Pusat
                    </h2>
                    </div>
                    <Tabs
                        tabActive={tabActiveMain}
                        handleChange={handleChangeTabMain}
                        tabLists={TabLists}
                    />
                </Container>
                <hr className="p-0 m-0" />
                <Container className="pt-10 pb-10">
                    {tabActiveMain === 0 && <RolesPage data={{ type: "BKB", authority: "Pusat" }} />}
                    {tabActiveMain === 1 && <RolesPage data={{ type: "Verification", authority: "Pusat" }} />}
                    {tabActiveMain === 2 && <RolesPage data={{ type: "Approval", authority: "Pusat" }} />}
                    {tabActiveMain === 3 && <RolesPage data={{ type: "Accept", authority: "Pusat" }} />}
                    {tabActiveMain === 4 && <RolesPage data={{ type: "Accept_Tax", authority: "Pusat" }} />}
                    {tabActiveMain === 5 && <RolesPage data={{ type: "Accounting", authority: "Pusat" }} />}
                    {tabActiveMain === 6 && <RolesPage data={{ type: "Park_BYR", authority: "Pusat" }} />}
                    {tabActiveMain === 7 && <RolesPage data={{ type: "Delivery", authority: "Pusat" }} />}
                    {tabActiveMain === 8 && <RolesPage data={{ type: "Signed_Giro", authority: "Pusat" }} />}
                    {tabActiveMain === 9 && <RolesPage data={{ type: "Termin_Authorization", authority: "Pusat" }} />}
                </Container>
            </Paper>
            <Paper className={classes.paper}>
                <Container>
                    <div className="d-flex align-items-baseline pt-3">
                        <h2 className="text-dark font-weight-bold my-2">
                            Roles Unit
                    </h2>
                    </div>
                    <Tabs
                        tabActive={tabActiveUnit}
                        handleChange={handleChangeTabUnit}
                        tabLists={TabLists}
                    />
                </Container>
                <hr className="p-0 m-0" />
                <Container className="pt-10 pb-10">
                    {tabActiveUnit === 0 && <RolesPage data={{ type: "BKB", authority: "Unit" }} />}
                    {tabActiveUnit === 1 && <RolesPage data={{ type: "Verification", authority: "Unit" }} />}
                    {tabActiveUnit === 2 && <RolesPage data={{ type: "Approval", authority: "Unit" }} />}
                    {tabActiveUnit === 3 && <RolesPage data={{ type: "Accept", authority: "Unit" }} />}
                    {tabActiveUnit === 4 && <RolesPage data={{ type: "Accept_Tax", authority: "Unit" }} />}
                    {tabActiveUnit === 5 && <RolesPage data={{ type: "Accounting", authority: "Unit" }} />}
                    {tabActiveUnit === 6 && <RolesPage data={{ type: "Park_BYR", authority: "Unit" }} />}
                    {tabActiveUnit === 7 && <RolesPage data={{ type: "Delivery", authority: "Unit" }} />}
                    {tabActiveUnit === 8 && <RolesPage data={{ type: "Signed_Giro", authority: "Unit" }} />}
                    {tabActiveUnit === 9 && <RolesPage data={{ type: "Termin_Authorization", authority: "Unit" }} />}
                </Container>
            </Paper>
        </Container>
    );
}

export default injectIntl(connect(null, null)(Roles));