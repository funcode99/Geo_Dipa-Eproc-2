const formData = [
  [
    {
      name: "party1_name",
      label: "Pejabat Berwenang Pihak 1",
    },
    {
      name: "party2_name",
      label: "Pejabat Berwenang Pihak 2",
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
    label: "Pihak 1 Pejabat Berwenang",
  },
  {
    name: "party1_jabatan",
    label: "Pihak 1 Jabatan",
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
    name: "party2_name",
    label: "Pihak 2 Pejabat Berwenang",
  },
  {
    name: "party2_jabatan",
    label: "Pihak 2 Jabatan",
  },
  {
    name: "pelaksana",
    label: "Pelaksana Pekerjaan",
  },
];

export default formData;
