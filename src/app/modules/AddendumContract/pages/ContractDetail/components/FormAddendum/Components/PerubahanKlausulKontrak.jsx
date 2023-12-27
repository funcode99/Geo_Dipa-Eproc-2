import { compose } from "redux";
import { Field, FieldArray } from "formik";
import { withRouter } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";

const PerubahanKlausulKontrak = ({
  title,
  subTitle,
  isDisable,
  fromWhere,
  showAddClause,
  showAddContract,
  isDrafting = false,
  isMandatory = false,
  dataNewClause,
  dataNewClauseDrafting,
}) => {
  const dispatch = useDispatch();

  const changeOtherBodyClauseData = (fieldIndex, value, fieldType) => {
    let newArr = isDrafting
      ? [...dataNewClauseDrafting[fromWhere].bodyClauseData]
      : [...dataNewClause[fromWhere].bodyClauseData];
    if (fieldType === "clause_number")
      newArr[fieldIndex]["clause_number"] = value;
    if (fieldType === "before_clause_note")
      newArr[fieldIndex]["before_clause_note"] = value;
    if (fieldType === "after_clause_note")
      newArr[fieldIndex]["after_clause_note"] = value;
    dispatch({
      type: isDrafting
        ? actionTypes.SetDraftingClause
        : actionTypes.SetDataClause,
      payload: newArr,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
      fromWhere: fromWhere,
    });
  };

  const changeBodyClauseData = (value, fieldType) => {
    dispatch({
      type: isDrafting
        ? actionTypes.SetDraftingClause
        : actionTypes.SetDataClause,
      payload: value,
      fieldType: fieldType,
      fromWhere: fromWhere,
    });
  };

  // data ini gak bisa di listen
  const changeFieldData = (fieldIndex, value, fieldType, actualFromWhere) => {
    let newArr = isDrafting
      ? [...dataNewClauseDrafting[actualFromWhere].attachmentClauseData]
      : [...dataNewClause[actualFromWhere].attachmentClauseData];
    if (fieldType === "attachment_number")
      newArr[fieldIndex]["attachment_number"] = value;
    if (fieldType === "clause_note") newArr[fieldIndex]["clause_note"] = value;
    dispatch({
      type: isDrafting
        ? actionTypes.SetDraftingClause
        : actionTypes.SetDataClause,
      payload: newArr,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
      // LUPA PAKE FROMWHERE CUK!
      fromWhere: actualFromWhere,
    });
  };

  const bodyClauseData = !isDrafting
    ? dataNewClause[fromWhere]?.bodyClauseData[0]
    : dataNewClauseDrafting[fromWhere]?.bodyClauseData[0];

  const isDisabled = !isDrafting
    ? !bodyClauseData ||
      bodyClauseData.after_clause_note === "" ||
      bodyClauseData.before_clause_note === "" ||
      bodyClauseData.clause_number === ""
    : !bodyClauseData ||
      bodyClauseData.after_clause_note === "" ||
      bodyClauseData.before_clause_note === "" ||
      bodyClauseData.clause_number === "";

  return (
    <>
      {/* Klausul Perubahan */}
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
            {subTitle}. Perubahan Klausul Kontrak {title}
          </span>
        </div>

        {fromWhere !== "other" && (
          <h1
            style={{
              fontWeight: 600,
              fontSize: 16,
              margin: 0,
            }}
          >
            {subTitle}.1 Body Kontrak
          </h1>
        )}

        {/* Button tambah body kontrak */}
        {fromWhere === "other" && (
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
            {/* <button
              type="button"
              disabled={
                !isDrafting
                  ? dataNewClause[fromWhere].bodyClauseData[0]
                      .after_clause_note === "" ||
                    dataNewClause[fromWhere].bodyClauseData[0]
                      .before_clause_note === "" ||
                    dataNewClause[fromWhere].bodyClauseData[0].clause_number ===
                      ""
                  : dataNewClauseDrafting[fromWhere]?.bodyClauseData[0]
                      ?.after_clause_note === "" ||
                    dataNewClauseDrafting[fromWhere]?.bodyClauseData[0]
                      ?.before_clause_note === "" ||
                    dataNewClauseDrafting[fromWhere].bodyClauseData[0]
                      ?.clause_number === ""
              }
              className="btn btn-primary text-white add-new-clause"
              onClick={showAddContract}
            >
              Tambah Body Kontrak
            </button> */}
            <button
              type="button"
              disabled={isDisabled}
              className="btn btn-primary text-white add-new-clause"
              onClick={showAddContract}
            >
              Tambah Body Kontrak
            </button>
          </div>
        )}

        <>
          {fromWhere !== "other" && (
            <>
              {/* Nomor Pasal */}
              <div>
                <Field
                  type="text"
                  name={`body_data.clause_number`}
                  value={
                    isDrafting
                      ? dataNewClauseDrafting[fromWhere]?.bodyClauseData
                          ?.clause_number
                      : dataNewClause[fromWhere]?.bodyClauseData?.clause_number
                  }
                  onChange={(e) =>
                    changeBodyClauseData(e.target.value, "clause number")
                  }
                  placeholder="Masukkan Nomor Klausul"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    minWidth: 400,
                  }}
                  disabled={!isDisable}
                />
                {isDrafting
                  ? dataNewClauseDrafting[fromWhere]?.bodyClauseData
                      ?.clause_number === "" &&
                    isMandatory && (
                      <p>
                        <span style={{ color: "red" }}>*</span>Wajib Diisi
                      </p>
                    )
                  : dataNewClause[fromWhere].bodyClauseData.clause_number ===
                      "" &&
                    isMandatory && (
                      <p>
                        <span style={{ color: "red" }}>*</span>Wajib Diisi
                      </p>
                    )}
              </div>

              {/* Pasal */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* pasal sebelum addendum */}
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
                    name={`body_data.before_clause_note`}
                    value={
                      isDrafting
                        ? dataNewClauseDrafting[fromWhere].bodyClauseData
                            .before_clause_note
                        : dataNewClause[fromWhere].bodyClauseData
                            .before_clause_note
                    }
                    onChange={(e) =>
                      changeBodyClauseData(e.target.value, "before clause note")
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
                  {isDrafting
                    ? dataNewClauseDrafting[fromWhere].bodyClauseData
                        .before_clause_note === "" &&
                      isMandatory && (
                        <p>
                          <span style={{ color: "red" }}>*</span>Wajib Diisi
                        </p>
                      )
                    : dataNewClause[fromWhere].bodyClauseData
                        .before_clause_note === "" &&
                      isMandatory && (
                        <p>
                          <span style={{ color: "red" }}>*</span>Wajib Diisi
                        </p>
                      )}
                </div>

                {/* pasal setelah addendum */}
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
                    name={`body_data.after_clause_note`}
                    value={
                      isDrafting
                        ? dataNewClauseDrafting[fromWhere].bodyClauseData
                            .after_clause_note
                        : dataNewClause[fromWhere].bodyClauseData
                            .after_clause_note
                    }
                    onChange={(e) =>
                      changeBodyClauseData(e.target.value, "after clause note")
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
                  {isDrafting ? (
                    dataNewClauseDrafting ? (
                      dataNewClauseDrafting[fromWhere].bodyClauseData
                        .after_clause_note === "" &&
                      isMandatory && (
                        <p>
                          <span style={{ color: "red" }}>*</span>Wajib Diisi
                        </p>
                      )
                    ) : (
                      <></>
                    )
                  ) : dataNewClause ? (
                    dataNewClause[fromWhere]?.bodyClauseData
                      ?.after_clause_note === "" &&
                    isMandatory && (
                      <></>
                      // <p>
                      //   <span style={{ color: "red" }}>*</span>Wajib Diisi
                      // </p>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          )}

          {/* body kontrak di other kondisi drafting */}
          {fromWhere === "other" &&
            isDrafting &&
            dataNewClauseDrafting &&
            dataNewClauseDrafting[fromWhere]?.bodyClauseData?.map(
              (item, index) => {
                return (
                  <>
                    {/* Nomor Pasal */}
                    <div>
                      <Field
                        type="text"
                        name={`body_data[${index}].clause_number`}
                        value={item?.clause_number}
                        onChange={(e) =>
                          changeOtherBodyClauseData(
                            index,
                            e.target.value,
                            "clause_number"
                          )
                        }
                        placeholder="Masukkan Nomor Klausul"
                        style={{
                          padding: 8,
                          borderRadius: 4,
                          minWidth: 400,
                        }}
                        disabled={!isDisable}
                      />
                      {item.clause_number === "" && index === 0 && isMandatory && (
                        <p>
                          <span style={{ color: "red" }}>*</span>Wajib Diisi
                        </p>
                      )}
                    </div>

                    {/* Pasal */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        // marginTop: 28
                      }}
                    >
                      {/* pasal sebelum addendum */}
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

                      {/* pasal setelah addendum */}
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

          {/* body kontrak di other kondisi bukan drafting */}
          {fromWhere === "other" &&
            !isDrafting &&
            dataNewClause &&
            dataNewClause[fromWhere]?.bodyClauseData?.map((item, index) => {
              return (
                <>
                  {/* Nomor Pasal */}
                  <div>
                    <Field
                      type="text"
                      name={`body_data[${index}].clause_number`}
                      value={item?.clause_number}
                      onChange={(e) =>
                        changeOtherBodyClauseData(
                          index,
                          e.target.value,
                          "clause_number"
                        )
                      }
                      placeholder="Masukkan Nomor Klausul"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      disabled={!isDisable}
                    />
                    {item.clause_number === "" && index === 0 && isMandatory && (
                      <p>
                        <span style={{ color: "red" }}>*</span>Wajib Diisi
                      </p>
                    )}
                  </div>

                  {/* Pasal */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {/* pasal sebelum addendum */}
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

                    {/* pasal setelah addendum */}
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
            })}
        </>

        {/* Lampiran */}
        {/* Button tambah klausul lampiran */}
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
            // disabled={isDisabled}
            className="btn btn-primary text-white add-new-clause"
            onClick={showAddClause}
          >
            Tambah Klausul Lampiran lampiran
          </button>
        </div>

        {/* klausul lampiran di other */}
        {isDrafting &&
          dataNewClauseDrafting &&
          dataNewClauseDrafting[fromWhere]?.attachmentClauseData?.map(
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
                  disabled={!isDisable}
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
                  disabled={!isDisable}
                />
                {item?.clause_note === "" && isMandatory && index === 0 && (
                  <p>
                    <span style={{ color: "red" }}>*</span>Wajib Diisi
                  </p>
                )}
              </>
            )
          )}

        {!isDrafting &&
          dataNewClause &&
          dataNewClause[fromWhere]?.attachmentClauseData?.map((item, index) => (
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
                value={item.attachment_number}
                type="text"
                placeholder="Masukkan Nomor Lampiran"
                style={{
                  padding: 8,
                  borderRadius: 4,
                  minWidth: 400,
                }}
                disabled={!isDisable}
              />
              {item.attachment_number === "" && index == 0 && isMandatory && (
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
                value={item.clause_note}
                type="text"
                placeholder="Masukkan Lampiran Klausul"
                style={{
                  padding: 8,
                  borderRadius: 4,
                  minWidth: 400,
                }}
                disabled={!isDisable}
              />
              {item.clause_note === "" && index == 0 && isMandatory && (
                <p>
                  <span style={{ color: "red" }}>*</span>Wajib Diisi
                </p>
              )}
            </>
          ))}
      </div>
    </>
  );
};

// ngirim data
const mapState = ({ addendumContract }) => ({
  dataNewClause: addendumContract.dataNewClause,
  dataNewClauseDrafting: addendumContract.dataNewClauseDrafting,
});

export default compose(
  withRouter,
  connect(mapState, null)
)(PerubahanKlausulKontrak);
