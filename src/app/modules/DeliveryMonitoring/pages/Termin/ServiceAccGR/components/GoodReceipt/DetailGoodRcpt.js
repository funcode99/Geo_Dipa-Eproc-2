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
import BoxSignSA from "../BoxSignSA";
import SectionHeader from "./components/SectionHeader";
import SectionSummary from "./components/SectionSummary";
import SectionTable2 from "./components/SectionTable2";

const key = "cancelling-gr";

const DetailGoodRcpt = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => getLoading(state, key));
  const { fullData, dataGR, isClient } = props;
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
      id: dataGR?.id,
      type: "gr",
      user: isClient ? "user" : "vendor",
    }),
    [dataGR, isClient]
  );

  const onCancelGR = React.useCallback(() => {
    dispatch(
      fetch_api_sg({
        key,
        type: "post",
        url: `/delivery/sap/cancel-gr/${dataGR?.id}`,
        alertAppear: "both",
      })
    );
  }, [dispatch, dataGR]);
  // console.log(`props`, props);
  return (
    <Card className={"d-flex"} style={{ flex: 1 }}>
      {/* <Card> */}
      <CardHeader title="">
        <CardHeaderToolbar>
          <div className="kt-widget19__action">
            <button
              onClick={onCancelGR}
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
              Cancel GR
            </button>
          </div>
          <button
            type="button"
            onClick={print}
            className="btn btn-sm btn-primary"
          >
            <i className="fas fa-print"></i>
            <FormattedMessage id="TITLE.PRINT" /> GR
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody id="printSA">
        <SectionHeader {...props} />
        <SectionSummary {...props} />
        {/* <SectionTable {...props} /> */}
        <SectionTable2 {...props} />
        <Grid container spacing={1} className={"mt-3"}>
          <Grid item xs={8}></Grid>
          <BoxSignSA
            name={
              fullData?.contract?.contract_party
                ?.party_1_director_position_full_name
            }
            date={dataGR?.createdAt}
            {...props.signProps}
            params={qr_params}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

export default DetailGoodRcpt;
