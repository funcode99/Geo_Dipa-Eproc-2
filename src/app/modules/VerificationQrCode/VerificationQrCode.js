import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Card, CardBody } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers/AssetsHelpers";
import {
  // useHistory,
  useLocation,
} from "react-router-dom";
// import useToast from "../../components/toast";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { Container } from "@material-ui/core";
import { verificationQr } from "./_redux/VerificationQrCodeCrud";

function VerificationQrCode(props) {
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
    setLoading(true);
    if (query.get("term_id") === null && query.get("role_id") === null) {
      setLoading(false);
      setTokenStatus(false);
    } else {
      verificationQr(query.get("term_id"), query.get("role_id"), query.get("type"))
        .then((result) => {
          setData(result.data.data);
          setLoading(false);
          setTokenStatus(true);
        })
        .catch((err) => {
          setLoading(false);
          setTokenStatus(false);
          // setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        });
    }
    // setTimeout(()=> {
    //   setToast("error || Go To Home Page", 3000);
    //   setTimeout(() => {
    //     history.push("/");
    //   }, 2000);
    // }, 2000);
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
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Nama Dokumen:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Document Title:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.document_name}
                      </h6>
                    </div>
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Nomor Dokumen:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Document Number:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.document_number}
                      </h6>
                    </div>
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Nama Penyedia:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Vendor Name:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.vendor_name}
                      </h6>
                    </div>
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Judul Kontrak:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Contract Name:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.contract_name}
                      </h6>
                    </div>
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Nomor Kontrak:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Contract Number:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.contract_no}
                      </h6>
                    </div>
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Nomor Purch Order:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Purch Order Number:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.purch_order_no}
                      </h6>
                    </div>
                    <div className="form-group mt-5 mb-0">
                      <label>
                        <small className="form-text">Termin:</small>
                        <small
                          className="form-text font-italic"
                          style={{ fontSize: styles.fontSizeItalicCard }}
                        >
                          Termin:
                        </small>
                      </label>
                      <h6 className="form-control-plaintext p-0">
                        {data?.term_name}
                      </h6>
                    </div>
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
                                {data?.full_name}
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
                                {data?.role_name}
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
                                {data?.approved_date
                                  ? window.moment
                                      .utc(new Date(data?.approved_date))
                                      .format("DD-MM-YYYY HH:mm:ss")
                                  : ""}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center my-5 pt-5">
                      <h6>
                        <i className="far fa-check-circle text-success mr-2"></i>
                        Adalah benar dan tercatat dalam audit trail kami.
                      </h6>
                      <span
                        className="font-italic"
                        style={{ fontSize: styles.fontSizeItalicHeader }}
                      >
                        That is true and it is recorded in our audit trail.
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

export default injectIntl(connect(null, null)(VerificationQrCode));
