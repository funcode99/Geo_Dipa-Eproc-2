import React from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../components/builder/FormBuilder";
import formData from "./fieldData";
import validation from "../../../../../service/helper/validationHelper";
import { object } from "yup";
import { Row, Col } from "react-bootstrap";
import TitleField from "../../../../../components/input/TitleField";
import TableBuilder from "../../../../../components/builder/TableBuilder";
import { useSelector } from "react-redux";
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
  let contract = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );
  const [content, setContent] = React.useState([]);
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
    nomor_bapp: validation.require("Nomor BAST"),
    tanggal_bapp: validation.require("Tanggal BAST"),
  });

  const initialValues = {
    nomor_bapp: "",
    tanggal_bapp: formatInitialDate(),
    jenis: contract?.contract_name,
    pelaksana: contract?.vendor?.party?.full_name,
    nomor_contract: contract?.contract_no,
    nomor_po: contract?.purch_order_no,
    hasil_pekerjaan: "",
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
        setToast(err.response?.data.message, 5000);
      }
    },
    [setToast]
  );

  const handleSuccess = React.useCallback(
    (res) => {
      if (res?.data?.status === true) {
        fetchData();
        setToast(res?.data?.message);
      }
    },
    [setToast]
  );

  const handleLoading = React.useCallback(
    (key, state) => setLoading((prev) => ({ ...prev, [key]: state })),
    [setLoading]
  );

  const fetchData = React.useCallback(() => {
    handleLoading("get", true);
    // serviceFetch(() => deliveryMonitoring.getTaskById(taskId))
    deliveryMonitoring
      .getTaskById(taskId)
      .then((res) => {
        console.log(`res`, res);
        handleLoading("get", false);
        if (res.data.status === true) {
          const histories = res?.data?.data?.task_news?.task_news_histories;
          setContent(histories);
        }
      })
      .catch((err) => console.log("err", err));
  }, [taskId]);

  const _handleSubmit = (data) => {
    const requestData = {
      no: data.nomor_bapp,
      date: data.tanggal_bapp,
      type: "bapp",
    };

    // console.log(requestData);

    handleLoading("submit", true);
    deliveryMonitoring
      .postCreateBeritaAcara(taskId, requestData)
      .then((res) => handleSuccess(res))
      .catch((err) => handleError(err))
      .finally(handleLoading("submit", false));
  };

  React.useEffect(() => {
    if (taskId !== "") fetchData();
  }, [taskId]);

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
                dataBody={content}
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
