import React from "react";
import DendaTab from "../tabs/Denda";
import Tabs from "app/components/tabs";
import JaminanTab from "../tabs/Jaminan";
import SummaryTab from "../tabs/Summary";
import LainnyaTab from "../tabs/Lainnya";
import JangkaWaktuTab from "../tabs/JangkaWaktu";
import NomorRekeningTab from "../tabs/NomorRekening";
import MetodePembayaranTab from "../tabs/MetodePembayaran";
import HargaPekerjaanTab from "../tabs/HargaPekerjaan/HargaPekerjaan";
import ParaPihakTab from "../../../../../../app/modules/AddendumContract/pages/ContractDetail/components/FormAddendum/FormParameterSubTab/PartiesFormParameter";

const TabLists = [
  {
    id: "summary",
    label: "Summary",
    addendum: true,
  },
  {
    id: "kick-off",
    label: "Para Pihak",
    addendum: true,
  },

  {
    id: "detail",
    label: "Harga Pekerjaan",
  },
  {
    id: "para-pihak",
    label: "Jangka Waktu",
  },
  {
    id: "dokumen-kontrak",
    label: "Metode Pembayaran",
  },

  {
    id: "harga-pekerjaan",
    label: "Denda",
  },
  {
    id: "jangka-waktu",
    label: "Jaminan",
    addendum: true,
  },
  {
    id: "jaminan",
    label: "Nomor Rekening",
    addendum: true,
  },
  {
    id: "other",
    label: "Lainnya",
    addendum: true,
  },
];

const FormParameter = ({
  data,
  isAdmin,
  PICData,
  contract_id,
  jobDirector,
  jobSupervisor,
  dataNewClause,
  jobSupervisor2,
  dataContractById,
  authorizedOfficial,
  accountNumberBankData,
  dataNewClauseDrafting,
  secondAuthorizedOfficial,
}) => {
  const [tabActive, setTabActive] = React.useState(0);

  const handleChangeTab = (event, newTabActive) => {
    setTabActive(newTabActive);
  };

  const HeaderSection = () => {
    return (
      <>
        <div
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            marginTop: "3px",
          }}
        >
          <Tabs
            tabActive={tabActive}
            handleChange={handleChangeTab}
            tabLists={TabLists}
            variant="scrollable"
          />
        </div>
      </>
    );
  };

  const FooterSection = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        {tabActive !== 0 && (
          <button
            className="btn btn-outline-primary"
            style={{
              minWidth: 100,
            }}
            onClick={() =>
              tabActive > 0
                ? setTabActive(tabActive - 1)
                : setTabActive(tabActive)
            }
          >
            {`<< Back`}
          </button>
        )}
        {tabActive !== TabLists.length - 1 && (
          <button
            className="btn btn-primary"
            style={{
              minWidth: 100,
            }}
            onClick={() => setTabActive(tabActive + 1)}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  switch (tabActive) {
    case 0:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <SummaryTab data={data} />
          <FooterSection />
        </div>
      );
    case 1:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <ParaPihakTab
            isDrafting={true}
            PICData={PICData}
            contract_id={contract_id}
            jobDirector={jobDirector}
            jsonData={dataContractById}
            jobSupervisor={jobSupervisor}
            jobSupervisor2={jobSupervisor2}
            is_add_parties={data?.is_add_parties}
            authorizedOfficialData={authorizedOfficial}
            isDisable={!data?.is_add_parties && !isAdmin}
            add_contract_party={data?.add_contract_party}
            secondAuthorizedOfficial={secondAuthorizedOfficial}
          />
          <FooterSection />
        </div>
      );
    case 2:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <HargaPekerjaanTab
            dataAfterAdendum={data}
            data={dataContractById}
            fromWhere={"job_price"}
            contract_id={contract_id}
            jobPriceCurrent={data?.add_contract_job_price}
            isDisable={!data?.is_add_job_price || !isAdmin}
            add_contract_job_price={data?.add_contract_job_price}
          />
          <FooterSection />
        </div>
      );

    case 3:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <JangkaWaktuTab
            isAdmin={isAdmin}
            contract_id={contract_id}
            fromWhere={"time_period"}
            dataNewClause={dataNewClause}
            timePeriodData={dataContractById}
            is_add_time_period={data?.is_add_time_period}
            isDisable={!data?.is_add_time_period || !isAdmin}
            timePeriodAddendumCurrent={data?.add_contract_time_period}
            add_contract_time_period={data?.add_contract_time_period}
          />
          <FooterSection />
        </div>
      );
    case 4:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <MetodePembayaranTab
            contract_id={contract_id}
            jsonData={dataContractById}
            fromWhere={"payment_method"}
            isDisable={!data?.is_add_payment_method || !isAdmin}
            paymentMethodCurrent={data?.add_contract_payment_method}
            add_contract_payment_method={data?.add_contract_payment_method}
          />
          <FooterSection />
        </div>
      );
    case 5:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <DendaTab
            fromWhere={"fine"}
            contract_id={contract_id}
            jsonData={dataContractById}
            fineCurrent={data?.add_contract_fine}
            isDisable={!data?.is_add_fine || !isAdmin}
          />
          <FooterSection />
        </div>
      );
    case 6:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <JaminanTab
            newData={data}
            fromWhere={"guarantee"}
            contract_id={contract_id}
            jsonData={dataContractById}
            dataNewClause={dataNewClause}
            is_add_guarantee={data?.is_add_guarantee}
            dataNewClauseDrafting={dataNewClauseDrafting}
            isDisable={!data?.is_add_guarantee || !isAdmin}
            guaranteeCurrent={data?.add_contract_guarantee}
            add_contract_guarantee={data?.add_contract_guarantee}
          />
          <FooterSection />
        </div>
      );
    case 7:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <LainnyaTab
            data={data}
            fromWhere="other"
            isDrafting={true}
            isMandatory={true}
            contract_id={contract_id}
            jsonData={dataContractById}
            dataNewClause={dataNewClause}
            is_add_other={data?.is_add_other}
            otherCurrent={data?.add_contract_others}
            isDisable={!data?.other_note || !isAdmin}
            add_contract_others={data?.add_contract_others}
          />
          <FooterSection />
        </div>
      );
    case 8:
      return (
        <div
          style={{
            padding: 5,
            borderRadius: 5,
            backgroundColor: "white",
          }}
        >
          <HeaderSection />
          <NomorRekeningTab
            contract_id={contract_id}
            jsonData={dataContractById}
            dataNewClause={dataNewClause}
            accountNumberBankData={accountNumberBankData}
            isDisable={!data?.is_add_account_number || !isAdmin}
            is_add_account_number={!data?.is_add_account_number}
            accountNumberCurrent={data?.add_contract_account_number}
            add_contract_account_number={data?.add_contract_account_number}
          />
          <FooterSection />
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

export default FormParameter;
