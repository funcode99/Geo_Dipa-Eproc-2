import React from "react";
import { Formik, Form } from "formik";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";
import { submitOther } from "app/modules/AddendumContract/service/AddendumContractCrudService";

const Lainnya = ({ jsonData, dataNewClause, contract_id, otherCurrent }) => {
  const submitFormParameterOther = (values) => {
    submitOther(
      {
        add_contract_id: localStorage.getItem("add_contract_id"),
        body_clause_data: [values.body_data],
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
  };
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const openCloseAddContract = React.useRef();
  const showAddContract = () => {
    openCloseAddContract.current.open();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        body_data: dataNewClause?.other.bodyClauseData,
        attachment_data: dataNewClause?.other.attachmentClauseData,
      }}
      onSubmit={(values) => {
        submitFormParameterOther(values);
      }}
    >
      {({ values }) => (
        <Form>
          <PerubahanKlausulKontrak
            subTitle={"A"}
            title={"Lainnya"}
            fromWhere={"other"}
            showAddClause={showAddClause}
            showAddContract={showAddContract}
            values={values}
            isDrafting={true}
          />

          <UpdateButton fromWhere={"other"} isDrafting={true} />
        </Form>
      )}
    </Formik>
  );
};

export default Lainnya;
