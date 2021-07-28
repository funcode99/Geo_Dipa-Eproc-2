import React from "react";
import { Col } from "react-bootstrap";
import { Box } from "@material-ui/core";

const ColDetail = ({ label, value, position = "left" || "right" }) => {
  const colClass =
    position === "left" ? "pr-0" : position === "right" ? "pl-0" : "px-0";

  return (
    <Col xs={6} className={colClass}>
      <Box border={1} padding={1} paddingBottom={0}>
        <p className="mb-0">{label}</p>
        <p className="mb-0">{value}</p>
      </Box>
    </Col>
  );
};

export default ColDetail;
