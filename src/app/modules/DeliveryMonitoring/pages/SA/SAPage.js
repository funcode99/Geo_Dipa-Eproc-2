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

  const generateTableContent = (data) => {
    let dataArr = data.map((item, id) => ({
      material_document: item?.material_document,
      po_number: item?.po_number,
      action: (
        <ButtonAction
          hoverLabel="More"
          data={"1"}
          // handleAction={console.log(null)}
          ops={[
            {
              label: "TITLE.DETAIL",
              icon: "fas fa-search text-primary pointer",
              to: {
                url: `/${status}/delivery-monitoring/gr/${item.id}`,
                style: {
                  color: "black",
                },
              },
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

  React.useEffect(() => {
    getDataContracts();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Subheader
        text="Good Receipt"
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
