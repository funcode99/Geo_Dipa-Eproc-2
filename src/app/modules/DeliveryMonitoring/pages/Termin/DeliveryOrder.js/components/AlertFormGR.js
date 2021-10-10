import React from "react";
import { Alert, Button } from "react-bootstrap";

const AlertFormGR = ({}) => {
  return (
    <Alert
      variant="light"
      className={"d-flex align-items-center justify-content-between"}
    >
      <div className={"d-flex flex-column"}>
        <Alert.Heading>Anda harus melengkapi Form GR</Alert.Heading>
        <p className={"mb-0"}>Form GR dibutuhkan untuk pembuatan GR 103</p>
      </div>
      <div>
        <Button variant="outline-warning">Lengkapi Sekarang</Button>
      </div>
    </Alert>
  );
};

export default AlertFormGR;
