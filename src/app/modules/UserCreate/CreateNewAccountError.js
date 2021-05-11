import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import * as auth from "../Auth/_redux/authRedux";
import { FormattedMessage } from "react-intl";

function CreateNewAccountError(props) {

    return (
        <div className="d-flex flex-row my-auto">
            <div className="flex-row-fluid col-lg-4 col-1"></div>
            <div className="flex-row-fluid col-lg-4 col-11">
                <div className="card card-custom card-stretch">
                    <div className="card-body">
                        <div className="form-group row text-center mb-12 mt-5">
                            <div className="col-lg-12 col-xl-12">
                                <i className="far fa-frown" style={{ fontSize: '9rem', color: '#90909C' }}></i>
                            </div>
                        </div>
                        <div className="form-group row text-center mb-6">
                            <div className="col-lg-12 col-xl-12">
                                <h2 style={{ color: '#48484E' }}><FormattedMessage id="TITLE.CREATE_ACCOUNT.ERROR_PAGE.TITLE" /></h2>
                            </div>
                        </div>
                        <div className="form-group row text-center">
                            <div className="col-lg-12 col-xl-12">
                                <h4 style={{ color: '#48484E' }}><FormattedMessage id="TITLE.CREATE_ACCOUNT.ERROR_PAGE.BODY" /></h4>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-lg-12 col-xl-12">
                                <Link to="/" className="btn btn-primary btn-lg btn-block">
                                    <FormattedMessage id="TITLE.CREATE_ACCOUNT.ERROR_PAGE.BUTTON" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-row-fluid col-lg-4 col-1"></div>
        </div>
    );
}

export default injectIntl(connect(null, auth.actions)(CreateNewAccountError));
