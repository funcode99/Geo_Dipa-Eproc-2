import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody } from "_metronic/_partials/controls";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "_metronic/_helpers/index";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton";
import { rupiah } from "app/libs/currency";

import ButtonAction from "app/components/buttonAction/ButtonAction";
import DialogGlobal from "app/components/modals/DialogGlobal";

import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import EditableTable from "./Components/EditableTable";

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
  submitParties,
  submitJobPrice,
  submitTimePeriod,
  submitPaymentMethod,
  submitFine,
  submitGuarantee,
  submitAccountNumber,
  submitOther,
} from "app/modules/AddendumContract/service/DeliveryMonitoringCrud";

const createNewPlaceman = (
  name,
  fullname,
  position,
  address,
  phone_number,
  fax
) => ({
  name,
  fullname,
  position,
  address,
  phone_number,
  fax,
});

const createNewPaymentStage = (description, percentage) => ({
  description,
  percentage,
});

const guaranteeBeforeAddendum = [
  {
    title: "Jaminan Uang Muka",
    startDate: "2023-09-19",
    endDate: "2023-10-29",
    filename: "bla_blah.pdf",
    radio: "yes",
    nameTitle: "dp_guarantee",
    nameStart: "dp_guarantee_start_date",
    nameEnd: "dp_guarantee_end_date",
    nameEvidence: "dp_guarantee_evidence_file",
  },
  {
    title: "Jaminan Pelaksanaan",
    startDate: "2023-09-19",
    endDate: "2023-10-29",
    filename: "secret.docx",
    radio: "no",
    nameTitle: "implementation_guarantee",
    nameStart: "implementation_guarantee_start_date",
    nameEnd: "implementation_guarantee_end_date",
    nameEvidence: "implementation_guarantee_evidence_file",
  },
  {
    title: "Jaminan Pemeliharaan",
    startDate: "2023-09-19",
    endDate: "2023-10-29",
    filename: "another_file.xlsx",
    radio: "yes",
    nameTitle: "maintenance_guarantee",
    nameStart: "maintenance_guarantee_start_date",
    nameEnd: "maintenance_guarantee_end_date",
    nameEvidence: "maintenance_guarantee_evidence_file",
  },
];

const actionButton = (
  <ButtonAction
    style={{
      backgroundColor: "#e8f4fb",
    }}
    hoverLabel="More"
    data={"1"}
    ops={[
      {
        label: "Edit",
      },
      {
        label: "Hapus",
      },
    ]}
  />
);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, "Keterlambatan Pekerjaan", 10, 30, "%"),
  createData(2, "Keterlambatan Pekerjaan", 15, 60, "%"),
];

