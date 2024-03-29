import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Card, CardBody } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers/AssetsHelpers";
import { useLocation } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { Container } from "@material-ui/core";
import { fetch_api_sg } from "../../../redux/globalReducer";

const renderRow = ({ label, labelEN, value, styles }) => {
  return (
    <div className="form-group mt-5 mb-0">
      <label>
        <small className="form-text">{label}</small>
        <small
          className="form-text font-italic"
          style={{ fontSize: styles.fontSizeItalicCard }}
        >
          {labelEN}
        </small>
      </label>
      <h6 className="form-control-plaintext p-0">{value}</h6>
    </div>
  );
};

function VerificationQrCodeDM({ fetch_api_sg }) {
  // const { intl } = props;
  const [styles] = useState({
    fontSizeItalicHeader: 9,
    fontSizeItalicCard: 10,
    backgroundColorCardUser: "rgb(229 229 229)",
  });
  const [loading, setLoading] = useState(false);
  // const [Toast, setToast] = useToast();
  const [tokenStatus, setTokenStatus] = useState(false);
  // const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const [data, setData] = useState({});

  useEffect(() => {
    // setLoading(true);
    if (
      query.get("doc_id") === null &&
      query.get("type") === null &&
      query.get("user") === null
    ) {
      setLoading(false);
      setTokenStatus(false);
    } else {
      const params = {
        doc_id: query.get("doc_id"),
        type: query.get("type"),
        user: query.get("user"),
      };
      fetch_api_sg({
        key: "qr-code-dm",
        type: "get",
        url: `/delivery/task/${params.doc_id}/${params.type}/${params.user}`,
        onSuccess: (res) => {
          setData(res.data);
          setLoading(false);
          setTokenStatus(true);
        },
      });
    }
  }, []);

  return (
    <React.Fragment>
      {/* <Toast /> */}
      {loading && <LayoutSplashScreen />}
      {!loading && (
        <Container maxWidth="sm" fixed className="my-5">
          <div className="text-center my-3">
            <img
              src={toAbsoluteUrl("/media/logos/logo-eprocurement.png")}
              style={{ width: "15em" }}
              alt="Logo"
            />
          </div>
          <div className="text-center my-5">
            <h1>Verifikasi Tanda Tangan Elektronik</h1>
            <span
              className="font-italic"
              style={{ fontSize: styles.fontSizeItalicHeader }}
            >
              Digital Signature Verification
            </span>
          </div>
          <div className="text-center my-5">
            <h6>PT Geo Dipa Energi (Persero) menyatakan bahwa:</h6>
            <span
              className="font-italic"
              style={{ fontSize: styles.fontSizeItalicHeader }}
            >
              PT Geo Dipa Energi (Persero) states that:
            </span>
          </div>
          <div className="my-5 py-5">
            <Card className="shadow-lg">
              <CardBody className="px-5 py-0">
                {!tokenStatus && (
                  <div name="invalidToken">
                    <div className="text-center mt-5">
                      <span className="d-block">
                        Ups, token dokumen tidak valid
                      </span>
                      <span
                        className="font-italic"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        Oops, document token is invalid
                      </span>
                    </div>
                    <div className="text-center mb-5 pb-5">
                      <span
                        className="d-block"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        Tidak ada informasi yang perlu ditampilkan di sini
                      </span>
                      <span
                        className="font-italic"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        There is no information that needs to be displayed here
                      </span>
                    </div>
                  </div>
                )}

                {tokenStatus && (
                  <div name="validToken">
                    {renderRow({
                      label: "Judul:",
                      labelEN: "Title:",
                      value: data?.title,
                      styles: styles,
                    })}
                    {renderRow({
                      label: "Nama Contract:",
                      labelEN: "Contract Name:",
                      value: data?.contract_name,
                      styles: styles,
                    })}
                    {renderRow({
                      label: "Nomor Contract:",
                      labelEN: "Contract Number:",
                      value: data?.contract_no,
                      styles: styles,
                    })}
                    {renderRow({
                      label: "Nomor Purch Order:",
                      labelEN: "Purch Orde Number:",
                      value: data?.po_number,
                      styles: styles,
                    })}
                    {renderRow({
                      label: "Nama Penyedia:",
                      labelEN: "Vendor Name:",
                      value: data?.vendor_name,
                      styles: styles,
                    })}
                    {renderRow({
                      label: "Nama Termin:",
                      labelEN: "Term Name:",
                      value: data?.termin_name,
                      styles: styles,
                    })}

                    <div className="form-group mt-5 mb-1">
                      <label>
                        <small className="form-text">
                          Telah ditandatangani oleh User sebagai berikut:
                        </small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Has been signed by User as follows:
                        </small>
                      </label>
                    </div>
                    <div className="form-group">
                      <div
                        className="card"
                        style={{
                          backgroundColor: styles.backgroundColorCardUser,
                        }}
                      >
                        <div className="card-body p-5">
                          <div className="row mt-5">
                            <div className="col">
                              <small
                                className="form-text"
                                style={{ fontSize: styles.fontSizeItalicCard }}
                              >
                                Nama/Name:
                              </small>
                              <h6 className="text-uppercase">
                                {data?.signed_by}
                              </h6>
                            </div>
                          </div>
                          <div className="row mt-5">
                            <div className="col">
                              <small
                                className="form-text"
                                style={{ fontSize: styles.fontSizeItalicCard }}
                              >
                                Posisi/Position:
                              </small>
                              <h6 className="text-uppercase">
                                {data?.signed_by_position}
                              </h6>
                            </div>
                          </div>
                          <div className="row my-5">
                            <div className="col">
                              <small
                                className="form-text"
                                style={{ fontSize: styles.fontSizeItalicCard }}
                              >
                                Waktu/Time:
                              </small>
                              <h6 className="text-uppercase">
                                {window
                                  .moment(new Date(data?.signed_at))
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center my-5 pt-5">
                      <h6>
                        <i className="far fa-check-circle text-success mr-2"></i>
                        Adalah benar dan tercatat dalam aplikasi e-procurement.
                      </h6>
                      <span
                        className="font-italic"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        That is true and it is recorded in e-procurement
                        application.
                      </span>
                    </div>
                    <div className="text-center my-5 pb-5">
                      <span
                        className="d-block"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        Untuk memastikan kebenaran pernyataan ini pastikan URL
                        pada browser anda adalah https://geodipa.co.id/
                      </span>
                      <span
                        className="font-italic"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        If you wish to check the validity of this statement,
                        please ensure the URL of your browser is
                        https://geodipa.co.id/
                      </span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </Container>
      )}
    </React.Fragment>
  );
}

const mapDispatch = {
  fetch_api_sg,
};

export default injectIntl(connect(null, mapDispatch)(VerificationQrCodeDM));
