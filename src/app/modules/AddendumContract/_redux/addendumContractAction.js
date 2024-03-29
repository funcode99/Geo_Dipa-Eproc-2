export const actionTypes = {
  SetContractById: "[Set Contract By Id] Action",
  SetDataJasa: "[Set Data Jasa] Action",
  SetDataBarang: "[Set Data Barang] Action",
  SetDataDocuments: "[Set Data Documents] Action",
  SetSubmitItemsByContractId: "[Set Submit Items by Contract Id] Action",
  SetDataTask: "[Set Data Task] Action",
  SetDataOrderItems: "[Set Data Order Items] Action",
  SetDataTempOrderItems: "[Set Data Temp Order Items] Action",
  SetDataUpdateOrderItems: "[Set Data Update Order Items] Action",
  SetDataClause: "[Set Data Clause] Action",
  SetDraftingClause: "[Set Drafting Clause] Action",
  SetRequestClause: "[Set Request Clause] Action",
  SetIsAddJobPrice: "[Set Is Add Job Price] Action",
  SetConclusion: "[Set Conclusion] Action",
  SetReactSelectAuthorizedOfficial:
    "[Set React Select Authorized Official] Action",
  saveNotifDM: "SAVE_NOTIFICATION_DM",
};

export const save_data_task = (payload) => ({
  type: actionTypes.SetDataTask,
  payload,
});

export const set_contract_id = (payload) => ({
  type: actionTypes.SetContractById,
  payload,
});
