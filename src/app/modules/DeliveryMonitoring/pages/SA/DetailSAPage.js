import { connect } from "react-redux";
import React from "react";
import { useParams } from "react-router-dom";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import DetailGR from "../Termin/ServiceAccGR/components/DetailGR";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import { Grid, Paper } from "@material-ui/core";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import DetailSA from "../Termin/ServiceAccGR/components/DetailSA";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../libs/currency";
import BoxSignSA from "../Termin/ServiceAccGR/components/BoxSignSA";
import FooterSA from "../Termin/ServiceAccGR/components/FooterSA";

const tableHeader1 = [
  { id: "no", label: <FormattedMessage id="TITLE.NO" /> },
  { id: "service", label: <FormattedMessage id="TITLE.SERVICE" /> },
  { id: "qty", label: <FormattedMessage id="TITLE.QUANTITY" /> },
  { id: "uom", label: "UoM" },
  { id: "unit_price", label: <FormattedMessage id="TITLE.UNIT_PRICE" /> },
  { id: "net_value", label: <FormattedMessage id="TITLE.NET_VALUE" /> },
];

const key = "fetch-sa";
const DetailSAPage = ({ fetch_api_sg, loading, status }) => {
  const { task_id, sa_id } = useParams();
  const isClient = status === "client";

  const [content, setContent] = React.useState();

  const qr_params = React.useMemo(
    () => ({
      id: content?.task_sa?.id,
      type: "sa",
      user: isClient ? "user" : "vendor",
    }),
    [content, isClient]
  );
  const handleRefresh = () => {
    fetch_api_sg({
      key,
      url: `/delivery/sa/${sa_id}`,
      type: "get",
      onSuccess: (res) => {
        console.log(`res`, res);
        setContent(res.data);
      },
    });
  };
  React.useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Card>
      <CardBody>
        <DetailSA data={content?.sa_header} fullData={{}} type="SA" />
        <TablePaginationCustom
          headerRows={tableHeader1}
          // width={1210}
          withPagination={false}
          withSearch={false}
          rows={content?.sa_items?.map((el, id) => ({
            no: id + 1,
            service: el?.short_text,
            qty: el?.quantity,
            uom: el?.base_uom,
            unit_price: rupiah(el?.gr_price),
            net_value: rupiah(el?.net_value),
          }))}
          footerComponent={<FooterSA data={content?.sa_items} />}
        />
        <Grid container spacing={1} className={"mt-3"}>
          {/* <BoxSignSA params={qr_params} noQR title={"VENDOR"} /> */}
          <Grid item xs={8}></Grid>
          <BoxSignSA
            params={qr_params}
            title={"MASIH DUMMY"}
            // title={data?.contract?.contract_party?.party_1_director_position}
          />
        </Grid>
      </CardBody>
    </Card>
  );
};

const mapState = (state) => ({
  loading: getLoading(state, key),
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(DetailSAPage);
