import React from "react";
import { Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";

const UploadInput = ({ onChange, value, ...other }) => {
  const _handleChange = React.useCallback(
    (e) => {
      onChange({ path: e.target.value, data: e.target.files[0] });
    },
    [onChange]
  );
  return (
    <React.Fragment>
      <label htmlFor="upload" className="input-group pointer">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="fas fa-file-upload"></i>
          </span>
        </div>
        <span className="form-control">{value?.path ?? "Pilih File ..."}</span>
      </label>
      <input
        type="file"
        className="d-none"
        id="upload"
        onChange={_handleChange}
        {...other}
      />
    </React.Fragment>
  );
};

export default UploadInput;
