import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../components/builder/FormBuilder";
import formData from "./fieldData";
import validation from "../../../../../service/helper/validationHelper";
import { object } from "yup";
import { Row, Col } from "react-bootstrap";
import TitleField from "../../../../../components/input/TitleField";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import { useSelector, useDispatch } from "react-redux";
import { actionTypes } from "../../../_redux/deliveryMonitoringAction";
import { formatInitialDate } from "../../../../../libs/date";
import * as deliveryMonitoring from "../../../service/DeliveryMonitoringCrud";
import useToast from "../../../../../components/toast";
import { TableCell } from "@material-ui/core";
import { StyledTableRow } from "../style";

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

const BappPage = ({ status, taskId }) => {
  const [Toast, setToast] = useToast();
  const dispatch = useDispatch();
  let contract = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );
  let taskNews = useSelector(
    (state) => state.deliveryMonitoring?.dataTask?.task_news
  );
  const [loading, setLoading] = React.useState({
    get: false,
    submit: false,
  });
  // const [open, setOpen] = React.useState({
  //   create: false,
  //   upload: false,
  //   edit: false,
  //   resend: false,
  //   submit: false,
  //   accept: false,
  //   reject: false,
  //   delete: false,
  //   tempParams: {},
  // });

  const validationClient = object().shape({
    hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
  });

  const validationVendor = object().shape({
    nomor_bapp: validation.require("Nomor BAPP"),
    tanggal_bapp: validation.require("Tanggal BAPP"),
  });

  const initialValues = {
    nomor_bapp: taskNews?.no || "",
    tanggal_bapp: taskNews?.date || formatInitialDate(),
    jenis: contract?.contract_name,
    pelaksana: contract?.vendor?.party?.full_name,
    nomor_contract: contract?.contract_no,
    nomor_po: contract?.purch_order_no,
    hasil_pekerjaan: taskNews?.review_text || "",
  };

  const disabledInputClient = [
    "nomor_bapp",
    "tanggal_bapp",
    "jenis",
    "pelaksana",
    "nomor_contract",
    "nomor_po",
  ];

  const disabledInputVendor = [
    "jenis",
    "pelaksana",
    "nomor_contract",
    "nomor_po",
    "hasil_pekerjaan",
  ];

  const disabledList =
    status === "client" ? disabledInputClient : disabledInputVendor;

  const validationSchema =
    status === "client" ? validationClient : validationVendor;

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
      // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
      deliveryMonitoring
        .getTaskById(taskId)
        .then((res) => {
          // console.log(`res`, res);
          handleLoading("get", false);
          if (res.data.status === true) {
            dispatch({
              type: actionTypes.SetDataTask,
              payload: res?.data?.data,
            });
            if (toast.visible === true) {
              setToast(toast.message, 5000);
            }
          }
        })
        .catch((err) => console.log("err", err));
    },
    [taskId, handleLoading, dispatch]
  );

  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        fetchData({ visible: true, message: res?.data?.message });
      }
    },
    [setToast, fetchData]
  );

  const submitVendor = React.useCallback(
    (data) => {
      const requestData = {
        no: data.nomor_bapp,
        date: data.tanggal_bapp,
        type: "bapp",
      };

      deliveryMonitoring
        .postCreateNewsVendor(taskId, requestData)
        .then((res) => handleSuccess(res))
        .catch((err) => handleError(err))
        .finally(handleLoading("submit", false));
    },
    [taskId, handleError]
  );

  const submitClient = (data) => {
    const requestData = {
      review_text: data.hasil_pekerjaan,
    };

    deliveryMonitoring
      .postCreateNewsClient(taskNews?.id, requestData)
      .then((res) => handleSuccess(res))
      .catch((err) => handleError(err))
      .finally(handleLoading("submit", false));
  };

  const _handleSubmit = (data) => {
    handleLoading("submit", true);

    if (status === "vendor") {
      submitVendor(data);
    }

    if (status === "client") {
      submitClient(data);
    }
  };

  React.useEffect(() => {
    if (taskId !== "") fetchData();
  }, [taskId, fetchData]);

  // const optionsList = {
  //   select_example: [
  //     { value: 1, label: "data1" },
  //     { value: 2, label: "data2" },
  //     { value: 3, label: "data3" },
  //   ],
  // };

  return (
    <React.Fragment>
      <Toast />

      {/* <ModalConfirmation
        visible={open[type]}
        onClose={() => handleVisible(type)}
        onSubmit={(params) => handleApi(type, params)}
        {...other}
      /> */}

      <Card>
        <CardBody>
          <FormBuilder
            onSubmit={_handleSubmit}
            formData={formData}
            initial={initialValues}
            validation={validationSchema}
            fieldProps={{
              readOnly: false,
              disabledFields: disabledList,
              // listOptions: optionsList,
            }}
            loading={loading.submit}
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
                  "No BAST",
                  "Tanggal",
                  "Approved by",
                  "Dokumen",
                  "Aksi",
                ]}
                dataBody={taskNews?.task_news_histories}
                renderRowBody={({ item, index }) => (
                  <RowNormal
                    key={index}
                    data={[item?.history?.no, item?.history?.date, "", "", ""]}
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

export default BappPage;
