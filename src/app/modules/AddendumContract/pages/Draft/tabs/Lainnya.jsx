import { Formik, Form, Field } from "formik";
import { connect, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { submitOther } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const Lainnya = ({
  jsonData,
  isDisable,
  fromWhere,
  isDrafting,
  contract_id,
  isMandatory,
  otherCurrent,
  dataNewClause,
  add_contract_others,
  dataNewClauseDrafting,
}) => {
  const [dataLainnya, setDataLainnya] = useState({
    bodyClauseData: dataNewClauseDrafting?.other?.bodyClauseData || [
      {
        clause_number: "",
        before_clause_note: "",
        after_clause_note: "",
      },
    ],
    attachmentClauseData: dataNewClauseDrafting?.other
      ?.attachmentClauseData || [
      {
        attachment_number: "",
        clause_note: "",
      },
    ],
  });

  const updateBodyClauseData = (fieldIndex, value, fieldType) => {
    const updatedData = {
      ...dataLainnya,
      bodyClauseData: [
        ...dataLainnya?.bodyClauseData?.slice(0, fieldIndex),
        {
          ...dataLainnya?.bodyClauseData[fieldIndex],
          [fieldType]: value,
        },
        ...dataLainnya?.bodyClauseData?.slice(fieldIndex + 1),
      ],
    };

    setDataLainnya(updatedData);
    dispatch({
      type: actionTypes.SetDraftingClause,
      payload: updatedData.bodyClauseData,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
      fromWhere: fromWhere,
    });
  };

  const updateAttachmentClauseData = (fieldIndex, value, fieldType) => {
    const updatedData = {
      ...dataLainnya,
      attachmentClauseData: [
        ...dataLainnya.attachmentClauseData.slice(0, fieldIndex),
        {
          ...dataLainnya.attachmentClauseData[fieldIndex],
          [fieldType]: value,
        },
        ...dataLainnya.attachmentClauseData.slice(fieldIndex + 1),
      ],
    };

    setDataLainnya(updatedData);
    dispatch({
      type: actionTypes.SetDraftingClause,
      payload: updatedData.attachmentClauseData,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
      fromWhere: fromWhere,
    });
  };

  const dispatch = useDispatch();
  const submitFormParameterOther = (values) => {
    submitOther(
      {
        add_contract_id: contract_id,
        body_clause_data: values.body_data,
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
    alert("Berhasil Update Data!");
  };

  const addNewBodyClauseData = () => {
    setDataLainnya((prevData) => ({
      ...prevData,
      bodyClauseData: [
        ...prevData.bodyClauseData,
        {
          clause_number: "",
          before_clause_note: "",
          after_clause_note: "",
        },
      ],
    }));
  };
  const addNewAttachmentClause = () => {
    setDataLainnya((prevData) => ({
      ...prevData,
      attachmentClauseData: [
        ...prevData.attachmentClauseData,
        {
          attachment_number: "",
          clause_note: "",
        },
      ],
    }));
  };

  useEffect(() => {
    if (add_contract_others?.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_others?.body_clause_data,
        fieldType: "refill_body_clause_data",
        fromWhere: "other",
      });
    }
    if (add_contract_others?.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_others?.attachment_clause_data,
        fieldType: "refill_attachment_clause_data",
        fromWhere: "other",
      });
    }
  }, [add_contract_others]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          body_data: dataLainnya?.bodyClauseData,
          attachment_data: dataLainnya?.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterOther(values);
        }}
      >
        {(props) => {
          const { values } = props;
          return (
            <Form>
              <div
                className="clause-change-wrapper bg-white"
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
                <div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#2e1f22",
                    }}
                  >
                    A. Perubahan Klausul Kontrak ini tab lainnya
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h1
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    A.1 Body Kontrak
                  </h1>
                  <button
                    type="button"
                    disabled={
                      dataLainnya.bodyClauseData.slice(-1)[0].clause_number ===
                        "" ||
                      dataLainnya.bodyClauseData.slice(-1)[0]
                        .before_clause_note === "" ||
                      dataLainnya.bodyClauseData.slice(-1)[0]
                        .after_clause_note === ""
                    }
                    className="btn btn-primary text-white add-new-clause"
                    onClick={addNewBodyClauseData}
                  >
                    Tambah Body Kontrak
                  </button>
                </div>

                <>
                  {fromWhere === "other" &&
                    isDrafting &&
                    dataLainnya?.bodyClauseData?.map((item, index) => {
                      return (
                        <>
                          <div>
                            <Field
                              type="text"
                              name={`bodyClauseData[${index}].clause_number`}
                              onChange={(e) => {
                                updateBodyClauseData(
                                  index,
                                  e.target.value,
                                  "clause_number"
                                );
                              }}
                              value={item?.clause_number}
                              placeholder="Masukkan Nomor Klausul"
                              style={{
                                padding: 8,
                                borderRadius: 4,
                                minWidth: 400,
                              }}
                              disabled={isDisable}
                            />
                            {item.clause_number === "" &&
                              index === 0 &&
                              isMandatory && (
                                <p>
                                  <span style={{ color: "red" }}>*</span>Wajib
                                  Diisi
                                </p>
                              )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 14,
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontWeight: 500,
                                  marginBottom: 14,
                                }}
                              >
                                Pasal Sebelum Addendum
                              </p>
                              <Field
                                className="form-control"
                                as="textarea"
                                name={`bodyClauseData[${index}].before_clause_note`}
                                onChange={(e) => {
                                  updateBodyClauseData(
                                    index,
                                    e.target.value,
                                    "before_clause_note"
                                  );
                                }}
                                value={item?.before_clause_note}
                                placeholder="Masukkan Klausul Kontrak"
                                style={{
                                  padding: 8,
                                  borderRadius: 4,
                                  minWidth: 400,
                                }}
                                rows="4"
                                disabled={isDisable}
                              />
                              {item?.before_clause_note === "" &&
                                index === 0 &&
                                isMandatory && (
                                  <p>
                                    <span style={{ color: "red" }}>*</span>Wajib
                                    Diisi
                                  </p>
                                )}
                            </div>
                            <div>
                              <p
                                style={{
                                  fontWeight: 500,
                                  marginBottom: 14,
                                }}
                              >
                                Pasal Setelah Addendum
                              </p>
                              <Field
                                className="form-control"
                                as="textarea"
                                name={`bodyClauseData[${index}].after_clause_note`}
                                value={item?.after_clause_note}
                                onChange={(e) => {
                                  updateBodyClauseData(
                                    index,
                                    e.target.value,
                                    "after_clause_note"
                                  );
                                }}
                                placeholder="Masukkan Klausul Kontrak"
                                style={{
                                  padding: 8,
                                  borderRadius: 4,
                                  minWidth: 400,
                                }}
                                rows="4"
                                disabled={isDisable}
                              />
                              {item.after_clause_note === "" &&
                                index === 0 &&
                                isMandatory && (
                                  <p>
                                    <span style={{ color: "red" }}>*</span>Wajib
                                    Diisi
                                  </p>
                                )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                </>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h1
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    A.2 Lampiran
                  </h1>
                  <button
                    type="button"
                    disabled={
                      dataLainnya.attachmentClauseData.slice(-1)[0]
                        .attachment_number === "" ||
                      dataLainnya.attachmentClauseData.slice(-1)[0]
                        .clause_note === ""
                    }
                    className="btn btn-primary text-white add-new-clause"
                    onClick={addNewAttachmentClause}
                  >
                    Tambah Klausul Lampiran
                  </button>
                </div>

                {isDrafting &&
                  dataLainnya?.attachmentClauseData.map((item, index) => (
                    <>
                      <div>
                        <Field
                          className="mb-2"
                          onChange={(e) => {
                            updateAttachmentClauseData(
                              index,
                              e.target.value,
                              "attachment_number"
                            );
                          }}
                          name={`attachmentClauseData[${index}].attachment_number`}
                          value={item?.attachment_number}
                          type="text"
                          placeholder="Masukkan Nomor Lampiran"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                          disabled={isDisable}
                        />

                        {item?.attachment_number === "" &&
                          isMandatory &&
                          index === 0 && (
                            <p>
                              <span style={{ color: "red" }}>*</span>Wajib Diisi
                            </p>
                          )}

                        <Field
                          className="form-control mb-2"
                          as="textarea"
                          onChange={(e) => {
                            updateAttachmentClauseData(
                              index,
                              e.target.value,
                              "clause_note"
                            );
                          }}
                          name={`attachmentClauseData[${index}].clause_note`}
                          value={item?.clause_note}
                          type="text"
                          placeholder="Masukkan Lampiran Klausul"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                          disabled={isDisable}
                        />
                        {item?.clause_note === "" &&
                          isMandatory &&
                          index === 0 && (
                            <p>
                              <span style={{ color: "red" }}>*</span>Wajib Diisi
                            </p>
                          )}
                      </div>
                    </>
                  ))}
              </div>

              <UpdateButton fromWhere={"payment_method"} isDrafting={true} />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

const mapState = (state) => ({
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, null)(Lainnya);
