import React from "react"
import Tabs from "app/components/tabs"
import FormParameter from "app/modules/AddendumContract/pages/ContractDetail/components/ParaPihak/FormParameter"
import { Button } from "react-bootstrap"
import {
    Card,
    CardBody,
} from "_metronic/_partials/controls"
import Steppers from "app/components/steppersCustom/Steppers"
import {
    STEPPER_ADDENDUM_CONTRACT
  } from "app/modules/AddendumContract/pages/Termin/TerminPageNew/STATIC_DATA"
  import Subheader from "app/components/subheader"
  import SubBreadcrumbs from "app/components/SubBreadcrumbs"
  import { toAbsoluteUrl } from "_metronic/_helpers/AssetsHelpers";
import SVG from "react-inlinesvg";

const DraftAddendumPage = () => {

    const [tabActive, setTabActive] = React.useState(0)
    const [sequence, setSequence] = React.useState(0)
    const TabLists = [
  
        {
          id: "kick-off",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
          label: "Para Pihak",
          // icon: <PlayCircleOutlineIcon className="mb-0 mr-2" />,
          addendum: true
        },
      
        {
          id: "detail",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DETAIL" />,
          label: "Harga Pekerjaan",
          // icon: <FindInPage className="mb-0 mr-2" />,
        },
      
        {
          id: "para-pihak",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
          label: "Jangka Waktu",
          // icon: <PeopleAlt className="mb-0 mr-2" />,
        },
      
        {
          id: "dokumen-kontrak",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.DOK_CONT" />,
          label: "Metode Pembayaran",
          // icon: <Assignment className="mb-0 mr-2" />,
        },
      
        {
          id: "harga-pekerjaan",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PRICE" />,
          label: "Denda",
          // icon: <MonetizationOn className="mb-0 mr-2" />,
        },
      
        {
          id: "jangka-waktu",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PERIOD" />,
          label: "Jaminan",
          // icon: <QueryBuilderSharp className="mb-0 mr-2" />,
          addendum: true
        },
      
        {
          id: "jaminan",
          // label: <FormattedMessage id="CONTRACT_DETAIL.TAB.GUARANTEE" />,
          label: "Nomor Rekening",
          // icon: <FeaturedPlayList className="mb-0 mr-2" />,
          addendum: true
        },
      
        // {
        //   id: "denda",
        //   label: <FormattedMessage id="CONTRACT_DETAIL.TAB.FINE" />,
        //   icon: <Error className="mb-0 mr-2" />,
        // },
        //   {
        //     id: "para-pihak2",
        //     label: <FormattedMessage id="CONTRACT_DETAIL.TAB.PARTIES" />,
        //     icon: <PeopleAlt className="mb-0 mr-2" />,
        //   },
        // {
        //   id: "bast",
        //   label: <FormattedMessage id="CONTRACT_DETAIL.TAB.BAST" />,
        //   icon: <Description className="mb-0 mr-2" />,
        // },
      
    ]

     // sengaja dikasih event biar yang diambil value nya
    function handleChangeTab(event, newTabActive) {
        // isi nya urutan angka array sesuai dengan yang di klik
        console.log('isi newTabActive', newTabActive)
        setTabActive(newTabActive);
      }

    //   const getContractById = async (contract_id) => {
    //     try {
    
    //       // loading buat throttling
    //       setLoading(true);
    
    //       // masukin response api nya ke objek yang nama properti nya data
    //       const {
    //         data: { data },
    //       } = await addendumContract.getContractById(contract_id);
    
    //       addCheckedField(data?.services, "jasa");
    //       addCheckedField(data?.items, "barang");
    
    //       dispatch({
    //         type: actionTypes.SetContractById,
    //         payload: data,
    //       })

    //     } catch (error) {
    //       if (
    //         error.response?.status !== 400 &&
    //         error.response?.data.message !== "TokenExpiredError"
    //       ) {
    //         if (
    //           error.response?.status !== 400 &&
    //           error.response?.data.message !== "TokenExpiredError"
    //         ) {
    //           setToast("Error API, please contact developer!");
    //         }
    //       }
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
    
    //   React.useEffect(() => {
    //     // kalo dipanggil bisa
    //     getContractById(contract_id)
    //     setInitialSubmitItems();
    //     // eslint-disable-next-line
    //   }, []);

    return (
        <>

        <Subheader 
            text={
            // dataContractById
            // null
            // ? 
            `No Dokumen Addendum : ADD-01/015.PJ/PST.100-GDE/I/2023` 
            }
        />

        <SubBreadcrumbs
            items={[
            {
                label: `Addendum Contract`
            },
            {
                label: "List of Addendum",
                // to: `/${authStatus}/addendum-contract/list-of-addendum`,
                to: `/client/addendum-contract/list-of-addendum`,
            },
            {
                label: "015.PJ/PST.100-GDE/I/2023 - Pengadaan Material Gasket Spiral Wound & Rupture Disk"
            }
            ]}
        />

        <Steppers
            steps={
                STEPPER_ADDENDUM_CONTRACT
            }
        />

        <br/>

        <Card>
            <form
                style={{
                    padding: 28,
                }}
            >

        {/* form parameter & template klausul */}
        <div 
          style={{
            height: 74, 
            fontSize: 14, 
            display: 'grid', 
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))" 
          }}
        >
          
          <div
            className="d-flex flex-column align-items-center"
            style={{
                backgroundColor: 'white', 
                flexGrow: 1, 
                borderTopLeftRadius: 14, 
                cursor: 'pointer',
                gap: 4
            }}
            onClick={() => setSequence(0)}
          >
            
            <SVG 
            src={toAbsoluteUrl("/media/svg/icons/All/form-parameter.svg")} />
            <h1 style={{
                fontSize: 14,
                color: sequence === 0 ? '#3699ff' : '#8c8a8a'
            }}>
                Form Parameter Addendum
            </h1>

          </div>
          
          <div
            className="d-flex flex-column align-items-center"
             style={{
                backgroundColor:'white', 
                flexGrow: 1, 
                cursor: 'pointer',
                borderTopRightRadius: 14,
                gap: 4
            }}
            onClick={() => setSequence(1)}
          >
            <SVG src={toAbsoluteUrl("/media/svg/icons/All/clause-template.svg")} />
            <h1 style={{
                fontSize: 14,
                color: sequence === 1 ? '#3699ff' : '#8c8a8a'
                }}>Template Klausul</h1>
          </div>

        </div>
                
        <div 
                                    style={{display: 'flex', columnGap: 40, flexWrap: 'wrap'}}
                                >
                                    <div className="col-md-4">
                                        <div className="form-group row">
                                            <label
                                                htmlFor="agreement_number"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Nomor Perjanjian
                                            </label>
                                            <input 
                                                type="text"
                                                className="form-control"
                                                id="agreement_number"
                                                style={{ backgroundColor: "#c7d2d8" }}
                                                disabled
                                                value={'015.PJ/PST.100-GDE/I/2023'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="po_number"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Nomor PO
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="po_number"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                value={'8000007360'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="form-group row">
                                            <label
                                                htmlFor="procurement_title"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Judul Pengadaan
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="procurement_title"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'Pengadaan Material Gasket Spiral Wound & Rupture Disk'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="po_number"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Keterangan PO
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="po_number"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'Pengadaan Material Gasket Spiral Wound & Rupture Disk'}
                                            />
                                        </div>
                                    </div>
        </div>

        <div 
                                    style={{display: 'flex', columnGap: 40, flexWrap: 'wrap'}}
                                >
                                    <div className="col-md-7">
                                        <div className="form-group row">
                                            <label
                                                htmlFor="agreement_format"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Format Perjanjian
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="agreement_format"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'Isi format perjanjian'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="procurement_authority"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Kewenangan Pengadaan
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="procurement_authority"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'Plant Dieng'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="user"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Pengguna
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="user"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'Plant Dieng'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="provider"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Penyedia
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="provider"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'Plant Dieng'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group row">
                                            <label
                                                htmlFor="agreement_type"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Jenis Perjanjian
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="agreement_type"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                value={'Perjanjian'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="po_number"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Grup Kewenangan Pengadaan
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="po_number"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'961242390'}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label
                                                htmlFor="user_group"
                                                className="col-form-label"
                                                style={{ fontWeight: 500, fontSize: 14 }}
                                            >
                                                Grup Pengguna
                                            </label>
                                            <input 
                                                type="text"
                                                    className="form-control"
                                                    id="user_group"
                                                    style={{ backgroundColor: "#c7d2d8" }}
                                                    disabled
                                                    onChange={(e) => {

                                                    }}
                                                value={'961242390'}
                                            />
                                        </div>
                                    </div>
        </div>

            </form>
        </Card>

                {/* silahkan download file */}
        <div
          style={{
            backgroundColor: 'white',
            padding: 28,
            marginTop: 24,
            marginBottom: 24,
            borderRadius: 5
          }}
        >

          <h1 style={{ 
              fontSize: 12,
              fontWeight: 400
          }}>Silahkan download file final draft dibawah ini:</h1>

          <select
            style={{
              borderRadius: 4,
              padding: '10px 12px',
              width: 310,
              backgroundColor: '#e8f4fb'
            }}
          >
            <option>
              Final Draft Kontrak
            </option>
            <option>
              Final Draft Addendum
            </option>
          </select>

          <div style={{ 
              minHeight: 100, 
              marginTop: 10,
              marginBottom: 10,
              fontSize: 12,
              fontWeight: 400,
              color: '#3699ff'
          }}>
              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}
              >
                <SVG src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")} />
                <p>Body Kontrak Perjanjian.doc</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}
              >
                <SVG src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")} />
                <p>Lampiran 1.doc</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6
                }}
              >
                <SVG src={toAbsoluteUrl("/media/svg/icons/All/file-final-draft.svg")} />
                <p>Lampiran 2.doc</p>
              </div>


          </div>

        </div>

        {sequence === 0 &&            
            <>
            <div
                style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14
                }}
            >
                <Tabs
                    tabActive={tabActive}
                    handleChange={handleChangeTab}
                    tabLists={TabLists}
                    variant="scrollable"
                />
            </div>
            <FormParameter currentActiveTab={tabActive} />
            </>
        }

        {sequence === 1 &&
            <>
                <div
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 4,
                        minHeight: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 28,
                        padding: 28
                    }}
                >
                    <div
                        style={{
                            border: 1,
                            borderStyle: 'solid',
                            borderColor: '#8C8A8A',
                            borderRadius: 4,
                            padding: '12px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>Template Word Body Kontrak</span>
                        <Button
                style={{
                  minWidth: 100
                }}
              >
                Download
              </Button>
                    </div>
                    <div
                                                style={{
                                                    border: 1,
                                                    borderStyle: 'solid',
                                                    borderColor: '#8C8A8A',
                                                    borderRadius: 4,
                                                    padding: '12px 10px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                    >
                               <span>Template Word Lampiran 1</span>
                               <Button
                style={{
                  minWidth: 100
                }}
              >
                Download
                                </Button>
                    </div>
                    <div
                                                style={{
                                                    border: 1,
                                                    borderStyle: 'solid',
                                                    borderColor: '#8C8A8A',
                                                    borderRadius: 4,
                                                    padding: '12px 10px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                    >
                               <span>Template Word Lampiran 2</span>
                               <Button
                style={{
                  minWidth: 100
                }}
              >
                Download
              </Button>
                    </div>
                </div>
            </>
        }

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 28,
                padding: '2rem 2.25rem'
              }}
            >
              <Button
                 style={{
                  minWidth: 100
                }}
              >
                Update
              </Button>
              <Button
                style={{
                  minWidth: 100
                }}
                onClick={() => setTabActive(tabActive < TabLists.length-1 ? tabActive+1 : tabActive)}
              >
                Next
              </Button>
            </div>

        </>
    )
}

export default DraftAddendumPage