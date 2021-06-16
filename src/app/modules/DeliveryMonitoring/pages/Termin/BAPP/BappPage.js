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
import { TableCell } from "@material-ui/core";
import { StyledTableRow } from "../style";
// import ModalConfirmation from "../../../../../components/modals/ModalConfirmation";

const validationClient = object().shape({
  hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
});

const validationVendor = object().shape({
  nomor_bapp: validation.require("Nomor BAPP"),
  tanggal_bapp: validation.require("Tanggal BAPP"),
});

const RowNormal = ({ data }) => {
  return (
    <StyledTableRow>
      {data.map((el, idx) => (
        <TableCell key={idx} className="text-dark text-left">
          {el}
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

const BappPage = ({ status, taskId, contract, taskNews, saveTask }) => {
  const [Toast, setToast] = useToast();
  const [loading, setLoading] = React.useState({
    get: false,
    submit: false,
  });
  const isClient = status === "client";
  // const [open, setOpen] = React.useState({
  //   submit: false,
  //   tempParams: {},
  // });

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

  const fetchData = React.useCallback(
    (toast = { visible: false, message: "" }) => {
      handleLoading("get", true);
      // console.log();
      // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
      deliveryMonitoring
        .getTaskById(taskId)
        .then((res) => {
          // console.log(`res`, res);
          handleLoading("get", false);
          if (res.data.status === true) {
            saveTask(res?.data?.data);
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
    if (taskId !== "") fetchData();
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
          <Row>
            <Col md={12}>
              <TitleField title={"History"} />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <TableBuilder
                hecto={5}
                dataHead={[
                  "No",
                  "Tanggal",
                  "User",
                  "Aktivitas",
                  "Dokumen",
                  "Aksi",
                ]}
                dataBody={taskNews?.task_news_histories}
                renderRowBody={({ item, index }) => (
                  <RowNormal
                    key={index}
                    data={[
                      (index += 1),
                      formatDate(new Date(item?.createdAt)),
                      item?.vendor?.username || item?.user?.username,
                      item?.action,
                      "",
                      "",
                    ]}
                  />
                )}
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
  taskNews: deliveryMonitoring.dataTask?.task_news,
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
