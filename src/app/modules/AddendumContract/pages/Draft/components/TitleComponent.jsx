import React from "react";

const TitleComponent = ({ title, required, marginTop }) => {
  return (
    <h3
      style={{
        marginTop: marginTop ? marginTop : 8,
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {title}
      {required && <span style={{ color: "red" }}>*</span>}
    </h3>
  );
};

export default TitleComponent;
