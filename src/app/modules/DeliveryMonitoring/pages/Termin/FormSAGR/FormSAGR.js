import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import Navs from "../../../../../components/navs";
import FormGR from "./components/FormGR";
import FormSA from "./components/FormSA";

const navLists = [
  { id: "form-sa", label: "Form Service Acceptance" },
  { id: "form-gr", label: "Form Good Receipt" },
];

const FormSAGR = () => {
  const [navActive, setNavActive] = React.useState("form-sa");

  return (
    <Card>
      <CardBody>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        />
        <div className="mt-5">
          {navActive === "form-sa" && <FormSA />}
          {navActive === "form-gr" && <FormGR />}
        </div>
      </CardBody>
    </Card>
  );
};

export default FormSAGR;
