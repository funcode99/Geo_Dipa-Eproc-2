import React from "react";
import SVG from "react-inlinesvg";
import { Card } from "_metronic/_partials/controls";
import { Col, Row, Container } from "react-bootstrap";
import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";

const TabCard = ({
  data,
  isAdmin,
  isVendor,
  contract,
  sequence,
  setSequence,
}) => {
  return (
    <>
      <Card>
        <form
          style={{
            padding: 28,
          }}
        >
          <Container>
            <Row>
              {!isVendor && (
                <Col>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{
                      backgroundColor: "white",
                      flexGrow: 1,
                      borderTopLeftRadius: 14,
                      cursor: "pointer",
                      gap: 4,
                    }}
                    onClick={() => setSequence(0)}
                  >
                    {sequence === 0 ? (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/form-parameter.svg"
                        )}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/form-parameter-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 0 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Form Parameter
                    </h1>
                  </div>
                </Col>
              )}

              {isAdmin && (
                <Col>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{
                      backgroundColor: "white",
                      flexGrow: 1,
                      cursor: "pointer",
                      borderTopRightRadius: 14,
                      gap: 4,
                    }}
                    onClick={() => setSequence(1)}
                  >
                    {sequence === 1 ? (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/clause-template.svg"
                        )}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/clause-template-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 1 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Template Klausul
                    </h1>
                  </div>
                </Col>
              )}

              <Col>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    gap: 4,
                    flexGrow: 1,
                    cursor: "pointer",
                    backgroundColor: "white",
                    borderTopRightRadius: 14,
                  }}
                >
                  <button
                    disabled={data?.status_code < 40}
                    onClick={() => setSequence(2)}
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    {sequence === 2 ? (
                      <SVG
                        src={toAbsoluteUrl("/media/svg/icons/All/review.svg")}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/review-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 2 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Review
                    </h1>
                  </button>
                </div>
              </Col>

              <Col>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    backgroundColor: "white",
                    flexGrow: 1,
                    cursor: "pointer",
                    borderTopRightRadius: 14,
                    gap: 4,
                  }}
                >
                  <button
                    disabled={data?.status_code < 60}
                    onClick={() => setSequence(3)}
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    {sequence === 3 ? (
                      <SVG
                        src={toAbsoluteUrl("/media/svg/icons/All/approval.svg")}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/approval-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 3 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Approval
                    </h1>
                  </button>
                </div>
              </Col>

              <Col>
                <div
                  className="d-flex flex-column align-items-center"
                  style={{
                    backgroundColor: "white",
                    flexGrow: 1,
                    cursor: "pointer",
                    borderTopRightRadius: 14,
                    gap: 4,
                  }}
                >
                  <button
                    disabled={data?.status_code < 80}
                    onClick={() => setSequence(4)}
                    style={{
                      border: "none",
                      outline: "none",
                      backgroundColor: "white",
                    }}
                  >
                    {sequence === 4 ? (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/distribusi.svg"
                        )}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/All/distribusi-black.svg"
                        )}
                      />
                    )}
                    <h1
                      style={{
                        fontSize: 14,
                        color: sequence === 4 ? "#3699ff" : "#8c8a8a",
                      }}
                    >
                      Distribusi
                    </h1>
                  </button>
                </div>
              </Col>
            </Row>
          </Container>

          <div
            style={{
              display: "flex",
              columnGap: 40,
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div className="col-md-4">
              <div className="form-group row">
                <label
                  htmlFor="agreement_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Nomor Perjanjian
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="agreement_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  value={contract?.contract_no}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="po_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Nomor PO
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="po_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  value={contract?.purch_order?.po_sap}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="agreement_format"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Format Perjanjian
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="agreement_format"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.contract_format?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="procurement_authority"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Kewenangan Pengadaan
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="procurement_authority"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.authority?.facility?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="user"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Pengguna
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.user?.facility?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="provider"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Penyedia
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="provider"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.vendor?.party?.full_name}
                />
              </div>
            </div>

            <div className="col-md-7">
              <div className="form-group row">
                <label
                  htmlFor="procurement_title"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Judul Pengadaan
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="procurement_title"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.contract_name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="po_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Keterangan PO
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="po_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.purch_order?.name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="agreement_type"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Jenis Perjanjian
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="agreement_type"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  value={data?.doc_type}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="po_number"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Grup Kewenangan Pengadaan
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="po_number"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.authority_group?.party?.full_name}
                />
              </div>
              <div className="form-group row">
                <label
                  htmlFor="user_group"
                  className="col-form-label"
                  style={{ fontWeight: 500, fontSize: 14 }}
                >
                  Grup Pengguna
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user_group"
                  style={{ backgroundColor: "#c7d2d8" }}
                  disabled
                  onChange={(e) => {}}
                  value={contract?.user_group?.party?.full_name}
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};
export default TabCard;
