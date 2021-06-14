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

export default formData;
