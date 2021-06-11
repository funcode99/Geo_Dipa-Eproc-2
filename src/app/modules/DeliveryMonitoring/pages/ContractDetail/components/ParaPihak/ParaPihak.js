import React from "react";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import Navs from "../../../../../../components/navs";
import { formData1, formData2 } from "./fieldData";

const navLists = [
  {
    id: "pertama",
    label: "PIHAK PERTAMA",
  },
  {
    id: "kedua",
    label: "PIHAK KEDUA",
  },
];

const ParaPihak = () => {
  const [navActive, setNavActive] = React.useState(navLists[0].id);

  return (
    <Card>
      <CardBody>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        />
        {navActive === "pertama" && (
          <FieldBuilder readOnly formData={formData1} />
        )}
        {navActive === "kedua" && (
          <FieldBuilder readOnly formData={formData2} />
        )}
      </CardBody>
    </Card>
  );
};

export default ParaPihak;
