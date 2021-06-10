import React from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FieldBuilder from "../../../../../../components/builder/FieldBuilder";
import Navs from "../../../../../../components/navs";
import { formData4, formData3 } from "./fieldData";

const ParaPihak2 = () => {
  const { contract_party } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  );
  const values = React.useMemo(
    () => ({
      nama_pejabat: contract_party?.party_1_contract_signature_name,
      jabatan_pejabat: contract_party?.party_1_position_of_autorize,
      nama_direksi: contract_party?.party_1_director_position,
      penyedia: contract_party?.party_1_position_of_autorize,
      nama_penyedia: contract_party?.party_2_autorize_name,
      jabatan_penyedia: contract_party?.party_2_position,
      email_pic: contract_party?.party_2_pic_email,
    }),
    [contract_party]
  );
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <FieldBuilder values={values} readOnly formData={formData3} />
          </Col>
          <Col>
            <FieldBuilder values={values} readOnly formData={formData4} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ParaPihak2;
