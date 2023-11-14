import React from "react";
import { Field, FieldArray } from "formik";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { compose } from "redux";
import { useDispatch, connect } from "react-redux";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";

const PerubahanKlausulKontrak = ({
  setBodyClauseData,
  setAttachmentClauseData,
  showAddClause,
  values,
  title,
  subTitle,
  dataNewClause,
}) => {
  const dispatch = useDispatch();
  const changeBodyClauseData = (value, type) => {
    setBodyClauseData((data) => {
      if (type === "clause number")
        return {
          ...data,
          clause_number: value,
        };
      if (type === "before clause note")
        return {
          ...data,
          before_clause_note: value,
        };
      if (type === "after clause note")
        return {
          ...data,
          after_clause_note: value,
        };
    });
  };

  const changeFieldData = (fieldIndex, value, fieldType) => {
    // action.type
    // action.payload
    // action.fieldType
    // action.fieldIndex
    dispatch({
      type: actionTypes.SetDataClause,
      payload: value,
      fieldType: fieldType,
      fieldIndex: fieldIndex,
    });
    // setAttachmentClauseData((data) => {
    //   let newArr = [...data];
    //   if (type === "attachment number")
    //     newArr[index]["attachment_number"] = value;
    //   if (type === "clause note") newArr[index]["clause_note"] = value;
    //   return newArr;
    // });
  };

  return (
    <>
      {/* Klausul Perubahan */}
      <div
        className="clause-change-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          border: 1,
          borderColor: "black",
          borderStyle: "solid",
          padding: 28,
          borderRadius: 14,
          // marginTop: 40
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

        <h1
          style={{
            fontWeight: 600,
            fontSize: 16,
            margin: 0,
          }}
        >
          {subTitle}.1 Body Kontrak
        </h1>

        <FieldArray name="body_data">
          {() => (
            <>
              <>
                {/* Nomor Pasal */}
                <div>
                  <Field
                    type="text"
                    name={`body_data.clause_number`}
                    onChange={(e) =>
                      changeBodyClauseData(e.target.value, "clause number")
                    }
                    placeholder="Masukkan Nomor Klausul"
                    style={{
                      padding: 8,
                      borderRadius: 4,
                      minWidth: 400,
                    }}
                  />
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
                      name={`body_data.before_clause_note`}
                      onChange={(e) =>
                        changeBodyClauseData(
                          e.target.value,
                          "before clause note"
                        )
                      }
                      placeholder="Masukkan Klausul Kontrak"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      rows="4"
                    />
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
                      onChange={(e) =>
                        changeBodyClauseData(
                          e.target.value,
                          "after clause note"
                        )
                      }
                      placeholder="Masukkan Klausul Kontrak"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      rows="4"
                    />
                  </div>
                </div>
              </>

              {/* Lampiran */}
              <h1
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  margin: 0,
                }}
              >
                {subTitle}.2 Lampiran
              </h1>
            </>
          )}
        </FieldArray>

        {/* Lampiran */}
        <FieldArray name="body_attachment">
          {() => (
            <>
              <Field
                // name={`attachment_data.${index}.attachment_number`}
                onChange={(e) =>
                  changeFieldData(0, e.target.value, "attachment number")
                }
                value={dataNewClause?.attachmentClauseData}
                type="text"
                placeholder="Masukkan Nomor Lampiran"
                style={{
                  padding: 8,
                  borderRadius: 4,
                  minWidth: 400,
                }}
              />

              <Field
                // name={`attachment_data.${index}.attachment_number`}
                className="form-control"
                as="textarea"
                onChange={(e) =>
                  changeFieldData(0, e.target.value, "clause note")
                }
                value={dataNewClause?.bodyClauseData}
                type="text"
                placeholder="Masukkan Nomor Lampiran"
                style={{
                  padding: 8,
                  borderRadius: 4,
                  minWidth: 400,
                }}
              />
              {/* {values?.attachment_data?.map((a, index) => (
                <>
                  <div></div>

                  <div>
                    <Field
                      className="form-control"
                      as="textarea"
                      name={`attachment_data.${index}.clause_note`}
                      onChange={(e) =>
                        changeFieldData(index, e.target.value, "clause note")
                      }
                      placeholder="Masukkan Lampiran Klausul Kontrak"
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        minWidth: 400,
                      }}
                      rows="4"
                    />
                  </div>
                </>
              ))} */}
            </>
          )}
        </FieldArray>

        {/* Tambah klausul lampiran */}
        <div>
          <button
            type="button"
            className="btn btn-primary text-white add-new-clause"
            style={{
              marginTop: 14,
            }}
            onClick={showAddClause}
          >
            Tambah Klausul Lampiran
          </button>
        </div>
      </div>
    </>
  );
};

// ngirim data
const mapState = ({ dataNewClause }) => ({
  dataNewClause,
  // ini isi local storage nya ternyata ah elah goblok bat sih gue wkwkwkwwkwk
  // authStatus: auth.user.data.status,
  // dataContractById: addendumContract.dataContractById,
});

// ngirim fungsi
const mapDispatch = {
  // fetch_api_sg,
};

export default compose(
  withRouter,
  connect(mapState, mapDispatch)
)(PerubahanKlausulKontrak);
