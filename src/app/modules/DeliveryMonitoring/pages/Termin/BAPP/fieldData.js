const formData = [
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
    name: "jenis",
    label: "Jenis Pekerjaan",
    // placeholder: "ada placeholder",
  },
  {
    name: "nomor_contract",
    label: "Dasar Pelaksanaan",
  },
  {
    name: "nomor_po",
  },
  {
    name: "hasil_pekerjaan",
    label: "Hasil pelaksanaan pekerjaan yang telah diselesaikan",
    typeInput: "TextAreaInput",
  },
];

export const formData2 = [
  {
    name: "tanggal_bapp",
    label: "Tanggal BAPP",
    typeInput: "SelectDateInput",
  },
  {
    name: "pelaksana",
    label: "Pelaksana Pekerjaan",
  },
];

export default formData;
