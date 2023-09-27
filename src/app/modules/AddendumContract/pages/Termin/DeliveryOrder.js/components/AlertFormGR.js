import React from "react";
import { Alert, Button } from "react-bootstrap";

const AlertFormGR = ({ onClick }) => {
  return (
    <Alert
      variant="light"
      className={"d-flex align-items-center justify-content-between"}
    >
      <div className={"d-flex flex-column"}>
        <Alert.Heading className={"h5"}>
          Anda harus melengkapi Form SA / GR
        </Alert.Heading>
        <p className={"mb-0"}>
          Form SA / GR dibutuhkan untuk pembuatan Dokumen SA / GR
        </p>
      </div>
      <div>
        <Button onClick={onClick} variant="outline-warning">
          Lengkapi Sekarang
        </Button>
      </div>
    </Alert>
  );
};

export default AlertFormGR;
