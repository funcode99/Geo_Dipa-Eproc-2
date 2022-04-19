import { CircularProgress, Grid } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  fetch_api_sg,
  getLoading,
} from "../../../../../../../../redux/globalReducer";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import NoDataBox from "../../../../../../../components/boxes/NoDataBox/NoDataBox";
import StatusRemarks from "../../../../../../../components/StatusRemarks";
import BoxSignSA from "../BoxSignSA";
import SectionHeader from "./components/SectionHeader";
import SectionSummary from "./components/SectionSummary";
import SectionTable from "./components/SectionTable";

const key = "cancelling-sa";

const DetailServAcceptance = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => getLoading(state, key));
  const { fullData, dataSA, isClient } = props;
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
  const qr_params = React.useMemo(
    () => ({
      id: dataSA?.id,
      type: "sa",
      user: isClient ? "user" : "vendor",
    }),
    [dataSA, isClient]
  );
  const onCancelSA = React.useCallback(() => {
    dispatch(
      fetch_api_sg({
        key,
        type: "post",
        url: `/delivery/sap/cancel-sa/${dataSA?.id}`,
        alertAppear: "both",
      })
    );
  }, [dispatch, dataSA]);
  console.log(`props`, props);
  return (
    <Card>
      <CardHeader
        title={
          <StatusRemarks status={"CANCELED"} remarks={dataSA?.canceled_at} />
        }
      >
        <CardHeaderToolbar>
          <div className="kt-widget19__action">
            <button
              onClick={onCancelSA}
              disabled={loading}
              className={`btn btn-sm btn-label-danger btn-bold mr-3`}
            >
              {loading && (
                <CircularProgress
                  className={"mr-2"}
                  size="0.875rem"
                  color="inherit"
                />
              )}
              Cancel SA
            </button>
          </div>
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
            params={qr_params}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

export default DetailServAcceptance;
