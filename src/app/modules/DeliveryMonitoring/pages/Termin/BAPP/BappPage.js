import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../components/builder/FormBuilder";
import formData from "./fieldData";
import validation from "../../../../../service/helper/validationHelper";
import { object } from "yup";
import { Row, Col } from "react-bootstrap";
import TitleField from "../../../../../components/input/TitleField";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import { connect } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import { formatDate, formatInitialDate } from "../../../../../libs/date";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import useToast from "../../../../../components/toast";
import ButtonAction from "../../../../../components/buttonAction/ButtonAction";
import { RowNormal } from "./components";
import { Button, ButtonGroup } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import urlHelper, {
  openLinkTab,
} from "../../../../../service/helper/urlHelper";
// import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";

const tableHeader = [
  {
    id: "no",
    label: <FormattedMessage id="TITLE.NO" />,
  },
  {
    id: "user",
    label: <FormattedMessage id="TITLE.USER" />,
  },
  {
    id: "date",
    label: <FormattedMessage id="TITLE.DATE" />,
  },
  {
    id: "activity",
    label: <FormattedMessage id="TITLE.ACTIVITY" />,
  },
];

const validationClient = object().shape({
  hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
});

const validationVendor = object().shape({
  nomor_bapp: validation.require("Nomor BAPP"),
  tanggal_bapp: validation.require("Tanggal BAPP"),
});

