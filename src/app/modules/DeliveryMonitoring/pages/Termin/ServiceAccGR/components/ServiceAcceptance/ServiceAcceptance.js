import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import SectionHeader from "./components/SectionHeader";
import SectionSummary from "./components/SectionSummary";
import SectionTable from "./components/SectionTable";

const ServiceAcceptance = () => {
  const print = () => {
    var printContents = window.$("#printSA").html();
    window.$("#root").css("display", "none");
    window.$("#print-content").addClass("p-5");
    window.$("#print-content").html(printContents);
    window.print();
    window.$("#root").removeAttr("style");
    window.$("#print-content").removeClass("p-5");
    window.$("#print-content").html("");
  };
  return (
    <Card>
      <CardHeader>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={print}
            className="btn btn-sm btn-primary"
          >
            <i className="fas fa-print"></i>
            <FormattedMessage id="TITLE.PRINT" /> SA
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody id="printSA">
        <SectionHeader />
        <SectionSummary />
        <SectionTable />
      </CardBody>
    </Card>
  );
};

export default ServiceAcceptance;