const FormParameter = ({
  currentActiveTab,
  fetch_api_sg,
  headerData,
  jsonData,
  authorizedOfficial,
  secondAuthorizedOfficial,
  jobDirector,
  jobSupervisor,
  PICData,
  timePeriodData,
}) => {
  // console.log("isi pihak kedua", secondAuthorizedOfficial);
  // console.log("isi auth official", authorizedOfficial);
  // console.log("isi direksi pekerjaan", jobDirector);
  // console.log("isi pengawas pekerjaan", jobSupervisor);
  // console.log("isi jsonData", jsonData);

  const countdownMonths = (start, end) => {
    let endDate = moment(end);
    const timeBetween = moment.duration(endDate.diff(start));
    return (
      <>
        <p className="counter">
          <span>
            {isNaN(timeBetween.months()) ? "X" : timeBetween.months()} Bulan{" "}
          </span>
          <span>
            {isNaN(timeBetween.days()) ? "X" : timeBetween.days()} Hari{" "}
          </span>
        </p>
      </>
    );
  };

  const timePeriodBeforeAddendum = [
    {
      title: "Jangka Waktu Perjanjian",
      startDate: timePeriodData?.from_time,
      endDate: timePeriodData?.from_time,
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
      prefix: "worked",
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
      endDate: timePeriodData?.from_time,
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
      prefix: "worked",
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
  const [secondAuthorizedIndex, setSecondAuthorizedIndex] = useState(0);
  const [authorizedOfficialIndex, setauthorizedOfficialIndex] = useState(0);
  const [jobDirectorIndex, setJobDirectorIndex] = useState(0);
  const [jobSupervisorIndex, setJobSupervisorIndex] = useState(0);
  const changeDataBankIndex = (num) => {
    setBankIndex(num);
    setAccountNumber(jsonData?.data_bank[num]);
  };
  const changeDataSecondaAuthorizedOfficial = (num) => {
    setSecondAuthorizedIndex(num);
  };
  const changeDataauthorizedOfficial = (num) => {
    setauthorizedOfficialIndex(num);
  };
  const changeDataJobDirector = (num) => {
    setJobDirectorIndex(num);
  };
  const changeDataJobSupervisor = (num) => {
    setJobSupervisorIndex(num);
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

  const [partiesBodyClauseData, setPartiesBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    partiesInitialAttachmentClauseData,
    setPartiesInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [
    partiesAttachmentClauseData,
    setPartiesAttachmentClauseData,
  ] = useState([]);

  const [jobPriceBodyClauseData, setJobPriceBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    jobPriceInitialAttachmentClauseData,
    setJobPriceInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [
    jobPriceAttachmentClauseData,
    setJobPriceAttachmentClauseData,
  ] = useState([]);

  const [timePeriodBodyClauseData, setTimePeriodBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    timePeriodInitialAttachmentClauseData,
    setTimePeriodInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [
    timePeriodAttachmentClauseData,
    setTimePeriodAttachmentClauseData,
  ] = useState([]);

  const [
    paymentMethodBodyClauseData,
    setPaymentMethodBodyClauseData,
  ] = useState(bodyClauseDataTemplate);
  const [
    paymentMethodInitialAttachmentClauseData,
    setPaymentMethodInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [
    paymentMethodAttachmentClauseData,
    setPaymentMethodAttachmentClauseData,
  ] = useState([]);

  const [fineBodyClauseData, setFineBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    fineInitialAttachmentClauseData,
    setFineInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [fineAttachmentClauseData, setFineAttachmentClauseData] = useState([]);

  const [guaranteeBodyClauseData, setGuaranteeBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    guaranteeInitialAttachmentClauseData,
    setGuaranteeInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [
    guaranteeAttachmentClauseData,
    setGuaranteeAttachmentClauseData,
  ] = useState([]);

  const [
    accountNumberBodyClauseData,
    setAccountNumberBodyClauseData,
  ] = useState(bodyClauseDataTemplate);
  const [
    accountNumberInitialAttachmentClauseData,
    setAccountNumberInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [
    accountNumberAttachmentClauseData,
    setAccountNumberAttachmentClauseData,
  ] = useState([]);

  const [otherBodyClauseData, setOtherBodyClauseData] = useState(
    bodyClauseDataTemplate
  );
  const [
    otherInitialAttachmentClauseData,
    setOtherInitialAttachmentClauseData,
  ] = useState(attachmentClauseDataTemplate);
  const [otherAttachmentClauseData, setOtherAttachmentClauseData] = useState(
    []
  );

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

  // bikin converter tanggal ke x hari & y bulan + skpp/spmk
  const submitFormParameterTimePeriod = (values) => {
    submitTimePeriod(
      {
        add_contract_id: jsonData?.add_contracts[0]?.id,
        from_time: values?.contract_start_date,
        thru_time: values?.contract_end_date,
        worked_start_date: values?.worked_start_date,
        worked_end_date: values?.worked_end_date,
        guarantee_start_date: values?.guarantee_start_date,
        guarantee_end_date: values?.guarantee_end_date,
        maintenance_start_date: values?.maintenance_start_date,
        maintenance_end_date: values?.maintenance_end_date,
        add_contract_periode_range_month: "6",
        add_contract_periode_range_day: "123",
        add_work_implement_period_month: "6",
        add_work_implement_period_day: "123",
        add_guarantee_period_month: "6",
        add_guarantee_period_day: "123",
        add_maintenance_period_month: "6",
        add_maintenance_period_day: "123",
        add_contract_period_type: "SKPP",
        add_work_period_type: "SPMK",
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
        add_contract_id: jsonData?.add_contracts[0]?.id,
        payment_method_name: values.payment_method,
        payment_method_data: values.payment_data,
        // kalo full payment method data nya gak perlu di kirim kan?
        // payment_method_data: {
        //   payment_name: "tahap 1",
        //   percentage_value: 10,
        //   description: "ini deskripsi",
        // },
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
        add_contract_id: jsonData?.add_contracts[0]?.id,
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
        add_contract_id: jsonData?.add_contracts[0]?.id,
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
        add_contract_id: jsonData?.add_contracts[0]?.id,
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
        add_contract_id: jsonData?.add_contracts[0]?.id,
        body_clause_data: [values.body_data],
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };

  const [addendumRows, setAddendumRows] = useState([
    createData(1, "Keterlambatan Pekerjaan", 10, 30, "%"),
  ]);
  // console.log('tab yang aktif sekarang', currentActiveTab)
  console.log("isi jsonData", jsonData);

  const { contract_id } = useParams();
  const [dataArr, setDataArr] = useState([]);
  const [dataArrFine, setDataArrFine] = useState([]);
  const [currencies, setDataCurrencies] = useState([]);
  const [placeman, setPlaceman] = useState({
    initialWorkDirector: {},
    initialWorkSupervisor: {
      position: "",
      address: "",
      phone: "",
      fax: "",
    },
    initialSecondWorkDirector: {
      position: "",
      address: "",
      phone: "",
      fax: "",
    },
    initialSecondWorkSupervisor: {
      position: "",
      address: "",
      phone: "",
      fax: "",
    },
    workDirector: [],
    workSupervisor: [],
    secondWorkDirector: [],
    secondWorkSupervisor: [],
  });

  useEffect(() => {
    console.log("placeman sekarang", placeman.workSupervisor);
  }, [placeman]);
  const [stagePayment, setStagePayment] = useState({
    payment: [],
  });
  const [earlyStagePayment, setEarlyStagePayment] = useState(
    jsonData?.payment_method_data
    // [
    // {
    //   payment_stage: "Tahap 1",
    //   percentage_value: 50,
    //   description: "ini deskripsi tahap 1",
    // },
    // {
    //   payment_stage: "Tahap 2",
    //   percentage_value: 50,
    //   description: "ini deskripsi tahap 2",
    // },
    // ]
  );
  const [fine, setFine] = useState([]);
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

  const [addendumPaymentMethod, setAddendumPaymentMethod] = useState("Full");

  const openCloseAddFine = React.useRef();
  const showAddFine = () => {
    openCloseAddFine.current.open();
  };

  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };

  const openCloseAddDetail = React.useRef();
  const showAddDetail = () => {
    openCloseAddDetail.current.open();
  };

  const openCloseAddPayment = React.useRef();
  const showAddPayment = () => {
    openCloseAddPayment.current.open();
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

  return (
    <>
      {/* modal tambah supervisor pekerjaan */}
      <DialogGlobal
        ref={openCloseWorkSupervisor}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
        // onYes={() => {
        //   setPlaceman((placeman) => {
        //     return {
        //       ...placeman,
        //       workSupervisor: [
        //         ...placeman.workSupervisor,
        //         createNewPlaceman(
        //           "",
        //           "",
        //           "EA",
        //           jobSupervisor[jobSupervisorIndex]?.address,
        //           jobSupervisor[jobSupervisorIndex]?.phone,
        //           jobSupervisor[jobSupervisorIndex]?.fax
        //         ),
        //       ],
        //     };
        //   });
        // }}
      >
        <Formik
          initialValues={{
            position: "",
          }}
          onSubmit={(values) => {
            setPlaceman((placeman) => {
              return {
                ...placeman,
                workSupervisor: [
                  ...placeman.workSupervisor,
                  createNewPlaceman(
                    "",
                    "",
                    values?.position,
                    jobSupervisor[jobSupervisorIndex]?.address,
                    jobSupervisor[jobSupervisorIndex]?.phone,
                    jobSupervisor[jobSupervisorIndex]?.fax
                  ),
                ],
              };
            });
            openCloseWorkSupervisor.current.close();
          }}
        >
          {() => (
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
                    Tambah Pengawas Pekerjaan
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
                      <span>Jabatan</span>
                      <Field
                        type="text"
                        name="position"
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
                      <span>Alamat</span>
                      <ReactSelect
                        data={jobSupervisor}
                        func={changeDataJobSupervisor}
                        labelName={"address"}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <span>Telp</span>
                      <input
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        value={
                          jobSupervisor
                            ? jobSupervisor[jobSupervisorIndex]?.phone
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
                      <span>Fax</span>
                      <input
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          opacity: 0.8,
                        }}
                        value={
                          jobSupervisor
                            ? jobSupervisor[jobSupervisorIndex]?.fax
                            : null
                        }
                        disabled
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
            </>
          )}
        </Formik>
      </DialogGlobal>

      {/* modal tambah direksi pekerjaan */}
      <DialogGlobal
        ref={openCloseWorkDirector}
        isCancel={false}
        onYes={() => {
          setPlaceman((placeman) => {
            console.log("jobDirectorIndex", jobDirectorIndex);

            return {
              ...placeman,
              workDirector: [
                ...placeman.workDirector,
                createNewPlaceman(
                  jobDirector ? jobDirector[jobDirectorIndex]?.username : null,
                  jobDirector ? jobDirector[jobDirectorIndex]?.full_name : null,
                  jobDirector
                    ? jobDirector[jobDirectorIndex]?.position_name
                    : null,
                  jobSupervisor
                    ? jobSupervisor[jobSupervisorIndex]?.address
                    : null,
                  jobSupervisor
                    ? jobSupervisor[jobSupervisorIndex]?.phone
                    : null,
                  jobSupervisor ? jobSupervisor[jobSupervisorIndex]?.fax : null
                ),
              ],
            };
          });
        }}
      >
        <Formik></Formik>
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
            Tambah Direksi Pekerjaan
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
              <span>Username</span>
              <ReactSelect
                data={jobDirector}
                func={changeDataJobDirector}
                labelName={`username`}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <span>Nama Lengkap</span>
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                  backgroundColor: "#e8f4fb",
                }}
                value={
                  jobDirector ? jobDirector[jobDirectorIndex]?.full_name : null
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
              <input
                style={{
                  padding: 8,
                  borderRadius: 4,
                  border: 1,
                  borderStyle: "solid",
                  borderColor: "#8c8a8a",
                  opacity: 0.8,
                  backgroundColor: "#e8f4fb",
                }}
                value={
                  jobDirector
                    ? jobDirector[jobDirectorIndex]?.position_name
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
                <ReactSelect
                  data={jobSupervisor}
                  func={changeDataJobSupervisor}
                  labelName={"address"}
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
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                    backgroundColor: "#e8f4fb",
                  }}
                  value={
                    jobSupervisor
                      ? jobSupervisor[jobSupervisorIndex]?.phone
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
                <span>FAX</span>
                <input
                  type="text"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: 1,
                    borderStyle: "solid",
                    borderColor: "#8c8a8a",
                    opacity: 0.8,
                    backgroundColor: "#e8f4fb",
                  }}
                  value={
                    jobSupervisor
                      ? jobSupervisor[jobSupervisorIndex]?.fax
                      : null
                  }
                  disabled
                />
              </label>
            </div>
          </div>
        </div>
      </DialogGlobal>

      {/* modal tambah pengawas pekerjaan pihak kedua */}
      <DialogGlobal
        ref={openCloseSecondWorkSupervisor}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            position: "",
            address: "",
            phone: "",
            fax: "",
          }}
          onSubmit={(values) => {
            setPlaceman((placeman) => {
              return {
                ...placeman,
                secondWorkSupervisor: [
                  ...placeman.secondWorkSupervisor,
                  createNewPlaceman(
                    "",
                    "",
                    values?.position,
                    values?.address,
                    values?.phone,
                    values?.fax
                  ),
                ],
              };
            });
            openCloseSecondWorkSupervisor.current.close();
          }}
        >
          {() => (
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
                    Tambah Pengawas Pekerjaan Pihak Kedua
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
                        Jabatan
                      </span>
                      <Field
                        type="text"
                        name="position"
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
                        Alamat
                      </span>
                      <Field
                        type="text"
                        name="address"
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
                        Telp
                      </span>
                      <Field
                        type="text"
                        name="phone"
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
                        Fax
                      </span>
                      <Field
                        type="text"
                        name="fax"
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

      {/* modal tambah direksi pekerjaan pihak kedua */}
      <DialogGlobal
        ref={openCloseSecondWorkDirector}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            position: "",
            address: "",
            phone: "",
            fax: "",
          }}
          onSubmit={(values) => {
            setPlaceman((placeman) => {
              return {
                ...placeman,
                secondWorkDirector: [
                  ...placeman.secondWorkDirector,
                  createNewPlaceman(
                    "",
                    "",
                    values?.position,
                    values?.address,
                    values?.phone,
                    values?.fax
                  ),
                ],
              };
            });
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
                    Tambah Direksi Pekerjaan Pihak Kedua
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
                        Jabatan
                      </span>
                      <Field
                        type="text"
                        name="position"
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
                        Alamat
                      </span>
                      <Field
                        type="text"
                        name="address"
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
                        Telp
                      </span>
                      <Field
                        type="text"
                        name="phone"
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
                        Fax
                      </span>
                      <Field
                        type="text"
                        name="fax"
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
            setAddendumRows((data) => {
              return [
                ...data,
                createData(
                  1,
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
                  createNewPaymentStage(values.description, values.percentage),
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

      {/* modal tambah klausul */}
      <DialogGlobal
        ref={openCloseAddClause}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
      >
        <Formik
          initialValues={{
            attachment_number: "",
            clause_note: "",
          }}
          onSubmit={(values) => {
            const doSet = (data) => {
              return [
                ...data,
                {
                  attachment_number: values.attachment_number,
                  clause_note: values.clause_note,
                },
              ];
            };
            if (currentActiveTab === 0) setPartiesAttachmentClauseData(doSet);
            if (currentActiveTab === 1) setJobPriceAttachmentClauseData(doSet);
            if (currentActiveTab === 2)
              setTimePeriodAttachmentClauseData(doSet);
            if (currentActiveTab === 3)
              setPaymentMethodAttachmentClauseData(doSet);
            if (currentActiveTab === 4) setFineAttachmentClauseData(doSet);
            if (currentActiveTab === 5) setGuaranteeAttachmentClauseData(doSet);
            if (currentActiveTab === 6)
              setAccountNumberAttachmentClauseData(doSet);
            if (currentActiveTab === 7) setOtherAttachmentClauseData(doSet);
            openCloseAddClause.current.close();
          }}
        >
          <Form>
            <>
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
                  Tambah klausul lampiran
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
                    <span>Angka Lampiran</span>
                    <Field
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        border: 1,
                        borderStyle: "solid",
                        borderColor: "#8c8a8a",
                        opacity: 0.8,
                      }}
                      name="attachment_number"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <span>Nomor Pasal</span>
                    <Field
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        border: 1,
                        borderStyle: "solid",
                        borderColor: "#8c8a8a",
                        opacity: 0.8,
                      }}
                      name="clause_note"
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
            </>
          </Form>
        </Formik>
      </DialogGlobal>

      <Card>
        <CardBody>
          {/* Para Pihak */}
          {currentActiveTab === 0 && (
            <>
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
                  official_deed_date:
                    inputAuthorizedOfficial.official_deed_date,
                  official_sk_kemenkumham_no:
                    inputAuthorizedOfficial.official_sk_kemenkumham_no,
                  official_sk_kemenkumham_date:
                    inputAuthorizedOfficial.official_sk_kemenkumham_date,
                  body_data: partiesBodyClauseData,
                  initial_attachment_data: partiesInitialAttachmentClauseData,
                  attachment_data: partiesAttachmentClauseData,
                  initialJobDirector: placeman.initialWorkDirector,
                  initialJobSupervisor: placeman.initialWorkSupervisor,
                  jobDirector: placeman.workDirector,
                  jobSupervisor: placeman.workSupervisor,
                  initialSecondJobDirector: placeman.initialSecondWorkDirector,
                  initialSecondJobSupervisor:
                    placeman.initialSecondWorkSupervisor,
                  secondJobDirector: placeman.secondWorkDirector,
                  secondJobSupervisor: placeman.secondWorkSupervisor,
                }}
                onSubmit={(values) => {
                  values.attachment_data.unshift(
                    values.initial_attachment_data
                  );
                  console.log("isi values parties", values);
                  // submitFormParameterContractParties(values);
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
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.authorized_official_name
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
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.authorized_official_position
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
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.address
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
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.phone
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
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]?.fax
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
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.assignment_deed_no
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
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.assignment_deed_date
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
                                      ? authorizedOfficial[
                                          authorizedOfficialIndex
                                        ]
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
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.authorized_official_deed_no
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
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]?.authorized_official_deed_date
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
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]
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
                                        ? authorizedOfficial[
                                            authorizedOfficialIndex
                                          ]
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
                                <span>Username</span>
                                <ReactSelect
                                  data={jobDirector}
                                  func={changeDataJobDirector}
                                  labelName={`username`}
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 10,
                                }}
                              >
                                <span>Nama Lengkap</span>
                                <input
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#e8f4fb",
                                  }}
                                  value={
                                    jobDirector
                                      ? jobDirector[jobDirectorIndex]?.full_name
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
                                <input
                                  className="form-control"
                                  style={{
                                    backgroundColor: "#e8f4fb",
                                  }}
                                  value={
                                    jobDirector
                                      ? jobDirector[jobDirectorIndex]
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
                                  <ReactSelect
                                    data={jobSupervisor}
                                    func={changeDataJobSupervisor}
                                    labelName={"address"}
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
                                    className="form-control"
                                    value={
                                      jobSupervisor
                                        ? jobSupervisor[jobSupervisorIndex]
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
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      jobSupervisor
                                        ? jobSupervisor[jobSupervisorIndex]
                                            ?.phone
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

                            {placeman.workDirector &&
                              placeman.workDirector.map((data, index) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 14,
                                    }}
                                  >
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
                                          <span>Username</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setPlaceman((placeman) => {
                                                let data = { ...placeman };
                                                data.workDirector.splice(
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
                                        <input
                                          type="text"
                                          value={data.name}
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
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          disabled
                                          value={
                                            index === 0
                                              ? jobDirector
                                                ? jobDirector[jobDirectorIndex]
                                                    ?.full_name
                                                : null
                                              : data.fullname
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
                                        <span>Jabatan</span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          value={
                                            index === 0
                                              ? jobDirector
                                                ? jobDirector[jobDirectorIndex]
                                                    ?.position_name
                                                : null
                                              : data.position
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
                                        <span>Alamat</span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          value={
                                            index === 0
                                              ? authorizedOfficial
                                                ? authorizedOfficial[
                                                    authorizedOfficialIndex
                                                  ]?.address
                                                : null
                                              : data.address
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
                                        <span>Telp</span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          value={
                                            index === 0
                                              ? authorizedOfficial
                                                ? authorizedOfficial[
                                                    authorizedOfficialIndex
                                                  ]?.phone
                                                : null
                                              : data.phone_number
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
                                        <span>FAX</span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          value={
                                            index === 0
                                              ? authorizedOfficial
                                                ? authorizedOfficial[
                                                    authorizedOfficialIndex
                                                  ]?.fax
                                                : null
                                              : data.fax
                                          }
                                          disabled
                                        />
                                      </label>
                                    </div>
                                  </div>
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
                                  className="form-control"
                                  name="initialJobSupervisor.position"
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
                                <ReactSelect
                                  data={jobSupervisor}
                                  func={changeDataJobSupervisor}
                                  labelName={"address"}
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
                                  className="form-control"
                                  value={
                                    jobSupervisor
                                      ? jobSupervisor[jobSupervisorIndex]?.phone
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
                                  type="text"
                                  className="form-control"
                                  value={
                                    jobSupervisor
                                      ? jobSupervisor[jobSupervisorIndex]?.phone
                                      : null
                                  }
                                  style={{ backgroundColor: "#e8f4fb" }}
                                  disabled
                                />
                              </label>
                            </div>

                            {/* Pengawas Pekerjaan Pihak Pertama */}
                            {placeman.workSupervisor &&
                              placeman.workSupervisor.map((data, index) => {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 14,
                                    }}
                                  >
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
                                                data.workSupervisor.splice(
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
                                        <input
                                          type="text"
                                          value={`${data?.position}`}
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
                                        {/* <ReactSelect
                                                    data={jobSupervisor}
                                                    func={changeDataJobSupervisor}
                                                    labelName={"facility_name"}
                                                  /> */}
                                        <input
                                          type="text"
                                          value={`${data?.address}`}
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
                                          // value={
                                          //   jobSupervisor && data
                                          //     ? jobSupervisor[
                                          //         jobSupervisorIndex
                                          //       ]?.phone
                                          //     : null
                                          // }
                                          value={data?.phone_number}
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
                                          // value={
                                          //   jobSupervisor && data
                                          //     ? jobSupervisor[
                                          //         jobSupervisorIndex
                                          //       ]?.fax
                                          //     : null
                                          // }
                                          value={data?.fax}
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          disabled
                                        />
                                      </label>
                                    </div>
                                  </div>
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
                                <ReactSelect
                                  data={secondAuthorizedOfficial}
                                  func={changeDataSecondaAuthorizedOfficial}
                                  labelName={`full_name`}
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
                                    secondAuthorizedOfficial
                                      ? secondAuthorizedOfficial[
                                          secondAuthorizedIndex
                                        ].position_title
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
                                <input className="form-control" type="text" />
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
                                  disabled
                                  value={
                                    secondAuthorizedOfficial
                                      ? secondAuthorizedOfficial[
                                          secondAuthorizedIndex
                                        ].phone_number
                                      : null
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
                                <input className="form-control" type="text" />
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
                                  <input type="text" className="form-control" />
                                  -
                                  <input
                                    type="date"
                                    // defaultValue={"2022-03-25"}
                                    className="form-control"
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
                                <input type="text" className="form-control" />
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
                                  <input type="text" className="form-control" />
                                  -
                                  <input
                                    type="date"
                                    // defaultValue={"2022-03-25"}
                                    className="form-control"
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
                                  <input type="text" className="form-control" />
                                  -
                                  <input
                                    type="date"
                                    // defaultValue={"2022-03-25"}
                                    className="form-control"
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
                                <ReactSelect
                                  data={PICData}
                                  func={changeDataSecondaAuthorizedOfficial}
                                  labelName={`email`}
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
                            {/* addendum direksi pekerjaan pihak kedua */}
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkDirector: {
                                        ...placeman.initialSecondWorkDirector,
                                        position: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobDirector.position`}
                                  type="text"
                                  className="form-control"
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkDirector: {
                                        ...placeman.initialSecondWorkDirector,
                                        address: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobDirector.address`}
                                  className="form-control"
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkDirector: {
                                        ...placeman.initialSecondWorkDirector,
                                        phone: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobDirector.phone`}
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkDirector: {
                                        ...placeman.initialSecondWorkDirector,
                                        fax: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobDirector.fax`}
                                />
                              </label>
                            </div>

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
                                          height: 65.5,
                                        }}
                                      >
                                        {/* <span>Jabatan</span> */}
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
                                        <input
                                          type="text"
                                          value={`${item.position}`}
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
                                          value={`${item.address}`}
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
                                          value={`${item.phone_number}`}
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
                                          value={`${item.fax}`}
                                          className="form-control"
                                          style={{ backgroundColor: "#e8f4fb" }}
                                          disabled
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
                                  className="form-control"
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkSupervisor: {
                                        ...placeman.initialSecondWorkSupervisor,
                                        position: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobSupervisor.position`}
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkSupervisor: {
                                        ...placeman.initialSecondWorkSupervisor,
                                        address: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobSupervisor.address`}
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkSupervisor: {
                                        ...placeman.initialSecondWorkSupervisor,
                                        phone: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobSupervisor.phone`}
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
                                  onChange={(e) =>
                                    setPlaceman((placeman) => ({
                                      ...placeman,
                                      initialSecondWorkSupervisor: {
                                        ...placeman.initialSecondWorkSupervisor,
                                        fax: e.target.value,
                                      },
                                    }))
                                  }
                                  name={`initialSecondJobSupervisor.fax`}
                                />
                              </label>
                            </div>

                            {placeman.secondWorkSupervisor &&
                              placeman.secondWorkSupervisor.map(
                                (item, index) => {
                                  return (
                                    <>
                                      <div>
                                        <label
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            rowGap: 4,
                                            height: 65.5,
                                          }}
                                        >
                                          {/* <span>Jabatan</span> */}
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
                                          <input
                                            type="text"
                                            value={`${item.position}`}
                                            className="form-control"
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
                                          <span>Alamat</span>
                                          <input
                                            type="text"
                                            value={`${item.address}`}
                                            className="form-control"
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
                                          <span>Telp</span>
                                          <input
                                            type="text"
                                            value={`${item.phone_number}`}
                                            className="form-control"
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
                                          <input
                                            type="text"
                                            value={`${item.fax}`}
                                            className="form-control"
                                            style={{
                                              backgroundColor: "#e8f4fb",
                                            }}
                                            disabled
                                          />
                                        </label>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <PerubahanKlausulKontrak
                      subTitle={"C"}
                      title={"Para Pihak"}
                      setBodyClauseData={setPartiesBodyClauseData}
                      setInitialAttachmentClauseData={
                        setPartiesInitialAttachmentClauseData
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

          {/* Harga Pekerjaan */}
          {currentActiveTab === 1 && (
            <>
              <Formik
                initialValues={{
                  body_data: jobPriceBodyClauseData,
                  initial_attachment_data: jobPriceInitialAttachmentClauseData,
                  attachment_data: jobPriceAttachmentClauseData,
                }}
              >
                {({ values }) => (
                  <Form>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 40,
                      }}
                    >
                      {/* Rincian Harga Pekerjaan */}
                      <div
                        className="job-price-section"
                        style={{
                          padding: 28,
                          borderRadius: 14,
                          border: 1,
                          borderStyle: "solid",
                          borderColor: "#8c8a8a",
                          display: "flex",
                          flexDirection: "column",
                          gap: 28,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 28,
                            flexWrap: "wrap",
                          }}
                        >
                          <label
                            style={{
                              flex: 1,
                            }}
                          >
                            <p
                              style={{
                                marginBottom: 14,
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              Nilai perjanjian kontrak awal
                            </p>
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                              }}
                            >
                              <select
                                style={{
                                  borderRadius: 4,
                                  padding: "10px 12px",
                                }}
                                disabled
                              >
                                {currencies?.count?.map((item) => {
                                  return (
                                    <option
                                      selected={
                                        item.code === headerData?.currency
                                      }
                                    >
                                      {item.code}
                                    </option>
                                  );
                                })}
                              </select>
                              <input
                                className="form-control"
                                type="text"
                                style={{
                                  width: "100%",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderColor: "#d1d1d1",
                                  backgroundColor: "#e8f4fb",
                                }}
                                value={rupiah(
                                  headerData?.initial_contract_value
                                )}
                                disabled
                              />
                            </div>
                          </label>

                          <label
                            style={{
                              flex: 1,
                            }}
                          >
                            <p
                              style={{
                                marginBottom: 14,
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              A. Nilai perjanjian setelah addendum
                            </p>
                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                              }}
                            >
                              <select
                                style={{
                                  borderRadius: 4,
                                  padding: "10px 12px",
                                }}
                              >
                                {currencies.count.map((item) => {
                                  return <option>{item.code}</option>;
                                })}
                              </select>
                              <input
                                className="form-control"
                                type="text"
                                style={{
                                  width: "100%",
                                  border: 1,
                                  borderStyle: "solid",
                                  borderColor: "#d1d1d1",
                                }}
                              />
                            </div>
                          </label>
                        </div>

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
                            }}
                          >
                            Rincian harga pekerjaan awal
                          </h1>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">No</TableCell>
                                <TableCell align="left">
                                  Deskripsi Item
                                </TableCell>
                                <TableCell align="left">QTY</TableCell>
                                <TableCell align="left">Satuan</TableCell>
                                <TableCell align="left">Harga Satuan</TableCell>
                                <TableCell align="left">Harga Total</TableCell>
                                <TableCell align="left">Keterangan</TableCell>
                              </TableRow>
                            </TableBody>
                            <TableBody>
                              {jsonData?.contract_items?.map((row, index) => (
                                <TableRow
                                  key={row.product_name}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="l">{index + 1}</TableCell>
                                  <TableCell align="left">
                                    {row.product_name}
                                  </TableCell>
                                  <TableCell align="left">{row.qty}</TableCell>
                                  <TableCell align="left">{row.uom}</TableCell>
                                  <TableCell align="left">
                                    {row.unit_price}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.subtotal}
                                  </TableCell>
                                  <TableCell align="left">{row.note}</TableCell>
                                </TableRow>
                              ))}
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
                            }}
                          >
                            <h1
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              Rincian harga PO-SAP
                            </h1>

                            <div>
                              <button
                                style={{
                                  color: "white",
                                  backgroundColor: "#ffc045",
                                  borderRadius: 8,
                                  border: "none",
                                  padding: "8px 14px",
                                }}
                              >
                                Get PO-SAP
                              </button>
                            </div>
                          </div>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">No</TableCell>
                                <TableCell align="left">
                                  Deskripsi Item
                                </TableCell>
                                <TableCell align="left">QTY</TableCell>
                                <TableCell align="left">Satuan</TableCell>
                                <TableCell align="left">Harga Satuan</TableCell>
                                <TableCell align="left">Harga Total</TableCell>
                                <TableCell align="left">Keterangan</TableCell>
                              </TableRow>
                            </TableBody>
                            <TableBody>
                              {rows.map((row) => (
                                <TableRow
                                  key={row.name}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th">
                                    {row.name}
                                  </TableCell>
                                  <TableCell align="left" scope="row">
                                    {row.calories}
                                  </TableCell>
                                  <TableCell align="left">{row.fat}</TableCell>
                                  <TableCell align="left">
                                    {row.carbs}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.protein}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <TableContainer>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h1
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              B. Addendum Rincian Harga Pekerjaan
                            </h1>
                            <div
                              style={{
                                display: "flex",
                                gap: 14,
                              }}
                            >
                              <button className="btn btn-success text-white">
                                + Harga Pekerjaan By Excel
                              </button>
                              <button
                                className="btn btn-primary text-white"
                                onClick={showAddDetail}
                              >
                                + Tambah Rincian
                              </button>
                            </div>
                          </div>

                          <EditableTable
                            openCloseAddDetail={openCloseAddDetail}
                          />
                        </TableContainer>
                      </div>

                      <PerubahanKlausulKontrak
                        subTitle={"C"}
                        title={"Harga Pekerjaan"}
                        setBodyClauseData={setJobPriceBodyClauseData}
                        setInitialAttachmentClauseData={
                          setJobPriceInitialAttachmentClauseData
                        }
                        showAddClause={showAddClause}
                        values={values}
                      />
                    </div>

                    <UpdateButton />
                  </Form>
                )}
              </Formik>
            </>
          )}

          {/* Jangka Waktu */}
          {currentActiveTab === 2 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  contract_start_date: "",
                  contract_end_date: "",
                  worked_start_date: "",
                  worked_end_date: "",
                  guarantee_start_date: "",
                  guarantee_end_date: "",
                  maintenance_start_date: "",
                  maintenance_end_date: "",
                  contract_range_month: "",
                  contract_range_day: "",
                  work_range_month: "",
                  work_range_day: "",
                  guarantee_range_month: "",
                  guarantee_range_day: "",
                  maintenance_range_month: "",
                  maintenance_range_day: "",
                  body_data: timePeriodBodyClauseData,
                  initial_attachment_data: timePeriodInitialAttachmentClauseData,
                  attachment_data: timePeriodAttachmentClauseData,
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
                                      : "X"}{" "}
                                    Bulan{" "}
                                    {data.calendarDay !== null
                                      ? data.calendarDay
                                      : "X"}{" "}
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
                                        //
                                        value={
                                          data.title ===
                                            "Jangka Waktu Perjanjian" ||
                                          data.title ===
                                            "Jangka Waktu Pelaksanaan Pekerjaan"
                                            ? data.startDate
                                            : null
                                        }
                                        disabled={
                                          data.title ===
                                            "Jangka Waktu Perjanjian" ||
                                          data.title ===
                                            "Jangka Waktu Pelaksanaan Pekerjaan"
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
                                      <span></span>

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
                                        onChange={(e) =>
                                          setTimePeriodAddendum((prev) => {
                                            let newArr = [...prev];
                                            newArr[index].endDate =
                                              e.target.value;
                                            return newArr;
                                          })
                                        }
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
                                        name={`${index + 1}`}
                                        value={"SKPP"}
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
                                        name={`${index + 1}`}
                                        value={"SPMK"}
                                      />
                                      <span>SPMK</span>
                                    </label>
                                  </div>
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
                      setInitialAttachmentClauseData={
                        setTimePeriodInitialAttachmentClauseData
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
                  early_payment_data: earlyStagePayment,
                  payment_data: stagePayment.payment,
                  body_data: paymentMethodBodyClauseData,
                  initial_attachment_data: paymentMethodInitialAttachmentClauseData,
                  attachment_data: paymentMethodAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  values.early_payment_data.map((item, index) => {
                    values.payment_data.unshift(
                      values.early_payment_data[index]
                    );
                  });
                  values.payment_data.reverse();
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
                        {jsonData?.payment_method_data &&
                          jsonData?.payment_method_data.map((item) => {
                            return (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    columnGap: 10,
                                    placeItems: "center",
                                    marginTop: 28,
                                    marginBottom: 14,
                                  }}
                                >
                                  Tahap {item?.payment}
                                  <input
                                    style={{
                                      flex: 1,
                                      // maxWidth: 500,
                                      padding: "10px 12px",
                                      borderRadius: 4,
                                    }}
                                    type="text"
                                    placeholder="Persentase"
                                    value={item?.percentage}
                                    disabled={
                                      addendumPaymentMethod !== "gradual"
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
                                      // maxWidth: 500,
                                      padding: "10px 12px",
                                      borderRadius: 4,
                                    }}
                                    placeholder="Deskripsi"
                                    value={item?.value}
                                    disabled={
                                      addendumPaymentMethod !== "gradual"
                                    }
                                  ></textarea>
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
                        {earlyStagePayment.map((item) => {
                          return (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  columnGap: 10,
                                  placeItems: "center",
                                  marginTop: 28,
                                  marginBottom: 14,
                                }}
                              >
                                Tahap {item.payment}
                                <input
                                  style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 4,
                                  }}
                                  type="text"
                                  placeholder="Persentase"
                                  value={item.percentage}
                                  disabled={addendumPaymentMethod !== "gradual"}
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
                                  disabled={addendumPaymentMethod !== "gradual"}
                                ></textarea>
                              </div>
                            </>
                          );
                        })}
                        {stagePayment?.payment?.map((item, index) => {
                          return (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  columnGap: 10,
                                  placeItems: "center",
                                  marginTop: "28px",
                                  marginBottom: "14px",
                                }}
                              >
                                Tahap {index + 3}
                                <input
                                  style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 4,
                                  }}
                                  type="text"
                                  placeholder="Persentase"
                                  value={item.percentage}
                                  disabled={addendumPaymentMethod !== "gradual"}
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
                                  value={item.description}
                                  disabled={addendumPaymentMethod !== "gradual"}
                                ></textarea>
                              </div>
                            </>
                          );
                        })}
                        {addendumPaymentMethod === "gradual" && (
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
                      setInitialAttachmentClauseData={
                        setPaymentMethodInitialAttachmentClauseData
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
                  fine_data: addendumRows,
                  body_data: fineBodyClauseData,
                  initial_attachment_data: fineInitialAttachmentClauseData,
                  attachment_data: fineAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  values.attachment_data.unshift(
                    values.initial_attachment_data
                  );
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
                                      {data.nilai}
                                    </TableCell>
                                    <TableCell align="left">
                                      {data.max_day}
                                    </TableCell>
                                    <TableCell align="left">
                                      {data.type_nilai}
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
                              {addendumRows.map((row, index) => (
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
                                    {row.calories}
                                  </TableCell>
                                  <TableCell align="left">{row.fat}</TableCell>
                                  <TableCell align="left">
                                    {row.carbs}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.protein}
                                  </TableCell>
                                  <TableCell align="left">
                                    {actionButton}
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
                      setInitialAttachmentClauseData={
                        setFineInitialAttachmentClauseData
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
                  initial_attachment_data: guaranteeInitialAttachmentClauseData,
                  attachment_data: guaranteeAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  values.attachment_data.unshift(
                    values.initial_attachment_data
                  );
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
                                      checked={data.radio === "yes"}
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
                                      checked={data.radio === "no"}
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
                      setInitialAttachmentClauseData={
                        setGuaranteeInitialAttachmentClauseData
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

          {/* nomor rekening */}
          {currentActiveTab === 6 && (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  data_bank: accountNumber,
                  body_data: accountNumberBodyClauseData,
                  initial_attachment_data: accountNumberInitialAttachmentClauseData,
                  attachment_data: accountNumberAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  values.attachment_data.unshift(
                    values.initial_attachment_data
                  );
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
                                value={"128574647483"}
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
                                value={"GOLDEN PRATAMA ENGINEERING"}
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
                                value={"MANDIRI"}
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
                                value={"Jl Warung Buncit Raya"}
                              />
                            </div>
                          </div>
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
                      setInitialAttachmentClauseData={
                        setAccountNumberInitialAttachmentClauseData
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
                  initial_attachment_data: otherInitialAttachmentClauseData,
                  attachment_data: otherAttachmentClauseData,
                }}
                onSubmit={(values) => {
                  values.attachment_data.unshift(
                    values.initial_attachment_data
                  );
                  submitFormParameterOther(values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <PerubahanKlausulKontrak
                      subTitle={"A"}
                      title={"Lainnya"}
                      setBodyClauseData={setOtherBodyClauseData}
                      setInitialAttachmentClauseData={
                        setOtherInitialAttachmentClauseData
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
