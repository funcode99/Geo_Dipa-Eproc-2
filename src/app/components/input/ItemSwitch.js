import { FormControlLabel, Switch } from "@material-ui/core";
import React from "react";
import { Col, Row } from "react-bootstrap";

const ItemSwitch = ({ label, switchProps, isActive }) => {
  const [active, setActive] = React.useState(false);
  const handleChange = () => {
    setActive((prev) => !prev);
  };
  const valueUsed = isActive !== undefined ? isActive : active;
  return (
    <Row>
      <Col md={8}>
        <FormControlLabel
          control={
            <Switch
              checked={active}
              onChange={handleChange}
              color="primary"
              {...switchProps}
            />
          }
          label={label}
        />
      </Col>
    </Row>
  );
};

export default ItemSwitch;
