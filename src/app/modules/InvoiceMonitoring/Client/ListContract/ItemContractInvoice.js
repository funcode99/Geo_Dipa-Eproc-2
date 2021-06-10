import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import Navs from "../../../../components/navs";
import ContractInvoicePage from "./ContractBillingDocument/ContractInvoicePage";
import ContractSprPage from "./ContractBillingDocument/ContractSprPage";
import ContractReceiptPage from "./ContractBillingDocument/ContractReceiptPage";
import ContractTaxPage from "./ContractBillingDocument/ContractTaxPage";
import ContractHardCopyDoc from "./ContractBillingDocument/ContractHardCopyDoc";

function ItemContractInvoice(props) {
  const navLists = [
    {
      id: "SPR",
      label: "SPR",
    },
    {
      id: "Invoice",
      label: "Invoice",
    },
    {
      id: "Kwitansi",
      label: "Kwitansi",
    },
    {
      id: "Faktur",
      label: "Faktur Pajak",
    },
    {
      id: "HardCopy",
      label: "Hard Copy Document",
    },
  ];

  const [navActive, setNavActive] = useState(navLists[0].id);

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <Navs
            navLists={navLists}
            handleSelect={(selectedKey) => setNavActive(selectedKey)}
          />

          {navActive === "SPR" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractSprPage {...props} />
            </div>
          )}

          {navActive === "Invoice" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractInvoicePage {...props} />
            </div>
          )}

          {navActive === "Kwitansi" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractReceiptPage {...props} />
            </div>
          )}

          {navActive === "Faktur" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractTaxPage {...props} />
            </div>
          )}

          {navActive === "HardCopy" && (
            <div className="table-wrapper-scroll-y my-custom-scrollbar my-5 h-100">
              <ContractHardCopyDoc {...props} />
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
export default injectIntl(connect(null, null)(ItemContractInvoice));
