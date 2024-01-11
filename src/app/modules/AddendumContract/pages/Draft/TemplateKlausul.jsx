import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import IconButton from "./components/assets/IconButton";
import TitleComponent from "./components/TitleComponent";
import {
  submitTemplateKlausul,
  submitGenerateTemplate,
} from "app/modules/AddendumContract/service/AddendumContractCrudService";

const TemplateKlausul = ({ data, contract_id }) => {
  const generateTemplate = async () => {
    try {
      await submitGenerateTemplate({
        add_contract_id: contract_id,
      }).then((res) => alert(res.data.data));
      setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };

  const PostTemplateKlausul = async () => {
    try {
      await submitTemplateKlausul({ add_contract_id: contract_id });
      alert("Berhasil simpan data!");
      setTimeout(() => {
        window.location.reload(true);
      }, 3000);
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };
  return (
    <>
      <div className="bg-white p-10 rounded mt-11">
        {!data?.link_generate_template && (
          <div className="button-template mb-4">
            <button
              className="btn btn-primary"
              onClick={() => generateTemplate()}
            >
              <span className="mr-3">
                <IconButton />
              </span>
              Generate Template Klausul
            </button>
          </div>
        )}
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
          {data?.link_generate_template ? (
            data?.link_generate_template?.map((item, index) => (
              <div className="field-pertama mt-8" key={index}>
                {index === 0 ? (
                  <TitleComponent title="A. Template Word Body Kontrak" />
                ) : (
                  <TitleComponent
                    title={`${String.fromCharCode(
                      65 + index
                    )}. Lampiran ${index}`}
                  />
                )}
                <div
                  className="field-template mt-4"
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    color: "#498FE4",
                    border: "1px solid #000000",
                  }}
                >
                  <a href={item.url} target="_blank">
                    {item.name}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>Link belum tergenerate</p>
          )}
        </div>
        <div className="button-submit mt-8 d-flex justify-content-end">
          <Button
            className="btn btn-primary"
            onClick={() => PostTemplateKlausul()}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};
const mapState = (state) => ({
  dataNewClause: state.addendumContract.dataNewClause,
});

export default connect(mapState, null)(TemplateKlausul);
