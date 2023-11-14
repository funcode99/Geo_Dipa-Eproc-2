import React from "react";
import { Container, makeStyles, Paper } from "@material-ui/core";
import Subheader from "../../../../components/subheader";
import Tabs from "../../../../components/tabs";
import Summary from "./Summary";
import {
  DescriptionOutlined,
  AssignmentOutlined,
  BookmarkBorderOutlined,
  LocalShipping,
} from "@material-ui/icons";
// import ServAccGR from "../ServiceAccGR/pages/ServiceAccDetail";
import Documents from "./Documents";
// import BAPP from "./BAPP";
import DeliveryOrder from "./DeliveryOrder.js";
import SubBreadcrumbs from "../../../../components/SubBreadcrumbs";
import { useSelector, shallowEqual, useDispatch, connect } from "react-redux";
import { actionTypes } from "../../_redux/addendumContractAction";
import { useHistory, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
// import * as deliveryMonitoring from "../../service/DeliveryMonitoringCrud";
import Steppers from "../../../../components/steppersCustom/Steppers";
import SAGRPage from "./ServiceAccGR/SAGRPage";
import BeritaAcara from "./BeritaAcara";
import { fetch_api_sg } from "../../../../../redux/globalReducer";
import { MODAL } from "../../../../../service/modalSession/ModalService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
  },
}));

const keys = {
  task_id: "task_id_service",
  task_service_and_item: "task_service_and_item",
};

