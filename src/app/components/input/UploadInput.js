import React from "react";
import { Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";

const UploadInput = ({ onChange, classLabel, value, ...other }) => {
  const _handleChange = React.useCallback(
    (e) => {
      onChange({ path: e.target.value, data: e.target.files[0] });
    },
    [onChange]
  );
  const idNow = "upload" + Date.now();
  return (
    <React.Fragment>
      <label htmlFor={idNow} className={`input-group pointer ${classLabel}`}>
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="fas fa-file-upload"></i>
          </span>
        </div>
        <span
          className="form-control"
          style={{ backgroundColor: other.disabled ? "#ebebeb" : undefined }}
        >
          {value?.path ?? <FormattedMessage id="TITLE.CHOOSE_FILE" />}
        </span>
        {/* <span className={`input-group-text`}>
          <a download={"sppData?.file_name"} href={"sppData?.file"}>
            <i className="fas fa-download"></i>
          </a>
        </span>
        <span className={`input-group-text`}>
          <i className="fas fa-eye"></i>
        </span> */}
      </label>
      <input
        type="file"
        className="d-none"
        id={idNow}
        onChange={_handleChange}
        {...other}
      />
    </React.Fragment>
  );
};

export default UploadInput;
