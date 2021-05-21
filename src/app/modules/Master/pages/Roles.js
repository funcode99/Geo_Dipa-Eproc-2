import React, {
    // useState 
} from 'react';
import {
    connect
} from "react-redux";
import {
    FormattedMessage,
    injectIntl
} from "react-intl";
import {
    Container,
    makeStyles,
    Paper
} from '@material-ui/core';
import Tabs from '../../../components/tabs';
import RolesBKB from './RolesPages/RolesBKB';
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
    }
];

const Roles = (props) => {
    const { intl } = props;
    const classes = useStyles();
    const [tabActive, setTabActive] = React.useState(0);

    function handleChangeTab(event, newTabActive) {
        setTabActive(newTabActive);
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
                        Master Periode
                    </h2>
                </div>
            </div>
            <Paper className={classes.paper}>
                <Container>
                    <Tabs
                        tabActive={tabActive}
                        handleChange={handleChangeTab}
                        tabLists={TabLists}
                    />
                </Container>
                <hr className="p-0 m-0" />
                <Container className="pt-10 pb-10">
                    {tabActive === 0 && <RolesBKB />}
                </Container>
            </Paper>
        </Container>
    );
}

export default injectIntl(connect(null, null)(Roles));