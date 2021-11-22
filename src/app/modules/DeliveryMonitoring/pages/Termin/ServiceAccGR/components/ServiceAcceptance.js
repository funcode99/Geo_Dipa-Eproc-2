import { Grid } from "@material-ui/core";
import React from "react";
import NoDataBox from "../../../../../../components/boxes/NoDataBox/NoDataBox";
import TablePaginationCustom from "../../../../../../components/tables/TablePagination";
import { rupiah } from "../../../../../../libs/currency";
import { tableHeader1 } from "../fieldData";
import BoxSignSA from "./BoxSignSA";
import DetailSA from "./DetailSA";
import FooterSA from "./FooterSA";
import RowAdditional from "./RowAdditional";

const ServiceAcceptance = ({ data, isClient, loading }) => {
  const task_sa = data?.task_sa;
  // const { sa_header, sa_items } = task_sa;
  console.log(`task_sa`, data);

  if (task_sa == null) {
    return <NoDataBox text={"Service Acceptance not Available"} />;
  }

  const qr_params = {
    id: task_sa?.id,
    type: "sa",
    user: isClient ? "user" : "vendor",
  };

  return (
    <React.Fragment>
      <DetailSA data={task_sa?.sa_header} fullData={data} type="SA" />
      <TablePaginationCustom
        headerRows={tableHeader1}
        // width={1210}
        withPagination={false}
        withSearch={false}
        rows={task_sa?.sa_items?.map((el, id) => ({
          no: id + 1,
          service: el?.short_text,
          qty: el?.quantity,
          uom: el?.base_uom,
          unit_price: rupiah(el?.gr_price),
          net_value: rupiah(el?.net_value),
        }))}
        footerComponent={<FooterSA data={task_sa?.sa_items} />}
      />
      <Grid container spacing={1} className={"mt-3"}>
        {/* <BoxSignSA params={qr_params} noQR title={"VENDOR"} /> */}
        <Grid item xs={8}></Grid>
        <BoxSignSA
          params={qr_params}
          title={data?.contract?.contract_party?.party_1_director_position}
        />
      </Grid>
    </React.Fragment>
  );
};

export default ServiceAcceptance;
