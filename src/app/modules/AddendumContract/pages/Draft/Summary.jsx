import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { rupiah } from "app/libs/currency";
import SVG from "react-inlinesvg";
import moment from "moment";
import { toAbsoluteUrl } from "_metronic/_helpers";
import { DEV_NODE } from "redux/BaseHost";

const Summary = ({ data }) => {
  return (
    <div className="bg-white p-10">
      <h4 className="mb-2">A. Tanggal Dokumen Permohonan</h4>
      <div className="mb-5">
        {data?.add_request_date ? moment(data?.add_request_date).format("DD/MMM/yyyy") : "-"}
      </div>
      <h4 className="mb-2">B. Perihal Addendum</h4>
      <Row className="mb-5">
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Data Para Pihak"}
            checked={data?.is_add_parties}
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Metode Pembayaran"}
            checked={data?.is_add_payment_method}
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Denda"}
            checked={data?.is_add_fine}
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Nomor Rekening"}
            checked={data?.is_add_account_number}
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Harga Pekerjaan"}
            checked={data?.is_add_job_price}
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Jangka Waktu"}
            checked={data?.is_add_time_period}
            disabled
          />
        </Col>
        <Col md={3}>
          <Form.Check
            className="mb-3"
            label={"Jaminan"}
            checked={data?.is_add_guarantee}
            disabled
          />
        </Col>
        <Col md={12}>
          <div className="d-flex align-items-center mb-3">
            <Form.Check
              className="mr-2"
              label={"Lainnya"}
              checked={data?.other_note}
              disabled
            />
            <input
              className="form-control col-4"
              value={data?.other_note}
              placeholder="Masukkan perihal addendum lainnya"
              disabled
            />
          </div>
        </Col>
      </Row>
      <h4 className="mb-2">C. Perubahan Harga Pekerjaan (Exc PPN)</h4>

      <Row className="mb-3">
        <Col md={6}>Harga Pekerjaan Awal</Col>
        <Col md={6}>
          {data?.initial_job_price ? rupiah(data?.initial_job_price * 1) : "-"}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Harga Pekerjaan Addendum Terakhir</Col>
        <Col md={6}>
          {data?.latest_addendum_job_price
            ? rupiah(data?.latest_addendum_job_price * 1)
            : "-"}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Penambahan Harga Pekerjaan</Col>
        <Col md={6}>
          {data?.increase_job_price
            ? rupiah(data?.increase_job_price * 1)
            : "-"}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Pengurangan Harga Pekerjaan</Col>
        <Col md={6}>
          {data?.decrease_job_price
            ? rupiah(data?.decrease_job_price * 1)
            : "-"}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Harga Pekerjaan Setelah Addendum</Col>
        <Col md={6}>
          {data?.after_addendum_job_price
            ? rupiah(data?.after_addendum_job_price * 1)
            : "-"}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Persentase Addendum</Col>
        <Col md={6}>{data?.addendum_percentage || 0}%</Col>
      </Row>
      <Row className="mb-5">
        <Col md={6}>Kesimpulan</Col>
        <Col md={6}>{data?.conclusion || "-"}</Col>
      </Row>

      <h4 className="mb-2">D. Dokumen Pendukung</h4>
      {!data?.add_support_document_data && (
        <div className="mb-3">Dokumen kosong</div>
      )}
      {data?.add_support_document_data?.map((document, i) => (
        <>
          <div className="d-flex align-items-center mb-2">
            <span className="mr-2">
              {i + 1}. {document?.namaDokumen}
            </span>
            <small>
              diupload :
              {document?.tglUploadDokumen}
              {/* {moment(document?.tglUploadDokumen).format("DD MMM yyyy hh:mm")} FIX: This line will be update after BE converting into UTC clock */}
            </small>
          </div>

          <Row className="ml-3 mb-3">
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">No Dokumen</b>
                <span>{document?.noDokumen}</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">Tanggal Dokumen</b>
                <span>
                  {moment(document?.tglDokumen).format("DD/MMM/yyyy")}
                </span>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">Dokumen</b>
                <a
                  onClick={() => {
                    window.open(
                      `${DEV_NODE}/support_document/${document?.fileDokumen}`,
                      "_blank"
                    );
                  }}
                  href="/#"
                  className="overflow-hidden d-flex align-items-center"
                >
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/files/PDF_download.svg"
                    )}
                    style={{ flex: "none" }}
                    className="mr-2"
                  />
                  <span className="text-truncate">{document?.fileDokumen}</span>
                </a>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">Perihal</b>
                <span>{document?.perihal || "-"}</span>
              </div>
            </Col>
          </Row>
        </>
      ))}

      <h4 className="mb-2">E. Permintaan Penerbitan Draft Addendum Kepada :</h4>
      <div className="mb-5">{data?.add_drafter || "-"}</div>
      <h4 className="mb-2">F. Catatan Addendum (Opsional)</h4>
      <div className="mb-5">
        <textarea className="form-control" disabled>
          {data?.request_note || "-"}
        </textarea>
      </div>
    </div>
  );
};

export default Summary;
