import { Container } from "@material-ui/core";
import React from "react";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";

const TempMobile = ({ withLogo, title, children }) => {
  return (
    <Container maxWidth="sm" fixed className="my-5">
      {withLogo && (
        <div className="text-center my-3">
          <img
            src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
            style={{ width: "15em" }}
            alt="Logo"
          />
        </div>
      )}
      {title && (
        <div className="text-center my-5">
          <h1>{title}</h1>
        </div>
      )}
      <Card className="shadow-lg">
        <CardBody className="px-5 py-5">{children}</CardBody>
      </Card>
    </Container>
  );
};

export default TempMobile;
