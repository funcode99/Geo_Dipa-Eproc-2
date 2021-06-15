import TitleField from "../../../../../../components/input/TitleField";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";

export const formData1 = [
  {
    name: "nomor_bast",
    label: "Nomor BAST",
  },
  {
    name: "tanggal_bast",
    label: "Tanggal BAST",
    typeInput: "SelectDateInput",
  },
  {
    name: "jenis",
    label: "Jenis Pekerjaan",
  },
  {
    name: "pelaksana",
    label: "Pelaksana Pekerjaan",
  },
  {
    name: "nomor_contract",
    label: "Dasar Pelaksanaan",
  },
  {
    name: "nomor_po",
  },
];

export const formData2 = [
  {
    name: "hasil_pekerjaan",
    label: "Hasil pekerjaan yang telah diselesaikan",
    typeInput: "TextAreaInput",
  },
];

export const formData3 = [
  [
    {
      name: "nomor_bast",
      label: "Nomor BAST",
    },
    {
      name: "tanggal_bast",
      label: "Tanggal BAST",
      typeInput: "SelectDateInput",
    },
  ],
  [
    {
      name: "jenis",
      label: "Jenis Pekerjaan",
      // placeholder: "ada placeholder",
    },
    {
      name: "pelaksana",
      label: "Pelaksana Pekerjaan",
    },
  ],
  [
    {
      name: "nomor_contract",
      label: "Dasar Pelaksanaan",
    },
  ],
  [
    {
      name: "hasil_pekerjaan",
      label: "Hasil pekerjaan yang telah diselesaikan",
      typeInput: "TextAreaInput",
    },
  ],
  // [
  //   {
  //     name: "file_attachment",
  //     label: "File",
  //     typeInput: "UploadInput",
  //   },
  //   {
  //     name: "select_example",
  //     label: "PROVINSI",
  //     typeInput: "SelectInputCustom",
  //     isMulti: true,
  //   },
  // ],
];

export const valSchemaPihakPertama = object().shape({
  nama_pemberi: validation.require("Nama Pemberi Kerja"),
});
