import { Grid } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import NoDataBox from "../../../../../../../components/boxes/NoDataBox/NoDataBox";
import BoxSignSA from "../BoxSignSA";
import SectionHeader from "./components/SectionHeader";
import SectionSummary from "./components/SectionSummary";
import SectionTable from "./components/SectionTable";
import DetailServAcceptance from "./DetailServAcceptance";

const ServiceAcceptance = ({ data, isClient }) => {
  const task_sa = data?.task_sa;
  const qr_params = React.useMemo(
    () => ({
      id: data?.task_sa?.id,
      type: "sa",
      user: isClient ? "user" : "vendor",
    }),
    [data, isClient]
  );

  if (task_sa == null) {
    return <NoDataBox text={"Service Acceptance not Available"} />;
  }

  return (
    <DetailServAcceptance
      header={task_sa?.sa_header}
      fullData={{}}
      items={task_sa?.sa_items}
      dataSA={task_sa}
    />
  );
};

export default ServiceAcceptance;
