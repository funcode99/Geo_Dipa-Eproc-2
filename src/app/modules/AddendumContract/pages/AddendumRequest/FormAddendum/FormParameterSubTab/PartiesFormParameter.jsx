import React, { useState, useEffect } from "react";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
// FieldArray, ErrorMessage
import { Formik, Field, Form } from "formik";
import { ReactSelect } from "percobaan/ReactSelect";
import { submitParties } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import NewWorkDirector from "../Components/Modal/Parties/NewWorkDirector";
import NewWorkSupervisor from "../Components/Modal/Parties/NewWorkSupervisor";
import NewSecondWorkDirector from "../Components/Modal/Parties/NewSecondWorkDirector";
import NewSecondWorkSupervisor from "../Components/Modal/Parties/NewSecondWorkSupervisor";
import NewClause from "../Components/Modal/NewClause";
import { connect } from "react-redux";

const PartiesFormParameter = ({
  jsonData,
  authorizedOfficialData,
  secondAuthorizedOfficial,
  PICData,
  jobDirector,
  jobSupervisor,
  jobSupervisor2,
  contract_id,
  dataNewClause,
  partiesData,
}) => {
  const [authorizedOfficialIndex, setauthorizedOfficialIndex] = useState(0);

  useEffect(() => {
    const isi = authorizedOfficialData?.map((item, index) => {
      if (
        item.authorized_official_username ===
        partiesData.add_contract_party.party_1_autorized_username
      ) {
        setauthorizedOfficialIndex(index);
      }
    });
  }, []);

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
    console.log("isi submit values parties", values);
    submitParties(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
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
        party_2_autorized_username: values.secondAuthorizedOfficial[0].fullname,
        party_2_autorized_name: values.secondAuthorizedOfficial[0].fullname,
        party_2_autorized_position:
          values.secondAuthorizedOfficial[0].position_title,
        party_2_autorized_address: values.secondAuthorizedOfficial[0].address,
        party_2_autorized_telp: values.secondAuthorizedOfficial[0].phone_number,
        party_2_autorized_fax: values.secondAuthorizedOfficial[0].fax,
        party_2_autorized_sk_no:
          values.secondAuthorizedOfficial[0].sk_assign_number,
        party_2_autorized_sk_date:
          values.secondAuthorizedOfficial[0].sk_assign_date,
        party_2_autorized_notary_act_name:
          values.secondAuthorizedOfficial[0].notary_name,
        party_2_autorized_notary_act_no:
          values.secondAuthorizedOfficial[0].act_number,
        party_2_autorized_notary_act_date:
          values.secondAuthorizedOfficial[0].act_date,
        party_2_autorized_kemenkumham_no:
          values.secondAuthorizedOfficial[0].sk_kemenkumham_number,
        party_2_autorized_kemenkumham_date:
          values.secondAuthorizedOfficial[0].sk_kemenkumham_date,
        party_2_pic_email: values.secondAuthorizedOfficial[0].PICEmail,
        party_2_job_director: values.secondJobDirector,
        party_2_job_supervisor: values.secondJobSupervisor,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  // silahkan taro pejabat berwenang pihak pertama disini kalo mau di persist
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
        // value input gaboleh null
        sk_assign_date: "",
        notary_name: "",
        act_number: "",
        act_date: "",
        sk_kemenkumham_number: "",
        sk_kemenkumham_date: "",
        PICEmail: "",
        // party_2_pic_email: "",
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

  const changeDataJobDirector = (num) => {
    setJobDirectorIndex(num);
  };
  const changeDataJobSupervisor = (num) => {
    setJobSupervisorIndex(num);
  };

  const [isSubmit, setIsSubmit] = useState(false);
  const changeDataJobSupervisorDynamic = (
    num,
    arrIndex,
    jobSupervisor2
    // type
  ) => {
    if (!isSubmit) {
      setPlaceman((placeman) => {
        let newArr = [...placeman.workSupervisor];
        newArr[arrIndex]["currentIndex"] = num;
        newArr[arrIndex]["party_1_job_supervisor_address"] =
          jobSupervisor2[num]?.address;
        newArr[arrIndex]["party_1_job_supervisor_telp"] =
          jobSupervisor2[num]?.phone;
        newArr[arrIndex]["party_1_job_supervisor_fax"] =
          jobSupervisor2[num]?.fax;
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
  const changeDataJobDirectorDynamic = (num, arrIndex, data, type) => {
    // berjalan sebanyak banyak nya fungsi yang dipanggil dari react select
    // console.log("fungsi berjalan di awal");

    if (!isSubmit) {
      setPlaceman((placeman) => {
        if (type === "username") {
          let newArr = [...placeman.workDirector];
          newArr[arrIndex]["usernameSelectIndex"] = num;
          newArr[arrIndex]["party_1_job_director_username"] =
            data[num]?.username;
          newArr[arrIndex]["party_1_job_director_fullname"] =
            data[num]?.full_name;
          newArr[arrIndex]["party_1_job_director_position"] =
            data[num]?.position_name;

          // jobDirector.splice(num, 1);

          return {
            ...placeman,
            workDirector: newArr,
          };
        }
        if (type === "facilityName") {
          let newArr = [...placeman.workDirector];
          newArr[arrIndex]["facilityNameSelectIndex"] = num;
          newArr[arrIndex]["facility_name"] = data[num]?.facility_name;
          newArr[arrIndex]["party_1_job_director_address"] = data[num]?.address;
          newArr[arrIndex]["party_1_job_director_telp"] = data[num]?.phone;
          newArr[arrIndex]["party_1_job_director_fax"] = data[num]?.fax;
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

  // di option data nya sudah di hapus, tapi di select nya masih belum
  useEffect(() => {
    console.log("job Director sekarang", jobDirector);
  }, [jobDirector]);

  const changeDataSecondAuthorizedOfficial = (num, unused, data) => {
    console.log("isi data data", data);

    setPlaceman((placeman) => {
      let newArr = [...placeman?.secondAuthorizedOfficial];
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
      let newArr = [...placeman?.secondAuthorizedOfficial];
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
      newArr[index]["party_1_job_supervisor_position"] = value;
      return {
        ...placeman,
        workSupervisor: newArr,
      };
    });
  };

  const changeDataSecondJobDirector = (index, value, type) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman.secondWorkDirector];

      if (type === "Position")
        newArr[index]["party_2_job_director_position"] = value;
      if (type === "Address")
        newArr[index]["party_2_job_director_address"] = value;
      if (type === "Phone") newArr[index]["party_2_job_director_telp"] = value;
      if (type === "Fax") newArr[index]["party_2_job_director_fax"] = value;

      return {
        ...placeman,
        secondWorkDirector: newArr,
      };
    });
  };

  const changeDataSecondAuthorizedOfficialPICEmail = (num, unused, data) => {
    setPlaceman((placeman) => {
      let newArr = [...placeman?.secondAuthorizedOfficial];
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

      if (type === "Position")
        newArr[index]["party_2_job_supervisor_position"] = value;
      if (type === "Address")
        newArr[index]["party_2_job_supervisor_address"] = value;
      if (type === "Phone")
        newArr[index]["party_2_job_supervisor_telp"] = value;
      if (type === "Fax") newArr[index]["party_2_job_supervisor_fax"] = value;

      return {
        ...placeman,
        secondWorkSupervisor: newArr,
      };
    });
  };
  const changeDataauthorizedOfficial = (num) => {
    setauthorizedOfficialIndex(num);
  };

  const [jobDirectorIndex, setJobDirectorIndex] = useState(0);
  const [jobSupervisorIndex, setJobSupervisorIndex] = useState(0);

  useEffect(() => {
    console.log("placeman sekarang", placeman);
  }, [placeman]);

  const [authorizedOfficial, setAuthorizedOfficial] = useState(
    authorizedOfficialData
  );

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
        fromWhere={"parties"}
        fieldType={"clause_attachment"}
        // setAttachmentClauseData={setPartiesAttachmentClauseData}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          official_username:
            partiesData?.add_contract_party !== null
              ? partiesData?.add_contract_party?.party_1_autorized_username
              : authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_username !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_username
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].authorized_official_username =
                    "kosong";
                  return newArr;
                }),
          official_name:
            partiesData?.add_contract_party !== null
              ? partiesData?.add_contract_party?.party_1_autorized_name
              : authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_name !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_name
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].authorized_official_name =
                    "kosong";
                  return newArr;
                }),
          official_position:
            authorizedOfficial[authorizedOfficialIndex]
              ?.authorized_official_position !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_position
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].authorized_official_position =
                    "kosong";
                  return newArr;
                }),
          official_address:
            authorizedOfficial[authorizedOfficialIndex]?.address !== null
              ? authorizedOfficial[authorizedOfficialIndex]?.address
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].address = "kosong";
                  return newArr;
                }),
          official_phone:
            authorizedOfficial[authorizedOfficialIndex]?.phone !== null
              ? authorizedOfficial[authorizedOfficialIndex]?.phone
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].phone = "kosong";
                  return newArr;
                }),
          official_fax:
            authorizedOfficial[authorizedOfficialIndex]?.fax !== null
              ? authorizedOfficial[authorizedOfficialIndex]?.fax
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].fax = "kosong";
                  return newArr;
                }),
          official_assignment_no:
            authorizedOfficial[authorizedOfficialIndex]?.assignment_deed_no !==
            null
              ? authorizedOfficial[authorizedOfficialIndex]?.assignment_deed_no
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].assignment_deed_no = "kosong";
                  return newArr;
                }),
          official_assignment_date:
            authorizedOfficial[authorizedOfficialIndex]
              ?.assignment_deed_date !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.assignment_deed_date
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].assignment_deed_date =
                    "kosong";
                  return newArr;
                }),
          official_notary:
            authorizedOfficial[authorizedOfficialIndex]
              ?.name_notary_deed_of_authorized_official !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.name_notary_deed_of_authorized_official
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[
                    authorizedOfficialIndex
                  ].name_notary_deed_of_authorized_official = "kosong";
                  return newArr;
                }),
          official_deed_no:
            authorizedOfficial[authorizedOfficialIndex]
              ?.authorized_official_deed_no !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_deed_no
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[authorizedOfficialIndex].authorized_official_deed_no =
                    "kosong";
                  return newArr;
                }),
          official_deed_date:
            authorizedOfficial[authorizedOfficialIndex]
              ?.authorized_official_deed_date !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_deed_date
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[
                    authorizedOfficialIndex
                  ].authorized_official_deed_date = "kosong";
                  return newArr;
                }),
          official_sk_kemenkumham_no:
            authorizedOfficial[authorizedOfficialIndex]
              ?.authorized_official_sk_kemenkumham_no !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_sk_kemenkumham_no
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[
                    authorizedOfficialIndex
                  ].authorized_official_sk_kemenkumham_no = "kosong";
                  return newArr;
                }),
          official_sk_kemenkumham_date:
            authorizedOfficial[authorizedOfficialIndex]
              ?.authorized_official_sk_kemenkumham_date !== null
              ? authorizedOfficial[authorizedOfficialIndex]
                  ?.authorized_official_sk_kemenkumham_date
              : setAuthorizedOfficial((previous) => {
                  let newArr = [...previous];
                  newArr[
                    authorizedOfficialIndex
                  ].authorized_official_sk_kemenkumham_date = "kosong";
                  return newArr;
                }),
          // firstAuthorizedOfficial: placeman.firstAuthorizedOfficial,
          jobDirector: placeman.workDirector,
          jobSupervisor: placeman.workSupervisor,
          secondAuthorizedOfficial: placeman?.secondAuthorizedOfficial,
          secondJobDirector: placeman.secondWorkDirector,
          secondJobSupervisor: placeman.secondWorkSupervisor,
          body_data: dataNewClause.parties.bodyClauseData,
          attachment_data: dataNewClause.parties.attachmentClauseData,
        }}
        onSubmit={(values) => {
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
                        <span>Username</span>
                        <ReactSelect
                          data={authorizedOfficial}
                          func={changeDataauthorizedOfficial}
                          // labelName wajib ada
                          labelName={`authorized_official_username`}
                          nowSelect={authorizedOfficialIndex}
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
                            authorizedOfficial[authorizedOfficialIndex]
                              ?.authorized_official_name
                            // :
                            // setAuthorizedOfficial((previous) => {
                            //     let newArr = [...previous];
                            //     newArr[
                            //       authorizedOfficialIndex
                            //     ].authorized_official_name = "kosong";
                            //     return newArr;
                            //   })
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
                              : ""
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
                              : ""
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
                              : ""
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
                              : ""
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
                              // authorizedOfficial
                              //   ?
                              authorizedOfficial[authorizedOfficialIndex]
                                ?.assignment_deed_no
                              // : setAuthorizedOfficial((previous) => {
                              //     let newArr = [...previous];
                              //     newArr[
                              //       authorizedOfficialIndex
                              //     ].assignment_deed_no = "kosong";
                              //     return newArr;
                              //   })
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
                              // authorizedOfficial[authorizedOfficialIndex]
                              //       ?.assignment_deed_date
                              //   ?
                              authorizedOfficial[authorizedOfficialIndex]
                                ?.assignment_deed_date
                              // : setAuthorizedOfficial((previous) => {
                              //     let newArr = [...previous];
                              //     newArr[
                              //       authorizedOfficialIndex
                              //     ].assignment_deed_date = "kosong";
                              //     return newArr;
                              //   })
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
                              : ""
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
                                : ""
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
                                : ""
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
                                : ""
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
                                : ""
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
                                  name={`jobDirector[${index}].party_1_job_director_username`}
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
                                name={`jobDirector[${index}].party_1_job_director_username`}
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
                                  name={`jobDirector[${index}].party_1_job_director_fullname`}
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
                                  name={`jobDirector[${index}].party_1_job_director_position`}
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
                                    name={`jobDirector[${index}].facility_name`}
                                    data={jobSupervisor}
                                    func={changeDataJobDirectorDynamic}
                                    labelName={"facility_name"}
                                    arrayIndex={index}
                                    currentSelect={data.facilityNameSelectIndex}
                                    type={"facilityName"}
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
                                    name={`jobDirector[${index}].party_1_job_director_telp`}
                                    value={
                                      jobSupervisor
                                        ? jobSupervisor[
                                            data.facilityNameSelectIndex
                                          ]?.phone
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
                                    name={`jobDirector[${index}].party_1_job_director_fax`}
                                    value={
                                      jobSupervisor
                                        ? jobSupervisor[
                                            data.facilityNameSelectIndex
                                          ]?.fax
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
                                  name={`jobSupervisor[${index}].party_1_job_supervisor_position`}
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
                                {/* KOMPONEN INI NYENGGOL */}
                                <Field
                                  name={`jobSupervisor[${index}].party_1_job_supervisor_address`}
                                  data={jobSupervisor2}
                                  func={changeDataJobSupervisorDynamic}
                                  labelName={"address"}
                                  arrayIndex={index}
                                  currentSelect={data.currentIndex}
                                  // type={"jobSupervisor"}
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
                                  name={`jobSupervisor[${index}].party_1_job_supervisor_telp`}
                                  value={
                                    jobSupervisor
                                      ? jobSupervisor2[data.currentIndex]?.phone
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
                                  name={`jobSupervisor[${index}].party_1_job_supervisor_fax`}
                                  value={
                                    jobSupervisor
                                      ? jobSupervisor2[data.currentIndex]?.fax
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
                                  name={`secondJobDirector[${index}].party_2_job_director_position`}
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
                                  name={`secondJobDirector[${index}].party_2_job_director_address`}
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
                                  name={`secondJobDirector[${index}].party_2_job_director_telp`}
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
                                  name={`secondJobDirector[${index}].party_2_job_director_fax`}
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
                                  name={`secondJobSupervisor[${index}].party_2_job_supervisor_position`}
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
                                  name={`secondJobSupervisor[${index}].party_2_job_supervisor_address`}
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
                                  name={`secondJobSupervisor[${index}].party_2_job_supervisor_telp`}
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
                                  name={`secondJobSupervisor[${index}].party_2_job_supervisor_fax`}
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
              showAddClause={showAddClause}
              fromWhere={"parties"}
              values={values}
              isMandatory={true}
            />

            <UpdateButton fromWhere={"parties"} />
          </Form>
        )}
      </Formik>
    </>
  );
};

// export default PartiesFormParameter;

const mapState = (state) => ({
  dataNewClause: state.addendumContract.dataNewClause,
});

export default connect(mapState, null)(PartiesFormParameter);
