import React from "react";
import { Row, Col } from "react-bootstrap";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import { formData1, formData2, formData3 } from "./fieldData";
import TableBuilder from "../../../../../../components/builder/TableBuilder";
import TitleField from "../../../../../../components/input/TitleField";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import { connect, useSelector } from "react-redux";
import { StyledTableRow } from "../../../../../../components/builder/TableBuilder/styledComponent";
import { Button, ButtonGroup, TableCell } from "@material-ui/core";
import * as deliveryMonitoring from "../../../../service/DeliveryMonitoringCrud";
import useToast from "../../../../../../components/toast";
import { actionTypes } from "../../../../_redux/deliveryMonitoringAction";
import { formatDate } from "../../../../../../libs/date";
import { FormattedMessage } from "react-intl";

const validationClient = object().shape({
  hasil_pekerjaan: validation.require("Hasil Pekerjaan"),
});

const validationVendor = object().shape({
  nomor_bast: validation.require("Nomor BAPP"),
  tanggal_bast: validation.require("Tanggal BAPP"),
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

const BastPage = ({ status, contract, saveContract }) => {
  const formikRef = React.useRef();
  const [Toast, setToast] = useToast();
  const isClient = status === "client";
  const [loadings, setLoadings] = React.useState({
    fetch: false,
    post: false,
  });
  const handleLoading = React.useCallback(
    (key, state) => setLoadings((prev) => ({ ...prev, [key]: state })),
    [setLoadings]
  );
  const { news, contract_name, vendor, contract_no, purch_order_no } = contract;
  const initialValues = React.useMemo(
    () => ({
      nomor_bast: "",
      tanggal_bast: news?.date,
      jenis: contract_name,
      pelaksana: vendor?.party?.full_name,
      nomor_contract: contract_no,
      nomor_po: purch_order_no,
      hasil_pekerjaan: "",
      select_example: {
        label: "isi",
        value: "value",
      },
    }),
    [news, contract_name, vendor, contract_no, purch_order_no]
  );

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

  const handleSuccess = React.useCallback(
    async (res) => {
      if (res?.data?.status === true) {
        const {
          data: { data },
        } = await deliveryMonitoring.getContractById(contract?.id);
        saveContract(data);
      }
    },
    [setToast]
  );

  const _handleSubmit = (data) => {
    // console.log(`data`, data);
    handleLoading("post", true);
    let params = {};
    switch (status) {
      case "vendor":
        params = {
          url: `delivery/task-news/${contract?.id}/bast`,
          no: data.nomor_bast,
          date: data.tanggal_bast,
        };
        break;
      case "client":
        params = {
          url: `delivery/task-news/${contract?.news?.id}/review`,
          review_text: data.hasil_pekerjaan,
        };
        break;
      default:
        break;
    }
    // console.log(`params`, params);
    handleLoading("post", true);

    deliveryMonitoring
      .postCreateBAST(params)
      .then(handleSuccess)
      .catch(handleError)
      .finally(() => {
        setTimeout(() => {
          handleLoading("post", false);
        }, 3000);
      });
  };

  let disabledInput = Object.keys(initialValues);
  let allowedClient = ["hasil_pekerjaan"];
  let allowedVendor = ["nomor_bast", "tanggal_bast"];

  // console.log(`contract`, contract);

  return (
    <React.Fragment>
      <Toast />
      <Card>
        <CardBody>
          <Card>
            <CardBody>
              {/* <FieldBuilder readOnly formData={formData3} /> */}
              <FormBuilder
                // ref={formikRef}
                onSubmit={_handleSubmit}
                // formData={formData3}
                loading={loadings.post}
                initial={initialValues}
                validation={isClient ? validationClient : validationVendor}
                fieldProps={{
                  readOnly: false,
                  // disabledFields: disabledInput,
                  disabledFields: disabledInput.filter((el) =>
                    isClient
                      ? !allowedClient.includes(el)
                      : !allowedVendor.includes(el)
                  ),
                }}
              >
                {({ fieldProps }) => (
                  <Row>
                    <Col>
                      <FieldBuilder formData={formData1} {...fieldProps} />
                    </Col>
                    <Col>
                      <FieldBuilder formData={formData2} {...fieldProps} />
                    </Col>
                  </Row>
                )}
              </FormBuilder>
            </CardBody>
          </Card>

          <Card className="mt-5">
            <CardBody>
              <Row className="mb-5">
                <Col md={12}>
                  <ButtonGroup
                    size="medium"
                    color="secondary"
                    variant="contained"
                  >
                    <Button
                    // onClick={() => handleAction("preview", taskNews?.file)}
                    // disabled={taskNews ? false : true}
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
                  <TableBuilder
                    hecto={10}
                    dataHead={[
                      "No BAST",
                      "Tanggal",
                      "Status",
                      "Approved by",
                      "Dokumen",
                      "Aksi",
                    ]}
                    dataBody={news?.task_news_histories}
                    renderRowBody={({ item, index }) => (
                      <RowNormal
                        key={index}
                        data={[
                          item?.history?.no,
                          formatDate(new Date(item?.updatedAt)),
                          "",
                          "",
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
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapState = ({ auth, deliveryMonitoring }) => ({
  status: auth.user.data.status,
  contract: deliveryMonitoring.dataContractById,
});

export default connect(mapState, {
  saveContract: (payload) => ({
    type: actionTypes.SetContractById,
    payload: payload,
  }),
})(BastPage);
