import React, { useState, useEffect } from "react";
import Select from "react-select";
import { colourOptions } from "./data";

const Checkbox = ({ children, ...props }) => (
  <label style={{ marginRight: "1em" }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

export const ReactSelect = ({
  data,
  func,
  labelName,
  arrayIndex,
  currentSelect,
  nowSelect,
  type,
  disabled,
}) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [userChoice, setUserChoice] = useState(0);

  useEffect(() => {
    // saat awal muncul, sudah langsung jalan.
    if (func) {
      func(userChoice, arrayIndex, data, type);
    }
    // data.splice(userChoice, 1);
  }, [userChoice]);

  if (data) {
    data.map((item, index) => {
      item.value = index;
      item.label = item[labelName];
    });
  }

  return (
    <>
      <Select
        isDisabled={disabled}
        className="basic-single"
        classNamePrefix="select"
        defaultValue={
          currentSelect
            ? data[currentSelect]
            : nowSelect
            ? data[nowSelect]
            : typeof data !== "undefined"
            ? data[0]
            : colourOptions[0]
        }
        options={typeof data !== "undefined" ? data : colourOptions}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name="color"
        onChange={(choice) => {
          setUserChoice(choice.value);
        }}
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
