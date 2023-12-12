import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Search } from "@material-ui/icons";
import { Row, Col } from "react-bootstrap";
import { ReactSelect } from "percobaan/ReactSelect";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
const ParaPihakTab = ({
  isAdmin,
  dataContractById,
  authorizedOfficial,
  secondAuthorizedOfficial,
}) => {
  const openCloseAddClause = React.useRef();
  const openCloseWorkDirector = React.useRef();
  const [authorizedOfficialIndex, setauthorizedOfficialIndex] = useState(0);
  const showAddWorkDirector = () => {
    openCloseWorkDirector.current.open();
  };
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const changeDataauthorizedOfficial = (num) => {
    setauthorizedOfficialIndex(num);
  };

  const [placeman, setPlaceman] = useState({
    secondAuthorizedOfficial: [
      {
        currentSelectIndex: 0,
        fullname: "",
        position_title: "",
        address: "",
        phone_number: "",
        fax: "",
        sk_assign_number: "",
        sk_assign_date: "",
        notary_name: "",
        act_number: "",
        act_date: "",
        sk_kemenkumham_number: "",
        sk_kemenkumham_date: "",
        PICEmail: "",
      },
    ],
    workDirector: [
      {
        usernameSelectIndex: 0,
        facilityNameSelectIndex: 0,
        party_1_job_director_username: "",
        party_1_job_director_fullname: "",
        party_1_job_director_position: "",
        party_1_job_director_address: "",
        party_1_job_director_telp: "",
        party_1_job_director_fax: "",
        facility_name: "",
      },
    ],
    workSupervisor: [
      {
        currentIndex: 0,
        party_1_job_supervisor_position: "",
        party_1_job_supervisor_address: "",
        party_1_job_supervisor_telp: "",
        party_1_job_supervisor_fax: "",
      },
    ],
    secondWorkDirector: [
      {
        party_2_job_director_position: "",
        party_2_job_director_address: "",
        party_2_job_director_telp: "",
        party_2_job_director_fax: "",
      },
    ],
    secondWorkSupervisor: [
      {
        party_2_job_supervisor_position: "",
        party_2_job_supervisor_address: "",
        party_2_job_supervisor_telp: "",
        party_2_job_supervisor_fax: "",
      },
    ],
  });
  return (
    <div className="bg-white p-10">
      <Formik>
        {({ values }) => (
          <Form>
            <div
              className="mb-3"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                border: 1,
                borderColor: "black",
                borderStyle: "solid",
                padding: 28,
                borderRadius: 14,
              }}
            >
              <div className="para-pihak">
                <div className="card d-inline-block bg-secondary mb-4">
                  <div className="p-2">
                    <h4 className="mb-0">A. Pihak Pertama</h4>
                  </div>
                </div>

                <Row className="mb-3">
                  <Col md={6}>
                    <h4 className="my-3">Pejabat Berwenang Pihak Pertama</h4>
                    <div className="form-group mb-3">
                      <label>Username</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_contract_signature_username
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_contract_signature_name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_position_of_autorize
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={dataContractById?.authority?.address}
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={dataContractById?.authority?.phone}
                        disabled
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={dataContractById?.authority?.fax}
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Penugasan</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party?.party_1_sk_no
                          }
                          disabled
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party?.party_1_sk_date
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Notaris</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_notary_act_autorized_name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor Akta</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_1_notary_act_autorized_no
                          }
                          disabled
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_1_notary_act_autorized_date
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Kemenkumham</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_1_autorized_kemenkumham_no
                          }
                          disabled
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_1_autorized_kemenkumham_date
                          }
                          disabled
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h4 className="my-3">
                      Addendum Pejabat Berwenang Pihak Pertama
                    </h4>
                    <div
                      className="form-group"
                      style={{ marginBottom: "-9px" }}
                    >
                      <label>Username</label>
                      <ReactSelect
                        data={authorizedOfficial}
                        func={changeDataauthorizedOfficial}
                        labelName={`authorized_official_username`}
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama</label>
                      <input
                        className="form-control"
                        value={
                          authorizedOfficial[authorizedOfficialIndex]
                            ?.authorized_official_name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          authorizedOfficial
                            ? authorizedOfficial[authorizedOfficialIndex]
                                ?.authorized_official_position
                            : ""
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={
                          authorizedOfficial
                            ? authorizedOfficial[authorizedOfficialIndex]
                                ?.address
                            : ""
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={
                          authorizedOfficial
                            ? authorizedOfficial[authorizedOfficialIndex]?.phone
                            : ""
                        }
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={
                          authorizedOfficial
                            ? authorizedOfficial[authorizedOfficialIndex]?.fax
                            : ""
                        }
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Penugasan</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            authorizedOfficial[authorizedOfficialIndex]
                              ?.assignment_deed_no
                          }
                          disabled={!isAdmin}
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            authorizedOfficial[authorizedOfficialIndex]
                              ?.assignment_deed_date
                          }
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Notaris</label>
                      <input
                        className="form-control"
                        value={
                          authorizedOfficial
                            ? authorizedOfficial[authorizedOfficialIndex]
                                ?.name_notary_deed_of_authorized_official
                            : ""
                        }
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Nomor Akta</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.authorized_official_deed_no
                              : ""
                          }
                          disabled={!isAdmin}
                        />
                        <div className="mx-2">-</div>
                        <input
                          type="date"
                          className="form-control"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.authorized_official_deed_date
                              : ""
                          }
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Kemenkumham</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.authorized_official_sk_kemenkumham_no
                              : ""
                          }
                          disabled={!isAdmin}
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.authorized_official_sk_kemenkumham_date
                              : ""
                          }
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <h4 className="my-3">Direksi Pekerjaan Pihak Pertama</h4>
                    <div className="form-group mb-3">
                      <label>Username</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_director_position_username
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Lengkap</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_director_position_full_name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_director_position
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_director_position_address
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_director_position_phone
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_director_position_fax
                        }
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="my-3">
                        Addendum Direksi Pekerjaan Pihak Pertama
                      </h4>
                      <button
                        className="btn btn-primary"
                        onClick={showAddWorkDirector}
                        disabled={!isAdmin}
                      >
                        Tambah
                      </button>
                    </div>

                    {placeman.workDirector &&
                      placeman.workDirector.map((data, index) => {
                        return (
                          <>
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
                              <input
                                className="form-control"
                                value=""
                                disabled
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label>Jabatan</label>
                              <input
                                className="form-control"
                                value=""
                                disabled
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label>Alamat</label>
                              <div className="input-group">
                                <div class="input-group-prepend">
                                  <div class="input-group-text">
                                    <Search />
                                  </div>
                                </div>
                                <input
                                  className="form-control"
                                  value=""
                                  disabled={!isAdmin}
                                />
                              </div>
                            </div>
                            <div className="form-group mb-3">
                              <label>Telp</label>
                              <input
                                className="form-control"
                                value=""
                                disabled={!isAdmin}
                              />
                            </div>

                            <div className="form-group mb-3">
                              <label>FAX</label>
                              <input
                                className="form-control"
                                value=""
                                disabled={!isAdmin}
                              />
                            </div>
                          </>
                        );
                      })}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <h4 className="my-3">Pengawas Pekerjaan Pihak Pertama</h4>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_job_supervisor?.name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_job_supervisor?.address
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_job_supervisor?.telp
                        }
                        disabled
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_1_job_supervisor?.fax
                        }
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="my-3">
                        Addendum Pengawas Pekerjaan Pihak Pertama
                      </h4>
                      <button className="btn btn-primary">Tambah</button>
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
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
                      <label>Nama</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_autorize_name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party?.party_2_position
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position_address
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position_phone
                        }
                        disabled
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position_fax
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Penugasan</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party?.party_2_sk_no
                          }
                          disabled
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party?.party_2_sk_date
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Notaris</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_notary_act_autorized_name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor Akta</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_2_notary_act_autorized_no
                          }
                          disabled
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_2_notary_act_autorized_date
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Kemenkumham</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_2_autorized_kemenkumham_no
                          }
                          disabled
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value={
                            dataContractById?.contract_party
                              ?.party_2_autorized_kemenkumham_date
                          }
                          disabled
                        />
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
                      <label>Nama</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input className="form-control" value="" disabled />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input className="form-control" value="" disabled />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Penugasan</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value=""
                          disabled={!isAdmin}
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value=""
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Nomor Akta</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Nama Akta</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value=""
                          disabled={!isAdmin}
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value=""
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Nomor SK Kemenkumham</label>
                      <div className="d-flex align-items-center justify-content-between">
                        <input
                          className="form-control"
                          value=""
                          disabled={!isAdmin}
                        />
                        <div className="mx-2">-</div>
                        <input
                          className="form-control"
                          value=""
                          disabled={!isAdmin}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Email PIC</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <h4 className="my-3">Direksi Pekerjaan</h4>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position_address
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position_phone
                        }
                        disabled
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_director_position_fax
                        }
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="my-3">Addendum Direksi Pekerjaan</h4>
                      <button className="btn btn-primary">Tambah</button>
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <h4 className="my-3">Pengawas Pekerjaan</h4>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_job_superviso?.name
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_job_superviso?.address
                        }
                        disabled
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_job_superviso?.telp
                        }
                        disabled
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value={
                          dataContractById?.contract_party
                            ?.party_2_job_superviso?.fax
                        }
                        disabled
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="my-3">Addendum Pengawas Pekerjaan</h4>
                      <button className="btn btn-primary">Tambah</button>
                    </div>
                    <div className="form-group mb-3">
                      <label>Jabatan</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Alamat</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Telp</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>FAX</label>
                      <input
                        className="form-control"
                        value=""
                        disabled={!isAdmin}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="klausul-kontrak">
              <PerubahanKlausulKontrak
                isDisable={isAdmin}
                subTitle={"C"}
                title={"Para Pihak"}
                showAddClause={showAddClause}
                fromWhere={"parties"}
                values={values}
                isMandatory={true}
              />
            </div>
            <UpdateButton fromWhere={"parties"} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ParaPihakTab;
