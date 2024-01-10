import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Subheader from "app/components/subheader";
import React, { useState, useEffect } from "react";
import SubBreadcrumbs from "app/components/SubBreadcrumbs";
import Steppers from "app/components/steppersCustom/Steppers";
import { fetch_api_sg, getLoading } from "redux/globalReducer";
import {
  STATE_STEPPER,
  DUMMY_STEPPER_CONTRACT,
} from "../Termin/TerminPageNew/STATIC_DATA";

import TabCard from "./TabCard";
import TemplateKlausul from "./TemplateKlausul";
import ReviewPage from "./ReviewPage/ReviewPage";
import FinalDraftSection from "./FinalDraftSection";
import ApprovalPage from "./ApprovalPage/ApprovalPage";
import FormParameter from "./FormParameter/FormParameter";
import DistribusiPage from "./DistribusiPage/DistribusiPage";

const DraftAddendumPage = ({
  rolesEproc,
  loginStatus,
  purch_group,
  fetch_api_sg,
  dataNewClause,
  dataNewClauseDrafting,
}) => {
  const { draft_id } = useParams();
  const [data, setData] = useState({});
  const [PICData, setPICData] = useState();
  const [jsonData, setJsonData] = useState();
  const [sequence, setSequence] = useState(0);
  const [contract, setContract] = useState({});
  const [jobDirector, setJobDirector] = useState();
  const [jobSupervisor, setJobSupervisor] = useState();
  const [finalDraftData, setFinalDraftData] = useState();
  const [jobSupervisor2, setJobSupervisor2] = useState();
  const [dataContractById, setDataContractById] = useState({});
  const [authorizedOfficial, setauthorizedOfficial] = useState();
  const [accountNumberBankData, setAccountNumberBankData] = useState();
  const [secondAuthorizedOfficial, setSecondAuthorizedOfficial] = useState();

  const getClientStatus = (val) => {
    const filteredData = rolesEproc?.filter(
      ({ ident_name }) => ident_name === val
    );
    return !!filteredData?.length > 0;
  };

  const isAdmin =
    getClientStatus("SUPERADMIN") ||
    getClientStatus("ADMIN_CONTRACT") ||
    getClientStatus("ADMIN_CONTRACT_UNIT") ||
    purch_group === data?.admin_purch_group_id;
  const isVendor = getClientStatus("VENDOR");
  const isClient = loginStatus === "client";

  const getAddendum = async () => {
    try {
      await fetch_api_sg({
        key: keys.getAddendumDetail,
        type: "get",
        url: `/adendum/add-contracts/${draft_id}`,
        onSuccess: (res) => {
          setContract(res?.data?.contract);
          setData(res?.data);
          getContractById(res.data.contract_id);
        },
      });
    } catch (error) {
      console.error("Error fetching addendum:", error);
    }
  };

  // api 1.2
  const getContractById = async (id) => {
    try {
      await fetch_api_sg({
        key: keys.getAddendumDetail,
        type: "get",
        url: `/adendum/contract-released/${id}/show`,
        onSuccess: (res) => {
          setDataContractById(res?.data);
          getSecondAuthorizedOfficial(res.data.vendor_id);
        },
      });
    } catch (error) {
      console.error("Error fetching contract by ID:", error);
    }
  };

  // get api 2.23
  const getFinalDraftData = async (contract_id) => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/contract-final-draft/${contract_id}/show`,
      onSuccess: (res) => {
        setFinalDraftData(res.data);
      },
    });
  };

  const getDataContractHeader = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/add-contracts/${draft_id}`,
        onSuccess: (res) => {
          getFinalDraftData(res?.data?.contract_id);
          setJsonData(res?.data);
          localStorage.setItem(
            "payment_method",
            JSON.stringify(res?.data?.payment_method_data)
          );
          localStorage.setItem(
            "fine",
            JSON.stringify(res?.data?.penalty_fine_data)
          );
          localStorage.setItem(
            "time_period",
            JSON.stringify({
              from_time: res?.data?.from_time,
              thru_time: res?.data?.thru_time,
              worked_start_date: res?.data?.worked_start_date,
              worked_end_date: res?.data?.worked_end_date,
              guarantee_start_date: res?.data?.guarantee_start_date,
              guarantee_end_date: res?.data?.guarantee_end_date,
              maintenance_start_date: res?.data?.maintenance_start_date,
              maintenance_end_date: res?.data?.maintenance_end_date,
              contract_period_type: res?.data?.contract_period_type,
              work_period_type: res?.data?.work_period_type,
              contract_period_range_day: res?.data?.contract_period_range_day,
              contract_period_range_month:
                res?.data?.contract_period_range_month,
              work_implement_period_day: res?.data?.work_implement_period_day,
              work_implement_period_month:
                res?.data?.work_implement_period_month,
              guarantee_period_day: res?.data?.guarantee_period_day,
              guarantee_period_month: res?.data?.guarantee_period_month,
              maintenance_period_day: res?.data?.maintenance_period_day,
              maintenance_period_month: res?.data?.maintenance_period_month,
            })
          );
        },
      });
    } catch (error) {
      console.error("Error fetching data contract header:", error);
    }
  };

  const getauthorizedOfficial = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/job-directors`,
        onSuccess: (res) => {
          setauthorizedOfficial(res.data);
        },
      });
    } catch (error) {
      console.error("Error fetching authorized officials:", error);
    }
  };

  // api 2.17
  const getSecondAuthorizedOfficial = async (id) => {
    fetch_api_sg({
      key: keys.fetch,
      type: "get",
      url: `/adendum/refference/get-vendor/${id}`,
      onSuccess: (res) => {
        setSecondAuthorizedOfficial(res.data.officer_data);
        setPICData(res.data.pic_data);
        setAccountNumberBankData(res.data.bank_data);
      },
    });
  };

  const getJobDirector = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/direksi-pekerjaan`,
        onSuccess: (res) => {
          setJobDirector(res.data);
        },
      });
    } catch (error) {
      console.error("Error fetching job directors:", error);
    }
  };

  const getJobSupervisor = async () => {
    try {
      await fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/refference/get-all-plants`,
        onSuccess: (res) => {
          setJobSupervisor(res.data);
          localStorage.setItem("job_supervisor", JSON.stringify(res.data));
          setJobSupervisor2(JSON.parse(localStorage.getItem("job_supervisor")));
        },
      });
    } catch (error) {
      console.error("Error fetching job supervisors:", error);
    }
  };

  if (!Array.isArray(authorizedOfficial)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = authorizedOfficial.findIndex(
      (item) =>
        item.authorized_official_username ===
        jsonData?.add_contract_party?.party_1_autorized_username
    );

    if (indexToMove !== -1) {
      const itemToMove = authorizedOfficial[indexToMove];
      authorizedOfficial.splice(indexToMove, 1);
      authorizedOfficial.unshift(itemToMove);
    }
  }
  if (!Array.isArray(secondAuthorizedOfficial)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = secondAuthorizedOfficial.findIndex(
      (item) =>
        item.authorized_official_username ===
        jsonData?.add_contract_party?.party_2_autorized_username
    );

    if (indexToMove !== -1) {
      const itemToMove = secondAuthorizedOfficial[indexToMove];
      secondAuthorizedOfficial.splice(indexToMove, 1);
      secondAuthorizedOfficial.unshift(itemToMove);
    }
  }
  if (!Array.isArray(jobDirector)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = jobDirector.findIndex(
      (item) =>
        item.username ===
        jsonData?.add_contract_party?.party_1_job_director[0]
          .party_1_job_director_username
    );

    if (indexToMove !== -1) {
      const itemToMove = jobDirector[indexToMove];
      jobDirector.splice(indexToMove, 1);
      jobDirector.unshift(itemToMove);
    }
  }
  if (!Array.isArray(jobSupervisor)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = jobSupervisor.findIndex(
      (item) =>
        item.facility_name ===
        jsonData?.add_contract_party?.party_1_job_director[0]?.facility_name
    );

    if (indexToMove !== -1) {
      const itemToMove = jobSupervisor[indexToMove];
      jobSupervisor.splice(indexToMove, 1);
      jobSupervisor.unshift(itemToMove);
    }
  }
  if (!Array.isArray(jobSupervisor2)) {
    console.error("Data is not an array.");
  } else {
    const indexToMove = jobSupervisor2.findIndex(
      (item) =>
        item.address ===
        jsonData?.add_contract_party?.party_1_job_supervisor[0]
          ?.party_1_job_supervisor_address
    );

    if (indexToMove !== -1) {
      const itemToMove = jobSupervisor2[indexToMove];
      jobSupervisor2.splice(indexToMove, 1);
      jobSupervisor2.unshift(itemToMove);
    }
  }

  useEffect(() => {
    getAddendum();
    // para pihak
    getJobDirector();
    getJobSupervisor();
    getauthorizedOfficial();
    getDataContractHeader();
  }, []);

  const HeaderSection = () => {
    return (
      <>
        <Subheader text={`No Dokumen Addendum : ${data?.add_doc_number}`} />

        <SubBreadcrumbs
          items={[
            {
              label: `Addendum Contract`,
            },
            {
              label: "List of Addendum",
              to: `/client/addendum-contract/list-of-addendum`,
            },
            {
              label: `${data?.add_doc_number} - ${data?.contract?.contract_name}`,
            },
          ]}
        />

        <div className="mb-4">
          <Steppers
            steps={
              data?.steppers
                ? DUMMY_STEPPER_CONTRACT
                : data?.steppers?.map((el) => ({
                    label: el.label,
                    status: STATE_STEPPER[el.state],
                  }))
            }
          />
        </div>

        <TabCard
          data={data}
          isAdmin={isAdmin}
          isVendor={isVendor}
          contract={contract}
          sequence={sequence}
          setSequence={setSequence}
        />

        <FinalDraftSection finalDraftData={finalDraftData} />
      </>
    );
  };
  switch (sequence) {
    case 0:
      return (
        <div>
          <HeaderSection />
          <FormParameter
            data={data}
            isAdmin={isAdmin}
            PICData={PICData}
            contract_id={draft_id}
            jobDirector={jobDirector}
            dataNewClause={dataNewClause}
            jobSupervisor={jobSupervisor}
            jobSupervisor2={jobSupervisor2}
            dataContractById={dataContractById}
            authorizedOfficial={authorizedOfficial}
            dataNewClauseDrafting={dataNewClauseDrafting}
            accountNumberBankData={accountNumberBankData}
            secondAuthorizedOfficial={secondAuthorizedOfficial}
          />
        </div>
      );
    case 1:
      return (
        <div>
          <HeaderSection />
          <TemplateKlausul />
        </div>
      );
    case 2:
      return (
        <div>
          <HeaderSection />
          <ReviewPage
            isAdmin={isAdmin}
            isVendor={isVendor}
            isClient={isClient}
            contract_id={draft_id}
          />
        </div>
      );
    case 3:
      return (
        <div>
          <HeaderSection />
          <ApprovalPage
            isAdmin={isAdmin}
            isClient={isClient}
            isVendor={isVendor}
            contract_id={draft_id}
            loginStatus={loginStatus}
          />
        </div>
      );
    case 4:
      return (
        <div>
          <HeaderSection />
          <DistribusiPage
            isAdmin={isAdmin}
            isClient={isClient}
            isVendor={isVendor}
            contract_id={draft_id}
            loginStatus={loginStatus}
          />
        </div>
      );
    default:
      return (
        <>
          <HeaderSection />
          <p>hello wolrd</p>
        </>
      );
  }
};

const keys = {
  getAddendumDetail: "get-addendum-contract-by-id ",
};
const mapState = (state) => ({
  loadings: {
    getAddendumDetail: getLoading(state, keys.getAddendumDetail),
  },
  loginStatus: state.auth.user.data.status,
  rolesEproc: state.auth.user.data.roles_eproc,
  purch_group: state.auth.user.data.purch_group,
  dataNewClause: state.addendumContract.dataNewClause,
  dataNewClauseDrafting: state.addendumContract.dataNewClauseDrafting,
});

const mapDispatch = {
  fetch_api_sg,
};
export default connect(mapState, mapDispatch)(DraftAddendumPage);
