import { connect } from "react-redux";
import React, { useState } from "react";
import { fetch_api_sg } from "redux/globalReducer";
import { ReactSelect } from "percobaan/ReactSelect";
import DialogGlobal from "app/components/modals/DialogGlobal";
import ButtonAction from "app/components/buttonAction/ButtonAction";
import { submitAddContractUserReviewer } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const ReviewPage = ({
  isAdmin,
  isVendor,
  isClient,
  contract_id,
  fetch_api_sg,
  listUserParticipantReview,
  listDataContactUserReviewer,
  listDataContractAdminReviewer,
  listDataContactVendorReviewer,
}) => {
  const openCloseAddReviewer = React.useRef();
  const showAddReviewer = () => {
    openCloseAddReviewer.current.open();
  };

  const [dataSubmit, setDataSubmit] = useState();

  const actionButton = (
    <ButtonAction
      style={{
        backgroundColor: "#e8f4fb",
      }}
      hoverLabel="More"
      data={"1"}
      ops={[
        {
          label: "Batalkan",
        },
      ]}
    />
  );

  const changeDataUserParticipantReview = (num) => {
    setDataSubmit({
      ...dataSubmit,
      user_id: listUserParticipantReview[num].user_id,
    });
  };

  const submitData = () => {
    submitAddContractUserReviewer({
      add_contract_id: contract_id,
      user_id: dataSubmit.user_id,
      position_name: dataSubmit.position_name,
    });
    alert("Berhasil tambah data!");
    openCloseAddReviewer.current.close();
    // window.location.reload(true);
  };
  return (
    <>
      <DialogGlobal
        ref={openCloseAddReviewer}
        isCancel={false}
        isSubmit={false}
        yesButton={false}
        noButton={false}
        maxWidth={"sm"}
      >
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
            Tambah Reviewer User
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
              <span>Name</span>
              <ReactSelect
                data={listUserParticipantReview}
                func={changeDataUserParticipantReview}
                labelName={`full_name`}
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
                }}
                onChange={(e) =>
                  setDataSubmit({
                    ...dataSubmit,
                    position_name: e.target.value,
                  })
                }
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
          <button
            type="button"
            className="btn btn-primary mx-1"
            onClick={submitData}
          >
            Save
          </button>
        </div>
      </DialogGlobal>
      <div
        style={{
          padding: 28,
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            border: 1,
            borderColor: "black",
            borderStyle: "solid",
            padding: "14px 28px",
            backgroundColor: "white",
            borderRadius: 14,
          }}
        >
          <h1
            style={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Reviewer Addendum
          </h1>
          <br
            style={{
              border: 1,
              borderColor: "black",
              borderStyle: "solid",
            }}
          />
          {(isAdmin || isClient) && (
            <>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                Admin Kontrak
              </h1>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 28,
                  margin: "14px 0px 28px 0px",
                }}
              >
                {listDataContractAdminReviewer &&
                  listDataContractAdminReviewer?.map((item, index) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span>Nama</span>
                        <input
                          type="text"
                          value={item.full_name}
                          style={{
                            borderRadius: 4,
                            padding: 8,
                            backgroundColor: "#e8f4fb",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span>Jabatan</span>
                        <input
                          type="text"
                          value={item.position_name}
                          style={{
                            borderRadius: 4,
                            padding: 8,
                            backgroundColor: "#e8f4fb",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span>Email</span>
                        <input
                          type="text"
                          value={item.email}
                          style={{
                            borderRadius: 4,
                            padding: 8,
                            backgroundColor: "#e8f4fb",
                          }}
                        />
                      </div>
                    </>
                  ))}
              </div>
            </>
          )}

          {(isAdmin || isClient) && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h1
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  User
                </h1>
                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary mx-1"
                    onClick={showAddReviewer}
                  >
                    + Review User
                  </button>
                )}
              </div>

              <table border={1}>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
                  <th>Email</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>

                {listDataContactUserReviewer &&
                  listDataContactUserReviewer.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.full_name}</td>
                          <td>{item.position_name}</td>
                          <td>{item.email}</td>
                          {isAdmin && <td>{actionButton}</td>}
                        </tr>
                      </>
                    );
                  })}
              </table>
            </>
          )}

          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Vendor
            </h1>
          </div>

          <table border={1}>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>PIC</th>
              <th>Email</th>
              {isVendor && <th>Aksi</th>}
            </tr>

            {listDataContactVendorReviewer &&
              listDataContactVendorReviewer.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.vendor_name}</td>
                      <td>{item.pic_full_name}</td>
                      <td>{item.pic_email}</td>
                      {isVendor && <td>{actionButton}</td>}
                    </tr>
                  </>
                );
              })}
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 40,
            }}
          >
            <button type="button" className="btn btn-primary mx-1">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};

const mapDispatch = {
  fetch_api_sg,
};
const mapState = ({ auth, deliveryMonitoring }) => ({
  authStatus: auth.user.data.status,
  data: auth.user.data,
  dataContractById: deliveryMonitoring.dataContractById,
});

export default connect(mapState, mapDispatch)(ReviewPage);
