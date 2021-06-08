import React from "react";
import { FormattedMessage } from "react-intl";

const UploadInput = () => {
  return (
    // <div className="form-group row">
    //   <label htmlFor="upload" className="col-sm-4 col-form-label">
    //     <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_UPLOAD" />
    //   </label>
    <React.Fragment>
      <label htmlFor="upload" className="input-group mb-3 pointer">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="fas fa-file-upload"></i>
          </span>
        </div>
        <span className="form-control">{"uploadFilename"}</span>
      </label>
      <input type="file" className="d-none" id="upload" />
    </React.Fragment>
    // </div>
  );
};

export default UploadInput;
