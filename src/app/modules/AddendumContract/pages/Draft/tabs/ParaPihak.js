import { Search } from "@material-ui/icons";
import { Formik } from "formik";
import React from "react";
import { Form, Row, Col } from "react-bootstrap";
const ParaPihakTab = ({ data }) => {
  return (
    <div className="bg-white p-10">
      {/* <Formik> */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="card d-inline-block bg-secondary mb-4">
            <div className="p-2">
              <h4 className="mb-0">A. Pihak Pertama</h4>
            </div>
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <h4 className="my-3">Pejabat Berwenang</h4>
              <div className="form-group mb-3">
                <label>Username</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nama</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Penugasan</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" disabled />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" disabled />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama Notaris</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nama Akta</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" disabled />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" disabled />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Kemenkumham</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" disabled />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" disabled />
                </div>
              </div>
            </Col>
            <Col md={6}>
              <h4 className="my-3">Addendum Pejabat Berwenang</h4>
              <div className="form-group mb-3">
                <label>Username</label>
                <div className="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <Search />
                    </div>
                  </div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Penugasan</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama Nomor Akta</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Nama Nomor Akta</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Kemenkumham</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" />
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <h4 className="my-3">Direksi Pekerjaan</h4>
              <div className="form-group mb-3">
                <label>Username</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nama Lengkap</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" disabled />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="my-3">Addendum Direksi Pekerjaan</h4>
                <button className="btn btn-primary">Tambah</button>
              </div>

              <div className="form-group mb-3">
                <label>Username</label>
                <div className="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <Search />
                    </div>
                  </div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama Lengkap</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <div className="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <Search />
                    </div>
                  </div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" />
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <h4 className="my-3">Pengawas Pekerjaan</h4>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" disabled />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="my-3">Addendum Pengawas Pekerjaan</h4>
                <button className="btn btn-primary">Tambah</button>
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" />
              </div>
            </Col>
          </Row>
          <div className="card d-inline-block bg-secondary my-4">
            <div className="p-2">
              <h4 className="mb-0">B. Pihak Kedua</h4>
            </div>
          </div>

          <Row className="mb-2">
            <Col md={6}>
              <h4 className="my-3">Pejabat Berwenang</h4>
              <div className="form-group mb-3">
                <label>Username</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nama</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Penugasan</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" disabled />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" disabled />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama Nomor Akta</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nomor Akta</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" disabled />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" disabled />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Kemenkumham</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" disabled />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" disabled />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Email PIC</label>
                <input className="form-control" value="" disabled />
              </div>
            </Col>
            <Col md={6}>
              <h4 className="my-3">Addendum Pejabat Berwenang</h4>
              <div className="form-group mb-3">
                <label>Username</label>
                <div className="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <Search />
                    </div>
                  </div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Penugasan</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama Nomor Akta</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Nama Akta</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nomor SK Kemenkumham</label>
                <div className="d-flex align-items-center justify-content-between">
                  <input className="form-control" value="" />
                  <div className="mx-2">-</div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Email PIC</label>
                <input className="form-control" value="" />
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <h4 className="my-3">Direksi Pekerjaan</h4>
              <div className="form-group mb-3">
                <label>Username</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Nama Lengkap</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" disabled />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="my-3">Addendum Direksi Pekerjaan</h4>
                <button className="btn btn-primary">Tambah</button>
              </div>

              <div className="form-group mb-3">
                <label>Username</label>
                <div className="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <Search />
                    </div>
                  </div>
                  <input className="form-control" value="" />
                </div>
              </div>
              <div className="form-group mb-3">
                <label>Nama Lengkap</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" />
              </div>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={6}>
              <h4 className="my-3">Pengawas Pekerjaan</h4>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" disabled />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" disabled />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" disabled />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="my-3">Addendum Pengawas Pekerjaan</h4>
                <button className="btn btn-primary">Tambah</button>
              </div>
              <div className="form-group mb-3">
                <label>Jabatan</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Alamat</label>
                <input className="form-control" value="" />
              </div>
              <div className="form-group mb-3">
                <label>Telp</label>
                <input className="form-control" value="" />
              </div>

              <div className="form-group mb-3">
                <label>FAX</label>
                <input className="form-control" value="" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="mb-0">C. Perubahan Klausul Kontrak Para Pihak</h4>
          <h4 className="my-3">C.1 Body Kontrak</h4>
          <div className="form-group mb-3">
            <input
              className="form-control col-6"
              value=""
              placeholder="Masukan Nomor Pasal"
            />
          </div>
          <div className="form-group mb-3">
            <label>Pasal Sebelum Addendum</label>
            <textarea className="form-control"></textarea>
          </div>
          <div className="form-group mb-3">
            <label>Pasal Setelah Addendum</label>
            <textarea className="form-control"></textarea>
          </div>
          <button className="btn btn-primary">Tambah Klausul Lampiran</button>
        </div>
      </div>
      {/* </Formik> */}
    </div>
  );
};

export default ParaPihakTab;
