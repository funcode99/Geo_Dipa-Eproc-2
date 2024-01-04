import { connect } from "react-redux";
import { fetch_api_sg } from "redux/globalReducer";
import React, { useState, useEffect } from "react";
import TitleComponent from "../components/TitleComponent";
const ProsesReviewPage = ({ contract_id, fetch_api_sg }) => {
  const Title = ["A. Addendum Perjanjian", "B. Lampiran 1", "C. Lampiran 2"];

  const [dataList, setDataList] = useState();

  // api 4.6
  const getAddContactVendorReviewer = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/review/contract-review/${contract_id}`,
        onSuccess: (res) => {
          setDataList(res.data);
        },
      });
    } catch (error) {
      console.error("Error fetching vendor reviewer:", error);
    }
  };

  useEffect(() => {
    getAddContactVendorReviewer();
  }, []);

  return (
    <>
      <div className="bg-white rounded">
        <div
          className="bottom mt-4"
          style={{
            padding: 16,
            display: "flex",
            borderRadius: 8,
            flexDirection: "column",
            border: "1px solid #000000",
          }}
        >
          {dataList?.link_review?.map((item, index) => (
            <div className="field-pertama mt-4" key={index}>
              <TitleComponent title={Title[index]} />
              <p>Silahkan klik link dibawah ini untuk melakukan review :</p>
              <div
                className="field-template mt-4"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  color: "#498FE4",
                  border: "1px solid #000000",
                }}
              >
                <a href={item.url_path} target="_blank">
                  {item.url_path}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div
          className="bottom mt-4"
          style={{
            padding: 16,
            display: "flex",
            borderRadius: 8,
            flexDirection: "column",
            border: "1px solid #000000",
          }}
        >
          <div className="div" style={{ borderBottom: "1px solid #000000" }}>
            <TitleComponent title=" Catatan Proses Review" />
          </div>
          <div className="div">
            <TitleComponent title="Syarat dan Ketentuan Proses Review :" />
          </div>
          <div className="field-pertama">
            <p>1. Review ditunggu maksimal 3 hari</p>
          </div>
          <div className="field-kedua">
            <p>2. Catatan Lainnya</p>
          </div>
          <div className="field-ketiga">
            <p>3. Catatan Lainnya</p>
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

export default connect(mapState, mapDispatch)(ProsesReviewPage);
