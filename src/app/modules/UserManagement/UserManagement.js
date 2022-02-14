import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {
    Paper,
    Container
} from "@material-ui/core";
import Tabs from "../../components/tabs";
import UserRoles from "./pages/UserRoles";
import PicRoles from "./pages/PicRoles";

const TabLists = [
    {
        id: 'users',
        label: 'Users Eproc',
        icon: <i className="fas fa-user-friends mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'pic',
        label: 'PIC Vendors',
        icon: <i className="fas fa-user mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
];

function UserManagement(props) {
    const [tabActiveMain, setTabActiveMain] = React.useState(0);

    function handleChangeTabMain(event, newTabActive) {
        setTabActiveMain(newTabActive);
    }

    return (
        <React.Fragment>
            <Paper>
                <Container>
                    <Tabs
                        tabActive={tabActiveMain}
                        handleChange={handleChangeTabMain}
                        tabLists={TabLists}
                    />
                </Container>
                <hr className="p-0 m-0" />
                {tabActiveMain === 0 && <UserRoles />}
                {tabActiveMain === 1 && <PicRoles />}
            </Paper>
        </React.Fragment>
    );
}

export default injectIntl(connect(null, null)(UserManagement));
