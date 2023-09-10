// import TitleField from "../../../../../../components/input/TitleField";
import React from "react"
import TitleField from 'app/components/input/TitleField'
import { object } from "yup"
import validation from 'app/service/helper/validationHelper'
import { FormattedMessage } from "react-intl"

const Ini = ({ text }) => <FormattedMessage id={`LABEL.DM.PARTIES.${text}`} />
const Ini2 = ({ text }) => <FormattedMessage id={`LABEL.AC.PARTIES.${text}`} />
// <FormattedMessage id={`CONTRACT_DETAIL.PARTIES.${text}`} />

export const formData1 = [
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini2 text={"ADDENDUM_STATUS"} />
    }
  },
  [
    {
      name: "parties_data",
      label: <Ini2 text={"PARTIES_DATA"} />,
      typeInput: "CheckboxInput"
    },
    {
      name: "job_price",
      label: <Ini2 text={"JOB_PRICE"} />,
      typeInput: "CheckboxInput"
    },
    {
      name: "time_period",
      label: <Ini2 text={"TIME_PERIOD"} />,
      typeInput: "CheckboxInput"
    },
    {
      name: "guarantee",
      label: <Ini2 text={"GUARANTEE"} />,
      typeInput: "CheckboxInput"
    }
  ],
  // ada on karena name nya kosong
  [
    {
      name: "scope_of_work",
      label: <Ini2 text={"SCOPE_OF_WORK"} />,
      typeInput: "CheckboxInput"
    },
    {
      name: "payment_method",
      label: <Ini2 text={"PAYMENT_METHOD"} />,
      typeInput: "CheckboxInput"
    },
    {
      name: "fine",
      label: <Ini2 text={"FINE"} />,
      typeInput: "CheckboxInput"
    }
  ],
  [
    // harus sama dengan key di variabel values file parapihak
    // {
    //   name: "nama_pemberitahu",
    //   label: <Ini text={"NAMA_PEMBERI"} />,
    // },
  ],
  // Deed of Establishment
  // {
  //   Child: TitleField,
  //   ChildrenProps: {
  //     title: <Ini text={"DEED"} />,
  //   },
  // },
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini2 text={"PRICE_CHANGE.TITLE"} />
    }
  },
  [
    {
      name: "start_price",
      label: <Ini2 text={"PRICE_CHANGE.START_PRICE"} /> 
    }
  ],
  [
    {
      name: "end_price",
      label: <Ini2 text={"PRICE_CHANGE.END_PRICE_ADDENDUM"} />,
    },
  ],
  [
    {
      name: "additional_price",
      label: <Ini2 text={"PRICE_CHANGE.ADDITIONAL_PRICE"} />,
    },
    // {
    //   name: "tgl_akta",
    //   label: <Ini text={"DEED_DATE"} />,
    // },
  ],
  [
    {
      name: "subtraction_price",
      label: <Ini2 text={"PRICE_CHANGE.SUBTRACTION_PRICE"} />,
    },
    // {
    //   name: "tgl_sk_kemenkum",
    //   label: <Ini text={"SK_KUM_DATE"} />,
    // },
  ],
  // Last Deed of Establishment
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"DEED_LAST"} />,
    },
  },
  [
    {
      name: "nama_notaris_akhir",
      label: <Ini text={"NAMA_NOTARIS"} />,
    },
  ],
  [
    {
      name: "akta_akhir",
      label: <Ini text={"DEED_NO"} />,
    },
    {
      name: "tgl_akta_akhir",
      label: <Ini text={"DEED_DATE"} />,
    },
  ],
  [
    {
      name: "sk_kemenkum_akhir",
      label: <Ini text={"SK_KUM_NO"} />,
    },
    {
      name: "tgl_sk_kemenkum_akhir",
      label: <Ini text={"SK_KUM_DATE"} />,
    },
  ],
  [
    {
      name: "domisili_hukum",
      label: <Ini text={"LEGAL_DOM"} />,
      typeInput: "TextAreaInput",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"AUTH_OFC"} />,
    },
  },
  [
    {
      name: "nama_pejabat",
      label: <Ini text={"PLACEMAN_NAME"} />,
    },
    {
      name: "telp_pejabat",
      label: <Ini text={"PHONE"} />,
    },
  ],
  [
    {
      name: "jabatan_pejabat",
      label: <Ini text={"PLACEMAN_POSITION"} />,
    },
    {
      name: "fax_pejabat",
      label: <Ini text={"FAX"} />,
    },
  ],
  [
    {
      name: "alamat_pejabat",
      label: <Ini text={"ADDRESS"} />,
      typeInput: "TextAreaInput",
    },
  ],
  [
    {
      name: "nama_notaris_penugasan",
      label: <Ini text={"NAMA_NOTARIS"} />,
    },
  ],
  [
    {
      name: "sk_penugasan",
      label: <Ini text={"SK_ASS_NO"} />,
    },
    {
      name: "tgl_sk_penugasan",
      label: <Ini text={"DATE_SK"} />,
    },
  ],
  [
    {
      name: "akta_penugasan",
      label: <Ini text={"DEED_NO"} />,
    },
    {
      name: "tgl_akta_penugasan",
      label: <Ini text={"DEED_DATE"} />,
    },
  ],
  [
    {
      name: "sk_kemenkum_penugasan",
      label: <Ini text={"SK_KUM_ASS_NO"} />,
    },
    {
      name: "tgl_sk_kemenkum_penugasan",
      label: <Ini text={"DATE_SK"} />,
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"BOARD_DIRECTOR"} />,
    },
  },
  [
    {
      name: "jabatan_direksi",
      label: <Ini text={"PLACEMAN_POSITION"} />,
    },
    {
      name: "telp_direksi",
      label: <Ini text={"PHONE"} />,
    },
  ],
  [
    {
      name: "alamat_direksi",
      label: <Ini text={"ADDRESS"} />,
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_direksi",
      label: <Ini text={"FAX"} />,
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"JOB_SUPERV"} />,
    },
  },
  [
    {
      name: "jabatan_pengawas",
      label: <Ini text={"PLACEMAN_POSITION"} />,
    },
    {
      name: "telp_pengawas",
      label: <Ini text={"PHONE"} />,
    },
  ],
  [
    {
      name: "alamat_pengawas",
      label: <Ini text={"ADDRESS"} />,
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_pengawas",
      label: <Ini text={"FAX"} />,
    },
  ],
];
export const formData2 = [
  [
    {
      name: "nama_penyedia",
      label: <Ini text={"NAMA_PENYEDIA"} />,
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"DEED"} />,
    },
  },
  [
    {
      name: "nama_notaris_2",
      label: <Ini text={"NAMA_NOTARIS"} />,
    },
  ],
  [
    {
      name: "akta_2",
      label: <Ini text={"DEED_NO"} />,
    },
    {
      name: "tgl_akta_2",
      label: <Ini text={"DEED_DATE"} />,
    },
  ],
  [
    {
      name: "sk_kemenkum_2",
      label: <Ini text={"SK_KUM_NO"} />,
    },
    {
      name: "tgl_sk_kemenkum_2",
      label: <Ini text={"SK_KUM_DATE"} />,
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"DEED_LAST"} />,
    },
  },
  [
    {
      name: "nama_notaris_akhir_2",
      label: <Ini text={"NAMA_NOTARIS"} />,
    },
  ],
  [
    {
      name: "akta_akhir_2",
      label: <Ini text={"DEED_NO"} />,
    },
    {
      name: "tgl_akta_akhir_2",
      label: <Ini text={"DEED_DATE"} />,
    },
  ],
  [
    {
      name: "sk_kemenkum_akhir_2",
      label: <Ini text={"SK_KUM_NO"} />,
    },
    {
      name: "tgl_sk_kemenkum_akhir_2",
      label: <Ini text={"SK_KUM_DATE"} />,
    },
  ],
  [
    {
      name: "domisili_hukum_2",
      label: <Ini text={"LEGAL_DOM"} />,
      typeInput: "TextAreaInput",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"AUTH_OFC"} />,
    },
  },
  [
    {
      name: "nama_pejabat_2",
      label: <Ini text={"PLACEMAN_NAME"} />,
    },
    {
      name: "telp_pejabat_2",
      label: <Ini text={"PHONE"} />,
    },
  ],
  [
    {
      name: "jabatan_pejabat_2",
      label: <Ini text={"PLACEMAN_POSITION"} />,
    },
    {
      name: "fax_pejabat_2",
      label: <Ini text={"FAX"} />,
    },
  ],
  [
    {
      name: "alamat_pejabat_2",
      label: <Ini text={"ADDRESS"} />,
      typeInput: "TextAreaInput",
    },
  ],
  [
    {
      name: "nama_notaris_penugasan_2",
      label: <Ini text={"NAMA_NOTARIS"} />,
    },
  ],
  [
    {
      name: "sk_penugasan_2",
      label: <Ini text={"SK_ASS_NO"} />,
    },
    {
      name: "tgl_sk_penugasan_2",
      label: <Ini text={"DATE_SK"} />,
    },
  ],
  [
    {
      name: "akta_penugasan_2",
      label: <Ini text={"DEED_NO"} />,
    },
    {
      name: "tgl_akta_penugasan_2",
      label: <Ini text={"DEED_DATE"} />,
    },
  ],
  [
    {
      name: "sk_kemenkum_penugasan_2",
      label: <Ini text={"SK_KUM_ASS_NO"} />,
    },
    {
      name: "tgl_sk_kemenkum_penugasan_2",
      label: <Ini text={"DATE_SK"} />,
    },
  ],
  [
    {
      name: "email_pic_2",
      label: "Email PIC",
      // typeInput: "TextAreaInput",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: <Ini text={"BOARD_DIRECTOR"} />,
    },
  },
  [
    {
      name: "jabatan_direksi_2",
      label: <Ini text={"PLACEMAN_POSITION"} />,
    },
    {
      name: "telp_direksi_2",
      label: <Ini text={"PHONE"} />,
    },
  ],
  [
    {
      name: "alamat_direksi_2",
      label: <Ini text={"ADDRESS"} />,
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_direksi_2",
      label: <Ini text={"FAX"} />,
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Pengawas Pekerjaan",
    },
  },
  [
    {
      name: "jabatan_pengawas_2",
      label: <Ini text={"PLACEMAN_POSITION"} />,
    },
    {
      name: "telp_pengawas_2",
      label: <Ini text={"PHONE"} />,
    },
  ],
  [
    {
      name: "alamat_pengawas_2",
      label: <Ini text={"ADDRESS"} />,
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_pengawas_2",
      label: <Ini text={"FAX"} />,
    },
  ],
];
export const formData3 = [
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Pemberi Kerja",
    },
  },
  {
    name: "nama_pejabat",
    label: "Nama Pejabat Berwenang",
  },
  {
    name: "jabatan_pejabat",
    label: <Ini text={"PLACEMAN_POSITION"} />,
  },
  {
    name: "nama_direksi",
    label: <Ini text={"BOARD_DIRECTOR"} />,
  },
];
export const formData4 = [
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Penyedia",
    },
  },
  {
    name: "penyedia",
    label: "Nama Penyedia",
  },
  {
    name: "nama_penyedia",
    label: "Nama Pejabat Berwenang",
  },
  {
    name: "jabatan_penyedia",
    label: <Ini text={"PLACEMAN_POSITION"} />,
  },
  {
    name: "email_pic",
    label: "Email PIC",
    // typeInput: "SelectInputCustom",
  },
];

export const valSchemaPihakPertama = object().shape({
  nama_pemberi: validation.require("Nama Pemberi Kerja"),
});
