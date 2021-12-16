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

const DetailServAcceptance = (props) => {
  const { fullData } = props;
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
  console.log(`props`, props);
  return (
    <Card>
      <CardHeader title="">
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
        <SectionHeader {...props} />
        <SectionSummary {...props} />
        <SectionTable {...props} />
        <Grid container spacing={1} className={"mt-3"}>
          <Grid item xs={8}></Grid>
          <BoxSignSA
            name={
              fullData?.contract?.contract_party
                ?.party_1_director_position_full_name
            }
            date={fullData?.task_sa_array?.[0]?.createdAt}
            {...props.signProps}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

export default DetailServAcceptance;
