import React, { useState, useEffect, useCallback } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../libs/currency";
import { useSelector, shallowEqual } from "react-redux";
import StyledSelect from "../../../../../../components/select-multiple";
import {
  getPicContract,
  getPicVendor,
  assignUser
} from "../../../../../InvoiceMonitoring/_redux/InvoiceMonitoringCrud";
import useToast from "../../../../../../components/toast";

const FormDetail = (props) => {
  const { dataContractById } = useSelector((state) => state.deliveryMonitoring);
  const user_id = useSelector((state) => state.auth.user.data.user_id, shallowEqual);

  const contract_id = props.contractId;
  const monitoring_type = "DELIVERY";
  const vendor_id = dataContractById?.vendor?.id

  const [Toast, setToast] = useToast();
  const [picVendorData, setPicVendorData] = useState([]);
  const [picContractData, setPicContractData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPicContractData = useCallback(() => {
    getPicContract({ id: contract_id, vendor_id: vendor_id, monitoring_type: monitoring_type })
      .then((response) => {
        setPicContractData(response.data.data);
      })
      .catch((error) => {
        // setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 10000);
      });
  }, [contract_id, setToast]);

  const getPicVendorData = useCallback(() => {
    getPicVendor(vendor_id)
      .then((response) => {
        setPicVendorData(response.data.data);
      })
      .catch((error) => {

      });
  }, [setToast]);

  const assignPic = () => {
    setLoading(true);
    var data = {
      contract_id: contract_id,
      data: picContractData,
      monitoring_type: monitoring_type,
      user_id: user_id,
    };
    assignUser(data)
      .then((response) => {
        setToast(
          <FormattedMessage id="REQ.ASSIGN_ACCOUNT_SUCCESS" />
        );
        setLoading(false);
      })
      .catch((error) => {
        if (
          error.response?.status !== 400 &&
          error.response?.data.message !== "TokenExpiredError"
        )
          setToast(<FormattedMessage id="REQ.REQUEST_FAILED" />, 10000);
        setLoading(false);
      });
  };

  const handlePic = (e) => {
    setPicContractData(e);
  };

  useEffect(getPicContractData, []);
  useEffect(getPicVendorData, []);

  return (
    <Form className="my-3">
      <Toast />
      <Container>
        <Row>
          <Col>
            <Form.Group as={Row}>
              <Form.Label column md="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER" />
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Nomor Kontrak"
                  defaultValue={dataContractById?.contract_no}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.PROCUREMENT_TITLE" />
              </Form.Label>
              <Col md="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Judul Pengadaan"
                  defaultValue={dataContractById?.contract_name}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="validationCustom01">
              <Form.Label column sm="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.AUTHORITY_GROUP" />
              </Form.Label>
              <Col md="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Kewenangan"
                  defaultValue={dataContractById?.authority_group?.alias_name}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="validationCustom02">
              <Form.Label column md="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.USER_GROUP" />
              </Form.Label>
              <Col md="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="User"
                  defaultValue={dataContractById?.user_group?.alias_name}
                  disabled
                />
              </Col>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group as={Row}>
              <Form.Label column md="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NUMBER" />
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Nomor PO"
                  defaultValue={dataContractById?.purch_order_no}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.PO_NAME" />
              </Form.Label>
              <Col md="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Header Text PO"
                  defaultValue={dataContractById?.purch_order?.name}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.PRICE" />
              </Form.Label>
              <Col md="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Harga Pekerjaan"
                  defaultValue={rupiah(
                    parseInt(dataContractById?.total_amount)
                  )}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md="4">
                <FormattedMessage id="CONTRACT_DETAIL.LABEL.VENDOR" />
              </Form.Label>
              <Col md="8">
                <Form.Control
                  required
                  type="text"
                  placeholder="Penyedia"
                  defaultValue={dataContractById?.vendor?.party?.full_name}
                  disabled
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column md="4">
                PIC
              </Form.Label>
              <Col md="8">
                <StyledSelect options={picVendorData} value={picContractData} onChange={handlePic}></StyledSelect>
              </Col>
            </Form.Group>
          </Col>
        </Row>
        <button
          type="button"
          className="btn btn-primary mx-1 float-right"
          onClick={assignPic}
          disabled={loading}
        >
          Simpan
          {loading && (
            <span
              className="spinner-border spinner-border-sm ml-1"
              aria-hidden="true"
            ></span>
          )}
        </button>
      </Container>
    </Form>
  );
};

export default FormDetail;
