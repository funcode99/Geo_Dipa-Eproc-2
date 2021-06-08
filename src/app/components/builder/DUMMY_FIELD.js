import TitleField from "../input/TitleField";

const DUMMY_FIELD = [
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Akta Pendirian",
    },
  },
  {
    name: "nama",
    placeholder: "NAME SURNAME",
    label: "NAMA LENGKAP SESUAI KTP",
  },
  {
    name: "tanggal_lahir",
    typeInput: "SelectDateInput",
    format: "yyyy-MM-dd",
    placeholder: "CITY/21011971",
    label: "TANGGAL LAHIR",
  },
  {
    name: "select2",
    label: "PROVINSI",
    typeInput: "UploadInput",
  },
  {
    name: "select2",
    label: "PROVINSI",
    typeInput: "TextAreaInput",
  },
  {
    name: "select",
    label: "PROVINSI",
    typeInput: "SelectInputCustom",
    data: [1, 2, 3, 4],
    // trigger: true,
  },
];

export default DUMMY_FIELD;
