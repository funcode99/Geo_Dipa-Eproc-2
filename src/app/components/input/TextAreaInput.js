import React from "react";

const TextAreaInput = () => {
  return (
    <div className="col-md-6">
      <div className="form-group row">
        <label htmlFor="second" className="col-sm-4 col-form-label">
          Pihak Kedua
        </label>
        <div className="col-sm-8">
          <textarea
            rows="4"
            cols=""
            className="form-control"
            id="second"
            disabled
            defaultValue={"contractData"}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TextAreaInput;
