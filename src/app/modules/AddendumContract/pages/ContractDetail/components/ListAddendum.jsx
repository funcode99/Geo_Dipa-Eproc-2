import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { fetch_api_sg } from "redux/globalReducer";
import React, { useState, useEffect } from "react";
import { Card, CardBody } from "../../../../../../_metronic/_partials/controls";
import TablePaginationCustom from "../../../../../components/tables/TablePagination";
import ButtonAction from "../../../../../../../src/app/components/buttonAction/ButtonAction";

const tableHeaderContractsNew = [
  {
    id: "no",
    label: <FormattedMessage id="CONTRACT_DETAIL.TABLE_HEAD.NO" />,
  },
  {
    id: "no_dokument",
    label: "No Dokumen Addendum",
  },
  {
    id: "tanggal_addendum",
    label: "Tanggal Addendum",
  },
  {
    id: "addendum_status",
    label: "Addendum Status",
  },
  {
    id: "aksi",
    label: "Aksi",
  },
];

const ListAddendum = ({ contract_id, fetch_api_sg }) => {
  const [dataAddContracts, setDataAddContracts] = useState({});
  const getDataAddContract = async (contract_id) => {
    fetch_api_sg({
      key: keys.getAddendumDetail,
      type: "get",
      url: `/adendum/contract-released/${contract_id}/show`,
      onSuccess: (res) => {
        setDataAddContracts(res?.data);
      },
    });
  };

  useEffect(() => {
    getDataAddContract(contract_id);
  }, [contract_id]);
  return (
    <Card>
      <CardBody>
        <TablePaginationCustom
          headerRows={tableHeaderContractsNew}
          withSearch={false}
          rows={dataAddContracts?.add_contracts?.map((el, id) => ({
            no: id + 1,
            no_dokument: el.add_doc_number,
            tanggal_addendum: el.add_request_date,
            addendum_status: el.add_status?.status,
            aksi: (
              <ButtonAction
                hoverLabel="More"
                data={"1"}
                ops={[
                  {
                    label: "Detail",
                    to: {
                      url: `/client/addendum-contract/draft/${el.id}`,
                      style: {
                        color: "black",
                      },
                    },
                  },
                ]}
              />
            ),
          }))}
        />
      </CardBody>
    </Card>
  );
};
const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};

const mapDispatch = {
  fetch_api_sg,
};
const mapState = ({ auth, deliveryMonitoring }) => ({
  authStatus: auth.user.data.status,
  data: auth.user.data,
  dataContractById: deliveryMonitoring.dataContractById,
});

export default connect(mapState, mapDispatch)(ListAddendum);
