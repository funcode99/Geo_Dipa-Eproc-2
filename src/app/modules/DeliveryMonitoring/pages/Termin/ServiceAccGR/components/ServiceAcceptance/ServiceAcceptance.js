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
import GRAccord from "../GRAccord";
import SectionHeader from "./components/SectionHeader";
import SectionSummary from "./components/SectionSummary";
import SectionTable from "./components/SectionTable";
import DetailServAcceptance from "./DetailServAcceptance";

const ServiceAcceptance = ({ data, isClient, showCancel = true }) => {
  const task_sa = data?.task_sa;
  const task_sa_array = data?.task_sa_array;
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
    <div className={"mt-3"}>
      {task_sa_array.map((els, id) => (
        <GRAccord
          key={id}
          id={"els.material_document"}
          label={`SA ${els.po_number}`}
        >
          <>
            <DetailServAcceptance
              header={els?.sa_header}
              fullData={data}
              items={els?.sa_items}
              dataSA={els}
              isClient={isClient}
              showCancel={showCancel}
            />
          </>
        </GRAccord>
      ))}
    </div>
  );

  return (
    <DetailServAcceptance
      header={task_sa?.sa_header}
      fullData={data}
      items={task_sa?.sa_items}
      dataSA={task_sa}
      isClient={isClient}
    />
  );
};

export default ServiceAcceptance;
