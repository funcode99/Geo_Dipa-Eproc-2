import React from "react";
import { Form } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { DEV_NODE } from "../../../redux/BaseHost";

const UploadInput = ({
  onChange,
  classLabel,
  value,
  isPreview = false,
  ...other
}) => {
  const _handleChange = React.useCallback(
    (e) => {
      console.log("isi upload", e.target.value, e.target.files[0]);
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
        <div
          className="form-control"
          style={{
            whiteSpace: "nowrap",
            overflow: "auto",
            overflowY: "hidden",
          }}
        >
          <span
            style={{ backgroundColor: other.disabled ? "#ebebeb" : undefined }}
          >
            {value?.path ?? <FormattedMessage id="TITLE.CHOOSE_FILE" />}
          </span>
        </div>
        {isPreview && (
          <div className="input-group-append" style={{ zIndex: 1 }}>
            <button
              className={`input-group-text text-center btn btn-sm btn-outline-secondary ${
                value.path_preview ? "" : "disabled"
              }`}
              type="button"
              disabled={!value.path_preview}
              onClick={() =>
                window.open(`${DEV_NODE}/${value.path_preview}`, "_blank")
              }
            >
              <i
                className={`fas fa-${value.path_preview ? "eye" : "eye-slash"}`}
              ></i>
              <FormattedMessage
                id={
                  value.path_preview
                    ? "LABEL.OPEN_FILE"
                    : "LABEL.FILE_UNAVAILABLE"
                }
              />
            </button>
          </div>
        )}
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
