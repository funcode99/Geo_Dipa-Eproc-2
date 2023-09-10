import React from "react";
const formData = [
  [
    {
      name: "party1_name",
      label: "Direksi Pekerjaan",
    },
    {
      name: "party2_name",
      label: "Pejabat Berwenang",
    },
  ],
  [
    {
      name: "party1_jabatan",
      label: "Jabatan Berwenang Pihak 1",
    },
    {
      name: "party2_jabatan",
      label: "Jabatan Berwenang Pihak 2",
    },
  ],
  [
    {
      name: "nomor_bapp",
      label: "Nomor BAPP",
    },
    {
      name: "tanggal_bapp",
      label: "Tanggal BAPP",
      typeInput: "SelectDateInput",
    },
  ],
  [
    {
      name: "jenis",
      label: "Jenis Pekerjaan",
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
      label: "Nomor PO",
      name: "nomor_po",
    },
  ],
  [
    {
      name: "hasil_pekerjaan",
      label: "Hasil pelaksanaan pekerjaan yang telah diselesaikan",
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

export const formData1 = [
  {
    name: "nomor_bapp",
    label: "Nomor BAPP",
  },
  {
    name: "party1_name",
    label: "Direksi Pekerjaan",
  },
  {
    name: "party1_jabatan",
    label: "Jabatan Direksi Pekerjaan",
  },
  {
    name: "jenis",
    label: "Jenis Pekerjaan",
    // placeholder: "ada placeholder",
  },
  {
    name: "nomor_contract",
    label: "Dasar Pelaksanaan",
  },
  {
    label: "Nomor PO",
    name: "nomor_po",
  },
  // {
  //   children: (
  //     <div className="row">
  //       <div className="col-4"> </div>
  //       <div className="col-8">
  //         *Jika kontrak memiliki addendum, maka tambahkan kolom untuk addendum
  //       </div>
  //     </div>
  //   ),
  // },
];

export const formData2 = [
  {
    name: "tanggal_bapp",
    label: "Tanggal BAPP",
    typeInput: "SelectDateInput",
  },
  {
    name: "party2_name",
    label: "Pejabat Berwenang",
  },
  {
    name: "party2_jabatan",
    label: "Jabatan Pejabat Berwenang",
  },
  {
    name: "pelaksana",
    label: "Pelaksana Pekerjaan",
  },
  {
    name: "hasil_pekerjaan",
    label: "Hasil pelaksanaan pekerjaan yang telah diselesaikan",
    typeInput: "TextAreaInput",
  },
];

export default formData;
