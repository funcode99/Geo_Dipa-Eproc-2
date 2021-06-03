import React from "react";
import { StyledModal } from "../../../../../../components/modals";
import useToast from "../../../../../../components/toast";
import * as documentOption from "../../../../../../service/Document";
import Select from "react-select";

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
    // console.log(`e`, e);
    setOptionSelected(e);
  };

  React.useEffect(() => {
    getDocumentTypeOption();
  }, []);

  const handleSubmit = React.useCallback(() => {
    if (optionSelected !== false) onSubmit(optionSelected);
    else setToast("Mohon pilih tipe jawaban !");
    setOptionSelected(false);
  }, [optionSelected, onSubmit, setToast, setOptionSelected]);
  const handleClose = React.useCallback(() => {
    onClose();
    setOptionSelected(false);
  }, [setOptionSelected]);
  //   console.log(`content`, content);

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
            options: el?.documents?.map((el2) => ({
              value: el2?.id,
              label: `${el2?.name} ${el2?.periode !== null &&
                `(${el2?.periode?.name})`}`,
            })),
          }))}
          // options={groupedOptions}
          formatGroupLabel={formatGroupLabel}
        />
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
            disabled={optionSelected === false}
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