const TerminPage = ({
  items,
  fetch_api_sg,
  loadings,
  dataBarang,
  task_sa,
  task_gr,
}) => {
  const classes = useStyles();
  const [tabActive, setTabActive] = React.useState(0);
  const [stepperProg, setStepperProg] = React.useState([]);
  // const [tabList, setTabList] = React.useState(TabLists);
  const dispatch = useDispatch();
  const { dataContractById, dataTask } = useSelector(
    (state) => state.deliveryMonitoring
  );
  let authStatus = useSelector(
    (state) => state.auth.user.data.status,
    shallowEqual
  );
  const history = useHistory();
  const { task_id } = useParams();

  const checkDataBarang = () => {
    const temp = [...dataBarang];
    const find = temp?.find((el) => el.checked === true);

    if (find) return true;
    if (!find) return false;
  };

  const isItemExists =
    Array.isArray(items) && items.length > 0 && checkDataBarang();

  const TabLists = React.useMemo(
    () => [
      {
        id: "summary",
        label: <FormattedMessage id="CONTRACT_DETAIL.TAB.SUMMARY" />,
        icon: <DescriptionOutlined className="mb-0 mr-2" />,
      },
      {
        id: "delivery-order",
        label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DELIVERY_ORDER" />,
        icon: <LocalShipping className="mb-0 mr-2" />,
      },
      {
        id: "berita-acara",
        label: <FormattedMessage id="CONTRACT_DETAIL.TAB.OFFICIAL_REPORT" />,
        icon: <AssignmentOutlined className="mb-0 mr-2" />,
      },
      {
        id: "sa-gr",
        label: "SA / GR",
        icon: <BookmarkBorderOutlined className="mb-0 mr-2" />,
      },
    ],
    []
  );

  const tabUsed = isItemExists
    ? TabLists
    : TabLists.filter((item) => item.id !== "delivery-order");

  const dataProgress = [
    {
      label: "Create Term",
      status: "NO STARTED",
    },
    {
      label: "Create Deliverables",
      status: "NO STARTED",
    },
    {
      label: "Upload Deliverables",
      status: "NO STARTED",
    },
    {
      label: "Create Delivery Order",
      status: "NO STARTED",
    },
    {
      label: "Create BAPP",
      status: "NO STARTED",
    },
    {
      label: "Approve SA/GR",
      status: "NO STARTED",
    },
  ];

  const getTask = React.useCallback(() => {
    const task = dataContractById?.tasks?.find((item) => item.id === task_id);
    return task?.name ?? "";
  }, [dataContractById, task_id]);

  const fetchDataTask = () => {
    fetch_api_sg({
      key: keys.task_service_and_item,
      type: "get",
      url: `/delivery/task/${task_id}/item-service`,
      onSuccess: (res) => {
        dispatch({
          type: actionTypes.SetDataTask,
          payload: res?.data,
        });
      },
    });
  };

  const getDataTask = React.useCallback(() => {
    // handleLoading("get", true);
    // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
    fetchDataStepper();
    fetchDataTask();
    // deliveryMonitoring
    //   .getTaskById(task_id)
    //   .then((res) => {
    //     // console.log(`resold`, res);
    //     // handleLoading("get", false);
    //     if (res.data.status === true) {
    //       dispatch({
    //         type: actionTypes.SetDataTask,
    //         payload: res?.data?.data,
    //       });
    //     }
    //   })
    //   .catch((err) => console.log("err", err));
  }, [fetchDataStepper]);

  React.useEffect(() => {
    if (!task_id) {
      history.goBack();
    } else {
      getDataTask();
    }
    // eslint-disable-next-line
  }, []);

  function handleChangeTab(e, newTabActive) {
    const lastTabIndex = tabUsed.length - 1;
    if (newTabActive === lastTabIndex) {
      if (!task_sa && !task_gr) {
        MODAL.showSnackbar("Mohon pastikan BAPP sudah di approve.", "warning");
      } else {
        setTabActive(newTabActive);
      }
    } else {
      setTabActive(newTabActive);
    }
  }

  const fetchDataStepper = () => {
    fetch_api_sg({
      key: keys.task_id,
      type: "get",
      url: `/delivery/task/${task_id}/item-service`,
      onSuccess: (res) => {
        dispatch({
          type: actionTypes.SetDataTask,
          payload: res?.data,
        });

        const stateLib = {
          done: "COMPLETE",
          on: "ON PROGRESS",
          wait: "NO STARTED",
        };
        const mappedStepper = res.data.task_steppers.map((el) => ({
          label: el.label,
          status: stateLib[el.state],
        }));
        setStepperProg(mappedStepper);
      },
    });
  };

  return (
    <Container>
      <Subheader
        text="Termin 1"
        IconComponent={<DescriptionOutlined style={{ color: "white" }} />}
      />

      <SubBreadcrumbs
        items={[
          {
            label: "List of Contract & PO",
            to: `/${authStatus}/delivery-monitoring/contract`,
          },
          {
            label: `${dataContractById?.contract_name || "no data"}`,
            to: `/${authStatus}/delivery-monitoring/contract/${dataContractById?.id ||
              1}`,
          },
          {
            label: getTask(task_id) || `Termin`,
            to: "",
          },
        ]}
      />
      {dataProgress.length > 0 && (
        <Steppers steps={stepperProg.length > 0 ? stepperProg : dataProgress} />
      )}
      <Paper className={classes.paper}>
        <Container>
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={tabUsed}
          />
        </Container>
        <hr className="p-0 m-0" />
        {/* {state.hasOwnProperty('task_id') && ( */}
        <Container style={{ marginTop: 20, paddingBottom: 20 }}>
          {tabActive === 0 && <Summary taskId={task_id} />}

          {isItemExists && tabActive === 1 && (
            <DeliveryOrder taskId={task_id} />
          )}
          {/* {!isItemExists && tabActive === 1 && <BAPP />} */}
          {!isItemExists && tabActive === 1 && <BeritaAcara />}

          {/* {isItemExists && tabActive === 2 && <BAPP />} */}
          {isItemExists && tabActive === 2 && <BeritaAcara />}

          {/* {!isItemExists && tabActive === 2 && <ServAccGR />} */}
          {!isItemExists && tabActive === 2 && <SAGRPage />}

          {/* {isItemExists && tabActive === 3 && <ServAccGR />} */}
          {isItemExists && tabActive === 3 && <SAGRPage />}

          {tabActive === 0 && (
            <Documents loadStepper={fetchDataStepper} taskId={task_id} />
          )}
        </Container>
        {/* )} */}
      </Paper>
    </Container>
  );
};

const mapState = ({ deliveryMonitoring }) => ({
  items: deliveryMonitoring.dataContractById?.items,
  dataBarang: deliveryMonitoring.dataBarang,
  task_sa: deliveryMonitoring.dataTask?.task_sa,
  task_gr: deliveryMonitoring.dataTask?.task_gr,
});

export default connect(mapState, { fetch_api_sg })(TerminPage);
// export default TerminPage;
