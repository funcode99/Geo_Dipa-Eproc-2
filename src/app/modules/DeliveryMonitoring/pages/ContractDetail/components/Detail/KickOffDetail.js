import React from "react";
import { MODAL } from "../../../../../../../service/modalSession/ModalService";
import {
  Card,
  CardBody,
} from "../../../../../../../_metronic/_partials/controls";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { fieldKickOff } from "./fieldData";

const KickOffDetail = () => {
  const initValues = React.useMemo(
    () => ({
      docType: "",
      docFile: "",
      docDate: "",
    }),
    []
  );
  return (
    <Card>
      <CardBody>
        <FormBuilder
          onSubmit={() => {
            MODAL.showSnackbar("FUNGSI INI BELUM TERSEDIA", "warning", 5000);
          }}
          formData={fieldKickOff}
          initial={initValues}
          fieldProps={{
            listOptions: {
              docType: [
                { value: "spmk", label: "SPMK" },
                { value: "skpp", label: "SKPP" },
              ],
            },
          }}
        ></FormBuilder>
      </CardBody>
    </Card>
  );
};

export default KickOffDetail;
