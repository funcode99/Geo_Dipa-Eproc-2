import { makeStyles, Paper } from "@material-ui/core";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { fetch_api_sg, getLoading } from "../../../../../redux/globalReducer";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import ButtonAction from "../../../../components/buttonAction/ButtonAction";
import Subheader from "../../../../components/subheader";
import TablePaginationCustom from "../../../../components/tables/TablePagination";
import { useHistory } from "react-router-dom";
import StatusRemarks from "../../../../components/StatusRemarks";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

const tableHeaderContractsNew = [
  {
    id: "material_document",
    label: "Material Document",
  },
  {
    id: "po_number",
    label: <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />,
  },
  { id: "status", label: "Status" },

  {
    id: "action",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.ACTION" />,
    sortable: false,
  },
];

const keys = {
  fetch: "get-data-sa",
};

export const SAPage = ({ fetch_api_sg, loadings, status }) => {
  const classes = useStyles();
  const [newContent, setNewContent] = React.useState([]);
  const history = useHistory();

  const generateTableContent = (data) => {
    console.log("datanya", data);
    let dataArr = data.map((item, id) => ({
      material_document: item?.material_document,
      po_number: item?.po_number,
      status: item?.canceled_at ? (
        <StatusRemarks status={"CANCELED"} remarks={item?.canceled_at} />
      ) : (
        "-"
      ),
      action: (
        <ButtonAction
          hoverLabel="More"
          data={item}
          handleAction={handleAction}
          ops={[
            {
              label: "TITLE.DETAIL",
              icon: "fas fa-search text-primary pointer",
            },
          ]}
        />
      ),
    }));
    setNewContent(dataArr);
  };

  const getDataContracts = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/delivery/sa`,
      onSuccess: (res) => {
        console.log(`res.data`, res.data);
        generateTableContent(res.data);
      },
    });
  };

  const handleAction = React.useCallback((type, data) => {
    console.log(`type`, type, data);
    history.push(
      `/${status}/delivery-monitoring/sa/${data?.task_id}/${data?.id}`
    );
  }, []);

  React.useEffect(() => {
    getDataContracts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Subheader
        text="Service Acceptance"
        IconComponent={
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")}
            style={{ color: "white" }}
          />
        }
      />

      <Paper className={classes.root}>
        <TablePaginationCustom
          headerRows={tableHeaderContractsNew}
          rows={newContent}
          loading={loadings.fetch}
        />
      </Paper>
    </>
  );
};

const mapState = (state) => ({
  loadings: {
    fetch: getLoading(state, keys.fetch),
  },
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(SAPage);
