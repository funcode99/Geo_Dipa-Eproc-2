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
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { Container } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual, connect } from "react-redux";

import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import Tabs from "../../../../components/tabs";
import useToast from "../../../../components/toast";
import Subheader from "../../../../components/subheader";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";

import { actionTypes } from "../../_redux/deliveryMonitoringAction";
import { FormattedMessage } from "react-intl";

import ParaPihak from "./components/ParaPihak";
import ParaPihak2 from "./components/ParaPihak/ParaPihak2";
import DokContract from "./components/DokContract";
import HargaPekerjaan from "./components/HargaPekerjaan";
import JangkaWaktu from "./components/JangkaWaktu";
import Jaminan from "./components/Jaminan";
import Denda from "./components/Denda"
import BAST from "./components/BAST"
import Steppers from "../../../../components/steppersCustom/Steppers"
import DetailPage from "./components/Detail/DetailPage"
import KickOffDetail from "app/modules/DeliveryMonitoring/pages/ContractDetail/components/Detail/KickOffDetail"

import { compose } from "redux"
import {
  DUMMY_STEPPER,
  DUMMY_STEPPER_CONTRACT,
  STATE_STEPPER,
} from "../Termin/TerminPageNew/STATIC_DATA";

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
    id: "kick-off",
    // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
    label: "Kick Off",
    icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
  },
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
  //   {
  //     id: "para-pihak2",
  //     label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
  //     icon: <PeopleAlt className="mb-0 mr-2" />,
  //   },
  // {
  //   id: "bast",
  //   label: <FormattedMessage id="CONTRACT_DETAIL.TAB.BAST" />,
  //   icon: <Description className="mb-0 mr-2" />,
  // },
];

export const ContractDetailPage = ({ dataContractById, authStatus }) => {
  const classes = useStyles();
  const location = useLocation();
  const { contract_id, tab: forceTabActive } = useParams();
  const [Toast, setToast] = useToast();
  // const { dataContractById } = useSelector((state) => state.deliveryMonitoring);
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [firstTime, setfirstTime] = React.useState(0);
  const [tempProps, setTempProps] = React.useState({
    task_id: "",
    tab: 0,
  });
  const [old, setOld] = React.useState({
    needRefresh: false,
    path: "",
  });

  // let authStatus = useSelector(
  //   (state) => state.auth.user.data.status,
  //   shallowEqual
  // );
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
      // dispatch({
      //   type: actionTypes.SetContractById,
      //   payload: [],
      // });

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
    // getContractById(contract_id);
    setInitialSubmitItems();
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(event, newTabActive) {
    setTabActive(newTabActive);
  }

  React.useEffect(() => {
    if (
      tempProps.contract_id != contract_id ||
      tempProps.tab != forceTabActive
    ) {
      setfirstTime(0);
      setInitialSubmitItems();
    }
    if (firstTime === 1) return;
    if (!!forceTabActive && firstTime === 0) {
      handleChangeTab(null, forceTabActive - 1);
      if (!!dataContractById) {
        setfirstTime(1);
        setTempProps({
          contract_id,
          tab: forceTabActive,
        });
      }
    }
  }, [dataContractById, contract_id, forceTabActive]);

  React.useEffect(() => {
    if (location.pathname !== old.path) {
      setOld({
        needRefresh: true,
        path: location.pathname,
      });
      setTimeout(() => {
        setOld((e) => ({
          ...e,
          needRefresh: false,
        }));
      }, 500);
    }
  }, [location]);

  console.log("dataContractById", dataContractById);

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
            to: `/${authStatus}/delivery-monitoring/contract`,
          },
          {
            label: `${
              dataContractById ? dataContractById?.contract_name : "x"
            }`,
            to: "/",
          },
        ]}
      />

      <Steppers
        steps={
          loading
            ? DUMMY_STEPPER_CONTRACT
            : dataContractById?.steppers?.map((el) => ({
                label: el.label,
                status: STATE_STEPPER[el.state],
              }))
        }
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
        {tabActive === 0 && <KickOffDetail setToast={setToast} />}
        <DetailPage
          show={tabActive === 1}
          refresh={old.needRefresh}
          contractId={contract_id}
        />
        {tabActive === 2 && dataContractById?.contract_status === "PO" && (
          <ParaPihak />
        )}
        {tabActive === 3 && <DokContract />}
        {tabActive === 4 && <HargaPekerjaan />}
        {tabActive === 5 && <JangkaWaktu />}
        {tabActive === 6 && <Jaminan />}
        {tabActive === 7 && <Denda />}
        {tabActive === 2 && dataContractById?.contract_status === "SPK" && (
          <ParaPihak2 />
        )}
        {/* {tabActive === 8 && <BAST />} */}
      </Paper>
    </React.Fragment>
  );
};

const mapState = ({ auth, deliveryMonitoring }) => ({
  authStatus: auth.user.data.status,
  dataContractById: deliveryMonitoring.dataContractById,
});

export default compose(withRouter, connect(mapState))(ContractDetailPage);
