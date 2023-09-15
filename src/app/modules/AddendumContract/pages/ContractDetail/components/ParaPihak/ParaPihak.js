import React, { useEffect, useState } from "react"
import DialogGlobal from "app/components/modals/DialogGlobal"


import { Button } from "@material-ui/core"

import { useFormik } from "formik"
import * as Yup from "yup"
import { format } from "date-fns"

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
]

const ParaPihak = ({

}) => {
  const [navActive, setNavActive] = React.useState(navLists[0].id)
  const openCloseModalRef = React.useRef()
  const openCloseDraftModalRef = React.useRef()
  const openCloseAddDocument = React.useRef()
  // console.log(openCloseModalRef)

  const { contract_party, vendor } = useSelector(
    (state) => state.deliveryMonitoring.dataContractById
  )

  const showModal = () => {
    openCloseModalRef.current.open()
  }

  const showDraft = () => {
    openCloseDraftModalRef.current.open()
  }

  const showAddDocument = () => {
    openCloseAddDocument.current.open()
  }

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
  )

  return (
    <>
    
    <Card>

      <CardBody>
        
        {/* <Navs
          navLists={navLists}
          handleSelect={(selectedKey) => setNavActive(selectedKey)}
        /> */}

          <DialogGlobal
            ref={openCloseModalRef}
            isCancel={false}
            isSubmit={false}
            yesButton={true}
            noButton={true}
          >
            Apakah anda sudah yakin untuk disubmit?
          </DialogGlobal>

          <DialogGlobal
            ref={openCloseDraftModalRef}
            isCancel={false}
            isSubmit={false}
            yesButton={true}
            noButton={true}
            maxWidth={'xs'}
          >
            Apakah anda sudah yakin disimpan ke draft?
            {/* <h1 className="mb-2" style={{fontSize: '16px'}}>Tambah Dokumen Pendukung Lainnya</h1> */}
            {/* <SupportingDocumentInput title={[{name:""}]} /> */}
          </DialogGlobal>

          <DialogGlobal
                ref={openCloseAddDocument}
                isCancel={false}
                isSubmit={false}
          >
              <SupportingDocumentInput />
          </DialogGlobal>

        <FormBuilder 
          initial={values} 
          withSubmit={true} 
          onSubmit={showModal}
          onDraft={showDraft} 
          btnChildren={
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={showDraft}
          >
            Save Draft
          </Button>
        }
        >

          {({}) => {
            return (
              <React.Fragment>
                {navActive === "pertama" && (
                  <>
                    {/* bagian ini untuk label */}
                    {/* readOnly */}
                    <FieldBuilder formData={formData1} />
                    <SupportingDocumentInput title={supportingDocumentDefault} />
                    <Button
                      variant="contained"
                      color="secondary"
                      size="medium"
                      onClick={showAddDocument}
                    >
                      Tambah Dokumen
                    </Button>
                    <div className="mt-5">
                      <p className="mb-0">Permintaan Penerbitan Draft Addendum Kepada:</p>
                      <select>
                        <option selected>
                          Supply Chain Management (SCM) Division
                        </option>
                        <option>
                          Corporate Legal & Compliance Division
                        </option>
                        <option>
                          Pengguna (Direksi Pekerjaan)
                        </option>
                      </select>
                    </div>
                    {/* <RenderInput typeInput={'SelectInputCustom'} /> */}
                  </>
                )}
              </React.Fragment>
            )
          }}
        </FormBuilder>

      </CardBody>
    </Card>
    </>
  );
};

export default ParaPihak;
