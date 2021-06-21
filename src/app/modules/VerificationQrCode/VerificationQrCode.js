import React, { useState, useEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../_metronic/_partials/controls";
import { toAbsoluteUrl } from "../../../_metronic/_helpers/AssetsHelpers";
import { useHistory } from "react-router-dom";
// import { getContractClient } from "../../_redux/InvoiceMonitoringCrud";
import useToast from "../../components/toast";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { Container } from "@material-ui/core";

function VerificationQrCode(props) {
  const { intl } = props;
  const [styles] = useState({
    fontSizeItalicHeader: 9,
    fontSizeItalicCard: 10,
    backgroundColorCardUser: "rgb(229 229 229)",
  });
  const [loading] = useState(false);
  const [Toast, setToast] = useToast();
  const history = useHistory();

  useEffect(() => {
    // setTimeout(() => {
    //   setToast("error || Go To Home Page", 3000);
    //   setTimeout(() => {
    //     history.push("/");
    //   }, 2000);
    // }, 2000);
  }, []);

  return (
    <React.Fragment>
      <Toast />
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
                <div className="form-group mt-5">
                  <label>
                    <small className="form-text">Nama Dokumen:</small>
                    <small
                      className="form-text font-italic"
                      style={{ fontSize: styles.fontSizeItalicCard }}
                    >
                      Document Title:
                    </small>
                  </label>
                  <h6 className="form-control-plaintext p-0">Perjanjian</h6>
                </div>
                <div className="form-group mt-5">
                  <label>
                    <small className="form-text">Nama Dokumen:</small>
                    <small
                      className="form-text font-italic"
                      style={{ fontSize: styles.fontSizeItalicCard }}
                    >
                      Document Title:
                    </small>
                  </label>
                  <h6 className="form-control-plaintext p-0">Perjanjian</h6>
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
                    style={{ backgroundColor: styles.backgroundColorCardUser }}
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
                            Jeffry Azhari Rosman Amd.K
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
                          <h6 className="text-uppercase">Direktur Keuangan</h6>
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
                            31-01-2020 17:50:22
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
                    Untuk memastikan kebenaran pernyataan ini pastikan URL pada
                    browser anda adalah https://geodipa.co.id/
                  </span>
                  <span
                    className="font-italic"
                    style={{ fontSize: styles.fontSizeItalicHeader }}
                  >
                    If you wish to check the validity of this statement, please
                    ensure the URL of your browser is https://geodipa.co.id/
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </Container>
      )}
    </React.Fragment>
  );
}

export default injectIntl(connect(null, null)(VerificationQrCode));
