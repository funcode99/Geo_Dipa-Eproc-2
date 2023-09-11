import React from "react"
import { FormattedMessage } from "react-intl"
import { useSelector } from "react-redux"
import {
  Card,
  CardBody,
} from "_metronic/_partials/controls"
import { formData1, supportingDocumentDefault } from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/fieldData"
import FieldBuilder from "app/components/builder/FieldBuilder"
import FormBuilder from "app/components/builder/FormBuilder"
import SupportingDocumentInput from "app/components/input/SupportingDocumentInput"
import Navs from "app/components/navs"

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
  const [navActive, setNavActive] = React.useState(navLists[0].id)

  const { contract_party, vendor } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );

  // console.log(`dataContractById`, contract_party);

  const values = React.useMemo(
    () => ({
      
      start_price: 'Rp 7.422.000.000',
      end_price_addendum: 'Rp 0',
      additional_price: 'Rp 0',
      subtraction_price: 'Rp 0',
      after_price_addendum: 'Rp 0',
      percentage_addendum: '%',
      conclusion: 'Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal',

    }),
    [contract_party, vendor]
  );

  return (
    <Card>
      <CardBody>

        {/* <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        /> */}
        <FormBuilder initial={values} withSubmit={true}>
          {({}) => {
            return (
              <React.Fragment>
                {navActive === "pertama" && (
                  <>
                    {/* bagian ini untuk label */}
                    {/* readOnly */}
                    <FieldBuilder formData={formData1} />
                    <SupportingDocumentInput title={supportingDocumentDefault} />
                  </>
                )}
                {/* {navActive === "kedua" && (
                  <FieldBuilder readOnly formData={formData2} />
                )} */}
              </React.Fragment>
            );
          }}
        </FormBuilder>

      </CardBody>
    </Card>
  );
};

export default ParaPihak;
