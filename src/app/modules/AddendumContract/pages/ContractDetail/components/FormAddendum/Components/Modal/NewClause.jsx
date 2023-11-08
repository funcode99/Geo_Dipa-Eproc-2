import React from "react";
import DialogGlobal from "app/components/modals/DialogGlobal";
import { Formik, Field, Form } from "formik";

const NewClause = () => {
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
            const doSet = (data) => {
              return [
                ...data,
                {
                  attachment_number: values.attachment_number,
                  clause_note: values.clause_note,
                },
              ];
            };
            // if (currentActiveTab === 0) setPartiesAttachmentClauseData(doSet);
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
    </>
  );
};

export default NewClause;
