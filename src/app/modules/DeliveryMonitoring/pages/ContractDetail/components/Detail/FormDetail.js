import React from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { rupiah } from "../../../../../../libs/currency";
import { useSelector } from "react-redux";

const FormDetail = () => {
  const { dataContractById } = useSelector((state) => state.deliveryMonitoring);

  return (
    <Form className="my-3">
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
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default FormDetail;
