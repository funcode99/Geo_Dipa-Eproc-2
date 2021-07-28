import React from "react";
import { Row, Col } from "react-bootstrap";
import { Box } from "@material-ui/core";
import { detailGR } from "../fieldData";
import { formatSADate } from "../../../../../../libs/date";

const DetailGR = ({ data }) => {
  const { client, document, vendor, contract } = detailGR;

  return (
    <div style={{ fontSize: "0.875rem" }}>
      <Row className="mt-5">
        <Col xs={6} className="pr-2">
          <Box border={1} padding={1}>
            <p className="mb-0">{client?.name}</p>
            <p className="mb-0">{client?.address1}</p>
            <p className="mb-0">{client?.address2}</p>
            <p className="mb-0">{client?.address3}</p>
          </Box>
        </Col>
        <Col xs={6} className="pl-2">
          <Row>
            <Col xs={6} className="pr-0">
              <Box border={1} padding={1} paddingBottom={0}>
                <p className="mb-0">Number:</p>
                <p className="mb-0">{data ? data?.mat_doc : document.number}</p>
              </Box>
            </Col>
            <Col xs={6} className="pl-0">
              <Box border={1} padding={1} paddingBottom={0}>
                <p className="mb-0">Page:</p>
                <p className="mb-0">1 of 1</p>
              </Box>
            </Col>
          </Row>
          <Row>
            <Col xs={6} className="pr-0">
              <Box border={1} padding={1} paddingTop={0}>
                <p className="mb-0">Posting date:</p>
                <p className="mb-0">
                  {data
                    ? formatSADate(data?.pstng_date)
                    : document.posting_date}
                </p>
              </Box>
            </Col>
            <Col xs={6} className="pl-0">
              <Box border={1} padding={1} paddingTop={0}>
                <p className="mb-0">Document date:</p>
                <p className="mb-0">
                  {data ? formatSADate(data?.doc_date) : document.document_date}
                </p>
              </Box>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={6} className="pr-2">
          <Box border={1} padding={1}>
            <p className="mb-0">{vendor?.name}</p>
            <p className="mb-0">{vendor?.address1}</p>
            <p className="mb-0">{vendor?.address2}</p>
            <p className="mb-0">{vendor?.address3}</p>
            <br />
            <p className="mb-0">
              Your vendor number with us: {vendor?.vendor_number}
            </p>
          </Box>
        </Col>
        <Col xs={6} className="pl-2">
          <Box border={1} padding={1}>
            <Row>
              <Col xs={4} className="pr-0">
                <p className="mb-0">PO Number</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">{data?.po_number || contract.po_number}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={4} className="pr-0">
                <p className="mb-0">Movement Type</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">{contract.movement_type}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={4} className="pr-0">
                <p className="mb-0">Purchasing Group</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">{contract?.purch_group} (static)</p>
              </Col>
            </Row>
            <Row>
              <Col xs={4} className="pr-0">
                <p className="mb-0">Telephone</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">{contract?.telephone} (static)</p>
              </Col>
            </Row>
            <Row>
              <Col xs={4} className="pr-0">
                <p className="mb-0">Delivery Note</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">
                  {data?.ext_number || contract.delivery_note}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={7} className="pr-0">
                <p className="mb-0">
                  Ref. Quality Assurance Acceptance Certificate
                </p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={4} className="pl-0">
                <p className="mb-0">{data?.ref_doc_no || contract.ref_qa}</p>
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    </div>
  );
};

export default DetailGR;
