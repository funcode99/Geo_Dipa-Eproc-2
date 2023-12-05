import React from "react";

const Title = ({ title, required, marginTop }) => {
  return (
    <h1
      style={{
        marginTop: marginTop ? marginTop : 8,
        fontSize: 16,
        fontWeight: 600,
      }}
    >
      {title}
      {required && <span style={{ color: "red" }}>*</span>}
    </h1>
  );
};

export default Title;
