import React from "react";

const UpdateButton = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 28,
        padding: "2rem 0",
      }}
    >
      <button
        type="submit"
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: "400",
          padding: "8px 14px",
          borderRadius: "8px",
          backgroundColor: "#8c8a8a",
          outline: "none",
          border: "none",
        }}
      >
        Update
      </button>
    </div>
  );
};

export default UpdateButton;
