const BASE_MODAL_CONF = [
  //   {
  //     type: "delete",
  //     title: "Yakin ingin menghapus dokumen ini ?",
  //     subTitle: "Setelah dihapus, dokumen tidak akan lagi ditampilkan",
  //   },
  {
    type: "submit",
    title: "Yakin ingin mengirim dokumen ini ?",
    subTitle: "Pastikan dokumen yang anda kirimkan sudah sesuai !",
  },
  {
    type: "accept",
    title: "Yakin ingin mengkonfirmasi dokumen ini ?",
    subTitle: "Pastikan dokumen yang dikirimkan telah sesuai !",
  },
  {
    type: "reject",
    title: "Yakin ingin menolak dokumen ini ?",
    subTitle: "Pastikan dokumen yang dikirimkan tidak sesuai !",
    isReject: true,
  },
];

export const PROGRESS_CONF = [
  {
    subTitle: "Harian",
    scheme: "danger",
    percentage: "20",
    name: "HARIAN",
  },
  {
    subTitle: "Mingguan",
    scheme: "warning",
    percentage: "30",
    name: "MINGGUAN",
  },
  {
    subTitle: "Bulanan",
    scheme: "success",
    percentage: "50",
    name: "BULANAN",
  },
];

export default BASE_MODAL_CONF;
