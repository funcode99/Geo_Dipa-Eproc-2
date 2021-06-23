import TitleField from "../../../../../../components/input/TitleField";
import { object } from "yup";
import validation from "../../../../../../service/helper/validationHelper";
import { FormattedMessage } from "react-intl";
import React from 'react'

const TextIni = ({text}) => (
  <FormattedMessage id={`PARTIES.NAMA_PEMBERI`} />
)


export const formData1 = [
  [
    {
      name: "nama_pemberi",
      label: <TextIni text={'NAMA_PEMBER'} />,
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Akta Pendirian",
    },
  },
  [
    {
      name: "nama_notaris",
      label: "Nama Notaris",
    },
  ],
  [
    {
      name: "akta",
      label: "Nomor Akta",
    },
    {
      name: "tgl_akta",
      label: "Tanggal Akta",
    },
  ],
  [
    {
      name: "sk_kemenkum",
      label: "Nomor SK Kemenkumham",
    },
    {
      name: "tgl_sk_kemenkum",
      label: "Tanggal SK",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Akta Perubahan Terakhir",
    },
  },
  [
    {
      name: "nama_notaris_akhir",
      label: "Nama Notaris",
    },
  ],
  [
    {
      name: "akta_akhir",
      label: "Nomor Akta",
    },
    {
      name: "tgl_akta_akhir",
      label: "Tanggal Akta",
    },
  ],
  [
    {
      name: "sk_kemenkum_akhir",
      label: "Nomor SK Kemenkumham",
    },
    {
      name: "tgl_sk_kemenkum_akhir",
      label: "Tanggal SK",
    },
  ],
  [
    {
      name: "domisili_hukum",
      label: "Domisili Hukum",
      typeInput: "TextAreaInput",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Pejabat Berwenang",
    },
  },
  [
    {
      name: "nama_pejabat",
      label: "Nama Pejabat",
    },
    {
      name: "telp_pejabat",
      label: "Telp",
    },
  ],
  [
    {
      name: "jabatan_pejabat",
      label: "Jabatan Pejabat",
    },
    {
      name: "fax_pejabat",
      label: "Fax",
    },
  ],
  [
    {
      name: "alamat_pejabat",
      label: "Alamat",
      typeInput: "TextAreaInput",
    },
  ],
  [
    {
      name: "nama_notaris_penugasan",
      label: "Nama Notaris",
    },
  ],
  [
    {
      name: "sk_penugasan",
      label: "Nomor SK Penugasan",
    },
    {
      name: "tgl_sk_penugasan",
      label: "Tanggal SK",
    },
  ],
  [
    {
      name: "akta_penugasan",
      label: "Nomor Akta",
    },
    {
      name: "tgl_akta_penugasan",
      label: "Tanggal Akta",
    },
  ],
  [
    {
      name: "sk_kemenkum_penugasan",
      label: "Nomor SK Kemenkumham",
    },
    {
      name: "tgl_sk_kemenkum_penugasan",
      label: "Tanggal SK",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Direksi Pekerjaan",
    },
  },
  [
    {
      name: "jabatan_direksi",
      label: "Jabatan",
    },
    {
      name: "telp_direksi",
      label: "Telp",
    },
  ],
  [
    {
      name: "alamat_direksi",
      label: "Alamat",
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_direksi",
      label: "Fax",
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
      name: "jabatan_pengawas",
      label: "Jabatan",
    },
    {
      name: "telp_pengawas",
      label: "Telp",
    },
  ],
  [
    {
      name: "alamat_pengawas",
      label: "Alamat",
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_pengawas",
      label: "Fax",
    },
  ],
];
export const formData2 = [
  [
    {
      name: "nama_penyedia",
      label: "Nama Penyedia",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Akta Pendirian",
    },
  },
  [
    {
      name: "nama_notaris_2",
      label: "Nama Notaris",
    },
  ],
  [
    {
      name: "akta_2",
      label: "Nomor Akta",
    },
    {
      name: "tgl_akta_2",
      label: "Tanggal Akta",
    },
  ],
  [
    {
      name: "sk_kemenkum_2",
      label: "Nomor SK Kemenkumham",
    },
    {
      name: "tgl_sk_kemenkum_2",
      label: "Tanggal SK",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Akta Perubahan Terakhir",
    },
  },
  [
    {
      name: "nama_notaris_akhir_2",
      label: "Nama Notaris",
    },
  ],
  [
    {
      name: "akta_akhir_2",
      label: "Nomor Akta",
    },
    {
      name: "tgl_akta_akhir_2",
      label: "Tanggal Akta",
    },
  ],
  [
    {
      name: "sk_kemenkum_akhir_2",
      label: "Nomor SK Kemenkumham",
    },
    {
      name: "tgl_sk_kemenkum_akhir_2",
      label: "Tanggal SK",
    },
  ],
  [
    {
      name: "domisili_hukum_2",
      label: "Domisili Hukum",
      typeInput: "TextAreaInput",
    },
  ],
  {
    Child: TitleField,
    ChildrenProps: {
      title: "Pejabat Berwenang",
    },
  },
  [
    {
      name: "nama_pejabat_2",
      label: "Nama Pejabat",
    },
    {
      name: "telp_pejabat_2",
      label: "Telp",
    },
  ],
  [
    {
      name: "jabatan_pejabat_2",
      label: "Jabatan Pejabat",
    },
    {
      name: "fax_pejabat_2",
      label: "Fax",
    },
  ],
  [
    {
      name: "alamat_pejabat_2",
      label: "Alamat",
      typeInput: "TextAreaInput",
    },
  ],
  [
    {
      name: "nama_notaris_penugasan_2",
      label: "Nama Notaris",
    },
  ],
  [
    {
      name: "sk_penugasan_2",
      label: "Nomor SK Penugasan",
    },
    {
      name: "tgl_sk_penugasan_2",
      label: "Tanggal SK",
    },
  ],
  [
    {
      name: "akta_penugasan_2",
      label: "Nomor Akta",
    },
    {
      name: "tgl_akta_penugasan_2",
      label: "Tanggal Akta",
    },
  ],
  [
    {
      name: "sk_kemenkum_penugasan_2",
      label: "Nomor SK Kemenkumham",
    },
    {
      name: "tgl_sk_kemenkum_penugasan_2",
      label: "Tanggal SK",
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
      title: "Direksi Pekerjaan",
    },
  },
  [
    {
      name: "jabatan_direksi_2",
      label: "Jabatan",
    },
    {
      name: "telp_direksi_2",
      label: "Telp",
    },
  ],
  [
    {
      name: "alamat_direksi_2",
      label: "Alamat",
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_direksi_2",
      label: "Fax",
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
      label: "Jabatan",
    },
    {
      name: "telp_pengawas_2",
      label: "Telp",
    },
  ],
  [
    {
      name: "alamat_pengawas_2",
      label: "Alamat",
      typeInput: "TextAreaInput",
    },
    {
      name: "fax_pengawas_2",
      label: "Fax",
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
    label: "Jabatan",
  },
  {
    name: "nama_direksi",
    label: "Direksi Pekerjaan",
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
    label: "Jabatan",
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
