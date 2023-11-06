import React, { useState, useEffect } from "react";
import Select from "react-select";
import { colourOptions } from "./data";

const Checkbox = ({ children, ...props }) => (
  <label style={{ marginRight: "1em" }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

export const ReactSelect = ({ data, func, labelName }) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [userChoice, setUserChoice] = useState(0);

  useEffect(() => {
    if (func) {
      func(userChoice);
    }
    console.log(userChoice);
  }, [userChoice]);

  console.log("isi data di react select", data);
  console.log(data !== "undefined");

  if (data) {
    data.map((item, index) => {
      item.value = index;
      item.label = item[labelName];
    });
  }

  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={typeof data !== "undefined" ? data[0] : colourOptions[0]}
        options={typeof data !== "undefined" ? data : colourOptions}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name="color"
        onChange={(choice) => setUserChoice(choice.value)}
        style={{
          marginTop: "4px",
        }}
      />

      <div
        style={{
          color: "hsl(0, 0%, 40%)",
          display: "inline-block",
          fontSize: 12,
          fontStyle: "italic",
        }}
      ></div>
    </>
  );
};
