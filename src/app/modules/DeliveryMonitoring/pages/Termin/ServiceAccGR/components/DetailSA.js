import React from "react";
import { Row, Col } from "react-bootstrap";
import { Box } from "@material-ui/core";
import { detailSA } from "../fieldData";
import { formatSADate } from "../../../../../../libs/date";
import ColDetail from "./ColDetail";

const DetailSA = ({ data, type }) => {
  const { client, document, vendor, contract } = detailSA;

  let dataSA = {};
  if (type === "SA") dataSA = data;

  const docValuesSA = React.useMemo(
    () => [
      {
        label: "Number",
        value: dataSA ? dataSA?.sheet_no : document.number || "",
      },
      {
        label: "Page",
        value: "1 of 1",
      },
      {
        label: "Posting date",
        value: dataSA ? formatSADate(dataSA?.doc_date) : document.document_date,
      },
      {
        label: "Document date",
        value: dataSA ? formatSADate(dataSA?.doc_date) : document.document_date,
      },
    ],
    [dataSA, document]
  );

  return (
    <div style={{ fontSize: "0.875rem" }}>
      <Row className="mt-5">
        <Col xs={6} className="pr-2">
          <Box border={1} padding={1}>
            {Object.values(client).map((el, id) => (
              <p className="mb-0" key={id}>
                {el}
              </p>
            ))}
          </Box>
        </Col>
        <Col xs={6} className="pl-2">
          <Row>
            <ColDetail
              label={docValuesSA[0].label}
              value={docValuesSA[0].value}
              position="left"
            />
            <ColDetail
              label={docValuesSA[1].label}
              value={docValuesSA[1].value}
              position="right"
            />
          </Row>
          <Row>
            <ColDetail
              label={docValuesSA[2].label}
              value={docValuesSA[2].value}
              position="left"
            />
            <ColDetail
              label={docValuesSA[3].label}
              value={docValuesSA[3].value}
              position="right"
            />
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={6} className="pr-2">
          <Box border={1} padding={1}>
            {Object.values(vendor).map((el, id) =>
              id === Object.values(vendor).length - 1 ? (
                <p className="mb-0" key={id}>
                  Your vendor number with us: {el}
                </p>
              ) : (
                <p className="mb-0" key={id}>
                  {el}
                </p>
              )
            )}
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
                <p className="mb-0">
                  {data ? data?.po_number : contract.po_number}
                </p>
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
                <p className="mb-0">Currency</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">
                  {data ? data?.currency : contract.currency}
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={4} className="pr-0">
                <p className="mb-0">External Number</p>
              </Col>
              <Col xs={1} className="px-0 d-flex justify-content-center">
                <p className="mb-0">:</p>
              </Col>
              <Col xs={7} className="pl-0">
                <p className="mb-0">
                  {data ? data?.ext_number : contract.external_number}
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
                <p className="mb-0">
                  {data ? data?.ref_doc_no : contract.ref_qa}
                </p>
              </Col>
            </Row>
          </Box>
        </Col>
      </Row>
    </div>
  );
};

export default DetailSA;
