import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody } from "_metronic/_partials/controls";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import { toAbsoluteUrl } from "_metronic/_helpers/index";
import { countdownMonths } from "app/libs/timeperioddate";
import { countdownConverter } from "app/libs/timedateconverter";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";
import { ReactSelect } from "percobaan/ReactSelect";
import { fetch_api_sg, getLoading } from "redux/globalReducer";
import { connect } from "react-redux";
import {
  submitTimePeriod,
  submitPaymentMethod,
  submitFine,
  submitGuarantee,
  submitAccountNumber,
  submitOther,
} from "app/modules/AddendumContract/service/DeliveryMonitoringCrud";

import * as Yup from "yup";
import SVG from "react-inlinesvg";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton";
import PartiesFormParameter from "./FormParameterSubTab/PartiesFormParameter";
import JobPriceFormParameter from "./FormParameterSubTab/JobPriceFormParameter";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import DialogGlobal from "app/components/modals/DialogGlobal";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import NewClause from "./Components/Modal/NewClause";

const createNewPaymentStage = (value, percentage, payment) => ({
  value,
  percentage,
  payment,
});

const actionButton = (id, deleteFine) => (
  <ButtonAction
    handleAction={(_, __, type) => {
      if (type === "Hapus") {
        deleteFine(id);
      }
    }}
    style={{
      backgroundColor: "#e8f4fb",
    }}
    hoverLabel="More"
    data={"1"}
    ops={[
      {
        label: "Hapus",
      },
    ]}
  />
);

function createData(id, fine_type, value, max_day, value_type) {
  return { id, fine_type, value, max_day, value_type };
}

