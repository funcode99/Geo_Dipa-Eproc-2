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
import DetailServAcceptance from "../Termin/ServiceAccGR/components/ServiceAcceptance/DetailServAcceptance";
import NoDataBox from "../../../../components/boxes/NoDataBox/NoDataBox";

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
  // const is_finished = content?.task?.news_bast?.is_finished;
  // sa_signed : is_finished ? content?.task?.news_bast?.bapp_authorize_officer : content?.task?.news?.bapp_authorize_officer;


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
        console.log(`pejabat`, res);
        setContent(res.data);
      },
    });
  };
  React.useEffect(() => {
    handleRefresh();
  }, []);

  if (content == null) {
    return <NoDataBox text={"Service Acceptance not Available"} />;
  }

  return (
    <Card>
      <CardBody>
        <DetailServAcceptance
          header={content?.sa_header}
          fullData={content?.task}
          items={content?.sa_items}
          dataSA={content}
          signProps={{
                                    
            name:
              content?.task?.contract?.contract_party
                ?.party_1_director_position_full_name,
            date: content?.createdAt,
          }}
          isClient={isClient}
        />
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
