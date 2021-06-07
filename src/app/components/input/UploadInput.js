import React from "react";
import { FormattedMessage } from "react-intl";

const UploadInput = () => {
  return (
    <div className="col-md-6">
      <div className="form-group row">
        <label htmlFor="upload" className="col-sm-4 col-form-label">
          <FormattedMessage id="TITLE.INVOICE_MONITORING.BILLING_DOCUMENT.SPR_DOCUMENT.SPR_UPLOAD" />
        </label>
        <label htmlFor="upload" className="input-group mb-3 col-sm-8 pointer">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fas fa-file-upload"></i>
            </span>
          </div>
          <span className="form-control">{"uploadFilename"}</span>
        </label>
        {/* {(formik.touched.file && formik.errors.file) ? (
                                        <span className="col-sm-8 offset-sm-4 text-center text-danger" >
                                            {formik.errors.file}
                                        </span>
                                    ) : null} */}
        <input type="file" className="d-none" id="upload" />
      </div>
    </div>
  );
};

export default UploadInput;
