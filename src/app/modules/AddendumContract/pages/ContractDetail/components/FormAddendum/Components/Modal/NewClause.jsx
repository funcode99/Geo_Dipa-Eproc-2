import React from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { useDispatch, connect } from "react-redux";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { Formik, Field, Form } from "formik";

const NewClause = ({
  openCloseAddClause,
  fromWhere,
  fieldType,
  isDrafting = false,
}) => {
  const dispatch = useDispatch();

  return (
    <>
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
            const doSet = {
              attachment_number: values.attachment_number,
              clause_note: values.clause_note,
            };
            dispatch({
              type: isDrafting
                ? actionTypes.SetDraftingClause
                : actionTypes.SetDataClause,
              payload: doSet,
              fieldType: fieldType,
              fromWhere: fromWhere,
            });
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
                    <span>Isi perubahan klausul</span>
                    <Field
                      as="textarea"
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
    </>
  );
};

const mapState = ({ addendumContract, isDrafting }) => ({
  dataNewClause: isDrafting
    ? addendumContract.dataNewClauseDrafting
    : addendumContract.dataNewClause,
});

export default compose(withRouter, connect(mapState, null))(NewClause);
