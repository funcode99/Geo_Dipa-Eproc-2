import React from "react";
import { Paper, makeStyles, CircularProgress } from "@material-ui/core";
import {
  Assignment,
  QueryBuilderSharp,
  FeaturedPlayList,
  Error,
  PeopleAlt,
  Description,
  FindInPage,
  MonetizationOn,
} from "@material-ui/icons";
import { Container } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { useParams, withRouter } from "react-router-dom";
import Tabs from "../../../../components/tabs";
import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";
import useToast from "../../../../components/toast";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSelector, useDispatch } from "react-redux";
import { actionTypes } from "../../_redux/deliveryMonitoringAction";
import { FormattedMessage } from "react-intl";
import ParaPihak from "./components/ParaPihak";
import ParaPihak2 from "./components/ParaPihak/ParaPihak2";
import DokContract from "./components/DokContract";
import HargaPekerjaan from "./components/HargaPekerjaan";
import JangkaWaktu from "./components/JangkaWaktu";
import Jaminan from "./components/Jaminan";
import Denda from "./components/Denda";
import BAST from "./components/BAST";
import DetailPage from "./components/Detail/DetailPage";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
}));

const TabLists = [
  {
    id: "detail",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
    icon: <FindInPage className="mb-0 mr-2" />,
  },
  {
    id: "para-pihak",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
    icon: <PeopleAlt className="mb-0 mr-2" />,
  },

  {
    id: "dokumen-kontrak",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
    icon: <Assignment className="mb-0 mr-2" />,
  },
  {
    id: "harga-pekerjaan",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
    icon: <MonetizationOn className="mb-0 mr-2" />,
  },
  {
    id: "jangka-waktu",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
    icon: <QueryBuilderSharp className="mb-0 mr-2" />,
  },
  {
    id: "jaminan",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
    icon: <FeaturedPlayList className="mb-0 mr-2" />,
  },
  {
    id: "denda",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.FINE" />,
    icon: <Error className="mb-0 mr-2" />,
  },
  {
    id: "para-pihak2",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
    icon: <PeopleAlt className="mb-0 mr-2" />,
  },
  {
    id: "bast",
    label: <FormattedMessage id="CONTRACT_DETAIL.TAB.BAST" />,
    icon: <Description className="mb-0 mr-2" />,
  },
];

export const ContractDetailPage = () => {
  const classes = useStyles();
  const { contract_id } = useParams();
  const [Toast, setToast] = useToast();
  const { dataContractById } = useSelector((state) => state.deliveryMonitoring);
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const addCheckedField = (data, type) => {
    if (type === "jasa") {
      data.map((services) => {
        services.item_services.map((service) => {
          service.checked = false;
        });
      });
    }
    if (type === "barang") {
      data.map((item) => {
        item.checked = false;
      });
    }
  };

  const setInitialSubmitItems = () => {
    const initialSubmitItems = {
      task_items: [],
      task_services: [],
    };
    dispatch({
      type: actionTypes.SetSubmitItemsByContractId,
      payload: initialSubmitItems,
    });
  };

  // get data contract detail from api
  const getContractById = async (contract_id) => {
    try {
      dispatch({
        type: actionTypes.SetContractById,
        payload: [],
      });

      setLoading(true);
      const {
        data: { data },
      } = await deliveryMonitoring.getContractById(contract_id);

      addCheckedField(data?.services, "jasa");
      addCheckedField(data?.items, "barang");

      dispatch({
        type: actionTypes.SetContractById,
        payload: data,
      });
    } catch (error) {
      if (
        error.response?.status !== 400 &&
        error.response?.data.message !== "TokenExpiredError"
      ) {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        ) {
          setToast("Error API, please contact developer!");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getContractById(contract_id);
    setInitialSubmitItems();
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  return (
    <React.Fragment>
      <Toast />

      {loading ? (
        <div className="d-flex justify-content-center m-5 border-danger">
          <CircularProgress />
        </div>
      ) : null}

      <Subheader
        text={
          dataContractById
            ? `${dataContractById?.contract_no} - ${dataContractById?.contract_name}`
            : null
        }
        IconComponent={
          <SVG
            src={toAbsoluteUrl("/media/svg/icons/Home/Book-open.svg")}
            style={{ color: "white" }}
          />
        }
      />

      <SubBreadcrumbs
        items={[
          {
            label: "List of Contract & PO",
            to: "/client/delivery-monitoring/contract",
          },
          {
            label: `${
              dataContractById ? dataContractById?.contract_name : "x"
            }`,
            to: "/",
          },
        ]}
      />

      <Paper className={classes.root}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
            variant="scrollable"
          />
        </Container>
        <hr className="p-0 m-0" />
        {tabActive === 0 && <DetailPage contractId={contract_id} />}
        {tabActive === 1 && <ParaPihak />}
        {tabActive === 2 && <DokContract />}
        {tabActive === 3 && <HargaPekerjaan />}
        {tabActive === 4 && <JangkaWaktu />}
        {tabActive === 5 && <Jaminan />}
        {tabActive === 6 && <Denda />}
        {tabActive === 7 && <ParaPihak2 />}
        {tabActive === 8 && <BAST />}
      </Paper>
    </React.Fragment>
  );
};

export default withRouter(ContractDetailPage);
