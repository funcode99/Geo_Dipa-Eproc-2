import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import IconButton from "./components/assets/IconButton";
import TitleComponent from "./components/TitleComponent";

const TemplateKlausul = () => {
  return (
    <>
      <div className="bg-white p-10 rounded mt-11">
        <div className="button-template mb-4">
          <button
            className="btn"
            style={{ backgroundColor: "#498FE4", color: "#ffffff" }}
          >
            <span className="mr-3">
              <IconButton />
            </span>
            Generate Template Klausul
          </button>
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
          <div className="field-pertama">
            <TitleComponent title="A. Template Word Body Kontrak" />
            <div
              className="field-template mt-4"
              style={{
                padding: 8,
                borderRadius: 8,
                color: "#498FE4",
                border: "1px solid #000000",
              }}
            >
              <a
                href="https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNliteIZ0eg?e=5mhN9Q"
                target="_blank"
              >
                https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNliteIZ0eg?e=5mhN9Q
              </a>
            </div>
          </div>

          <div className="field-kedua mt-8">
            <TitleComponent title="B. Template Word Lampiran 1" />
            <div
              className="field-template mt-4"
              style={{
                padding: 8,
                borderRadius: 8,
                color: "#498FE4",
                border: "1px solid #000000",
              }}
            >
              <a
                href="https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNliteIZ0eg?e=5mhN9Q"
                target="_blank"
              >
                https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNliteIZ0eg?e=5mhN9Q
              </a>
            </div>
          </div>

          <div className="field-ketiga mt-8">
            <TitleComponent title="C. Template Word Lampiran 2" />
            <div
              className="field-template mt-4"
              style={{
                padding: 8,
                borderRadius: 8,
                color: "#498FE4",
                border: "1px solid #000000",
              }}
            >
              <a
                href="https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNliteIZ0eg?e=5mhN9Q"
                target="_blank"
              >
                https://geodipa-my.sharepoint.com/:w:/g/personal/contract_admin_geodipa_id/EVLWq8U2WxVLgVmHO--FqR0BiX_FbrptwluwNliteIZ0eg?e=5mhN9Q
              </a>
            </div>
          </div>
        </div>
        <div className="button-submit mt-8 d-flex justify-content-end">
          <Button
            className="btn"
            style={{ backgroundColor: "#498FE4", color: "#ffffff" }}
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
