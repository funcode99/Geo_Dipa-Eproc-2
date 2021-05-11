import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import * as auth from "../Auth/_redux/authRedux";
import CreateNewAccountPage from "./CreateNewAccount";
import CreateNewAccountErrorPage from "./CreateNewAccountError";
import { useLocation } from "react-router-dom";
import { checkToken } from "./_redux/createApi";

function CreateNewAccountHome(props) {

    const token = new URLSearchParams(useLocation().search).get('token')
    const [loading, setloading] = useState(true)
    const [validToken, setValidToken] = useState(false)
    const [data, setData] = useState({})

    useEffect(() => {
        checkToken({ token: token })
            .then(response => {
                if (response.status == 200) {
                    setValidToken(true)
                    setData(response.data.data.items)
                }
            });
    }, []);

    return (
        <div className="container-background" style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundImage: 'url(/media/bg/bg-4.jpg)' }}>
            {validToken ? (
                <CreateNewAccountPage data={data}/>
            ) : <CreateNewAccountErrorPage />}
        </div>
    );
}

export default injectIntl(connect(null, auth.actions)(CreateNewAccountHome));