const BappPage = ({ status, taskId, contract, taskNews, saveTask }) => {
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = React.useState({
    get: false,
    submit: false,
  });
  const [exclude, setExclude] = React.useState([]);
  // const [open, setOpen] = React.useState({
  //   submit: false,
  //   tempParams: {},
  // });
  const [content, setContent] = React.useState([]);
  const isClient = status === "client";

  const initialValues = React.useMemo(
    () => ({
      nomor_bapp: taskNews?.no || "",
      tanggal_bapp: taskNews?.date || formatInitialDate(),
      jenis: contract?.contract_name,
      pelaksana: contract?.vendor?.party?.full_name,
      nomor_contract: contract?.contract_no,
      nomor_po: contract?.purch_order_no,
      hasil_pekerjaan: taskNews?.review_text || "",
    }),
    [taskNews, contract]
  );

  const clientMenu = React.useMemo(
    () => [
      {
        label: "TITLE.PREVIEW",
        icon: "far fa-file-pdf text-danger pointer",
        type: "preview",
        params: "",
      },
      {
        label: "TITLE.UPLOAD",
        icon: "fas fa-file-upload text-primary pointer",
        type: "upload",
        params: "",
      },
      {
        label: "TITLE.APPROVE",
        icon: "fas fa-check-circle text-success pointer",
        type: "approve",
        params: "",
      },
    ],
    []
  );

  const vendorMenu = React.useMemo(
    () => [
      {
        label: "TITLE.PREVIEW",
        icon: "far fa-file-pdf text-danger pointer",
        type: "preview",
        params: "",
      },
      {
        label: "TITLE.UPLOAD",
        icon: "fas fa-file-upload text-primary pointer",
        type: "upload",
        params: "",
      },
    ],
    []
  );

  const listUsed = status === "client" ? clientMenu : vendorMenu;
  const isDisabled = React.useMemo(() => isClient && !taskNews, [
    taskNews,
    isClient,
  ]);

  const handleError = React.useCallback(
    (err) => {
      if (
        err.response?.code !== 400 &&
        err.response?.data.message !== "TokenExpiredError"
      ) {
        console.log("handle error");
        setToast(err.response?.data.message, 5000);
      }
    },
    [setToast]
  );

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const updateExclude = () => {
    if (taskNews && taskNews?.review_text !== null) {
      // console.log(`review ada isinya`);
      setExclude([""]);
    } else if (taskNews && taskNews?.review_text === null) {
      // console.log(`review kosong`);
      setExclude(["approve"]);
    }
  };

  const generateTableContent = (data) => {
    // console.log(`data`, data);
    let dataArr = data.map((item, id) => ({
      no: (id += 1),
      user: item?.vendor?.username || item?.user?.username,
      date: formatDate(new Date(item?.createdAt)),
      activity: item?.description,
    }));
    setContent(dataArr);
  };

  const fetchData = React.useCallback(
    (toast = { visible: false, message: "" }) => {
      handleLoading("get", true);
      // console.log();
      deliveryMonitoring
        .getTaskById(taskId)
        .then((res) => {
          // console.log(`res`, res);
          handleLoading("get", false);
          if (res.data.status === true) {
            saveTask(res?.data?.data);
            generateTableContent(res?.data?.data?.news?.news_histories);

            updateExclude();

            if (toast.visible === true) {
              setToast(toast.message, 5000);
            }
          }
        })
        .catch((err) => console.log("err", err));
    },
    [taskId, handleLoading, saveTask, setToast]
  );

  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        fetchData({ visible: true, message: res?.data?.message });
        // updateExclude();
      }
    },
    [fetchData]
  );

  const _handleSubmit = (data) => {
    handleLoading("submit", true);

    let params = {};
    switch (status) {
      case "vendor":
        params = {
          url: `delivery/task-news/${taskId}`,
          no: data.nomor_bapp,
          date: data.tanggal_bapp,
        };
        break;
      case "client":
        params = {
          url: `delivery/task-news/${taskNews?.id}/review`,
          review_text: data.hasil_pekerjaan,
        };
        break;
      default:
        break;
    }

    deliveryMonitoring
      .postCreateBAPP(params)
      .then((res) => handleSuccess(res))
      .catch((err) => handleError(err))
      .finally(handleLoading("submit", false));
  };

  React.useEffect(() => {
    if (taskId !== "") {
      // console.log(`masuk sini`);
      fetchData();
    }
  }, [taskId, fetchData]);

  let disabledInput = Object.keys(initialValues);
  let allowedClient = ["hasil_pekerjaan"];
  let allowedVendor = ["nomor_bapp", "tanggal_bapp"];

  // const handleVisible = (key, tempParams = {}) => {
  //   setOpen((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //     tempParams: { ...prev.tempParams, ...tempParams },
  //   }));
  // };

  const handleAction = (type, params) => {
    // console.log(`type`, type);
    // console.log(`params`, params);

    switch (type) {
      case "preview":
        openLinkTab(params?.file);
        // window.open(urlHelper.addBaseURL(params?.file), "_blank");
        break;
      case "upload":
        console.log(`type`, type);
        break;
      case "approve":
        console.log(`type`, type);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Toast />

      {/* <ModalConfirmation
        visible={open.submit}
        onClose={() => handleVisible("submit")}
        onSubmit={(params) => handleApi(type, params)}
        {...other}
      /> */}

      <Card>
        <CardBody>
          {/* <div className="d-flex justify-content-between align-items-center w-100">
            <h2 className="mb-0">Berita Acara Pelaksanaan Pekerjaan</h2>
            {taskNews && (
              <ButtonAction
                label="TITLE.MORE"
                data={taskNews}
                ops={listUsed}
                handleAction={handleAction}
                exclude={exclude}
              />
            )}
          </div> */}

          <FormBuilder
            onSubmit={_handleSubmit}
            formData={formData}
            initial={initialValues}
            validation={isClient ? validationClient : validationVendor}
            fieldProps={{
              readOnly: false,
              disabledFields: disabledInput.filter((item) =>
                isClient
                  ? !allowedClient.includes(item)
                  : !allowedVendor.includes(item)
              ),
            }}
            loading={loading.submit}
            disabledButton={isDisabled}
          />
        </CardBody>
      </Card>

      <Card className="mt-5">
        <CardBody>
          <Row className="mb-5">
            <Col md={12}>
              <ButtonGroup size="medium" color="secondary" variant="contained">
                <Button
                  onClick={() => handleAction("preview", taskNews)}
                  disabled={taskNews ? false : true}
                >
                  <FormattedMessage id="TITLE.PREVIEW" />
                </Button>
                <Button>
                  <FormattedMessage id="TITLE.UPLOAD_SIGNED_DOCUMENT" />
                </Button>
                <Button>
                  <FormattedMessage id="TITLE.APPROVE" />
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <TitleField title={"History"} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {/* <TableBuilder
                hecto={5}
                dataHead={["No", "User", "Tanggal", "Aktivitas", "Aksi"]}
                dataBody={taskNews?.news_histories}
                renderRowBody={({ item, index }) => (
                  <RowNormal
                    key={index}
                    data={[
                      (index += 1),
                      item?.vendor?.username || item?.user?.username,
                      formatDate(new Date(item?.createdAt)),
                      item?.description,
                      "",
                    ]}
                  />
                )}
              /> */}
              <TablePaginationCustom
                headerRows={tableHeader}
                rows={content}
                loading={loading.get}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapState = ({ auth, deliveryMonitoring }) => ({
  status: auth.user.data.status,
  contract: deliveryMonitoring.dataContractById,
  taskNews: deliveryMonitoring.dataTask?.news,
  taskId: deliveryMonitoring.dataTask?.id,
});

const mapDispatch = (dispatch) => ({
  saveTask: (payload) => {
    dispatch({
      type: actionTypes.SetDataTask,
      payload: payload,
    });
  },
});

export default connect(mapState, mapDispatch)(BappPage);
