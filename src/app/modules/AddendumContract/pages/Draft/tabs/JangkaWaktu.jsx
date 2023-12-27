import { connect, useDispatch } from "react-redux";
import { countdownMonths } from "app/libs/timeperioddate";
import React, { useState, useRef, useEffect } from "react";
import { countdownConverter } from "app/libs/timedateconverter";
import { Formik, Field, FieldArray, Form, ErrorMessage } from "formik";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import { submitTimePeriod } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const JangkaWaktu = ({
  isAdmin,
  isDisable,
  contract_id,
  dataNewClause,
  timePeriodData,
  is_add_time_period,
  dataNewClauseDrafting,
  add_contract_time_period,
  timePeriodAddendumCurrent,
}) => {
  const dispatch = useDispatch();
  const openCloseAddClause = useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
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
      startDate: timePeriodAddendumCurrent?.from_time,
      endDate: timePeriodAddendumCurrent?.thru_time,
      totalMonth: timePeriodAddendumCurrent?.add_contract_period_range_month,
      calendarDay: timePeriodAddendumCurrent?.add_contract_period_range_day,
      radio: timePeriodAddendumCurrent?.add_contract_period_type,
      prefix: "contract",
      selectableStart:
        timePeriodAddendumCurrent?.from_time !== null ? true : false,
    },
    {
      title: "Jangka Waktu Pelaksanaan Pekerjaan",
      startDate: timePeriodAddendumCurrent?.worked_start_date,
      endDate: timePeriodAddendumCurrent?.worked_end_date,
      totalMonth: timePeriodAddendumCurrent?.add_work_implement_period_month,
      calendarDay: timePeriodAddendumCurrent?.add_work_implement_period_day,
      radio: timePeriodAddendumCurrent?.add_work_period_type,
      prefix: "work",
      selectableStart:
        timePeriodAddendumCurrent?.worked_start_date !== null ? true : false,
    },
    {
      title: "Jangka Waktu Masa Garansi",
      startDate: timePeriodAddendumCurrent?.guarantee_start_date,
      endDate: timePeriodAddendumCurrent?.guarantee_end_date,
      totalMonth: timePeriodAddendumCurrent?.add_guarantee_period_month,
      calendarDay: timePeriodAddendumCurrent?.add_guarantee_period_day,
      prefix: "guarantee",
    },
    {
      title: "Jangka Waktu Masa Pemeliharaan",
      startDate: timePeriodAddendumCurrent?.maintenance_start_date,
      endDate: timePeriodAddendumCurrent?.maintenance_end_date,
      totalMonth: timePeriodAddendumCurrent?.add_maintenance_period_month,
      calendarDay: timePeriodAddendumCurrent?.add_maintenance_period_day,
      prefix: "maintenance",
    },
  ]);

  const submitFormParameterTimePeriod = (values) => {
    submitTimePeriod(
      {
        add_contract_id: contract_id,
        from_time: values?.contract_start_date,
        thru_time: values?.contract_end_date,
        worked_start_date: values?.worked_start_date,
        worked_end_date: values?.worked_end_date,
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
    alert("Berhasil Update Data!");
  };

  useEffect(() => {
    if (add_contract_time_period?.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_time_period?.attachment_clause_data || [
          {
            attachment_number: "",
            clause_note: "",
          },
        ],
        fieldType: "refill_attachment_clause_data",
        fromWhere: "time_period",
      });
    }
    if (add_contract_time_period?.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_time_period?.body_clause_data || {
          clause_number: "",
          before_clause_note: "",
          after_clause_note: "",
        },
        fieldType: "refill_body_clause_data",
        fromWhere: "time_period",
      });
    }
  }, []);

  return (
    <div className="bg-white p-10">
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
          worked_start_date: timePeriodAddendum[1]?.startDate,
          worked_end_date: timePeriodAddendum[1]?.endDate,
          guarantee_start_date: timePeriodAddendum[2]?.startDate,
          guarantee_end_date: timePeriodAddendum[2]?.endDate,
          maintenance_start_date: timePeriodAddendum[3]?.startDate,
          maintenance_end_date: timePeriodAddendum[3]?.endDate,
          add_contract_period_type: timePeriodAddendum[0]?.radio,
          add_work_period_type: timePeriodAddendum[1]?.radio,
          body_data: dataNewClauseDrafting?.time_period?.bodyClauseData,
          attachment_data:
            dataNewClauseDrafting?.time_period?.attachmentClauseData,
        }}
        onSubmit={(values) => {
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
                            {data.totalMonth !== null ? data.totalMonth : 0}{" "}
                            Bulan{" "}
                            {data.calendarDay !== null ? data.calendarDay : 0}{" "}
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
                                    (data.title === "Jangka Waktu Perjanjian" &&
                                      data.startDate !== null) ||
                                    (data.title ===
                                      "Jangka Waktu Pelaksanaan Pekerjaan" &&
                                      data.startDate !== null)
                                      ? "#e8f4fb"
                                      : "",
                                }}
                                name={data.prefix + "_start_date"}
                                value={data.startDate}
                                disabled={
                                  (data.title === "Jangka Waktu Perjanjian" &&
                                    data.selectableStart) ||
                                  (data.title ===
                                    "Jangka Waktu Pelaksanaan Pekerjaan" &&
                                    data.selectableStart)
                                }
                                onChange={(e) =>
                                  setTimePeriodAddendum((prev) => {
                                    let newArr = [...prev];
                                    newArr[index].startDate = e.target.value;
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
                                      newArr[index].endDate = e.target.value;
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
                            {countdownMonths(data.startDate, data.endDate)}
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
                                    newArr[index].radio = e.target.value;
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
                                    newArr[index].radio = e.target.value;
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
              values={values}
              isDrafting={true}
              isMandatory={true}
              isDisable={!isDisable}
              title={"Jangka Waktu"}
              fromWhere={"time_period"}
              showAddClause={showAddClause}
            />

            <UpdateButton
              isDrafting={true}
              isMandatory={true}
              isDisable={isDisable}
              fromWhere={"time_period"}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

// export default JangkaWaktu;
const mapState = (state) => ({
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, null)(JangkaWaktu);
