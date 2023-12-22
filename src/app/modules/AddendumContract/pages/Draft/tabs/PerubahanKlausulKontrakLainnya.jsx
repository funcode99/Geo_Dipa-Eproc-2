import { compose } from "redux";
import { Field, FieldArray } from "formik";
import { withRouter } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";

const PerubahanKlausulKontrakLainnya = ({
  title,
  subTitle,
  isDisable,
  fromWhere,
  showAddClause,
  showAddContract,
  isDrafting = false,
  isMandatory = false,
  dataNewClauseDrafting,
}) => {
  const dispatch = useDispatch();

  const [dataLainnya, setDataLainnya] = useState();

  const changeOtherBodyClauseData = (fieldIndex, value, fieldType) => {
    let newArr = [...dataNewClauseDrafting[fromWhere].bodyClauseData];
    if (fieldType === "clause_number")
      newArr[fieldIndex]["clause_number"] = value;
    if (fieldType === "before_clause_note")
      newArr[fieldIndex]["before_clause_note"] = value;
    if (fieldType === "after_clause_note")
      newArr[fieldIndex]["after_clause_note"] = value;
    dispatch({
      type: actionTypes.SetDraftingClause,
      payload: newArr,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
      fromWhere: fromWhere,
    });
  };

  // data ini gak bisa di listen
  const changeFieldData = (fieldIndex, value, fieldType, actualFromWhere) => {
    let newArr = [
      ...dataNewClauseDrafting[actualFromWhere].attachmentClauseData,
    ];
    if (fieldType === "attachment_number")
      newArr[fieldIndex]["attachment_number"] = value;
    if (fieldType === "clause_note") newArr[fieldIndex]["clause_note"] = value;
    dispatch({
      type: actionTypes.SetDraftingClause,
      payload: newArr,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
      fromWhere: actualFromWhere,
    });
  };

  const bodyClauseData = dataNewClauseDrafting[fromWhere]?.bodyClauseData?.[0];

  const isDisabled =
    !bodyClauseData ||
    bodyClauseData.after_clause_note === "" ||
    bodyClauseData.before_clause_note === "" ||
    bodyClauseData.clause_number === "";

  return (
    <>
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
            {subTitle}. Perubahan Klausul Kontrak ini tab lainnya {title}
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
            {subTitle}.1 Body Kontrak
          </h1>
          <button
            type="button"
            disabled={isDisabled}
            className="btn btn-primary text-white add-new-clause"
            onClick={showAddContract}
          >
            Tambah Body Kontrak
          </button>
        </div>

        <>
          {fromWhere === "other" &&
            isDrafting &&
            dataNewClauseDrafting[fromWhere]?.bodyClauseData?.map(
              (item, index) => {
                return (
                  <>
                    <div>
                      <Field
                        type="text"
                        // name={`body_data[${index}].clause_number`}
                        // name={`body_data[${item}].clause_number`}
                        // value={item?.clause_number}
                        onChange={(e) =>
                          //   changeOtherBodyClauseData(
                          //     index,
                          //     e.target.value,
                          //     "clause_number"
                          //   )
                          console.log(e.target.value, "eeee nya")
                        }
                        placeholder="Masukkan Nomor Klausul"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                        disabled={isDisable}
                      />
                      {item.clause_number === "" && index === 0 && isMandatory && (
                        <p>
                          <span style={{ color: "red" }}>*</span>Wajib Diisi
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
                          name={`body_data[${index}].before_clause_note`}
                          value={item?.before_clause_note}
                          onChange={(e) =>
                            changeOtherBodyClauseData(
                              index,
                              e.target.value,
                              "before_clause_note"
                            )
                          }
                          placeholder="Masukkan Klausul Kontrak"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                          rows="4"
                          disabled={!isDisable}
                        />
                        {item?.before_clause_note === "" &&
                          index === 0 &&
                          isMandatory && (
                            <p>
                              <span style={{ color: "red" }}>*</span>Wajib Diisi
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
                          name={`body_data[${index}].after_clause_note`}
                          value={item.after_clause_note}
                          onChange={(e) =>
                            changeOtherBodyClauseData(
                              index,
                              e.target.value,
                              "after_clause_note"
                            )
                          }
                          placeholder="Masukkan Klausul Kontrak"
                          style={{
                            padding: 8,
                            borderRadius: 4,
                            minWidth: 400,
                          }}
                          rows="4"
                          disabled={!isDisable}
                        />
                        {item.after_clause_note === "" &&
                          index === 0 &&
                          isMandatory && (
                            <p>
                              <span style={{ color: "red" }}>*</span>Wajib Diisi
                            </p>
                          )}
                      </div>
                    </div>
                  </>
                );
              }
            )}
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
            {subTitle}.2 Lampiran
          </h1>
          <button
            type="button"
            disabled={
              dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                .attachment_number === "" ||
              dataNewClauseDrafting[fromWhere].attachmentClauseData[0]
                .clause_note === ""
            }
            className="btn btn-primary text-white add-new-clause"
            onClick={showAddClause}
          >
            Tambah Klausul Lampiran
          </button>
        </div>

        {isDrafting &&
          dataNewClauseDrafting[fromWhere].attachmentClauseData.map(
            (item, index) => (
              <>
                <Field
                  onChange={(e) =>
                    changeFieldData(
                      index,
                      e.target.value,
                      "attachment_number",
                      fromWhere
                    )
                  }
                  name={`attachment_data[${index}].attachment_number`}
                  value={item?.attachment_number}
                  type="text"
                  placeholder="Masukkan Nomor Lampiran"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    minWidth: 400,
                  }}
                />

                {item?.attachment_number === "" && isMandatory && index === 0 && (
                  <p>
                    <span style={{ color: "red" }}>*</span>Wajib Diisi
                  </p>
                )}

                <Field
                  className="form-control"
                  as="textarea"
                  onChange={(e) =>
                    changeFieldData(
                      index,
                      e.target.value,
                      "clause_note",
                      fromWhere
                    )
                  }
                  name={`attachment_data[${index}].clause_note`}
                  value={item?.clause_note}
                  type="text"
                  placeholder="Masukkan Lampiran Klausul"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    minWidth: 400,
                  }}
                />
                {item?.clause_note === "" && isMandatory && index === 0 && (
                  <p>
                    <span style={{ color: "red" }}>*</span>Wajib Diisi
                  </p>
                )}
              </>
            )
          )}
      </div>
    </>
  );
};

const mapState = ({ addendumContract }) => ({
  dataNewClauseDrafting: addendumContract.dataNewClauseDrafting,
});

export default compose(
  withRouter,
  connect(mapState, null)
)(PerubahanKlausulKontrakLainnya);
