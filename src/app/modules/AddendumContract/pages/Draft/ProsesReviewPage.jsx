import { connect } from "react-redux";
import { fetch_api_sg } from "redux/globalReducer";
import React, { useState, useEffect } from "react";
const ProsesReviewPage = ({
  isAdmin,
  isVendor,
  isClient,
  contract_id,
  fetch_api_sg,
}) => {
  return <p>hello wolrd</p>;
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
