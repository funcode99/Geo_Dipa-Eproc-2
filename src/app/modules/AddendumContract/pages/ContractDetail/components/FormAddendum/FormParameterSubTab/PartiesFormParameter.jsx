import React, { useState, useEffect } from "react";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton";
// FieldArray, ErrorMessage
import { Formik, Field, Form } from "formik";
import { ReactSelect } from "percobaan/ReactSelect";
import { submitParties } from "app/modules/AddendumContract/service/DeliveryMonitoringCrud";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import NewWorkDirector from "../Components/Modal/Parties/NewWorkDirector";
import NewWorkSupervisor from "../Components/Modal/Parties/NewWorkSupervisor";
import NewSecondWorkDirector from "../Components/Modal/Parties/NewSecondWorkDirector";
import NewSecondWorkSupervisor from "../Components/Modal/Parties/NewSecondWorkSupervisor";
import NewClause from "../Components/Modal/NewClause";
import { submitJobPrice } from "app/modules/AddendumContract/service/DeliveryMonitoringCrud";

const PartiesFormParameter = ({
  jsonData,
  authorizedOfficial,
  secondAuthorizedOfficial,
  PICData,
  jobDirector,
  jobSupervisor,
  contract_id,
}) => {
  const bodyClauseDataTemplate = {
    clause_number: "",
    before_clause_note: "",
    after_clause_note: "",
  };

  const attachmentClauseDataTemplate = {
    attachment_number: "",
    clause_note: "",
  };

  const openCloseWorkSupervisor = React.useRef();
  const showAddWorkSupervisor = () => {
    openCloseWorkSupervisor.current.open();
  };

  const openCloseWorkDirector = React.useRef();
  const showAddWorkDirector = () => {
    openCloseWorkDirector.current.open();
  };

  const openCloseSecondWorkSupervisor = React.useRef();
  const showAddSecondWorkSupervisor = () => {
    openCloseSecondWorkSupervisor.current.open();
  };

  const openCloseSecondWorkDirector = React.useRef();
  const showAddSecondWorkDirector = () => {
    openCloseSecondWorkDirector.current.open();
  };

  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };

  const submitFormParameterContractParties = (values) => {
    submitParties(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        party_1_autorized_username: values?.official_username,
        party_1_autorized_name: values?.official_name,
        party_1_autorized_position: values?.official_position,
        party_1_autorized_address: values?.official_address,
        party_1_autorized_telp: values?.official_phone,
        party_1_autorized_fax: values?.official_fax,
        party_1_autorized_sk_no: values?.official_assignment_no,
        party_1_autorized_sk_date: values?.official_assignment_date,
        party_1_autorized_notary_act_name: values?.official_notary,
        party_1_autorized_notary_act_no: values?.official_deed_no,
        party_1_autorized_notary_act_date: values?.official_deed_date,
        party_1_autorized_kemenkumham_no: values?.official_sk_kemenkumham_no,
        party_1_autorized_kemenkumham_date:
          values?.official_sk_kemenkumham_date,
        party_1_job_director: values?.jobDirector,
        party_1_job_supervisor: values?.jobSupervisor,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  const [placeman, setPlaceman] = useState({
    secondAuthorizedOfficial: [
      {
        currentSelectIndex: 0,
        fullname: "",
        position_title: "",
        phone_number: "",
        address: "",
        fax: "",
        sk_assign_number: "",
        sk_assign_date: null,
        notary_name: "",
        act_number: "",
        act_date: null,
        sk_kemenkumham_number: "",
        sk_kemenkumham_date: null,
        PICEmail: "",
      },
    ],
    workDirector: [
      {
        usernameSelectIndex: 0,
        addressSelectIndex: 0,
        username: "",
        fullname: "",
        position: "",
        address: "",
        phone: "",
        fax: "",
      },
    ],
    workSupervisor: [
      {
        currentIndex: 0,
        position: "",
        address: "",
        phone: "",
        fax: "",
      },
    ],
    secondWorkDirector: [
      {
        position: "",
        address: "",
        phone: "",
        fax: "",
      },
    ],
    secondWorkSupervisor: [
      {
        position: "",
        address: "",
        phone: "",
        fax: "",
      },
    ],
  });

  const changeDataJobDirector = (num) => {
    setJobDirectorIndex(num);
  };
  const changeDataJobSupervisor = (num) => {
    setJobSupervisorIndex(num);
  };

  const [isSubmit, setIsSubmit] = useState(false);
  const changeDataJobDirectorDynamic = (num, arrIndex, data, type) => {
    if (!isSubmit) {
      setPlaceman((placeman) => {
        if (type === "username") {
          let newArr = [...placeman.workDirector];
          newArr[arrIndex]["usernameSelectIndex"] = num;
          newArr[arrIndex]["username"] = data[num]?.username;
          newArr[arrIndex]["fullname"] = data[num]?.full_name;
          newArr[arrIndex]["position"] = data[num]?.position_name;
          return {
            ...placeman,
            workDirector: newArr,
          };
        }
        if (type === "address") {
          let newArr = [...placeman.workDirector];
          newArr[arrIndex]["addressSelectIndex"] = num;
          newArr[arrIndex]["address"] = data[num]?.address;
          newArr[arrIndex]["phone"] = data[num]?.phone;
          newArr[arrIndex]["fax"] = data[num]?.fax;
          return {
            ...placeman,
            workDirector: newArr,
          };
        }
      });
    }
    if (isSubmit) {
      setIsSubmit(false);
    }
  };
  const changeDataJobSupervisorDynamic = (num, arrIndex, jobSupervisor) => {
    if (!isSubmit) {
      setPlaceman((placeman) => {
        let newArr = [...placeman.workSupervisor];
        newArr[arrIndex]["currentIndex"] = num;
        newArr[arrIndex]["address"] = jobSupervisor[num]?.address;
        newArr[arrIndex]["phone"] = jobSupervisor[num]?.phone;
        newArr[arrIndex]["fax"] = jobSupervisor[num]?.fax;
        return {
          ...placeman,
          workSupervisor: newArr,
        };
      });
    }
    if (isSubmit) {
      setIsSubmit(false);
    }
  };
  const changeDataSecondAuthorizedOfficial = (num, unused, data) => {
    console.log("isi data data", data);

    setPlaceman((placeman) => {
      let newArr = [...placeman.secondAuthorizedOfficial];
      newArr[0]["currentSelectIndex"] = num;
      newArr[0]["fullname"] = data[num]?.full_name;
      newArr[0]["position_title"] = data[num]?.position_title;
      newArr[0]["phone_number"] = data[num]?.phone_number;
      return {
        ...placeman,
        secondAuthorizedOfficial: newArr,
      };
    });
  };
  const changeInputValueSecondAuthorizedOfficial = (value, type) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman.secondAuthorizedOfficial];
      if (type === "Address") newArr[0]["address"] = value;
      if (type === "FAX") newArr[0]["fax"] = value;
      if (type === "SK ASSIGN NUMBER") newArr[0]["sk_assign_number"] = value;
      if (type === "SK ASSIGN DATE") newArr[0]["sk_assign_date"] = value;
      if (type === "NOTARY NAME") newArr[0]["notary_name"] = value;
      if (type === "ACT NUMBER") newArr[0]["act_number"] = value;
      if (type === "ACT DATE") newArr[0]["act_date"] = value;
      if (type === "SK KEMENKUMHAM DATE")
        newArr[0]["sk_kemenkumham_date"] = value;
      if (type === "SK KEMENKUMHAM NUMBER")
        newArr[0]["sk_kemenkumham_number"] = value;
      return {
        ...placeman,
        secondAuthorizedOfficial: newArr,
      };
    });
  };

  const changeDataPosition = (index, value) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman.workSupervisor];
      newArr[index]["position"] = value;
      return {
        ...placeman,
        workSupervisor: newArr,
      };
    });
  };

  const changeDataSecondJobDirector = (index, value, type) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman.secondWorkDirector];

      if (type === "Position") newArr[index]["position"] = value;
      if (type === "Address") newArr[index]["address"] = value;
      if (type === "Phone") newArr[index]["phone"] = value;
      if (type === "Fax") newArr[index]["fax"] = value;

      return {
        ...placeman,
        secondWorkDirector: newArr,
      };
    });
  };

  const changeDataSecondAuthorizedOfficialPICEmail = (num, unused, data) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman.secondAuthorizedOfficial];
      newArr[0]["PICEmail"] = data[num]?.email;
      return {
        ...placeman,
        secondAuthorizedOfficial: newArr,
      };
    });
  };

  const changeDataSecondJobSupervisor = (index, value, type) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman.secondWorkSupervisor];

      if (type === "Position") newArr[index]["position"] = value;
      if (type === "Address") newArr[index]["address"] = value;
      if (type === "Phone") newArr[index]["phone"] = value;
      if (type === "Fax") newArr[index]["fax"] = value;

      return {
        ...placeman,
        secondWorkSupervisor: newArr,
      };
    });
  };

  const [inputAuthorizedOfficial, setInputAuthorizedOfficial] = useState({
    official_username: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]
          ?.authorized_official_username
      : null,
    official_name: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.authorized_official_name
      : null,
    official_position: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]
          ?.authorized_official_position
      : null,
    official_address: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.address
      : null,
    official_phone: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.phone
      : null,
    official_fax: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.fax
      : null,
    official_assignment_no: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.assignment_deed_no
      : null,
    official_assignment_date: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.assignment_deed_date
      : null,
    official_notary: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]
          ?.name_notary_deed_of_authorized_official
      : null,
    official_deed_no: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]?.authorized_official_deed_no
      : null,
    official_deed_date: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]
          ?.authorized_official_deed_date
      : null,
    official_sk_kemenkumham_no: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]
          ?.authorized_official_sk_kemenkumham_no
      : null,
    official_sk_kemenkumham_date: authorizedOfficial
      ? authorizedOfficial[authorizedOfficialIndex]
          ?.authorized_official_sk_kemenkumham_date
      : null,
  });

  const [partiesBodyClauseData, setPartiesBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    partiesAttachmentClauseData,
    setPartiesAttachmentClauseData,
  ] = useState([attachmentClauseDataTemplate]);
  const changeDataauthorizedOfficial = (num) => {
    setauthorizedOfficialIndex(num);
  };
  const [authorizedOfficialIndex, setauthorizedOfficialIndex] = useState(0);
  const [jobDirectorIndex, setJobDirectorIndex] = useState(0);
  const [jobSupervisorIndex, setJobSupervisorIndex] = useState(0);

  useEffect(() => {
    console.log("placeman sekarang", placeman);
  }, [placeman]);

  const submitFormParameterJobPrice = (values) => {
    submitJobPrice(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        product_title: "",
        uom: "",
        subtotal: "",
        qty_total: "",
        clause_note: "",
        item_detail: [],
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  return (
    <>
      <NewWorkDirector
        openCloseWorkDirector={openCloseWorkDirector}
        setPlaceman={setPlaceman}
        jobDirector={jobDirector}
        jobDirectorIndex={jobDirectorIndex}
        changeDataJobDirector={changeDataJobDirector}
        jobSupervisor={jobSupervisor}
        jobSupervisorIndex={jobSupervisorIndex}
        changeDataJobSupervisor={changeDataJobSupervisor}
        setIsSubmit={setIsSubmit}
      />
      <NewWorkSupervisor
        openCloseWorkSupervisor={openCloseWorkSupervisor}
        setPlaceman={setPlaceman}
        jobSupervisor={jobSupervisor}
        jobSupervisorIndex={jobSupervisorIndex}
        changeDataJobSupervisor={changeDataJobSupervisor}
        setIsSubmit={setIsSubmit}
      />
      <NewSecondWorkDirector
        openCloseSecondWorkDirector={openCloseSecondWorkDirector}
        setPlaceman={setPlaceman}
      />
      <NewSecondWorkSupervisor
        openCloseSecondWorkSupervisor={openCloseSecondWorkSupervisor}
        setPlaceman={setPlaceman}
      />
      <NewClause
        openCloseAddClause={openCloseAddClause}
        setAttachmentClauseData={setPartiesAttachmentClauseData}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          official_username: inputAuthorizedOfficial.official_username,
          official_name: inputAuthorizedOfficial.official_name,
          official_position: inputAuthorizedOfficial.official_position,
          official_address: inputAuthorizedOfficial.official_address,
          official_phone: inputAuthorizedOfficial.official_phone,
          official_fax: inputAuthorizedOfficial.official_fax,
          official_assignment_no:
            inputAuthorizedOfficial.official_assignment_no,
          official_assignment_date:
            inputAuthorizedOfficial.official_assignment_date,
          official_notary: inputAuthorizedOfficial.official_notary,
          official_deed_no: inputAuthorizedOfficial.official_deed_no,
          official_deed_date: inputAuthorizedOfficial.official_deed_date,
          official_sk_kemenkumham_no:
            inputAuthorizedOfficial.official_sk_kemenkumham_no,
          official_sk_kemenkumham_date:
            inputAuthorizedOfficial.official_sk_kemenkumham_date,
          jobDirector: placeman.workDirector,
          jobSupervisor: placeman.workSupervisor,
          secondAuthorizedOfficial: placeman.secondAuthorizedOfficial,
          secondJobDirector: placeman.secondWorkDirector,
          secondJobSupervisor: placeman.secondWorkSupervisor,
          body_data: partiesBodyClauseData,
          attachment_data: partiesAttachmentClauseData,
        }}
        onSubmit={(values) => {
          values.attachment_data.unshift(values.initial_attachment_data);
          console.log("isi values parties", values);
          submitFormParameterContractParties(values);
        }}
      >
        {({ values }) => (
          <Form>
            {/* Pihak 1 + 2 */}
            <div
              className="parties-wrapper"
              style={{
                border: 1,
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: 14,
                padding: "28px 15.5px",
                marginBottom: 40,
              }}
            >
              {/* Header pihak pertama */}
              <div
                style={{
                  backgroundColor: "#cdcdcd",
                  display: "inline-block",
                  padding: 8,
                  borderRadius: 6,
                  marginBottom: 14,
                  marginLeft: 12.5,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#2e1f22",
                  }}
                >
                  A. Pihak Pertama
                </span>
              </div>

              {/* Baris pihak pertama sebelum addendum */}
              <div className="row col-md-12">
                {/* Pihak pertama sebelum addendum */}
                <div
                  className="col-md-6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                  }}
                >
                  {/* Pejabat Berwenang Sebelum Addendum Pihak Pertama */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      Pejabat berwenang
                    </h1>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                          height: 65.5,
                        }}
                      >
                        <span>Username</span>
                        <input
                          type="text"
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          value={`${jsonData?.contract_party?.party_1_contract_signature_username}`}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_contract_signature_name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_position_of_autorize}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          className="form-control"
                          type="text"
                          value={`${jsonData?.authority?.address}`}
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          className="form-control"
                          type="text"
                          style={{ backgroundColor: "#e8f4fb" }}
                          value={`${jsonData?.authority?.phone}`}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          className="form-control"
                          type="text"
                          value={`${jsonData?.authority?.fax}`}
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Penugasan</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={`${jsonData?.contract_party?.party_1_sk_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={`${jsonData?.contract_party?.party_1_sk_date}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama Notaris</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_notary_act_autorized_name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor Akta</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={`${jsonData?.contract_party?.party_1_notary_act_autorized_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={`${jsonData?.contract_party?.party_1_notary_act_autorized_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Kemenkumham</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={`${jsonData?.contract_party?.party_1_autorized_kemenkumham_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={`${jsonData?.contract_party?.party_1_autorized_kemenkumham_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Direksi Pekerjaan Sebelum Addendum Pihak Pertama */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        height: 44.89,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                          minHeight: 38.17,
                        }}
                      >
                        Direksi pekerjaan
                      </h1>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                          height: 65.5,
                        }}
                      >
                        <span>Username</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_director_position_username}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama Lengkap</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_director_position_full_name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_director_position}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_director_position_address}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_director_position_phone}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_director_position_fax}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pengawas Pekerjaan Sebelum Addendum Pihak Pertama */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        height: 44.89,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Pengawas pekerjaan
                      </h1>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_job_supervisor.name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_job_supervisor.address}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_job_supervisor.telp}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_1_job_supervisor.fax}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Addendum pihak pertama */}
                <div
                  className="col-md-6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                  }}
                >
                  {/* Addendum Pejabat Berwenang Pihak Pertama */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      Addendum Pejabat berwenang
                    </h1>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <ReactSelect
                          data={authorizedOfficial}
                          func={changeDataauthorizedOfficial}
                          labelName={`authorized_official_username`}
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama</span>
                        <Field
                          className="form-control"
                          style={{
                            backgroundColor: "#e8f4fb",
                          }}
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.authorized_official_name
                              : null
                          }
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.authorized_official_position
                              : null
                          }
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          className="form-control"
                          type="text"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.address
                              : null
                          }
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          className="form-control"
                          type="text"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.phone
                              : null
                          }
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          className="form-control"
                          type="text"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]?.fax
                              : null
                          }
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Penugasan</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={
                              authorizedOfficial
                                ? authorizedOfficial[authorizedOfficialIndex]
                                    ?.assignment_deed_no
                                : null
                            }
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={
                              authorizedOfficial
                                ? authorizedOfficial[authorizedOfficialIndex]
                                    ?.assignment_deed_date
                                : null
                            }
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama Notaris</span>
                        <input
                          type="text"
                          value={
                            authorizedOfficial
                              ? authorizedOfficial[authorizedOfficialIndex]
                                  ?.name_notary_deed_of_authorized_official
                              : null
                          }
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor Akta</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={
                              authorizedOfficial
                                ? authorizedOfficial[authorizedOfficialIndex]
                                    ?.authorized_official_deed_no
                                : null
                            }
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={
                              authorizedOfficial
                                ? authorizedOfficial[authorizedOfficialIndex]
                                    ?.authorized_official_deed_date
                                : null
                            }
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Kemenkumham</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={
                              authorizedOfficial
                                ? authorizedOfficial[authorizedOfficialIndex]
                                    ?.authorized_official_sk_kemenkumham_no
                                : null
                            }
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={
                              authorizedOfficial
                                ? authorizedOfficial[authorizedOfficialIndex]
                                    ?.authorized_official_sk_kemenkumham_date
                                : null
                            }
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Addendum Direksi Pekerjaan Pihak Pertama */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // height: 38.17,
                        // 3.61 + 44.89
                        height: 48.5,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Addendum Direksi pekerjaan
                      </h1>

                      <button
                        type="button"
                        className="btn btn-primary mx-1"
                        onClick={showAddWorkDirector}
                      >
                        Tambah
                      </button>
                    </div>

                    {/* Direksi Pekerjaan */}
                    {placeman.workDirector &&
                      placeman.workDirector.map((data, index) => {
                        return (
                          <>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 10,
                                }}
                              >
                                {/* <span>Username</span> */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>Username</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPlaceman((placeman) => {
                                        let data = { ...placeman };
                                        data.workDirector.splice(index, 1);
                                        return data;
                                      });
                                    }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                                <Field
                                  name={`jobDirector[${index}].username`}
                                  data={jobDirector}
                                  func={changeDataJobDirectorDynamic}
                                  labelName={"username"}
                                  arrayIndex={index}
                                  currentSelect={data.usernameSelectIndex}
                                  type={"username"}
                                  component={ReactSelect}
                                />
                              </div>

                              <Field
                                className="form-control d-none"
                                style={{
                                  backgroundColor: "#e8f4fb",
                                }}
                                // name="initialJobDirector.username"
                                name={`jobDirector[${index}].username`}
                                value={
                                  jobDirector
                                    ? jobDirector[data.usernameSelectIndex]
                                        ?.username
                                    : null
                                }
                                disabled
                              />

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 10,
                                }}
                              >
                                <span>Nama Lengkap</span>
                                <Field
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#e8f4fb",
                                  }}
                                  // name="initialJobDirector.fullname"
                                  name={`jobDirector[${index}].fullname`}
                                  value={
                                    jobDirector
                                      ? jobDirector[data.usernameSelectIndex]
                                          ?.full_name
                                      : null
                                  }
                                  disabled
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 10,
                                }}
                              >
                                <span>Jabatan</span>
                                <Field
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#e8f4fb",
                                  }}
                                  name={`jobDirector[${index}].position`}
                                  value={
                                    jobDirector
                                      ? jobDirector[data.usernameSelectIndex]
                                          ?.position_name
                                      : null
                                  }
                                  disabled
                                />
                              </div>

                              <div>
                                <label
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 4,
                                  }}
                                >
                                  <span>Alamat</span>
                                  <Field
                                    name={`jobDirector[${index}].adress`}
                                    data={jobSupervisor}
                                    func={changeDataJobDirectorDynamic}
                                    labelName={"address"}
                                    arrayIndex={index}
                                    currentSelect={data.addressSelectIndex}
                                    type={"address"}
                                    component={ReactSelect}
                                  />
                                </label>
                              </div>

                              <div>
                                <label
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 4,
                                  }}
                                >
                                  <span>Telp</span>
                                  <Field
                                    type="text"
                                    className="form-control"
                                    name={`jobDirector[${index}].phone`}
                                    value={
                                      jobSupervisor
                                        ? jobSupervisor[data.addressSelectIndex]
                                            ?.phone
                                        : null
                                    }
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                    disabled
                                  />
                                </label>
                              </div>

                              <div>
                                <label
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 4,
                                  }}
                                >
                                  <span>FAX</span>
                                  <Field
                                    type="text"
                                    className="form-control"
                                    name={`jobDirector[${index}].fax`}
                                    value={
                                      jobSupervisor
                                        ? jobSupervisor[data.addressSelectIndex]
                                            ?.fax
                                        : null
                                    }
                                    disabled
                                    style={{
                                      backgroundColor: "#e8f4fb",
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>

                  {/* Addendum Pengawas Pekerjaan Pihak Pertama */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Addendum Pengawas pekerjaan
                      </h1>

                      <button
                        type="button"
                        className="btn btn-primary mx-1"
                        onClick={showAddWorkSupervisor}
                      >
                        Tambah
                      </button>
                    </div>

                    {/* Pengawas Pekerjaan Pihak Pertama */}

                    {/* Pengawas Pekerjaan Pihak Pertama */}
                    {placeman.workSupervisor &&
                      placeman.workSupervisor.map((data, index) => {
                        return (
                          <>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>Jabatan</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPlaceman((placeman) => {
                                        let data = { ...placeman };
                                        data.workSupervisor.splice(index, 1);
                                        return data;
                                      });
                                    }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`jobSupervisor[${index}].position`}
                                  onChange={(e) =>
                                    changeDataPosition(index, e.target.value)
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <Field
                                  name={`jobSupervisor[${index}].address`}
                                  data={jobSupervisor}
                                  func={changeDataJobSupervisorDynamic}
                                  labelName={"address"}
                                  arrayIndex={index}
                                  currentSelect={data.currentIndex}
                                  type={"jobSupervisor"}
                                  component={ReactSelect}
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`jobSupervisor[${index}].phone`}
                                  value={
                                    jobSupervisor
                                      ? jobSupervisor[data.currentIndex]?.phone
                                      : null
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`jobSupervisor[${index}].fax`}
                                  value={
                                    jobSupervisor
                                      ? jobSupervisor[data.currentIndex]?.fax
                                      : null
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Header pihak kedua */}
              <div
                style={{
                  backgroundColor: "#cdcdcd",
                  display: "inline-block",
                  padding: 8,
                  borderRadius: 6,
                  marginBottom: 14,
                  marginTop: 40,
                  marginLeft: 12.5,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#2e1f22",
                  }}
                >
                  B. Pihak Kedua
                </span>
              </div>

              {/* Baris pihak kedua */}
              <div className="row col-md-12">
                {/* Pihak kedua */}
                <div
                  className="col-md-6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                  }}
                >
                  {/* Pejabat Berwenang Sebelum Addendum Pihak Kedua */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Pejabat berwenang
                      </h1>
                    </div>

                    {/* <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                  height: 65.5,
                                }}
                              >
                                <span>Username</span>
                                <input
                                  type="text"
                                  value={`${jsonData?.contract_party?.party_2_contract_signature_username}`}
                                  className="form-control"
                                  style={{ backgroundColor: "#e8f4fb" }}
                                />
                              </label>
                            </div> */}

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_autorize_name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_position}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          className="form-control"
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position_address}`}
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          className="form-control"
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position_phone}`}
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          className="form-control"
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position_fax}`}
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Penugasan</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={`${jsonData?.contract_party?.party_2_sk_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={`${jsonData?.contract_party?.party_2_sk_date}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama Notaris</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_notary_act_autorized_name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor Akta</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={`${jsonData?.contract_party?.party_2_notary_act_autorized_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={`${jsonData?.contract_party?.party_2_notary_act_autorized_date}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Kemenkumham</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <input
                            type="text"
                            value={`${jsonData?.contract_party?.party_2_autorized_kemenkumham_no}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                          -
                          <input
                            type="date"
                            value={`${jsonData?.contract_party?.party_2_autorized_kemenkumham_date}`}
                            className="form-control"
                            style={{
                              backgroundColor: "#e8f4fb",
                            }}
                            disabled
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Email PIC</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_notary_act_autorized_name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                  </div>

                  {/* Direksi Pekerjaan Sebelum Addendum Pihak Kedua */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        minHeight: 44.89,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Direksi pekerjaan
                      </h1>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                          height: 65.5,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position_address}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position_phone}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_director_position_fax}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pengawas Pekerjaan Sebelum Addendum Pihak Kedua */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        minHeight: 44.89,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Pengawas pekerjaan
                      </h1>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                          // height: 65.5
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_job_supervisor.name}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_job_supervisor.address}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_job_supervisor.telp}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <input
                          type="text"
                          value={`${jsonData?.contract_party?.party_2_job_supervisor.fax}`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Addendum pihak kedua */}
                <div
                  className="col-md-6"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 28,
                  }}
                >
                  {/* Addendum Pejabat Berwenang Pihak Kedua */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Addendum Pejabat berwenang
                      </h1>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama</span>
                        <Field
                          name={`secondAuthorizedOfficial[${0}].fullname`}
                          data={secondAuthorizedOfficial}
                          currentSelect={
                            placeman?.secondAuthorizedOfficial
                              ?.currentSelectIndex
                          }
                          func={changeDataSecondAuthorizedOfficial}
                          labelName={"full_name"}
                          component={ReactSelect}
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <Field
                          type="text"
                          name={`secondAuthorizedOfficial[${0}].position_title`}
                          className="form-control"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Alamat</span>
                        <Field
                          className="form-control"
                          type="text"
                          name={`secondAuthorizedOfficial[${0}].address`}
                          onChange={(e) =>
                            changeInputValueSecondAuthorizedOfficial(
                              e.target.value,
                              "Address"
                            )
                          }
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Telp</span>
                        <Field
                          className="form-control"
                          type="text"
                          style={{ backgroundColor: "#e8f4fb" }}
                          disabled
                          name={`secondAuthorizedOfficial[${0}].phone_number`}
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>FAX</span>
                        <Field
                          className="form-control"
                          type="text"
                          name={`secondAuthorizedOfficial[${0}].fax`}
                          onChange={(e) =>
                            changeInputValueSecondAuthorizedOfficial(
                              e.target.value,
                              "FAX"
                            )
                          }
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Penugasan</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <Field
                            type="text"
                            className="form-control"
                            name={`secondAuthorizedOfficial[${0}].sk_assign_number`}
                            onChange={(e) =>
                              changeInputValueSecondAuthorizedOfficial(
                                e.target.value,
                                "SK ASSIGN NUMBER"
                              )
                            }
                          />
                          -
                          <Field
                            type="date"
                            className="form-control"
                            name={`secondAuthorizedOfficial[${0}].sk_assign_date`}
                            onChange={(e) =>
                              changeInputValueSecondAuthorizedOfficial(
                                e.target.value,
                                "SK ASSIGN DATE"
                              )
                            }
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nama Notaris</span>
                        <Field
                          type="text"
                          className="form-control"
                          name={`secondAuthorizedOfficial[${0}].notary_name`}
                          onChange={(e) =>
                            changeInputValueSecondAuthorizedOfficial(
                              e.target.value,
                              "NOTARY NAME"
                            )
                          }
                        />
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor Akta</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <Field
                            type="text"
                            className="form-control"
                            name={`secondAuthorizedOfficial[${0}].act_number`}
                            onChange={(e) =>
                              changeInputValueSecondAuthorizedOfficial(
                                e.target.value,
                                "ACT NUMBER"
                              )
                            }
                          />
                          -
                          <Field
                            type="date"
                            className="form-control"
                            name={`secondAuthorizedOfficial[${0}].act_date`}
                            onChange={(e) =>
                              changeInputValueSecondAuthorizedOfficial(
                                e.target.value,
                                "ACT DATE"
                              )
                            }
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Nomor SK Kemenkumham</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: 8,
                          }}
                        >
                          <Field
                            type="text"
                            className="form-control"
                            name={`secondAuthorizedOfficial[${0}].sk_kemenkumham_number`}
                            onChange={(e) =>
                              changeInputValueSecondAuthorizedOfficial(
                                e.target.value,
                                "SK KEMENKUMHAM NUMBER"
                              )
                            }
                          />
                          -
                          <Field
                            type="date"
                            className="form-control"
                            name={`secondAuthorizedOfficial[${0}].sk_kemenkumham_date`}
                            onChange={(e) =>
                              changeInputValueSecondAuthorizedOfficial(
                                e.target.value,
                                "SK KEMENKUMHAM DATE"
                              )
                            }
                          />
                        </div>
                      </label>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 4,
                        }}
                      >
                        <span>Email PIC</span>
                        <Field
                          name={`secondAuthorizedOfficial[0].PICEmail`}
                          data={PICData}
                          func={changeDataSecondAuthorizedOfficialPICEmail}
                          labelName={"email"}
                          // currentSelect={data.usernameSelectIndex}
                          component={ReactSelect}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Addendum Direksi Pekerjaan Pihak Kedua */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        height: 44.89,
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Addendum Direksi pekerjaan
                      </h1>
                      <button
                        type="button"
                        className="btn btn-primary mx-1"
                        onClick={showAddSecondWorkDirector}
                      >
                        Tambah
                      </button>
                    </div>
                    {/* addendum direksi pekerjaan pihak kedua */}
                    {placeman.secondWorkDirector &&
                      placeman.secondWorkDirector.map((item, index) => {
                        return (
                          <>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>Jabatan</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPlaceman((placeman) => {
                                        let data = { ...placeman };
                                        data.secondWorkDirector.splice(
                                          index,
                                          1
                                        );
                                        return data;
                                      });
                                    }}
                                  >
                                    Hapus
                                  </button>
                                </div>

                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobDirector[${index}].position`}
                                  onChange={(e) =>
                                    changeDataSecondJobDirector(
                                      index,
                                      e.target.value,
                                      "Position"
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobDirector[${index}].address`}
                                  onChange={(e) =>
                                    changeDataSecondJobDirector(
                                      index,
                                      e.target.value,
                                      "Address"
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobDirector[${index}].phone`}
                                  onChange={(e) =>
                                    changeDataSecondJobDirector(
                                      index,
                                      e.target.value,
                                      "Phone"
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobDirector[${index}].fax`}
                                  onChange={(e) =>
                                    changeDataSecondJobDirector(
                                      index,
                                      e.target.value,
                                      "Fax"
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </>
                        );
                      })}
                  </div>

                  {/* Addendum Pengawas Pekerjaan Pihak Kedua */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        Addendum Pengawas pekerjaan
                      </h1>

                      <button
                        type="button"
                        className="btn btn-primary mx-1"
                        onClick={showAddSecondWorkSupervisor}
                      >
                        Tambah
                      </button>
                    </div>

                    {placeman.secondWorkSupervisor &&
                      placeman.secondWorkSupervisor.map((item, index) => {
                        return (
                          <>
                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>Jabatan</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPlaceman((placeman) => {
                                        let data = { ...placeman };
                                        data.secondWorkSupervisor.splice(
                                          index,
                                          1
                                        );
                                        return data;
                                      });
                                    }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobSupervisor[${index}].position`}
                                  onChange={(e) =>
                                    changeDataSecondJobSupervisor(
                                      index,
                                      e.target.value,
                                      "Position"
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Alamat</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobSupervisor[${index}].address`}
                                  onChange={(e) =>
                                    changeDataSecondJobSupervisor(
                                      index,
                                      e.target.value,
                                      "Address"
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>Telp</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobSupervisor[${index}].phone`}
                                  onChange={(e) =>
                                    changeDataSecondJobSupervisor(
                                      index,
                                      e.target.value,
                                      "Phone"
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div>
                              <label
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  rowGap: 4,
                                }}
                              >
                                <span>FAX</span>
                                <Field
                                  type="text"
                                  className="form-control"
                                  name={`secondJobSupervisor[${index}].fax`}
                                  onChange={(e) =>
                                    changeDataSecondJobSupervisor(
                                      index,
                                      e.target.value,
                                      "Fax"
                                    )
                                  }
                                />
                              </label>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <PerubahanKlausulKontrak
              subTitle={"C"}
              title={"Para Pihak"}
              setBodyClauseData={setPartiesBodyClauseData}
              setAttachmentClauseData={setPartiesAttachmentClauseData}
              showAddClause={showAddClause}
              values={values}
            />

            <UpdateButton />
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PartiesFormParameter;
