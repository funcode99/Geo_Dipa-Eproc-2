import { Formik, Form } from "formik";
import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import UpdateButton from "app/components/button/ButtonGlobal/UpdateButton.jsx";
import { actionTypes } from "app/modules/AddendumContract/_redux/addendumContractAction";
import { submitOther } from "app/modules/AddendumContract/service/AddendumContractCrudService";
import PerubahanKlausulKontrak from "app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/Components/PerubahanKlausulKontrak";

const Lainnya = ({
  jsonData,
  contract_id,
  otherCurrent,
  dataNewClause,
  add_contract_others,
  dataNewClauseDrafting,
}) => {
  const dispatch = useDispatch();
  const submitFormParameterOther = (values) => {
    submitOther(
      {
        add_contract_id: contract_id,
        body_clause_data: [values.body_data],
        attachment_clause_data: values.attachment_data,
      },
      contract_id
    );
    alert("Berhasil Update Data!");
  };
  const openCloseAddClause = React.useRef();
  const showAddClause = () => {
    openCloseAddClause.current.open();
  };
  const openCloseAddContract = React.useRef();
  const showAddContract = () => {
    openCloseAddContract.current.open();
  };

  useEffect(() => {
    if (add_contract_others?.attachment_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_others?.attachment_clause_data || [
          {
            attachment_number: "",
            clause_note: "",
          },
        ],
        fieldType: "refill_attachment_clause_data",
        fromWhere: "other",
      });
    }
    if (add_contract_others?.body_clause_data !== null) {
      dispatch({
        type: actionTypes.SetDraftingClause,
        payload: add_contract_others?.body_clause_data || [
          {
            clause_number: "",
            before_clause_note: "",
            after_clause_note: "",
          },
        ],
        fieldType: "refill_body_clause_data",
        fromWhere: "other",
      });
    }
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        body_data: dataNewClauseDrafting?.other?.bodyClauseData,
        attachment_data: dataNewClauseDrafting?.other?.attachmentClauseData,
      }}
      onSubmit={(values) => {
        submitFormParameterOther(values);
      }}
    >
      {(props) => {
        const { values } = props;
        return (
          <Form>
            <PerubahanKlausulKontrak
              subTitle={"A"}
              values={values}
              isDrafting={true}
              title={"Lainnya"}
              fromWhere={"other"}
              showAddClause={showAddClause}
              showAddContract={showAddContract}
            />

            <UpdateButton fromWhere={"other"} isDrafting={true} />
          </Form>
        );
      }}
    </Formik>
  );
};

// export default Lainnya;
const mapState = (state) => ({
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

export default connect(mapState, null)(Lainnya);
