import React from "react";
import { Alert, Button } from "react-bootstrap";

const AlertLate = ({ onClick, dataLate }) => {
  return (
    <Alert
      variant="warning"
      className={"d-flex align-items-center justify-content-between"}
    >
      <div className={"d-flex flex-column"}>
        <Alert.Heading className={"h5"}>
          Berkas berikut terlambat disediakan oleh vendor :
        </Alert.Heading>
        <ul>
          {dataLate.map((el, id) => (
            <li key={id}>{el}</li>
          ))}
        </ul>
        {/* <p className={"mb-0"}>
          Laporan Harian, Sertifikat kalibrasi, Manual Book
        </p> */}
      </div>
      {/* <div>
        <Button onClick={onClick} variant="outline-warning">
          Lengkapi Sekarang
        </Button>
      </div> */}
    </Alert>
  );
};

export default AlertLate;
