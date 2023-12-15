import { Formik, Form } from "formik";
import Title from "./Component/Title";
import { connect } from "react-redux";
import Currency from "./Component/Currency";
import { FormattedMessage } from "react-intl";
import PerubahanKlausul from "./PerubahanKlausul";
import { TableContainer } from "@material-ui/core";
import React, { useState, useRef, useEffect } from "react";
import { formatCurrencyIDR } from "./Helper/formartCurrencyIDR";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton";
import TableRincianHargaPekerjaanAwal from "./Table/TableRincianHargaPekerjaanAwal";
import NewClause from "../../../ContractDetail/components/FormAddendum/Components/Modal/NewClause";
import GRAccord from "app/modules/DeliveryMonitoring/pages/Termin/ServiceAccGR/components/GRAccord";
import Item from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/Item";
// import PerubahanKlausulKontrak from "../../../ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import EditableTable from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/EditableTable/index";
import { submitJobPrice } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import PerubahanKlausulKontrak from "../../../ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";

const HargaPekerjaan = ({
  data,
  isDisable,
  currencies,
  contract_id,
  dataNewClause,
  dataAfterAdendum,
  jobPriceCurrent,
  is_add_job_price,
}) => {
  if (is_add_job_price) {
    isDisable = is_add_job_price;
  }
  const openCloseAddDetail = useRef();
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const [item, setItem] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
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
  const showAddDetail = () => {
    openCloseAddDetail.current.open();
  };

  const submitFormParameterJobPrice = (values) => {
    if (valueAfterAddendum === grandTotal) {
      submitJobPrice(
        {
          add_contract_id: localStorage.getItem("add_contract_id"),
          currency_id: currencies.count[currenciesIndex].id,
          item: values.data,
          body_clause_data: values.body_data,
          attachment_clause_data: values.attachment_data,
        },
        contract_id
      );
    } else {
      alert(
        "Jumlah rincian pekerjaan anda belum sama dengan nilai perjanjian setelah addendum!"
      );
    }
  };

  return (
    <>
      <NewClause
        openCloseAddClause={openCloseAddClause}
        fromWhere={"job_price"}
        fieldType={"clause_attachment"}
        isDrafting={true}
      />
      <Formik
        enableReinitialize={true}
        initialValues={{
          data: item,
          body_data: dataNewClause.job_price.bodyClauseData,
          attachment_data: dataNewClause.job_price.attachmentClauseData,
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
                  padding: 16,
                }}
              >
                <div className="nilai-perjanjian-kontrak-awal">
                  <Currency
                    title={"  Nilai perjanjian kontrak awal"}
                    value={data?.contract_value}
                    currencyCode={data?.currency?.code}
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
                    <Item />
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
                          className="btn btn-primary text-white"
                          onClick={showAddDetail}
                        >
                          + Tambah Rincian
                        </button>
                      </div>
                    </div>
                    <EditableTable
                      openCloseAddDetail={openCloseAddDetail}
                      previousData={data?.contract_items}
                      jobPriceCurrent={jobPriceCurrent}
                      func={setItem}
                      grandTotal={formatCurrencyIDR(grandTotal)}
                    />
                  </TableContainer>
                </div>
              </div>
              {/* <div
                className="mt-8"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #000000",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div className="perubahan-klausul mt-8">
                  <PerubahanKlausul />
                </div>
              </div> */}
              <div className="mt-8"></div>
              <PerubahanKlausulKontrak
                subTitle={"C"}
                title={"Harga Pekerjaan"}
                showAddClause={showAddClause}
                fromWhere={"job_price"}
                isMandatory={true}
                isDrafting={true}
                values={values}
                isDisable={isDisable}
              />
              <UpdateButton
                fromWhere={"job_price"}
                isDrafting={true}
                isMandatory={true}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

const mapState = (state) => ({
  dataNewClause: state.addendumContract.dataNewClause,
});

export default connect(mapState, null)(HargaPekerjaan);
