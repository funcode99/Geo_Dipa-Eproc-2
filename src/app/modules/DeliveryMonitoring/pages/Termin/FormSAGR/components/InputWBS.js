import React from "react";

const InputWBS = ({ onOpen }) => {
  return (
    <div className="form-group mb-0">
      <div className="input-group">
        <input
          disabled
          type="text"
          className="form-control"
          placeholder="WBS Value"
        />
        <div className="input-group-append">
          <button className="btn btn-secondary" type="button" onClick={onOpen}>
            Add WBS
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputWBS;
