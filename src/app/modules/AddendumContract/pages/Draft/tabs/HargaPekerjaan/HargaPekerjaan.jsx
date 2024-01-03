import { Formik, Form } from "formik";
import Title from "./Component/Title";
import { fetch_api_sg } from "redux/globalReducer";
import Currency from "./Component/Currency";
import { FormattedMessage } from "react-intl";
import { TableContainer } from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import React, { useState, useRef, useEffect } from "react";
import { formatCurrencyIDR } from "./Helper/formartCurrencyIDR";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton";
import TableRincianHargaPekerjaanAwal from "./Table/TableRincianHargaPekerjaanAwal";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { submitJobPrice } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import NewClause from "../../../ContractDetail/components/FormAddendum/Components/Modal/NewClause";
import GRAccord from "app/modules/DeliveryMonitoring/pages/Termin/ServiceAccGR/components/GRAccord";
import Item from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/Item";
import PerubahanKlausulKontrak from "../../../ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import EditableTable from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/EditableTable/index";

const HargaPekerjaan = ({
  data,
  isDisable,
  contract_id,
  dataAfterAdendum,
  jobPriceCurrent,
  dataNewClauseDrafting,
  add_contract_job_price,
}) => {
  const dispatch = useDispatch();
  const openCloseAddDetail = useRef();
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const [item, setItem] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [currencies, setDataCurrencies] = useState([]);

  let currenciesIndex = 0;
  const valueAfterAddendum = JSON.parse(
    localStorage.getItem("value_after_addendum")
  );
  useEffect(() => {
    function sum(total, data) {
      return total + Math.round(data?.subtotal);
    }
    setGrandTotal(item?.reduce(sum, 0));
  }, [item]);

  const getCurrencies = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/currencies`,
        onSuccess: (res) => {
          setDataCurrencies(res);
        },
      });
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    if (add_contract_job_price?.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_job_price?.attachment_clause_data || [
          {
            attachment_number: "",
            clause_note: "",
          },
        ],
        fieldType: "refill_attachment_clause_data",
        fromWhere: "job_price",
      });
    }
    if (add_contract_job_price?.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_job_price?.body_clause_data || {
          clause_number: "",
          before_clause_note: "",
          after_clause_note: "",
        },
        fieldType: "refill_body_clause_data",
        fromWhere: "job_price",
      });
    }
  }, [add_contract_job_price]);

  useEffect(() => {
    getCurrencies();
  }, []);

  const showAddDetail = () => {
    openCloseAddDetail.current.open();
  };

  const submitFormParameterJobPrice = (values) => {
    if (dataAfterAdendum?.after_addendum_job_price == grandTotal) {
      submitJobPrice(
        {
          add_contract_id: contract_id,
          currency_id: currencies.count[currenciesIndex].id,
          item: values.data,
          body_clause_data: values.body_data,
          attachment_clause_data: values.attachment_data,
        },
        contract_id
      );
      alert("Berhasil update data!");
    } else {
      alert(
        "Jumlah rincian pekerjaan anda belum sama dengan nilai perjanjian setelah addendum!"
      );
    }
  };

  return (
    <>
      <NewClause
        isDrafting={true}
        fromWhere={"job_price"}
        fieldType={"clause_attachment"}
        openCloseAddClause={openCloseAddClause}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          data: item,
          body_data: dataNewClauseDrafting.job_price.bodyClauseData,
          attachment_data: dataNewClauseDrafting.job_price.attachmentClauseData,
        }}
        onSubmit={(values) => {
          submitFormParameterJobPrice(values);
        }}
      >
        {({ values }) => (
          <Form>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 40,
              }}
            ></div>
            <div className="bg-white p-10 rounded">
              <div
                className="div"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #000000",
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                <div className="nilai-perjanjian-kontrak-awal">
                  <Currency
                    value={data?.contract_value}
                    currencyCode={data?.currency?.code}
                    title={"  Nilai perjanjian kontrak awal"}
                  />
                </div>

                <div className="rincian-harga-perkerjaan-awal mt-8">
                  <Title title="Rincian Harga Pekerjaan Awal" />
                  <TableRincianHargaPekerjaanAwal data={data?.contract_items} />
                </div>

                <div className="rincian-harga-po-sap mt-8">
                  <Title title=" Rincian Harga PO-SAP" />
                  <GRAccord
                    id={"title.termtable"}
                    label={<FormattedMessage id="TITLE.ITEM_TABLE" />}
                  >
                    <Item isData={true} data={data} />
                  </GRAccord>
                </div>

                <div className="nilai-perjanjian-setelah-adendum mt-8">
                  <Currency
                    title={"A. Nilai Perjanjian Setelah Addendum"}
                    value={dataAfterAdendum?.after_addendum_job_price}
                    currencyCode={
                      dataAfterAdendum?.add_contract_job_price?.currency_id
                    }
                  />
                </div>

                <div className="adendum-rincian-harga-pekerjaan mt-8">
                  <TableContainer>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Title title="B. Addendum Rincian Harga Pekerjaan" />
                      <div
                        style={{
                          display: "flex",
                          gap: 14,
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-success text-white"
                        >
                          + Harga Pekerjaan By Excel
                        </button>
                        <button
                          type="button"
                          disabled={isDisable}
                          onClick={showAddDetail}
                          className="btn btn-primary text-white"
                        >
                          + Tambah Rincian
                        </button>
                      </div>
                    </div>
                    <EditableTable
                      func={setItem}
                      jobPriceCurrent={jobPriceCurrent}
                      previousData={data?.contract_items}
                      openCloseAddDetail={openCloseAddDetail}
                      grandTotal={formatCurrencyIDR(grandTotal)}
                    />
                  </TableContainer>
                </div>
              </div>
              <div className="mt-8"></div>
              <PerubahanKlausulKontrak
                subTitle={"C"}
                values={values}
                isDrafting={true}
                isMandatory={true}
                fromWhere={"job_price"}
                isDisable={!isDisable}
                title={"Harga Pekerjaan"}
                showAddClause={showAddClause}
              />
              <UpdateButton
                isDrafting={true}
                isMandatory={true}
                isDisable={isDisable}
                fromWhere={"job_price"}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};

const mapDispatch = {
  fetch_api_sg,
};
const mapState = (state) => ({
  dataNewClause: state.addendumContract.dataNewClause,
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, mapDispatch)(HargaPekerjaan);
