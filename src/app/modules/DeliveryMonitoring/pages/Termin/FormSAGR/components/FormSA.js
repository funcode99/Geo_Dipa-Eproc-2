import React, { useEffect, useState } from "react";
import FormBuilder from "../../../../../../components/builder/FormBuilder";
import { KEYS_TERMIN } from "../../TerminPageNew/STATIC_DATA";
import { TerminPageContext } from "../../TerminPageNew/TerminPageNew";
import { option_dist_type, sa_field, validationSchema_sa } from "./DUMMY_DATA";
import TableSA from "./TableSA";

export const FormSAContext = React.createContext({});

const FormSA = ({ fetch_api_sg, keys, loadings_sg }) => {
  const [arrService, setArrService] = useState({});
  const [listWBS, setlistWBS] = useState([]);
  const [itemJasa, setItemJasa] = useState([]);
  const [initial, setInitial] = useState({});

  const { func, task_id } = React.useContext(TerminPageContext);
  const handleRefresh = () => {
    fetch_api_sg({
      key: keys.fetch_wbs,
      type: "get",
      url: `delivery/wbs`,
      onSuccess: (res) => {
        // console.log("reswbs", res);
        setlistWBS(res.data);
      },
    });
    func.handleApi({
      key: KEYS_TERMIN.f_termin,
      onSuccess: (res) => {
        const tempDataJasa = res.data.task_item_services;
        let tempSubmitJasa = [];
        tempDataJasa.forEach((item) => {
          tempSubmitJasa = item.item_services.filter(
            (service) => service.service
          );
        });
        setItemJasa(tempSubmitJasa);
      },
    });
  };
  const disabled = [""];
  const _handleSubmit = ({ begdate, enddate, ...data }) => {
    const params = {
      ...data,
      beg_date: begdate,
      end_date: enddate,
      services: Object.values(arrService).map((item) => ({
        service_id: item.service_id,
        distribution_type: item.dist_type.value,
        gl_account: item.gl_account,
        bus_area: item.bus_area,
        costcenter: item.cost_center,
        wbs_elem: item.wbs.label,
        value: item.value,
      })),
    };
    console.log(`data`, params);
    fetch_api_sg({
      key: keys.upload_sa,
      type: "post",
      url: `delivery/task-sa/${task_id}`,
      params,
      onSuccess: (res) => {
        console.log("post sa", res);
        // setlistWBS(res.data);
      },
    });
  };
  useEffect(() => handleRefresh(), []);
  // console.log(`itemJasa`, itemJasa);
  return (
    <FormSAContext.Provider
      value={{
        setArrService,
        listWBS,
        itemJasa,
      }}
    >
      {itemJasa.length > 0 && <TableSA />}
      <FormBuilder
        loading={loadings_sg[keys.upload_sa]}
        onSubmit={_handleSubmit}
        formData={sa_field}
        validation={validationSchema_sa}
      />
    </FormSAContext.Provider>
  );
};

export default FormSA;
