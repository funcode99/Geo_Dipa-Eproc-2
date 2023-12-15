import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import Navs from "../../../../../../components/navs";
import { FormattedMessage } from "react-intl";
import { formData1, formData2 } from "./fieldData";

const navLists = [
  {
    id: "pertama",
    label: <FormattedMessage id={`LABEL.DM.PARTIES.1_PARTY`} />,
  },
  {
    id: "kedua",
    label: <FormattedMessage id={`LABEL.DM.PARTIES.2_PARTY`} />,
  },
];

const ParaPihak = () => {
  const [navActive, setNavActive] = React.useState(navLists[0].id);

  const { contract_party, vendor } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );

  // console.log(`dataContractById`, contract_party);

  const values = React.useMemo(
    () => ({
      nama_pemberi: contract_party?.party_1_employer_name,
      nama_notaris: contract_party?.party_1_deed_of_establishment_name,
      akta: contract_party?.party_1_deed_of_establishment_no,
      tgl_akta: contract_party?.party_1_deed_of_establishment_date,
      sk_kemenkum: contract_party?.party_1_deed_of_establishment_kemenkumham_no,
      tgl_sk_kemenkum:
        contract_party?.party_1_deed_of_establishment_kemenkumham_date,
      nama_notaris_akhir: contract_party?.party_1_last_change_notary_name,
      akta_akhir: contract_party?.party_1_last_deed_amanded_no,
      tgl_akta_akhir: contract_party?.party_1_last_deed_amanded_date,
      sk_kemenkum_akhir:
        contract_party?.party_1_last_deed_of_amanded_kemenkumham_no,
      tgl_sk_kemenkum_akhir:
        contract_party?.party_1_last_deed_of_amanded_kemenkumham_date,
      domisili_hukum: contract_party?.party_1_legal_domicile,

      nama_pejabat: contract_party?.party_1_contract_signature_name,
      jabatan_pejabat: contract_party?.party_1_position_of_autorize,
      fax_pejabat: contract_party?.party_1_sk_kemenkumham_contact?.fax,
      telp_pejabat: contract_party?.party_1_sk_kemenkumham_contact?.address,
      alamat_pejabat: contract_party?.party_1_sk_kemenkumham_contact?.telp,

      nama_notaris_penugasan: contract_party?.party_1_notary_act_autorized_name,
      sk_penugasan: contract_party?.party_1_sk_no,
      tgl_sk_penugasan: contract_party?.party_1_sk_date,
      akta_penugasan: contract_party?.party_1_notary_act_autorized_no,
      tgl_akta_penugasan: contract_party?.party_1_notary_act_autorized_date,
      sk_kemenkum_penugasan: contract_party?.party_1_autorized_kemenkumham_no,
      tgl_sk_kemenkum_penugasan:
        contract_party?.party_1_autorized_kemenkumham_date,

      jabatan_direksi: contract_party?.party_1_director_position,
      telp_direksi: contract_party?.party_1_director_position_phone,
      alamat_direksi: contract_party?.party_1_director_position_address,
      fax_direksi: contract_party?.party_1_director_position_fax,

      jabatan_pengawas: contract_party?.party_1_job_supervisor?.name,
      telp_pengawas: contract_party?.party_1_job_supervisor?.telp,
      alamat_pengawas: contract_party?.party_1_job_supervisor?.address,
      fax_pengawas: contract_party?.party_1_job_supervisor?.fax,

      // PIHAK KEDUA
      //   nama_penyedia: contract_party?.party_2_employer_name,
      nama_penyedia: vendor?.party?.full_name,
      nama_notaris_2: contract_party?.party_2_deed_of_establishment_name,
      akta_2: contract_party?.party_2_deed_of_establishment_no,
      tgl_akta_2: contract_party?.party_2_deed_of_establishment_date,
      sk_kemenkum_2:
        contract_party?.party_2_deed_of_establishment_kemenkumham_no,
      tgl_sk_kemenkum_2:
        contract_party?.party_2_deed_of_establishment_kemenkumham_date,
      nama_notaris_akhir_2: contract_party?.party_2_last_change_notary_name,
      akta_akhir_2: contract_party?.party_2_last_deed_amanded_no,
      tgl_akta_akhir_2: contract_party?.party_2_last_deed_amanded_date,
      sk_kemenkum_akhir_2:
        contract_party?.party_2_last_deed_of_amanded_kemenkumham_no,
      tgl_sk_kemenkum_akhir_2:
        contract_party?.party_2_last_deed_of_amanded_kemenkumham_date,
      domisili_hukum_2: contract_party?.party_2_legal_domicile,

      nama_pejabat_2: contract_party?.party_2_autorize_name,
      jabatan_pejabat_2: contract_party?.party_2_position,
      fax_pejabat_2: contract_party?.party_2_sk_kemenkumham_contact?.fax,
      telp_pejabat_2: contract_party?.party_2_sk_kemenkumham_contact?.address,
      alamat_pejabat_2: contract_party?.party_2_sk_kemenkumham_contact?.telp,

      nama_notaris_penugasan_2:
        contract_party?.party_2_notary_act_autorized_name,
      sk_penugasan_2: contract_party?.party_2_sk_no,
      tgl_sk_penugasan_2: contract_party?.party_2_sk_date,
      akta_penugasan_2: contract_party?.party_2_notary_act_autorized_no,
      tgl_akta_penugasan_2: contract_party?.party_2_notary_act_autorized_date,
      sk_kemenkum_penugasan_2: contract_party?.party_2_autorized_kemenkumham_no,
      tgl_sk_kemenkum_penugasan_2:
        contract_party?.party_2_autorized_kemenkumham_date,

      jabatan_direksi_2: contract_party?.party_2_director_position,
      telp_direksi_2: contract_party?.party_2_director_position_phone,
      alamat_direksi_2: contract_party?.party_2_director_position_address,
      fax_direksi_2: contract_party?.party_2_director_position_fax,

      jabatan_pengawas_2: contract_party?.party_2_job_supervisor?.name,
      telp_pengawas_2: contract_party?.party_2_job_supervisor?.telp,
      alamat_pengawas_2: contract_party?.party_2_job_supervisor?.address,
      fax_pengawas_2: contract_party?.party_2_job_supervisor?.fax,
    }),
    [contract_party, vendor]
  );

  return (
    <Card>
      <CardBody>
        <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        />
        <FormBuilder initial={values} withSubmit={false}>
          {({}) => {
            return (
              <React.Fragment>
                {navActive === "pertama" && (
                  <FieldBuilder readOnly formData={formData1} />
                )}
                {navActive === "kedua" && (
                  <FieldBuilder readOnly formData={formData2} />
                )}
              </React.Fragment>
            );
          }}
        </FormBuilder>
      </CardBody>
    </Card>
  );
};

export default ParaPihak;
