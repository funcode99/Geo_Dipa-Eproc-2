import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import Navs from "../../../../../components/navs";
import { FormattedMessage } from "react-intl";
import { ServiceAcceptance, GoodReceipt } from "./components";
import { TerminPageContext } from "../TerminPageNew/TerminPageNew";
import { KEYS_TERMIN } from "../TerminPageNew/STATIC_DATA";
import { data } from "jquery";

const navListSA = [
  { id: "link-sa", label: <FormattedMessage id="TITLE.SERVICE_ACCEPTANCE" /> },
  { id: "link-gr", label: <FormattedMessage id="TITLE.GOOD_RECEIPT" /> },
];

const SAGRPage = () => {
  const [navActive, setNavActive] = React.useState(navListSA[0].id);
  const { func, task_id, loadings, authStatus } = React.useContext(
    TerminPageContext
  );
  const [content, setContent] = React.useState({
    task_sa: null,
    task_gr: null,
    contract: null,
  });
  const loading = loadings[KEYS_TERMIN.f_sa_gr];
  const isClient = authStatus === "client";

  const handleRefresh = () => {
    func.handleApi({
      key: KEYS_TERMIN.f_sa_gr,
      onSuccess: (res) => {
        // console.log(`res sa gr`, res);
        setContent((prev) => ({
          ...prev,
          ...res.data,
        }));
      },
    });
  };

  React.useEffect(() => {
    handleRefresh();
  }, []);
  // console.log(`content sa gr`, content);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Navs
            navLists={navListSA}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />
          {navActive === "link-sa" && (
            <ServiceAcceptance
              data={content}
              isClient={isClient}
              loading={loading}
            />
          )}
          {navActive === "link-gr" && (
            <GoodReceipt data={content} isClient={isClient} loading={loading} />
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default SAGRPage;
