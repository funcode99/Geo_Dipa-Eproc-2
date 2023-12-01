import React from "react";
import { InputGroup, FormControl } from "react-bootstrap";

const TextAreaInput = ({ placeholder, defaultValue }) => {
  return (
    <InputGroup>
      <FormControl
        as="textarea"
        aria-label="With textarea"
        rows={4}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mb-3"
        style={{ border: "1px solid black" }}
      />
    </InputGroup>
  );
};

export default TextAreaInput;