const FormParameter = ({
  fetch_api_sg,
  currentActiveTab,
  headerData,
  jsonData,
  jobDirector,
  jobSupervisor,
  jobSupervisor2,
  timePeriodData,
  authorizedOfficial,
  secondAuthorizedOfficial,
  PICData,
  accountNumberBankData,
}) => {
  // console.log("isi pihak kedua", secondAuthorizedOfficial);
  // console.log("isi auth official", authorizedOfficial);
  // console.log("isi direksi pekerjaan", jobDirector);
  // console.log("isi pengawas pekerjaan", jobSupervisor);
  // console.log("isi jsonData", jsonData);

  const guaranteeBeforeAddendum = [
    {
      title: "Jaminan Uang Muka",
      startDate: `${jsonData?.from_time}`,
      endDate: `${jsonData?.thru_time}`,
      filename: "bla_blah.pdf",
      radio: `${jsonData?.down_payment_guarantee}`,
      nameTitle: "dp_guarantee",
      nameStart: "dp_guarantee_start_date",
      nameEnd: "dp_guarantee_end_date",
      nameEvidence: "dp_guarantee_evidence_file",
    },
    {
      title: "Jaminan Pelaksanaan",
      startDate: `${jsonData?.guarantee_start_date}`,
      endDate: `${jsonData?.guarantee_end_date}`,
      filename: "secret.docx",
      radio: `${jsonData?.implementation_guarantee}`,
      nameTitle: "implementation_guarantee",
      nameStart: "implementation_guarantee_start_date",
      nameEnd: "implementation_guarantee_end_date",
      nameEvidence: "implementation_guarantee_evidence_file",
    },
    {
      title: "Jaminan Pemeliharaan",
      startDate: `${jsonData?.maintenance_start_date}`,
      endDate: `${jsonData?.maintenance_start_date}`,
      filename: "another_file.xlsx",
      radio: `${jsonData?.maintenance_guarantee}`,
      nameTitle: "maintenance_guarantee",
      nameStart: "maintenance_guarantee_start_date",
      nameEnd: "maintenance_guarantee_end_date",
      nameEvidence: "maintenance_guarantee_evidence_file",
    },
  ];

  const timePeriodBeforeAddendum = [
    {
      title: "Jangka Waktu Perjanjian",
      startDate: timePeriodData?.from_time,
      endDate: timePeriodData?.thru_time,
      totalMonth: timePeriodData?.contract_period_range_month,
      calendarDay: timePeriodData?.contract_period_range_day,
      radio: timePeriodData?.contract_period_type,
      prefix: "contract",
    },
    {
      title: "Jangka Waktu Pelaksanaan Pekerjaan",
      startDate: timePeriodData?.worked_start_date,
      endDate: timePeriodData?.worked_end_date,
      totalMonth: timePeriodData?.work_implement_period_month,
      calendarDay: timePeriodData?.work_implement_period_day,
      radio: timePeriodData?.work_period_type,
      prefix: "work",
    },
    {
      title: "Jangka Waktu Masa Garansi",
      startDate: timePeriodData?.guarantee_start_date,
      endDate: timePeriodData?.guarantee_end_date,
      totalMonth: timePeriodData?.guarantee_period_month,
      calendarDay: timePeriodData?.guarantee_period_day,
      prefix: "guarantee",
    },
    {
      title: "Jangka Waktu Masa Pemeliharaan",
      startDate: timePeriodData?.maintenance_start_date,
      endDate: timePeriodData?.maintenance_end_date,
      totalMonth: timePeriodData?.maintenance_period_month,
      calendarDay: timePeriodData?.maintenance_period_day,
      prefix: "maintenance",
    },
  ];

  const [timePeriodAddendum, setTimePeriodAddendum] = useState([
    {
      title: "Jangka Waktu Perjanjian",
      startDate: timePeriodData?.from_time,
      endDate: timePeriodData?.thru_time,
      totalMonth: timePeriodData?.contract_period_range_month,
      calendarDay: timePeriodData?.contract_period_range_day,
      radio: timePeriodData?.contract_period_type,
      prefix: "contract",
    },
    {
      title: "Jangka Waktu Pelaksanaan Pekerjaan",
      startDate: timePeriodData?.worked_start_date,
      endDate: timePeriodData?.worked_end_date,
      totalMonth: timePeriodData?.work_implement_period_month,
      calendarDay: timePeriodData?.work_implement_period_day,
      radio: timePeriodData?.work_period_type,
      prefix: "work",
    },
    {
      title: "Jangka Waktu Masa Garansi",
      startDate: timePeriodData?.guarantee_start_date,
      endDate: timePeriodData?.guarantee_end_date,
      totalMonth: timePeriodData?.guarantee_period_month,
      calendarDay: timePeriodData?.guarantee_period_day,
      prefix: "guarantee",
    },
    {
      title: "Jangka Waktu Masa Pemeliharaan",
      startDate: timePeriodData?.maintenance_start_date,
      endDate: timePeriodData?.maintenance_end_date,
      totalMonth: timePeriodData?.maintenance_period_month,
      calendarDay: timePeriodData?.maintenance_period_day,
      prefix: "maintenance",
    },
  ]);

  const [bankIndex, setBankIndex] = useState(0);
  const changeDataBankIndex = (num) => {
    setBankIndex(num);
    setAccountNumber(jsonData?.data_bank[num]);
  };

  const bodyClauseDataTemplate = {
    clause_number: "",
    before_clause_note: "",
    after_clause_note: "",
  };

  const attachmentClauseDataTemplate = {
    attachment_number: "",
    clause_note: "",
  };

  const [timePeriodBodyClauseData, setTimePeriodBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    timePeriodAttachmentClauseData,
    setTimePeriodAttachmentClauseData,
  ] = useState([attachmentClauseDataTemplate]);

  const [
    paymentMethodBodyClauseData,
    setPaymentMethodBodyClauseData,
  ] = useState(bodyClauseDataTemplate);
  const [
    paymentMethodAttachmentClauseData,
    setPaymentMethodAttachmentClauseData,
  ] = useState([attachmentClauseDataTemplate]);

  const [fineBodyClauseData, setFineBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [fineAttachmentClauseData, setFineAttachmentClauseData] = useState([
    attachmentClauseDataTemplate,
  ]);

  const [guaranteeBodyClauseData, setGuaranteeBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    guaranteeAttachmentClauseData,
    setGuaranteeAttachmentClauseData,
  ] = useState([attachmentClauseDataTemplate]);

  const [
    accountNumberBodyClauseData,
    setAccountNumberBodyClauseData,
  ] = useState(bodyClauseDataTemplate);
  const [
    accountNumberAttachmentClauseData,
    setAccountNumberAttachmentClauseData,
  ] = useState([attachmentClauseDataTemplate]);

  const [otherBodyClauseData, setOtherBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [otherAttachmentClauseData, setOtherAttachmentClauseData] = useState([
    attachmentClauseDataTemplate,
  ]);

  const [inputDataGuarantee, setInputDataGuarantee] = useState({
    dp_guarantee: "",
    dp_guarantee_start_date: "",
    dp_guarantee_end_date: "",
    dp_guarantee_evidence_file: "",
    implementation_guarantee: "",
    implementation_guarantee_start_date: "",
    implementation_guarantee_end_date: "",
    implementation_guarantee_evidence_file: "",
    maintenance_guarantee: "",
    maintenance_guarantee_start_date: "",
    maintenance_guarantee_end_date: "",
    maintenance_guarantee_evidence_file: "",
  });

  // bikin converter tanggal ke x hari & y bulan + skpp/spmk
  const submitFormParameterTimePeriod = (values) => {
    submitTimePeriod(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        from_time: values?.contract_start_date,
        thru_time: values?.contract_end_date,
        work_start_date: values?.work_start_date,
        work_end_date: values?.work_end_date,
        guarantee_start_date: values?.guarantee_start_date,
        guarantee_end_date: values?.guarantee_end_date,
        maintenance_start_date: values?.maintenance_start_date,
        maintenance_end_date: values?.maintenance_end_date,
        add_contract_periode_range_month: values?.contract_range_month,
        add_contract_periode_range_day: values?.contract_range_day,
        add_work_implement_period_month: values?.work_range_month,
        add_work_implement_period_day: values?.work_range_day,
        add_guarantee_period_month: values?.guarantee_range_month,
        add_guarantee_period_day: values?.guarantee_range_day,
        add_maintenance_period_month: values?.maintenance_range_month,
        add_maintenance_period_day: values?.maintenance_range_day,
        add_contract_period_type: values?.add_contract_period_type,
        add_work_period_type: values?.add_work_period_type,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  // CLEAR!, tinggal skenario yang Full
  const submitFormParameterPaymentMethod = (values) => {
    submitPaymentMethod(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        payment_method_name: values.payment_method,
        payment_method_data: values.payment_data,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  // CLEAR!
  const submitFormParameterFine = (values) => {
    submitFine(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        penalty_fine_data: values.fine_data,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  // CLEAR!
  const submitFormParameterGuarantee = (values) => {
    submitGuarantee(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        down_payment_guarantee: values.dp_guarantee,
        down_payment_guarantee_start_date: values.dp_guarantee_start_date,
        down_payment_guarantee_end_date: values.dp_guarantee_end_date,
        down_payment_guarantee_evidence_file: values.dp_guarantee_evidence_file,
        implementation_guarantee: values.implementation_guarantee,
        implementation_guarantee_start_date:
          values.implementation_guarantee_start_date,
        implementation_guarantee_end_date:
          values.implementation_guarantee_end_date,
        implementation_guarantee_evidence_file:
          values.implementation_guarantee_evidence_file,
        maintenance_guarantee: values.maintenance_guarantee,
        maintenance_guarantee_start_date:
          values.maintenance_guarantee_start_date,
        maintenance_guarantee_end_date: values.maintenance_guarantee_end_date,
        maintenance_guarantee_evidence_file:
          values.maintenance_guarantee_evidence_file,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  // CLEAR!
  const submitFormParameterAccountNumber = (values) => {
    submitAccountNumber(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        data_bank: values.data_bank,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_file,
      },
      contract_id
    );
  };

  // CLEAR!
  const submitFormParameterOther = (values) => {
    submitOther(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        body_clause_data: [values.body_data],
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  const [fine, setFine] = useState([
    createData(1, "Keterlambatan Pekerjaan", 10, 30, "%"),
  ]);

  const deleteFine = (id) => {
    setFine(() => {
      return fine.filter((data) => {
        return data.id !== id;
      });
    });
  };

  const { contract_id } = useParams();
  const [dataArr, setDataArr] = useState([]);
  const [dataArrFine, setDataArrFine] = useState([]);
  const [currencies, setDataCurrencies] = useState([]);

  const earlyStagePayment = {
    payment: JSON.parse(localStorage.getItem("payment_method")),
  };

  const [stagePayment, setStagePayment] = useState({
    payment: jsonData?.payment_method_data,
  });
  const [accountNumber, setAccountNumber] = useState(
    jsonData?.data_bank[bankIndex]
  );

  const getDataPenalties = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-all-pinalties`,
      onSuccess: (res) => {
        setDataArr(
          res.data.map((item) => ({
            id: item.id,
            name: item.pinalty_name,
          }))
        );
      },
    });
  };

  const getDataBankAccounts = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-party-bank/${contract_id}`,
      onSuccess: (res) => {
        setDataArrFine(
          res.data.map((item) => ({
            id: item.id,
            name: item.pinalty_name,
          }))
        );
      },
    });
  };

  const getCurrencies = async () => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/currencies`,
      onSuccess: (res) => {
        console.log("response currencies", res);
        setDataCurrencies(res);
      },
    });
  };

  React.useEffect(() => {
    getDataPenalties();
    getDataBankAccounts();
    getCurrencies();
  }, []);

  React.useEffect(() => {
    console.log("isi dataArr", dataArr);
    console.log("isi currencies", currencies);
  }, [dataArr, currencies]);

  const [addendumPaymentMethod, setAddendumPaymentMethod] = useState(
    jsonData?.payment_method
  );

  const openCloseAddFine = React.useRef();
  const showAddFine = () => {
    openCloseAddFine.current.open();
  };

  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };

  const openCloseAddPayment = React.useRef();
  const showAddPayment = () => {
    openCloseAddPayment.current.open();
  };

  const changePaymentMethodField = (index, value, type) => {
    setStagePayment((state) => {
      let newArr = [...state.payment];
      if (type === "Percentage") newArr[index]["percentage"] = value;
      if (type === "Description") newArr[index]["value"] = value;
      return {
        ...state,
        payment: newArr,
      };
    });
  };

  return (
    <>
      {/* modal tambah denda */}
      <DialogGlobal
        ref={openCloseAddFine}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
        maxWidth={"sm"}
      >
        <Formik
          initialValues={{
            fine_type: "",
            value: "",
            max_day: "",
            value_type: "",
          }}
          onSubmit={(values) => {
            setFine((data) => {
              return [
                ...data,
                createData(
                  fine.length + 1,
                  values.fine_type,
                  values.value,
                  values.max_day,
                  values.value_type
                ),
              ];
            });
            openCloseAddFine.current.close();
          }}
        >
          {({ values }) => (
            <>
              <Form>
                <div
                  style={{
                    padding: "0 17%",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: 40,
                      fontSize: 16,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Tambah Denda
                  </h1>

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
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Jenis Denda
                      </span>
                      <Field
                        as="select"
                        name="fine_type"
                        style={{
                          padding: "10px 0",
                          backgroundColor: "#e8f4fb",
                          borderRadius: 4,
                        }}
                      >
                        {dataArrFine.length > 0 &&
                          dataArr.map((data) => {
                            return (
                              <>
                                <option
                                  style={{
                                    display: "none",
                                  }}
                                ></option>
                                <option
                                  key={data.id}
                                  style={{
                                    padding: "10px 12px",
                                    backgroundColor: "white",
                                    borderRadius: 4,
                                  }}
                                  value={data.name}
                                >
                                  {data.name}
                                </option>
                              </>
                            );
                          })}
                      </Field>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Nilai
                      </span>
                      <Field
                        type="text"
                        name="value"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Maksimal Hari
                      </span>
                      <Field
                        type="text"
                        name="max_day"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        Type Nilai
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: 20,
                        }}
                      >
                        <label>
                          <Field type="radio" name="value_type" value="%" />%
                        </label>
                        <label>
                          <Field type="radio" name="value_type" value="nilai" />
                          Nilai
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 52,
                    padding: "0 7%",
                  }}
                >
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </DialogGlobal>

      {/* modal tambah pembayaran */}
      <DialogGlobal
        ref={openCloseAddPayment}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            percentage: "",
            description: "",
          }}
          onSubmit={(values) => {
            setStagePayment((data) => {
              console.log("isi submit data", data);
              return {
                ...data,
                payment: [
                  ...data.payment,
                  createNewPaymentStage(
                    values.description,
                    values.percentage,
                    data?.payment?.length + 1
                  ),
                ],
              };
            });
            openCloseAddPayment.current.close();
          }}
        >
          <Form>
            <div
              style={{
                padding: "0 17%",
              }}
            >
              <h1
                style={{
                  marginBottom: 40,
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Tambah pembayaran bertahap
              </h1>

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
                  <span>Persentase</span>
                  <Field
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      border: 1,
                      borderStyle: "solid",
                      borderColor: "#8c8a8a",
                      opacity: 0.8,
                    }}
                    name="percentage"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>Deskripsi</span>
                  <Field
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      border: 1,
                      borderStyle: "solid",
                      borderColor: "#8c8a8a",
                      opacity: 0.8,
                    }}
                    name="description"
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 52,
                padding: "0 7%",
              }}
            >
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </Form>
        </Formik>
      </DialogGlobal>

      {currentActiveTab === 2 && (
        <NewClause
          openCloseAddClause={openCloseAddClause}
          setAttachmentClauseData={setTimePeriodAttachmentClauseData}
        />
      )}

      {currentActiveTab === 3 && (
        <NewClause
          openCloseAddClause={openCloseAddClause}
          setAttachmentClauseData={setPaymentMethodAttachmentClauseData}
        />
      )}

      {currentActiveTab === 4 && (
        <NewClause
          openCloseAddClause={openCloseAddClause}
          setAttachmentClauseData={setFineAttachmentClauseData}
        />
      )}

      {currentActiveTab === 5 && (
        <NewClause
          openCloseAddClause={openCloseAddClause}
          setAttachmentClauseData={setGuaranteeAttachmentClauseData}
        />
      )}

      {currentActiveTab === 6 && (
        <NewClause
          openCloseAddClause={openCloseAddClause}
          setAttachmentClauseData={setAccountNumberAttachmentClauseData}
        />
      )}

      <Card>
        <CardBody>
          {/* Para Pihak */}
          {currentActiveTab === 0 && (
            <>
              <PartiesFormParameter
                jsonData={jsonData}
                authorizedOfficial={authorizedOfficial}
                secondAuthorizedOfficial={secondAuthorizedOfficial}
                PICData={PICData}
                jobDirector={jobDirector}
                jobSupervisor={jobSupervisor}
                jobSupervisor2={jobSupervisor2}
                contract_id={contract_id}
              />
            </>
          )}

          {/* Harga Pekerjaan */}
          {currentActiveTab === 1 && (
            <>
              <JobPriceFormParameter
                currencies={currencies}
                headerData={headerData}
                jsonData={jsonData}
              />
            </>
          )}

          {/* Jangka Waktu */}
          {currentActiveTab === 2 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  contract_range_month: timePeriodAddendum[0]?.totalMonth,
                  contract_range_day: timePeriodAddendum[0]?.calendarDay,
                  work_range_month: timePeriodAddendum[1]?.totalMonth,
                  work_range_day: timePeriodAddendum[1]?.calendarDay,
                  guarantee_range_month: timePeriodAddendum[2]?.totalMonth,
                  guarantee_range_day: timePeriodAddendum[2]?.calendarDay,
                  maintenance_range_month: timePeriodAddendum[3]?.totalMonth,
                  maintenance_range_day: timePeriodAddendum[3]?.calendarDay,
                  contract_start_date: timePeriodAddendum[0]?.startDate,
                  contract_end_date: timePeriodAddendum[0]?.endDate,
                  work_start_date: timePeriodAddendum[1]?.startDate,
                  work_end_date: timePeriodAddendum[1]?.endDate,
                  guarantee_start_date: timePeriodAddendum[2]?.startDate,
                  guarantee_end_date: timePeriodAddendum[2]?.endDate,
                  maintenance_start_date: timePeriodAddendum[3]?.startDate,
                  maintenance_end_date: timePeriodAddendum[3]?.endDate,
                  body_data: timePeriodBodyClauseData,
                  attachment_data: timePeriodAttachmentClauseData,
                  add_contract_period_type: timePeriodAddendum[0]?.radio,
                  add_work_period_type: timePeriodAddendum[1]?.radio,
                }}
                onSubmit={(values) => {
                  console.log("isi jangka waktu", values);
                  submitFormParameterTimePeriod(values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        border: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        borderRadius: 14,
                        padding: 28,
                        marginBottom: 40,
                      }}
                    >
                      {/* Jangka waktu kontrak awal */}
                      <h1
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          marginBottom: 14,
                        }}
                      >
                        Jangka waktu kontrak awal
                      </h1>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        {timePeriodBeforeAddendum &&
                          timePeriodBeforeAddendum.map((data, index) => (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                  columnGap: 18,
                                }}
                              >
                                <div>
                                  <div className="upper-for-title">
                                    <p
                                      style={{
                                        margin: 0,
                                      }}
                                    >
                                      {data.title}
                                    </p>
                                  </div>

                                  <div
                                    className="bottom-for-input col-md-3"
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-end",
                                      columnGap: 10,
                                      padding: 0,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 4,
                                        padding: 0,
                                      }}
                                    >
                                      <input
                                        type="date"
                                        style={{
                                          backgroundColor: "#e8f4fb",
                                          borderRadius: 4,
                                          padding: "10px 12px",
                                          border: "none",
                                          display: "flex",
                                          flexDirection: "row-reverse",
                                          columnGap: 10,
                                        }}
                                        value={data.startDate}
                                        // kalo ada value nya gak bisa diganti, kalo gak ada value bisa diganti
                                        disabled
                                      />
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        placeItems: "center",
                                        minHeight: 41.5,
                                      }}
                                    >
                                      -
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 4,
                                        padding: 0,
                                      }}
                                    >
                                      <input
                                        type="date"
                                        style={{
                                          backgroundColor: "#e8f4fb",
                                          borderRadius: 4,
                                          padding: "10px 12px",
                                          border: "none",
                                          display: "flex",
                                          flexDirection: "row-reverse",
                                          columnGap: 10,
                                        }}
                                        value={data.endDate}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="month-day-wrapper"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: 41.5,
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                    }}
                                  >
                                    {data.totalMonth !== null
                                      ? data.totalMonth
                                      : 0}{" "}
                                    Bulan{" "}
                                    {data.calendarDay !== null
                                      ? data.calendarDay
                                      : 0}{" "}
                                    Hari
                                  </p>
                                </div>

                                {typeof data.radio !== "undefined" && (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 20,
                                      marginLeft: 10,
                                      alignItems: "center",
                                      minHeight: 41.5,
                                    }}
                                  >
                                    <label
                                      style={{
                                        margin: 0,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        columnGap: 8,
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name={`${index}_down_payment_guarantee`}
                                        value={"SKPP"}
                                        checked={data.radio === "SKPP"}
                                      />
                                      <span>SKPP</span>
                                    </label>

                                    <label
                                      style={{
                                        margin: 0,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        columnGap: 8,
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name={`${data.title}_down_payment_guarantee`}
                                        value={"SPMK"}
                                        checked={data.radio === "SPMK"}
                                      />
                                      <span>SPMK</span>
                                    </label>
                                  </div>
                                )}
                              </div>
                            </>
                          ))}
                      </div>

                      {/* Addendum jangka waktu */}
                      <h1
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          marginTop: 28,
                          marginBottom: 14,
                        }}
                      >
                        A. Addendum jangka waktu
                      </h1>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        {timePeriodAddendum &&
                          timePeriodAddendum.map((data, index) => (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                  columnGap: 18,
                                }}
                              >
                                <div>
                                  <div className="upper-for-title">
                                    <p
                                      style={{
                                        margin: 0,
                                      }}
                                    >
                                      {data.title}
                                    </p>
                                  </div>

                                  <div
                                    className="bottom-for-input col-md-3"
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-end",
                                      columnGap: 10,
                                      padding: 0,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 4,
                                        padding: 0,
                                      }}
                                    >
                                      <Field
                                        type="date"
                                        style={{
                                          borderRadius: 4,
                                          padding: "10px 12px",
                                          border: "none",
                                          display: "flex",
                                          flexDirection: "row-reverse",
                                          columnGap: 10,
                                          backgroundColor:
                                            data.title ===
                                              "Jangka Waktu Perjanjian" ||
                                            data.title ===
                                              "Jangka Waktu Pelaksanaan Pekerjaan"
                                              ? "#e8f4fb"
                                              : "",
                                        }}
                                        name={data.prefix + "_start_date"}
                                        value={data.startDate}
                                        disabled={
                                          (data.title ===
                                            "Jangka Waktu Perjanjian" &&
                                            data.startDate !== null) ||
                                          (data.title ===
                                            "Jangka Waktu Pelaksanaan Pekerjaan" &&
                                            data.startDate !== null)
                                        }
                                        onChange={(e) =>
                                          setTimePeriodAddendum((prev) => {
                                            let newArr = [...prev];
                                            newArr[index].startDate =
                                              e.target.value;
                                            return newArr;
                                          })
                                        }
                                      />
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        placeItems: "center",
                                        minHeight: 41.5,
                                      }}
                                    >
                                      -
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 4,
                                        padding: 0,
                                      }}
                                    >
                                      <Field
                                        type="date"
                                        style={{
                                          borderRadius: 4,
                                          padding: "10px 12px",
                                          border: "none",
                                          display: "flex",
                                          flexDirection: "row-reverse",
                                          columnGap: 10,
                                        }}
                                        name={data.prefix + "_end_date"}
                                        value={data.endDate}
                                        onChange={(e) => {
                                          setTimePeriodAddendum((prev) => {
                                            if (e !== null) {
                                              let newArr = [...prev];
                                              newArr[index].endDate =
                                                e.target.value;
                                              let a = countdownConverter(
                                                data?.startDate,
                                                data?.endDate
                                              );
                                              newArr[index].totalMonth = a[0];
                                              newArr[index].calendarDay = a[1];
                                              return newArr;
                                            }
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="month-day-wrapper"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: 41.5,
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                    }}
                                  >
                                    {countdownMonths(
                                      data.startDate,
                                      data.endDate
                                    )}
                                  </p>
                                </div>

                                {typeof data.radio !== "undefined" && (
                                  <label
                                    style={{
                                      display: "flex",
                                      gap: 20,
                                      marginLeft: 10,
                                      alignItems: "center",
                                      minHeight: 41.5,
                                    }}
                                  >
                                    <div
                                      style={{
                                        margin: 0,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        columnGap: 8,
                                      }}
                                    >
                                      <Field
                                        type="radio"
                                        name={`add_${data?.prefix}_period_type`}
                                        value={"SKPP"}
                                        onChange={(e) =>
                                          setTimePeriodAddendum((prev) => {
                                            let newArr = [...prev];
                                            newArr[index].radio =
                                              e.target.value;
                                            return newArr;
                                          })
                                        }
                                      />
                                      <span>SKPP</span>
                                    </div>

                                    <div
                                      style={{
                                        margin: 0,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        columnGap: 8,
                                      }}
                                    >
                                      <Field
                                        type="radio"
                                        name={`add_${data?.prefix}_period_type`}
                                        value={"SPMK"}
                                        onChange={(e) =>
                                          setTimePeriodAddendum((prev) => {
                                            let newArr = [...prev];
                                            newArr[index].radio =
                                              e.target.value;
                                            return newArr;
                                          })
                                        }
                                      />
                                      <span>SPMK</span>
                                    </div>
                                  </label>
                                )}
                              </div>
                            </>
                          ))}
                      </div>
                    </div>

                    <PerubahanKlausulKontrak
                      subTitle={"B"}
                      title={"Jangka Waktu"}
                      setBodyClauseData={setTimePeriodBodyClauseData}
                      setAttachmentClauseData={
                        setTimePeriodAttachmentClauseData
                      }
                      showAddClause={showAddClause}
                      values={values}
                    />

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* Metode Pembayaran */}
          {currentActiveTab === 3 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  payment_method: addendumPaymentMethod,
                  payment_data: stagePayment.payment,
                  body_data: paymentMethodBodyClauseData,
                  attachment_data: paymentMethodAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  // values.payment_data.reverse();
                  console.log("submit di metode pembayaran", values);
                  submitFormParameterPaymentMethod(values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        padding: 28,
                        borderRadius: 14,
                        border: 1,
                        borderStyle: "solid",
                        borderColor: "#8c8a8a",
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 40,
                        columnGap: 100,
                      }}
                    >
                      {/* Metode Pembayaran Kontrak Awal */}
                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <h1
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                          }}
                        >
                          Metode pembayaran kontrak awal
                        </h1>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 14,
                            paddingTop: 14,
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              gap: 12,
                            }}
                          >
                            <input
                              type="radio"
                              name="payment"
                              disabled
                              checked={jsonData?.payment_method === "full"}
                            />
                            Full Pembayaran
                          </label>
                          <label
                            style={{
                              display: "flex",
                              gap: 12,
                            }}
                          >
                            <input
                              type="radio"
                              name="payment"
                              disabled
                              checked={jsonData?.payment_method === "gradually"}
                            />
                            Pembayaran Bertahap
                          </label>
                        </div>
                        {earlyStagePayment &&
                          earlyStagePayment?.payment?.map((item) => {
                            return (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    columnGap: 10,
                                    marginTop: 28,
                                    marginBottom: 14,
                                  }}
                                >
                                  <p
                                    style={{
                                      paddingTop: 12,
                                    }}
                                  >
                                    Tahap {item.payment}
                                  </p>

                                  <div
                                    style={{
                                      flex: 1,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <Field
                                        style={{
                                          flex: 1,
                                          padding: "10px 12px",
                                          borderRadius: 4,
                                        }}
                                        type="text"
                                        placeholder="Persentase"
                                        value={item.percentage}
                                        disabled
                                      />
                                    </div>
                                    <div
                                      style={{
                                        marginTop: 14,
                                        marginBottom: 28,
                                        display: "flex",
                                      }}
                                    >
                                      <Field
                                        as="textarea"
                                        style={{
                                          flex: 1,
                                          padding: "10px 12px",
                                          borderRadius: 4,
                                        }}
                                        placeholder="Deskripsi"
                                        value={item.value}
                                        disabled
                                      />
                                      {/* </textarea> */}
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                      </div>

                      {/* Addendum Metode Pembayaran */}
                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <h1
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                          }}
                        >
                          A. Addendum metode pembayaran
                        </h1>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 14,
                            paddingTop: 14,
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              gap: 12,
                            }}
                          >
                            <input
                              type="radio"
                              name="payment_addendum"
                              onClick={() => setAddendumPaymentMethod("full")}
                              checked={addendumPaymentMethod === "full"}
                            />
                            Full Pembayaran
                          </label>
                          <label
                            style={{
                              display: "flex",
                              gap: 12,
                              margin: 0,
                            }}
                          >
                            <input
                              type="radio"
                              name="payment_addendum"
                              onClick={() =>
                                setAddendumPaymentMethod("gradually")
                              }
                              checked={addendumPaymentMethod === "gradually"}
                            />
                            Pembayaran Bertahap
                          </label>
                        </div>
                        {addendumPaymentMethod === "gradually" &&
                          stagePayment?.payment?.map((item, index) => {
                            return (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    columnGap: 10,
                                    marginTop: 28,
                                    marginBottom: 14,
                                  }}
                                >
                                  <div>
                                    <p
                                      style={{
                                        paddingTop: 12,
                                      }}
                                    >
                                      {/* Tahap {item.payment} */}
                                      Tahap {index + 1}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setStagePayment((previous) => {
                                          let data = { ...previous };
                                          data.payment.splice(index, 1);
                                          return data;
                                        });
                                      }}
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                  <div
                                    style={{
                                      flex: 1,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <Field
                                        style={{
                                          flex: 1,
                                          padding: "10px 12px",
                                          borderRadius: 4,
                                        }}
                                        type="text"
                                        placeholder="Persentase"
                                        value={item.percentage}
                                        onChange={(e) =>
                                          changePaymentMethodField(
                                            index,
                                            e.target.value,
                                            "Percentage"
                                          )
                                        }
                                        disabled={
                                          addendumPaymentMethod !== "gradually"
                                        }
                                      />
                                    </div>
                                    <div
                                      style={{
                                        marginTop: 14,
                                        marginBottom: 28,
                                        display: "flex",
                                      }}
                                    >
                                      <textarea
                                        style={{
                                          flex: 1,
                                          padding: "10px 12px",
                                          borderRadius: 4,
                                        }}
                                        placeholder="Deskripsi"
                                        value={item.value}
                                        onChange={(e) =>
                                          changePaymentMethodField(
                                            index,
                                            e.target.value,
                                            "Description"
                                          )
                                        }
                                        disabled={
                                          addendumPaymentMethod !== "gradually"
                                        }
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        {addendumPaymentMethod === "gradually" && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: 28,
                            }}
                          >
                            <button
                              type="button"
                              className="btn btn-primary mx-1"
                              onClick={showAddPayment}
                            >
                              Tambah
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <PerubahanKlausulKontrak
                      subTitle={"B"}
                      title={"Metode Pembayaran"}
                      setBodyClauseData={setPaymentMethodBodyClauseData}
                      setAttachmentClauseData={
                        setPaymentMethodAttachmentClauseData
                      }
                      showAddClause={showAddClause}
                      values={values}
                    />

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* Denda */}
          {currentActiveTab === 4 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  fine_data: fine,
                  body_data: fineBodyClauseData,
                  attachment_data: fineAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  submitFormParameterFine(values);
                  console.log("isi submit", values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        padding: 28,
                        borderRadius: 14,
                        border: 1,
                        borderStyle: "solid",
                        borderColor: "#8c8a8a",
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: 40,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 34.5,
                        }}
                      >
                        <TableContainer
                          style={{
                            padding: 10,
                          }}
                          component={Paper}
                        >
                          <h1
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#2e1f22",
                            }}
                          >
                            Denda Kontrak Awal
                          </h1>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">No</TableCell>
                                <TableCell align="left">Jenis Denda</TableCell>
                                <TableCell align="left">Nilai</TableCell>
                                <TableCell align="left">
                                  Maksimal Hari
                                </TableCell>
                                <TableCell align="left">Type Nilai</TableCell>
                              </TableRow>
                            </TableBody>
                            <TableBody>
                              {jsonData?.penalty_fine_data?.map(
                                (data, index) => (
                                  <TableRow
                                    key={data.id}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell component="th">
                                      {index + 1}
                                    </TableCell>
                                    <TableCell align="left" scope="row">
                                      {data.pinalty_name}
                                    </TableCell>
                                    <TableCell align="left">
                                      {data.value}
                                    </TableCell>
                                    <TableCell align="left">
                                      {data.max_day}
                                    </TableCell>
                                    <TableCell align="left">
                                      {data.type === "1" ? "%" : "Nilai"}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <TableContainer
                          style={{
                            padding: 10,
                          }}
                          component={Paper}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              // marginTop: 34,
                              // marginBottom: 20
                            }}
                          >
                            <h1
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: "#2e1f22",
                              }}
                            >
                              A. Addendum Denda Pekerjaan
                            </h1>
                            <button
                              className="btn btn-primary"
                              style={{
                                maxHeight: 40,
                              }}
                              onClick={showAddFine}
                            >
                              Denda
                            </button>
                          </div>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">No</TableCell>
                                <TableCell align="left">Jenis Denda</TableCell>
                                <TableCell align="left">Nilai</TableCell>
                                <TableCell align="left">
                                  Maksimal Hari
                                </TableCell>
                                <TableCell align="left">Tipe Nilai</TableCell>
                                <TableCell align="left">Aksi</TableCell>
                              </TableRow>
                            </TableBody>
                            <TableBody>
                              {fine.map((row, index) => (
                                <TableRow
                                  key={row.name}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell align="left" scope="row">
                                    {row.fine_type}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.value}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.max_day}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.value_type}
                                  </TableCell>
                                  <TableCell align="left">
                                    {actionButton(row.id, deleteFine)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>

                    <PerubahanKlausulKontrak
                      subTitle={"B"}
                      title={"Denda"}
                      setBodyClauseData={setFineBodyClauseData}
                      setAttachmentClauseData={setFineAttachmentClauseData}
                      showAddClause={showAddClause}
                      values={values}
                    />

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* jaminan */}
          {currentActiveTab === 5 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  dp_guarantee: inputDataGuarantee.dp_guarantee,
                  dp_guarantee_start_date:
                    inputDataGuarantee.dp_guarantee_start_date,
                  dp_guarantee_end_date:
                    inputDataGuarantee.dp_guarantee_end_date,
                  dp_guarantee_evidence_file:
                    inputDataGuarantee.dp_guarantee_evidence_file,
                  implementation_guarantee:
                    inputDataGuarantee.implementation_guarantee,
                  implementation_guarantee_start_date:
                    inputDataGuarantee.implementation_guarantee_start_date,
                  implementation_guarantee_end_date:
                    inputDataGuarantee.implementation_guarantee_end_date,
                  implementation_guarantee_evidence_file:
                    inputDataGuarantee.implementation_guarantee_evidence_file,
                  maintenance_guarantee:
                    inputDataGuarantee.maintenance_guarantee,
                  maintenance_guarantee_start_date:
                    inputDataGuarantee.maintenance_guarantee_start_date,
                  maintenance_guarantee_end_date:
                    inputDataGuarantee.maintenance_guarantee_end_date,
                  maintenance_guarantee_evidence_file:
                    inputDataGuarantee.maintenance_guarantee_evidence_file,
                  body_data: guaranteeBodyClauseData,
                  attachment_data: guaranteeAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  submitFormParameterGuarantee(values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 28,
                        border: 1,
                        borderStyle: "solid",
                        borderColor: "black",
                        borderRadius: 14,
                        padding: 28,
                        marginBottom: 40,
                      }}
                    >
                      {/* jaminan kontrak awal */}
                      <div>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                          }}
                        >
                          Jaminan Kontrak Awal
                        </span>
                      </div>

                      {/* jaminan uang muka */}
                      {guaranteeBeforeAddendum &&
                        guaranteeBeforeAddendum.map((data, index) => (
                          <>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 30,
                                  alignItems: "center",
                                }}
                              >
                                {/* jaminan uang muka */}
                                <p
                                  style={{
                                    width: 150,
                                    margin: 0,
                                  }}
                                >
                                  {data.title}
                                </p>

                                {/* ya / tidak */}
                                {data.radio}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 14,
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`${index}_down_payment_guarantee`}
                                      checked={data.radio == "1"}
                                    />
                                    <span>Ya</span>
                                  </label>

                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`${index}_down_payment_guarantee`}
                                      checked={data.radio == "0"}
                                    />
                                    <span>Tidak</span>
                                  </label>
                                </div>
                              </div>

                              {/* tanggal mulai, selesai, evidence */}
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 20,
                                  marginTop: 15,
                                }}
                              >
                                {/* tanggal mulai */}
                                <div className="col-sm-3">
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>Tanggal Mulai</span>
                                    <input
                                      type="date"
                                      style={{
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      value={data.startDate}
                                      disabled
                                    />
                                  </label>
                                </div>

                                {/* tanggal selesai */}
                                <div className="col-sm-3">
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>Tanggal Selesai</span>
                                    <input
                                      type="date"
                                      style={{
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      value={data.endDate}
                                      disabled
                                    />
                                  </label>
                                </div>

                                {/* evidence */}
                                <div
                                  className="col-md-5"
                                  style={{
                                    padding: 0,
                                  }}
                                >
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>Evidence</span>
                                    <div>
                                      <label
                                        htmlFor="upload"
                                        className={`input-group mb-3 col-sm-12 pointer`}
                                        style={{
                                          padding: 0,
                                        }}
                                      >
                                        <span
                                          className={`form-control text-truncate`}
                                          style={{
                                            backgroundColor: "#e8f4fb",
                                          }}
                                        >
                                          {/* nama_file_upload.pdf */}
                                          {data.filename}
                                        </span>
                                        <div className="input-group-prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              backgroundColor: "#e8f4fb",
                                            }}
                                          >
                                            <i className="fas fa-file-upload"></i>
                                          </span>
                                        </div>
                                      </label>
                                      <input
                                        type="file"
                                        className="d-none"
                                        id="upload"
                                        style={{
                                          backgroundColor: "#E8F4FB",
                                        }}
                                        disabled
                                      />
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}

                      {/* Addendum jaminan */}
                      <div>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                          }}
                        >
                          A. Addendum Jaminan
                        </span>
                      </div>

                      {guaranteeBeforeAddendum &&
                        guaranteeBeforeAddendum.map((data, index) => (
                          <>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 30,
                                  alignItems: "center",
                                }}
                              >
                                {/* jaminan uang muka */}
                                <p
                                  style={{
                                    width: 150,
                                    margin: 0,
                                  }}
                                >
                                  {data.title}
                                </p>

                                {/* ya / tidak */}
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 14,
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <Field
                                      type="radio"
                                      value="1"
                                      name={data.nameTitle}
                                      onChange={(e) => {
                                        setInputDataGuarantee((state) => {
                                          console.log("masuk update guarantee");
                                          let fieldName = data.nameTitle;
                                          let a = { ...state };
                                          a[fieldName] = e.target.value;
                                          return a;
                                        });
                                      }}
                                    />
                                    <span>Ya</span>
                                  </label>

                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                      columnGap: 8,
                                    }}
                                  >
                                    <Field
                                      type="radio"
                                      value="0"
                                      name={data.nameTitle}
                                      onChange={(e) => {
                                        setInputDataGuarantee((state) => {
                                          console.log("masuk update guarantee");
                                          let fieldName = data.nameTitle;
                                          let a = { ...state };
                                          a[fieldName] = e.target.value;
                                          return a;
                                        });
                                      }}
                                    />
                                    <span>Tidak</span>
                                  </label>
                                </div>
                              </div>

                              {/* tanggal mulai, selesai, evidence */}
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 20,
                                  marginTop: 15,
                                }}
                              >
                                {/* tanggal mulai */}
                                <div className="col-sm-3">
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>Tanggal Mulai</span>
                                    <Field
                                      type="date"
                                      style={{
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      name={data.nameStart}
                                      onChange={(e) => {
                                        setInputDataGuarantee((state) => {
                                          console.log("masuk update guarantee");
                                          let fieldName = data.nameStart;
                                          let a = { ...state };
                                          a[fieldName] = e.target.value;
                                          return a;
                                        });
                                      }}
                                    />
                                  </label>
                                </div>

                                {/* tanggal selesai */}
                                <div className="col-sm-3">
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>Tanggal Selesai</span>
                                    <Field
                                      type="date"
                                      style={{
                                        borderRadius: 4,
                                        padding: "10px 12px",
                                        border: "none",
                                        display: "flex",
                                        flexDirection: "row-reverse",
                                        columnGap: 10,
                                      }}
                                      name={data.nameEnd}
                                      onChange={(e) => {
                                        setInputDataGuarantee((state) => {
                                          console.log("masuk update guarantee");
                                          let fieldName = data.nameEnd;
                                          let a = { ...state };
                                          a[fieldName] = e.target.value;
                                          return a;
                                        });
                                      }}
                                    />
                                  </label>
                                </div>

                                {/* evidence */}
                                <div
                                  className="col-md-5"
                                  style={{
                                    padding: 0,
                                  }}
                                >
                                  <label
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <span>Evidence</span>
                                    <div>
                                      <label
                                        htmlFor="upload"
                                        className={`input-group mb-3 col-sm-12 pointer`}
                                        style={{
                                          padding: 0,
                                        }}
                                      >
                                        <span
                                          className={`form-control text-truncate`}
                                          style={{
                                            backgroundColor: "#e8f4fb",
                                          }}
                                        >
                                          {data.filename}
                                        </span>
                                        <div className="input-group-prepend">
                                          <span
                                            className="input-group-text"
                                            style={{
                                              backgroundColor: "#e8f4fb",
                                            }}
                                          >
                                            <i className="fas fa-file-upload"></i>
                                          </span>
                                        </div>
                                      </label>
                                      <input
                                        type="file"
                                        className="d-none"
                                        name={data.nameEvidence}
                                        // value={data.filename}
                                        filename={data.filename}
                                        id="upload"
                                        style={{
                                          backgroundColor: "#E8F4FB",
                                        }}
                                      />
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>

                    <PerubahanKlausulKontrak
                      subTitle={"B"}
                      title={"Jaminan"}
                      setBodyClauseData={setGuaranteeBodyClauseData}
                      setAttachmentClauseData={setGuaranteeAttachmentClauseData}
                      showAddClause={showAddClause}
                      values={values}
                    />

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* nomor rekening */}
          {currentActiveTab === 6 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  data_bank: accountNumber,
                  body_data: accountNumberBodyClauseData,
                  attachment_data: accountNumberAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  submitFormParameterAccountNumber(values);
                  console.log("values account number", values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        border: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        padding: 28,
                        borderRadius: 14,
                        marginBottom: 40,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 24,
                        }}
                      >
                        <div>
                          <h1
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              marginBottom: 14,
                            }}
                          >
                            Nomor rekening kontrak awal
                          </h1>

                          {accountNumberBankData &&
                            accountNumberBankData.map((item) => {
                              return (
                                <div
                                  style={{
                                    // display: 'grid',
                                    // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 24,
                                    fontSize: 14,
                                    fontWeight: 500,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      flex: 1,
                                    }}
                                  >
                                    <span>Nomor rekening</span>
                                    <input
                                      type="text"
                                      style={{
                                        width: "100%",
                                        backgroundColor: "#e8f4fb",
                                        padding: "10px 12px",
                                        borderColor: "black",
                                        border: 1,
                                        borderStyle: "solid",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        marginTop: 4,
                                      }}
                                      disabled
                                      value={item?.account_number}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      flex: 1,
                                    }}
                                  >
                                    <span>Nama rekening</span>
                                    <input
                                      type="text"
                                      style={{
                                        width: "100%",
                                        backgroundColor: "#e8f4fb",
                                        padding: "10px 12px",
                                        borderColor: "black",
                                        border: 1,
                                        borderStyle: "solid",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        marginTop: 4,
                                      }}
                                      disabled
                                      value={item?.account_holder_name}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      flex: 1,
                                    }}
                                  >
                                    <span>Nama bank</span>
                                    <input
                                      type="text"
                                      style={{
                                        width: "100%",
                                        backgroundColor: "#e8f4fb",
                                        padding: "10px 12px",
                                        borderColor: "black",
                                        border: 1,
                                        borderStyle: "solid",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        marginTop: 4,
                                      }}
                                      disabled
                                      value={item?.bank?.full_name}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      flex: 1,
                                    }}
                                  >
                                    <span>Alamat bank</span>
                                    <input
                                      type="text"
                                      style={{
                                        width: "100%",
                                        backgroundColor: "#e8f4fb",
                                        padding: "10px 12px",
                                        borderColor: "black",
                                        border: 1,
                                        borderStyle: "solid",
                                        borderRadius: 4,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        marginTop: 4,
                                      }}
                                      disabled
                                      value={item?.address?.postal_address}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        <div>
                          <h1
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              marginBottom: 14,
                            }}
                          >
                            A. Addendum nomor rekening
                          </h1>

                          <div
                            style={{
                              // display: 'grid',
                              // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 24,
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Nomor rekening</span>
                              <ReactSelect
                                data={jsonData?.data_bank}
                                func={changeDataBankIndex}
                                labelName={`account_number`}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Nama rekening</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  padding: "10px 12px",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={
                                  jsonData?.data_bank[bankIndex]
                                    ?.account_holder_name
                                }
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Nama bank</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  padding: "10px 12px",

                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={
                                  jsonData?.data_bank[bankIndex]?.bank.full_name
                                }
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                              }}
                            >
                              <span>Alamat bank</span>
                              <input
                                type="text"
                                style={{
                                  width: "100%",
                                  padding: "10px 12px",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                disabled
                                value={
                                  jsonData?.data_bank[bankIndex]?.address
                                    ?.postal_address
                                }
                              />
                            </div>
                          </div>
                        </div>

                        {/* surat pernyataan dari bank */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: 24,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                              }}
                            >
                              Surat pernyataan dari bank
                            </span>
                            <div
                              style={{
                                position: "relative",
                                padding: 0,
                                margin: 0,
                              }}
                            >
                              <input
                                style={{
                                  width: "100%",
                                  padding: "10px 12px 10px 46px",
                                  color: "#3699ff",
                                  borderColor: "black",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderRadius: 4,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  marginTop: 4,
                                }}
                                type="text"
                                value={`surat_pernyataan_bank_bca.pdf`}
                                disabled
                              />
                              <SVG
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  bottom: 0,
                                  left: 12,
                                  margin: "auto 0",
                                  // width:10,
                                  // height:10
                                }}
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/All/upload.svg"
                                )}
                              />
                            </div>

                            {/* <div>
                                                        <label
                                                            htmlFor="upload"
                                                            className={`input-group mb-3 col-sm-3 pointer`}
                                                            style={{
                                                                padding: 0
                                                            }}
                                                        >
                                                            <span
                                                                            className={`form-control text-truncate`} 
                                                                            style={{
                                                                                backgroundColor: '#e8f4fb'
                                                                            }}
                                                                            >
                                                                            nama_file_upload.pdf
                                                            </span>
                                                            <div 
                                                                                className="input-group-prepend"
                                                                            >
                                                                                <span className="input-group-text"
                                                                                    style={{
                                                                                        backgroundColor: '#e8f4fb'
                                                                                    }}    
                                                                                >
                                                                                <i className="fas fa-file-upload"></i>
                                                                                </span>
                                                            </div>
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="d-none"
                                                            id="upload"
                                                            style={{
                                                                backgroundColor: '#E8F4FB'
                                                            }}
                                                        />
                                                    </div> */}
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>

                    <PerubahanKlausulKontrak
                      subTitle={"B"}
                      title={"Nomor Rekening"}
                      setBodyClauseData={setAccountNumberBodyClauseData}
                      setAttachmentClauseData={
                        setAccountNumberAttachmentClauseData
                      }
                      showAddClause={showAddClause}
                      values={values}
                    />

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* lainnya */}
          {currentActiveTab === 7 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  body_data: otherBodyClauseData,
                  attachment_data: otherAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  submitFormParameterOther(values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <PerubahanKlausulKontrak
                      subTitle={"A"}
                      title={"Lainnya"}
                      setBodyClauseData={setOtherBodyClauseData}
                      setAttachmentClauseData={setOtherAttachmentClauseData}
                      showAddClause={showAddClause}
                      values={values}
                    />

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

const keys = {
  fetch: "get-data-penalties",
};

const mapState = (state) => ({
  loadings: {
    fetch: getLoading(state, keys.fetch),
  },
  status: state.auth.user.data.status,
});

const mapDispatch = {
  fetch_api_sg,
};

export default connect(mapState, mapDispatch)(FormParameter);
