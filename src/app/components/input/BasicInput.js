import React from "react";

const BasicInput = ({}) => {
  return (
    <div className="col-md-6">
      <div className="form-group row">
        <label htmlFor="numberContract" className="col-sm-4 col-form-label">
          Number Contract
        </label>
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            id="numberContract"
            defaultValue={'contractData["contract_no"]'}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInput;
