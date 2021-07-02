import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import Navs from "../../../../../components/navs";
import { FormattedMessage } from "react-intl";
import { ServiceAcceptance, GoodReceipt } from "./components";

const navListSA = [
  { id: "link-sa", label: <FormattedMessage id="TITLE.SERVICE_ACCEPTANCE" /> },
  { id: "link-gr", label: <FormattedMessage id="TITLE.GOOD_RECEIPT" /> },
];

const SAGRPage = () => {
  const [navActive, setNavActive] = React.useState(navListSA[0].id);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Navs
            navLists={navListSA}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />
          {navActive === "link-sa" && <ServiceAcceptance />}
          {navActive === "link-gr" && <GoodReceipt />}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default SAGRPage;
