import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Row, Col } from "react-bootstrap";
import { rupiah } from "app/libs/currency";
import SVG from "react-inlinesvg";
import moment from "moment";
import { toAbsoluteUrl } from "_metronic/_helpers";

const Summary = ({ loginStatus, rolesEproc }) => {
  // const get = async () => {
  //     fetch_api_sg({
  //       key: keys.fetch,
  //       type: "get",
  //       url: `/adendum/refference/get-all-pinalties`,
  //       onSuccess: (res) => {
  //         setDataArr(
  //           res.data.map((item) => ({
  //             id: item.id,
  //             name: item.pinalty_name,
  //           }))
  //         );
  //       },
  //     });
  //   };

  useEffect(() => {}, []);
  return (
    <div className="bg-white p-10">
      <h4 className="mb-2">A. Addendum jangka waktu</h4>
      <div className="mb-5">
        {moment("2023-11-16T18:41:41.000Z").format("DD/MMM/yyyy")}
      </div>
      <h4 className="mb-2">B. Perihal Addendum</h4>
      <Row className="mb-5">
        <Col md={3}>
          <Form.Check className="mb-3" label={"Data Para Pihak"} disabled />
        </Col>
        <Col md={3}>
          <Form.Check className="mb-3" label={"Metode Pembayaran"} disabled />
        </Col>
        <Col md={3}>
          <Form.Check className="mb-3" label={"Denda"} disabled />
        </Col>
        <Col md={3}>
          <Form.Check className="mb-3" label={"Nomor Rekening"} disabled />
        </Col>
        <Col md={3}>
          <Form.Check className="mb-3" label={"Harga Pekerjaan"} disabled />
        </Col>
        <Col md={3}>
          <Form.Check className="mb-3" label={"Jangka Waktu"} disabled />
        </Col>
        <Col md={3}>
          <Form.Check className="mb-3" label={"Jaminan"} disabled />
        </Col>
        <Col md={12}>
          <div className="d-flex align-items-center mb-3">
            <Form.Check className="mr-2" label={"Harga Pekerjaan"} disabled />
            <input placeholder="Masukkan perihal addendum lainnya" disabled />
          </div>
        </Col>
      </Row>
      <h4 className="mb-2">C. Perubahan Harga Pekerjaan (Exc PPN)</h4>

      <Row className="mb-3">
        <Col md={6}>Harga Pekerjaan Awal</Col>
        <Col md={6}>{rupiah(7422000000)}</Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Harga Pekerjaan Addendum Terakhir</Col>
        <Col md={6}>{rupiah(0)}</Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Penambahan Harga Pekerjaan</Col>
        <Col md={6}>{rupiah(0)}</Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Pengurangan Harga Pekerjaan</Col>
        <Col md={6}>{rupiah(0)}</Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Harga Pekerjaan Setelah Addendum</Col>
        <Col md={6}>{rupiah(0)}</Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Persentase Addendum</Col>
        <Col md={6}>2%</Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>Kesimpulan</Col>
        <Col md={6}>
          Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal
        </Col>
      </Row>

      <h4 className="mb-2">D. Dokumen Pendukung</h4>
      {[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map((document, i) => (
        <>
          <div className="d-flex align-items-center mb-3">
            <span className="mr-2">
              {i + 1}. Surat Permohonan Addendum dari Pihak Kedua
            </span>
            <small>
              diupload :{" "}
              {moment("2023-11-16T18:41:41.000Z").format("DD MMM yyyy hh:mm")}
            </small>
          </div>

          <Row className="mb-5">
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">No Dokumen</b>
                <span>017.SPV/PST.100-GDE/I/2023</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">Tanggal Dokumen</b>
                <span>
                  {moment("2023-11-16T18:41:41.000Z").format("DD/MMM/yyyy")}
                </span>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">Upload Dokumen</b>
                <a href="#" className="d-flex align-items-center">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/files/PDF_download.svg"
                    )}
                    className="mr-2"
                  />
                  <span>PADD_Surat Permohonan Addendum .pdf</span>
                </a>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <b className="d-block">Perihal</b>
                <span>Dokumen</span>
              </div>
            </Col>
          </Row>
        </>
      ))}

      <h4 className="mb-2">E. Permintaan Penerbitan Draft Addendum Kepada :</h4>
      <div className="mb-5">Supply Chain Management (SCM) Division</div>
      <h4 className="mb-2">F. Catatan Addendum (Opsional)</h4>
      <div className="mb-5">
        Berisi Catatan Adendum baik di approve / direject
      </div>
    </div>
  );
};

const mapState = (state) => ({
  loginStatus: state.auth.user.data.status,
  rolesEproc: state.auth.user.data.roles_eproc,
});

export default connect(mapState)(Summary);
