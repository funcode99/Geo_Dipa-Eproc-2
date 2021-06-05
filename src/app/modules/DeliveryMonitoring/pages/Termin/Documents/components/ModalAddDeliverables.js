import React, { useEffect } from "react";
import { StyledModal } from "../../../../../../components/modals";
import useToast from "../../../../../../components/toast";
import * as documentOption from "../../../../../../service/Document";
import Select from "react-select";
import { Form, Row, Col } from "react-bootstrap";

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const ModalAddDeliverables = ({ visible, onClose, onSubmit }) => {
  const [content, setContent] = React.useState({
    loading: false,
    data: [],
  });
  const [Toast, setToast] = useToast();
  const [optionSelected, setOptionSelected] = React.useState(false);
  const [remarks, setRemarks] = React.useState(false);
  const [isCustom, setIsCustom] = React.useState(false);

  const getDocumentTypeOption = async () => {
    try {
      setContent((prev) => ({ ...prev, loading: true }));
      const {
        data: { data },
      } = await documentOption.getDocTypeOptions();
      setContent({ data: data.document_types, loading: false });
    } catch (error) {
      setToast("Error API, please contact developer!");
    } finally {
      setContent((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSelectChange = (e) => {
    if (e === null) {
      setOptionSelected(false);
      setIsCustom(false);
    } else {
      let resTemp = e.filter(({ value }) =>
        value.includes(`\"is_custom\":true`)
      );
      let resTemp2 = e.filter(
        ({ value }) => !value.includes(`\"is_custom\":true`)
      );
      console.log(`e`, e, resTemp);
      if (resTemp.length > 0) {
        if (isCustom === true) {
          setOptionSelected(resTemp2);
          setIsCustom(false);
        } else {
          setOptionSelected(resTemp.pop());
          setIsCustom(true);
        }
      } else if (resTemp.length < 1) {
        setOptionSelected(resTemp2);
        setIsCustom(false);
      }
    }
  };

  const handleRemarksChange = (e) => {
    // console.log(`e`, e.target.value);
    setRemarks(e.target.value);
  };

  React.useEffect(() => {
    getDocumentTypeOption();
  }, []);

  const handleSubmit = React.useCallback(() => {
    // console.log(`optionSelected`, optionSelected);
    if (optionSelected !== false) {
      let firstObj = optionSelected[0];
      if (isCustom === true) onSubmit({ ...optionSelected, remarks });
      else onSubmit(optionSelected);
    } else setToast("Mohon pilih tipe jawaban !");
    setTimeout(() => {
      setOptionSelected(false);
    }, 500);
  }, [
    optionSelected,
    onSubmit,
    isCustom,
    remarks,
    setToast,
    setOptionSelected,
  ]);
  const handleClose = React.useCallback(() => {
    onClose();
    setOptionSelected(false);
  }, [setOptionSelected]);
  //   console.log(`content`, content);

  // useEffect(() => {
  //   if (optionSelected?.length > 0) {
  //     optionSelected.forEach((el, id) => {
  //       let parsed = JSON.parse(el.value);
  //       if (parsed.is_custom) {
  //         setIsCustom(true);
  //         if (
  //           optionSelected.length !== 1 ||
  //           (optionSelected.length === 1 && isCustom === false)
  //         ) {
  //           setOptionSelected([el]);
  //         }
  //         console.log(`optionSelected`, JSON.parse(el.value));
  //       }
  //     });
  //   }
  // }, [optionSelected]);

  return (
    <React.Fragment>
      <Toast />
      <StyledModal
        visible={visible}
        onClose={handleClose}
        minWidth="30vw"
        maxWidth="35vw"
      >
        {/* <form onSubmit={() => onSubmit(optionSelected)}> */}
        <div className="d-flex align-items-start flex-column">
          <h3>Tambah Dokumen Baru</h3>
          <h6> Silahkan pilih jenis dokumen yang akan ditambahkan</h6>
        </div>
        <Select
          isMulti
          value={optionSelected}
          onChange={(e) => handleSelectChange(e)}
          // defaultValue={}
          options={content?.data?.map((el) => ({
            label: el.name,
            options: el?.documents?.reverse().map((el2) => ({
              value: JSON.stringify(el2),
              // value: el2?.id,
              label: `${el2?.name} ${
                el2?.periode?.hasOwnProperty("name")
                  ? `(${el2?.periode?.name})`
                  : ""
              }`,
            })),
          }))}
          // options={groupedOptions}
          formatGroupLabel={formatGroupLabel}
        />
        {isCustom && (
          <Form.Group className="my-3" controlId="formBasicEmail">
            <Form.Label>Nama Dokumen Lainnya</Form.Label>
            <Form.Control
              type="input"
              onChange={handleRemarksChange}
              // placeholder="COMING SOON"
              // disabled={!isCustom}
            />
          </Form.Group>
        )}
        {/* <div className="row">
          <div className="col-12">
            <select
              value={optionSelected}
              className="form-control m-select2"
              onChange={(e) => handleSelectChange(e)}
            >
              <option value={false}>Pilih jawaban ...</option>
              {content?.data?.map((el, id) => (
                <optgroup label={el.name} key={id}>
                  {el?.documents?.map((els, id) => (
                    <option value={els.id} key={id}>
                      {els.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div> */}

        <div className="d-flex mt-5">
          <button
            disabled={
              optionSelected === false ||
              (isCustom === true && remarks === false)
            }
            onClick={handleSubmit}
            className="btn btn-primary ml-auto"
          >
            Tambahkan
          </button>
        </div>
        {/* </form> */}
      </StyledModal>
    </React.Fragment>
  );
};

export default ModalAddDeliverables;
