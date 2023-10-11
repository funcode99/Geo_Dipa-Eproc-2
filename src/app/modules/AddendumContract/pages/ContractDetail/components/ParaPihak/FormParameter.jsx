import React, { useState, useRef } from "react"
import {
    Card,
    CardBody,
  } from "_metronic/_partials/controls"

import ButtonAction from "app/components/buttonAction/ButtonAction"
import DialogGlobal from "app/components/modals/DialogGlobal"
import { Button } from "@material-ui/core"

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Collapse
} from '@material-ui/core'

import {
    Column,
    TableTan,
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowData,
  } from '@tanstack/react-table'

import { ReactSelect } from "percobaan/ReactSelect"

const tableDummyJobPriceDetail = [
    {   
        item_desc: 'TX-76543 -- 001 ABCDEFFGH',
        qty: '10',
        unit: 'EA',
        unit_price: '100.000.000',
        total_price: '1.000.000.000',
        info: 'empty',
        child: [
            {
                item_desc: 'TX-76543 -- 001 ABCDEFFGH',
                qty: '10',
                unit: 'EA',
                unit_price: '100.000.000',
                total_price: '1.000.000.000',
                info: 'empty',
            },
            {
                item_desc: 'TX-76543 -- 001 ABCDEFFGH',
                qty: '10',
                unit: 'EA',
                unit_price: '100.000.000',
                total_price: '1.000.000.000',
                info: 'empty',
            },
            {
                item_desc: 'TX-76543 -- 001 ABCDEFFGH',
                qty: '10',
                unit: 'EA',
                unit_price: '100.000.000',
                total_price: '1.000.000.000',
                info: 'empty',
            },
        ]
    },
    {
        item_desc: 'TX-76544 -- 002 ABCDEFFGH',
        qty: '5',
        unit: 'EA',
        unit_price: '100.000.000',
        total_price: '1.000.000.000',
        info: 'nothing',
        child: []
    }
]

const timePeriodBeforeAddendum = [
    {
        title: 'Jangka Waktu Masa Garansi',
        startDate: '2023-09-29',
        endDate: '2023-09-30',
        totalMonth: 6,
        calendarDay: 15,
        radio: 'SKPP'
    },
    {
        title: 'Jangka Waktu Pelaksanaan Pekerjaan',
        startDate: '2023-09-29',
        endDate: '2023-09-30',
        totalMonth: 6,
        calendarDay: 15,
        radio: 'SPMK'
    },
    {
        title: 'Jangka Waktu Masa Garansi',
        startDate: '2023-09-29',
        endDate: '2023-09-30',
        totalMonth: 6,
        calendarDay: 15,
        radio: 'SKPP'
    },
    {
        title: 'Jangka Waktu Masa Pemeliharaan',
        startDate: '2023-09-29',
        endDate: '2023-09-30',
        totalMonth: 6,
        calendarDay: 15,
        radio: 'SPMK'
    },
]

const guaranteeBeforeAddendum = [
    {
        title: 'Jaminan Uang Muka',
        startDate: '2023-09-19',
        endDate: '2023-10-29',
        filename: 'bla_blah.pdf',
        radio: 'yes'
    },
    {
        title: 'Jaminan Pelaksanaan',
        startDate: '2023-09-19',
        endDate: '2023-10-29',
        filename: 'secret.docx',
        radio: 'no'
    },
    {
        title: 'Jaminan Pemeliharaan',
        startDate: '2023-09-19',
        endDate: '2023-10-29',
        filename: 'another_file.xlsx',
        radio: 'yes'
    }
]

const actionButton = (
    <ButtonAction
        style={{
            backgroundColor: '#e8f4fb'
        }}
        hoverLabel="More"
        data={"1"}
        ops={[
            {
                label: "Edit",
            },
            {
                label: "Hapus",
            },
        ]}
    />
)



function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData(1, 'Keterlambatan Pekerjaan', 10, 30, '%'),
    createData(2, 'Keterlambatan Pekerjaan', 15, 60, '%')
  ];

  const addendumRows = [
    createData(1, 'Keterlambatan Pekerjaan', 10, 30, '%')
  ]
  

const FormParameter = ({
    currentActiveTab
}) => {

    console.log('tab yang aktif sekarang', currentActiveTab)

    const [addendumPaymentMethod, setAddendumPaymentMethod] = useState('full')

    const openCloseAddFine = React.useRef()
    const showAddFine = () => {
        openCloseAddFine.current.open()
    }

    const openCloseAddPayment = React.useRef()
    const showAddPayment = () => {
        openCloseAddPayment.current.open()
    }

    const openCloseWorkSupervisor = React.useRef()
    const showAddWorkSupervisor = () => {
        openCloseWorkSupervisor.current.open()
    }

    const openCloseWorkDirector = React.useRef()
    const showAddWorkDirector = () => {
        openCloseWorkDirector.current.open()
    }

    return (
        <>

            {/* modal tambah supervisor pekerjaan */}
            <DialogGlobal
                ref={openCloseWorkSupervisor}
                isCancel={false}
            >
                <div
                    style={{
                        padding: '0 17%'
                    }}
                >
                    
                    <h1
                        style={{
                            marginBottom: 40,
                            fontSize: 16,
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        Tambah Pengawas Pekerjaan
                    </h1>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14
                        }}
                    >

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                            Jabatan
                            </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Alamat
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Telp
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Fax
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>


                    </div>

                </div>
            </DialogGlobal>

            {/* modal tambah direksi pekerjaan */}
            <DialogGlobal
                 ref={openCloseWorkDirector}
                 isCancel={false}
            >
                <div
                    style={{
                        padding: '0 17%'
                    }}
                >
                    
                    <h1
                        style={{
                            marginBottom: 40,
                            fontSize: 16,
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        Tambah Direksi Pekerjaan
                    </h1>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14
                        }}
                    >

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                            Username
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"10%"}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Nama Lengkap
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"isi"}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Jabatan
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"isi"}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Alamat
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Telp
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Fax
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={""}
                        />
                    </div>


                    </div>

                </div>
            </DialogGlobal>

            {/* modal tambah denda */}
            <DialogGlobal
              ref={openCloseAddFine}
              isCancel={false}
              isSubmit={false}
              yesButton={false}
              noButton={false}
              maxWidth={'sm'}
            >

                    <div
                    style={{
                        padding: '0 17%'
                    }}
                >
                    
                    <h1
                        style={{
                            marginBottom: 40,
                            fontSize: 16,
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        Tambah Denda
                    </h1>
                
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14
                        }}
                    >

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                            Jenis Denda
                        </span>
                        {/* <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"User 4"}
                        /> */}
                        <select name="" id="">
                            <option>
                                Keterlambatan Kerja
                            </option>
                        </select>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                            Nilai
                            </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"Procurement Staff"}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Maksimal Hari
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"user.4@geodipa.co.id"}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        Type Nilai
                        <div
                            style={{
                                display: 'flex',
                                gap: 20
                            }}
                        >
                            <label>
                                <input
                                    type="radio"
                                    name="value_type"
                                />
                                %
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="value_type"
                                />
                                Nilai
                            </label>
                        </div>
                    </div>

                    </div>


                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 52,
                            padding: '0 7%'
                        }}
                    >
                        <button
                            className="btn btn-primary"
                        >
                            Save
                        </button>
                    </div>

            </DialogGlobal>

            {/* modal tambah pembayaran */}
            <DialogGlobal
              ref={openCloseAddPayment}
              isCancel={false}
            >

                <div
                    style={{
                        padding: '0 17%'
                    }}
                >
                    
                    <h1
                        style={{
                            marginBottom: 40,
                            fontSize: 16,
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        Tambah pembayaran bertahap
                    </h1>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14
                        }}
                    >

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                            Persentase
                            </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"10%"}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10
                        }}
                    >
                        <span>
                           Deskripsi
                        </span>
                        <input 
                            style={{
                                padding: 8,
                                borderRadius: 4,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                opacity: .8
                            }}
                            value={"isi"}
                        />
                    </div>


                    </div>

                </div>

            </DialogGlobal>

            <Card>
                <CardBody>

                {currentActiveTab === 0 &&                
                    <>
                    
                        <div
                            style={{
                                backgroundColor: '#cdcdcd',
                                display: 'inline-block',
                                padding: 8,
                                borderRadius: 6,
                                marginBottom: 14
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: '#2e1f22'
                                }}
                            >
                                A. Pihak Pertama
                            </span>
                        </div>

                        <div
                            className="row col-md-12"
                        >

                        <div
                            className="col-md-6"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14
                            }}
                        >

                            {/* Pejabat Berwenang */}
                            <div>

                                <h1
                                    style={{
                                        fontSize: '16px'
                                    }}
                                >
                                    Pejabat berwenang
                                </h1>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Username</span>
                                        {/* <input 
                                            type="text" 
                                            value={"herdian"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        /> */}
                                        <ReactSelect />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama</span>
                                        <input 
                                            type="text" 
                                            value={"Herdian Ardi Febrianto"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }} 
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input 
                                            type="text" 
                                            value={"General Manager Unit Dieng"} 
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            className="form-control"
                                            type="text" 
                                            value={"Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo"}
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            className="form-control"
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            className="form-control"
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nomor SK Penugasan</span>
                                        <div
                                        
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 8,
                                            }}
                                        >
                                            <input 
                                                type="text"
                                                value={"015.PJ/PST.100-GDE/I/2023"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                            -
                                            <input 
                                                type="date" 
                                                defaultValue={"2022-03-25"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama Notaris</span>
                                        <input
                                            type="text" 
                                            value={""}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nomor Akta</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 8,
                                            }}
                                        >
                                            <input 
                                                type="text"
                                                value={""}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                            -
                                            <input 
                                                type="date" 
                                                defaultValue={"2022-03-25"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nomor SK Kemenkumham</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 8,
                                            }}
                                        >
                                            <input 
                                                type="text"
                                                value={""}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                            -
                                            <input 
                                                type="date" 
                                                defaultValue={"2022-03-25"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                            </div>

                            {/* Direksi Pekerjaan */}
                            <div>
                                
                                <h1
                                    style={{
                                        fontSize: '16px',
                                        minHeight: 38.17
                                    }}
                                >
                                    Direksi pekerjaan
                                </h1>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Username</span>
                                        {/* <input
                                            type="text" 
                                            value={"weni"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        /> */}
                                        <ReactSelect />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama Lengkap</span>
                                        <input
                                            type="text" 
                                            value={"Weni Kusumaningrum"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input
                                            type="text" 
                                            value={"Procurement Superintendent"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            type="text" 
                                            value={"Jl. Raya Dieng - Batur PO BOX 01 Wonosobo"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                            </div>

                            {/* Pengawas Pekerjaan */}
                            <div>
                                
                                <h1
                                    style={{
                                        fontSize: '16px'
                                    }}
                                >
                                    Pengawas pekerjaan
                                </h1>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input
                                            type="text" 
                                            value={"Logistic Supervisor"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            type="text" 
                                            value={"Jl. Raya Dieng Batur, Karangtengah Batur Banjarnegara"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                            </div>

                        </div>

                        <div
                            className="col-md-6"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14
                            }}
                        >

                            {/* Pejabat Berwenang */}
                            <div>

                                <h1
                                    style={{
                                        fontSize: '16px'
                                    }}
                                >
                                    Addendum Pejabat berwenang
                                </h1>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Username</span>
                                        {/* <input 
                                            type="text" 
                                            value={"herdian"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        /> */}
                                        <ReactSelect />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama</span>
                                        <input 
                                            type="text" 
                                            value={"Herdian Ardi Febrianto"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }} 
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input 
                                            type="text" 
                                            value={"General Manager Unit Dieng"} 
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            className="form-control"
                                            type="text" 
                                            value={"Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo"}
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            className="form-control"
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            className="form-control"
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nomor SK Penugasan</span>
                                        <div
                                        
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 8,
                                            }}
                                        >
                                            <input 
                                                type="text"
                                                value={"015.PJ/PST.100-GDE/I/2023"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                            -
                                            <input 
                                                type="date" 
                                                defaultValue={"2022-03-25"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama Notaris</span>
                                        <input
                                            type="text" 
                                            value={""}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nomor Akta</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 8,
                                            }}
                                        >
                                            <input 
                                                type="text"
                                                value={""}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                            -
                                            <input 
                                                type="date" 
                                                defaultValue={"2022-03-25"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nomor SK Kemenkumham</span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                columnGap: 8,
                                            }}
                                        >
                                            <input 
                                                type="text"
                                                value={""}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                            -
                                            <input 
                                                type="date" 
                                                defaultValue={"2022-03-25"}
                                                className="form-control"
                                                style={{
                                                    backgroundColor: "#e8f4fb"
                                                }}
                                            />
                                        </div>
                                    </label>
                                </div>

                            </div>

                            {/* Direksi Pekerjaan */}
                            <div>
                                

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        
                                    }}
                                >
                                        <h1
                                            style={{
                                                fontSize: '16px',

                                            }}
                                        >
                                            Addendum Direksi pekerjaan
                                        </h1>

                                        <button
                                            className="btn btn-primary mx-1"
                                            onClick={showAddWorkDirector}
                                        >
                                            Tambah
                                        </button>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Username</span>
                                        <ReactSelect />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama Lengkap</span>
                                        <input
                                            type="text" 
                                            value={"Weni Kusumaningrum"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input
                                            type="text" 
                                            value={"Procurement Superintendent"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            type="text" 
                                            value={"Jl. Raya Dieng - Batur PO BOX 01 Wonosobo"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                            </div>

                            <div>
                                

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                        <h1
                                            style={{
                                                fontSize: '16px'
                                            }}
                                        >
                                            Addendum Direksi pekerjaan
                                        </h1>

                                        {/* <button
                                            
                                        >
                                            Tambah
                                        </button> */}
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Username</span>
                                        {/* <input
                                            type="text" 
                                            value={"weni"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        /> */}
                                        <ReactSelect />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Nama Lengkap</span>
                                        <input
                                            type="text" 
                                            value={"Weni Kusumaningrum"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input
                                            type="text" 
                                            value={"Procurement Superintendent"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            type="text" 
                                            value={"Jl. Raya Dieng - Batur PO BOX 01 Wonosobo"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                            </div>

                            {/* Pengawas Pekerjaan */}
                            <div>
                                
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                        <h1
                                            style={{
                                                fontSize: '16px'
                                            }}
                                        >
                                            Addendum Pengawas pekerjaan
                                        </h1>

                                        <button
                                            className="btn btn-primary mx-1"
                                            onClick={showAddWorkSupervisor}
                                        >
                                            Tambah
                                        </button>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Jabatan</span>
                                        <input
                                            type="text" 
                                            value={"Logistic Supervisor"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Alamat</span>
                                        <input
                                            type="text" 
                                            value={"Jl. Raya Dieng Batur, Karangtengah Batur Banjarnegara"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>Telp</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342020"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                                <div
                                >
                                    <label
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 4
                                        }}
                                    >
                                        <span>FAX</span>
                                        <input
                                            type="text" 
                                            value={"+62-286-3342022"}
                                            className="form-control"
                                            style={{ backgroundColor: "#e8f4fb" }}
                                        />
                                    </label>
                                </div>

                            </div>

                        </div>

                        </div>

                        <div
                            style={{
                                backgroundColor: '#cdcdcd',
                                display: 'inline-block',
                                padding: 8,
                                borderRadius: 6,
                                marginBottom: 14
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: '#2e1f22'
                                }}
                            >
                                B. Pihak Kedua
                            </span>
                        </div>

                        <div
                            className="row col-md-12"
                        >
                            <div
                                className="col-md-6"
                            >

                                {/* Pejabat Berwenang */}
                                <div>

                                    <h1
                                        style={{
                                            fontSize: '16px'
                                        }}
                                    >
                                        Pejabat berwenang
                                    </h1>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Username</span>
                                            {/* <input 
                                                type="text" 
                                                value={"herdian"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            /> */}
                                            <ReactSelect />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nama</span>
                                            <input 
                                                type="text" 
                                                value={"Herdian Ardi Febrianto"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }} 
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Jabatan</span>
                                            <input 
                                                type="text" 
                                                value={"General Manager Unit Dieng"} 
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Alamat</span>
                                            <input
                                                className="form-control"
                                                type="text" 
                                                value={"Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo"}
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Telp</span>
                                            <input
                                                className="form-control"
                                                type="text" 
                                                value={"+62-286-3342020"}
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>FAX</span>
                                            <input
                                                className="form-control"
                                                type="text" 
                                                value={"+62-286-3342022"}
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nomor SK Penugasan</span>
                                            <div
                                            
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    columnGap: 8,
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    value={"015.PJ/PST.100-GDE/I/2023"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                                -
                                                <input 
                                                    type="date" 
                                                    defaultValue={"2022-03-25"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nama Notaris</span>
                                            <input
                                                type="text" 
                                                value={""}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nomor Akta</span>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    columnGap: 8,
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    value={""}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                                -
                                                <input 
                                                    type="date" 
                                                    defaultValue={"2022-03-25"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nomor SK Kemenkumham</span>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    columnGap: 8,
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    value={""}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                                -
                                                <input 
                                                    type="date" 
                                                    defaultValue={"2022-03-25"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                </div>

                                {/* Direksi Pekerjaan */}
                                <div>
                                    
                                    <h1
                                        style={{
                                            fontSize: '16px'
                                        }}
                                    >
                                        Direksi pekerjaan
                                    </h1>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Username</span>
                                            {/* <input
                                                type="text" 
                                                value={"weni"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            /> */}
                                            <ReactSelect />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nama Lengkap</span>
                                            <input
                                                type="text" 
                                                value={"Weni Kusumaningrum"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Jabatan</span>
                                            <input
                                                type="text" 
                                                value={"Procurement Superintendent"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Alamat</span>
                                            <input
                                                type="text" 
                                                value={"Jl. Raya Dieng - Batur PO BOX 01 Wonosobo"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Telp</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342020"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>FAX</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342022"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                </div>

                                {/* Pengawas Pekerjaan */}
                                <div>
                                    
                                    <h1
                                        style={{
                                            fontSize: '16px'
                                        }}
                                    >
                                        Pengawas pekerjaan
                                    </h1>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Jabatan</span>
                                            <input
                                                type="text" 
                                                value={"Logistic Supervisor"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Alamat</span>
                                            <input
                                                type="text" 
                                                value={"Jl. Raya Dieng Batur, Karangtengah Batur Banjarnegara"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Telp</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342020"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>FAX</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342022"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                </div>

                            </div>
                            <div
                                className="col-md-6"
                            >

                                {/* Pejabat Berwenang */}
                                <div>

                                    <h1
                                        style={{
                                            fontSize: '16px'
                                        }}
                                    >
                                        Addendum Pejabat berwenang
                                    </h1>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Username</span>
                                            {/* <input 
                                                type="text" 
                                                value={"herdian"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            /> */}
                                            <ReactSelect />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nama</span>
                                            <input 
                                                type="text" 
                                                value={"Herdian Ardi Febrianto"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }} 
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Jabatan</span>
                                            <input 
                                                type="text" 
                                                value={"General Manager Unit Dieng"} 
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Alamat</span>
                                            <input
                                                className="form-control"
                                                type="text" 
                                                value={"Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo"}
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Telp</span>
                                            <input
                                                className="form-control"
                                                type="text" 
                                                value={"+62-286-3342020"}
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>FAX</span>
                                            <input
                                                className="form-control"
                                                type="text" 
                                                value={"+62-286-3342022"}
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nomor SK Penugasan</span>
                                            <div
                                            
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    columnGap: 8,
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    value={"015.PJ/PST.100-GDE/I/2023"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                                -
                                                <input 
                                                    type="date" 
                                                    defaultValue={"2022-03-25"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nama Notaris</span>
                                            <input
                                                type="text" 
                                                value={""}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nomor Akta</span>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    columnGap: 8,
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    value={""}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                                -
                                                <input 
                                                    type="date" 
                                                    defaultValue={"2022-03-25"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nomor SK Kemenkumham</span>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    columnGap: 8,
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    value={""}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                                -
                                                <input 
                                                    type="date" 
                                                    defaultValue={"2022-03-25"}
                                                    className="form-control"
                                                    style={{
                                                        backgroundColor: "#e8f4fb"
                                                    }}
                                                />
                                            </div>
                                        </label>
                                    </div>

                                </div>

                                {/* Direksi Pekerjaan */}
                                <div>
                                    
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <h1
                                            style={{
                                                fontSize: '16px'
                                            }}
                                        >
                                            Addendum Direksi pekerjaan
                                        </h1>
                                        <button
                                            className="btn btn-primary mx-1"
                                            onClick={showAddWorkDirector}
                                        >
                                            Tambah
                                        </button>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Username</span>
                                            {/* <input
                                                type="text" 
                                                value={"weni"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            /> */}
                                            <ReactSelect />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Nama Lengkap</span>
                                            <input
                                                type="text" 
                                                value={"Weni Kusumaningrum"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Jabatan</span>
                                            <input
                                                type="text" 
                                                value={"Procurement Superintendent"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Alamat</span>
                                            <input
                                                type="text" 
                                                value={"Jl. Raya Dieng - Batur PO BOX 01 Wonosobo"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Telp</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342020"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>FAX</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342022"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                </div>

                                {/* Pengawas Pekerjaan */}
                                <div>
                                    
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                            <h1
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Addendum Pengawas pekerjaan
                                            </h1>

                                            <button
                                                className="btn btn-primary mx-1"
                                                onClick={showAddWorkSupervisor}
                                            >
                                                Tambah
                                            </button>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Jabatan</span>
                                            <input
                                                type="text" 
                                                value={"Logistic Supervisor"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Alamat</span>
                                            <input
                                                type="text" 
                                                value={"Jl. Raya Dieng Batur, Karangtengah Batur Banjarnegara"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>Telp</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342020"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                    <div
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                rowGap: 4
                                            }}
                                        >
                                            <span>FAX</span>
                                            <input
                                                type="text" 
                                                value={"+62-286-3342022"}
                                                className="form-control"
                                                style={{ backgroundColor: "#e8f4fb" }}
                                            />
                                        </label>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 28
                            }}
                        >
                            
                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Sebelum Addendum</span>
                                <textarea
                                    disabled
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Setelah Addendum</span>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                        </div>

                    </>
                }

                {currentActiveTab === 2 &&
                    <>

                        <h1
                            style={{
                                fontSize: '16px',
                                fontWeight: 600
                            }}
                        >
                            Jangka waktu kontrak awal
                        </h1>

                        {timePeriodBeforeAddendum && 

                            timePeriodBeforeAddendum.map((data, index) => (
                                <>
                                    <div
                                        className=""
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 20
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                columnGap: 10
                                            }}
                                        >
                                            <div
                                                className="col-md-2"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    padding: 0
                                                }}
                                            >
                                                <span
                                                >
                                                    {/* Jangka Waktu Masa Garansi */}
                                                    {data.title}
                                                </span>
                                                <input
                                                    disabled
                                                    type="date"
                                                    style={{
                                                        backgroundColor: "#e8f4fb",
                                                        borderRadius: 4,
                                                        padding: '10px 12px',
                                                        border: 'none'
                                                    }}
                                                    value={data.startDate}
                                                />
                                            </div>
                                                
                                            <div
                                            style={{
                                                display: 'flex',
                                                placeItems: 'center',
                                                minHeight: 41.5
                                            }}
                                        >
                                            S/D
                                        </div>
                                            
                                            <div
                                                className="col-md-2"
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    padding: 0
                                                }}
                                            >
                                                <span>

                                                </span>
                                                <input 
                                                    disabled
                                                    type="date"
                                                    style={{
                                                        backgroundColor: "#e8f4fb",
                                                        borderRadius: 4,
                                                        padding: '10px 12px',
                                                        border: 'none'
                                                    }}
                                                    value={data.endDate}
                                                />
                                            </div>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    padding: 0
                                                }}
                                            >
                                                <span>
                                                    Jumlah Bulan
                                                </span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        backgroundColor: "#e8f4fb",
                                                        borderRadius: 4,
                                                        padding: '10px 12px',
                                                        border: 'none'
                                                    }}
                                                    value={data.totalMonth}
                                                    disabled
                                                />
                                            </div>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    padding: 0
                                                }}
                                            >
                                                <span>
                                                    Hari Kalender
                                                </span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        backgroundColor: "#e8f4fb",
                                                        borderRadius: 4,
                                                        padding: '10px 12px',
                                                        border: 'none'
                                                    }}
                                                    value={data.calendarDay}
                                                    disabled
                                                />
                                            </div>

                                            <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 14,
                                                        alignItems: 'center',
                                                        minHeight: 41.5
                                                    }}
                                                >

                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                alignItems: 'center',
                                                                columnGap: 8
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${index}_down_payment_guarantee`}
                                                                value={"SKPP"}
                                                                checked={data.radio === "SKPP"}
                                                            />
                                                            <span>
                                                                SKPP
                                                            </span>
                                                        </label>

                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                alignItems: 'center',
                                                                columnGap: 8
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${data.title}_down_payment_guarantee`}
                                                                value={"SPMK"}
                                                                checked={data.radio === "SPMK"}
                                                            />
                                                            <span>
                                                                SPMK
                                                            </span>
                                                        </label>

                                            </div>

                                        </div>

                                    </div>
                                </>
                            ))

                        }


                        {/* Addendum jangka waktu */}
                        <h1
                            style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                marginTop: 28
                            }}
                        >
                            Addendum jangka waktu
                        </h1>
{/* 
                        <div
                            className=""
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 20
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    columnGap: 10
                                }}
                            >
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span
                                    >Jangka Waktu Masa Garansi
                                    </span>
                                    <input
                                    
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>
                                    
                                    S/D
                                
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>

                                    </span>
                                    <input 
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Jumlah Bulan
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Hari Kalender
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                        style={{
                                            display: 'flex',
                                            gap: 14,
                                            alignItems: 'center'
                                        }}
                                    >

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SKPP
                                                </span>
                                            </label>

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SPMK
                                                </span>
                                            </label>

                                    </div>

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    columnGap: 10
                                }}
                            >
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span
                                    >Jangka Waktu Masa Garansi
                                    </span>
                                    <input
                                    
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>
                                    
                                    S/D
                                
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>

                                    </span>
                                    <input 
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Jumlah Bulan
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Hari Kalender
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                        style={{
                                            display: 'flex',
                                            gap: 14,
                                            alignItems: 'center'
                                        }}
                                    >

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SKPP
                                                </span>
                                            </label>

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SPMK
                                                </span>
                                            </label>

                                    </div>

                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    columnGap: 10
                                }}
                            >
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span
                                    >Jangka Waktu Masa Garansi
                                    </span>
                                    <input
                                    
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>
                                    
                                    S/D
                                
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>

                                    </span>
                                    <input 
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Jumlah Bulan
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Hari Kalender
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                        style={{
                                            display: 'flex',
                                            gap: 14,
                                            alignItems: 'center'
                                        }}
                                    >

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SKPP
                                                </span>
                                            </label>

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SPMK
                                                </span>
                                            </label>

                                    </div>

                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    columnGap: 10
                                }}
                            >
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span
                                    >Jangka Waktu Masa Garansi
                                    </span>
                                    <input
                                    
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>
                                    
                                    S/D
                                
                                <div
                                    className="col-md-2"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>

                                    </span>
                                    <input 
                                        type="date"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Jumlah Bulan
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 4,
                                        padding: 0
                                    }}
                                >
                                    <span>
                                        Hari Kalender
                                    </span>
                                    <input 
                                        type="text"
                                        style={{
                                            borderRadius: 4,
                                            padding: '10px 12px',
                                            border: 'none'
                                        }}
                                    />
                                </div>

                                <div
                                        style={{
                                            display: 'flex',
                                            gap: 14,
                                            alignItems: 'center'
                                        }}
                                    >

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SKPP
                                                </span>
                                            </label>

                                            <label
                                                style={{
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    columnGap: 8
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="down_payment_guarantee"
                                                />
                                                <span>
                                                    SPMK
                                                </span>
                                            </label>

                                    </div>

                            </div>



                        </div> */}

{timePeriodBeforeAddendum && 

timePeriodBeforeAddendum.map((data, index) => (
    <>
        <div
            className=""
            style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 20
            }}
        >

            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    columnGap: 10
                }}
            >
                <div
                    className="col-md-2"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 4,
                        padding: 0
                    }}
                >
                    <span
                    >
                        {/* Jangka Waktu Masa Garansi */}
                        {data.title}
                    </span>
                    <input
              
                        type="date"
                        style={{
                            backgroundColor: "#e8f4fb",
                            borderRadius: 4,
                            padding: '10px 12px',
                            border: 'none'
                        }}
                        value={data.startDate}
                    />
                </div>
                    
                <div
                style={{
                    display: 'flex',
                    placeItems: 'center',
                    minHeight: 41.5
                }}
            >
                S/D
            </div>
                
                <div
                    className="col-md-2"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 4,
                        padding: 0
                    }}
                >
                    <span>

                    </span>
                    <input 
          
                        type="date"
                        style={{
                            backgroundColor: "#e8f4fb",
                            borderRadius: 4,
                            padding: '10px 12px',
                            border: 'none'
                        }}
                        value={data.endDate}
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 4,
                        padding: 0
                    }}
                >
                    <span>
                        Jumlah Bulan
                    </span>
                    <input 
                        type="text"
                        style={{
                            backgroundColor: "#e8f4fb",
                            borderRadius: 4,
                            padding: '10px 12px',
                            border: 'none'
                        }}
                        value={data.totalMonth}
                 
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 4,
                        padding: 0
                    }}
                >
                    <span>
                        Hari Kalender
                    </span>
                    <input 
                        type="text"
                        style={{
                            backgroundColor: "#e8f4fb",
                            borderRadius: 4,
                            padding: '10px 12px',
                            border: 'none'
                        }}
                        value={data.calendarDay}
                  
                    />
                </div>

                <div
                        style={{
                            display: 'flex',
                            gap: 14,
                            alignItems: 'center',
                            minHeight: 41.5
                        }}
                    >

                            <label
                                style={{
                                    margin: 0,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    columnGap: 8
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`${index}_down_payment_guarantee`}
                                    value={"SKPP"}
                        
                                />
                                <span>
                                    SKPP
                                </span>
                            </label>

                            <label
                                style={{
                                    margin: 0,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    columnGap: 8
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`${data.title}_down_payment_guarantee`}
                                    value={"SPMK"}
                            
                                />
                                <span>
                                    SPMK
                                </span>
                            </label>

                </div>

            </div>

        </div>
    </>
))

}
                        


                        {/* pasal sebelum addendum */}
                            <div
                            >
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Sebelum Addendum</span>
                                <textarea
                                    disabled
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Setelah Addendum</span>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                    </>
                }

                {
                    currentActiveTab === 1 &&
                    <div
                        style={{
                            padding: 28,
                            borderRadius: 14,
                            border: 1,
                            borderStyle: 'solid',
                            borderColor: '#8c8a8a',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 28
                        }}
                    >

                            <div
                                style={{
                                    display: 'flex',
                                    gap: 28,
                                    flexWrap: 'wrap'
                                }}
                            >
                                
                                <label
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <p
                                        style={{
                                            marginBottom: 14,
                                            fontSize: 16,
                                            fontWeight: 600
                                        }}
                                    >
                                        Nilai perjanjian kontrak awal
                                    </p>
                                    <input
                                        className="form-control"
                                        type="text"
                                        style={{
                                            width: '100%',
                                            border: 1,
                                            borderStyle: 'solid',
                                            borderColor: '#d1d1d1',
                                            backgroundColor: '#e8f4fb',
                                        }}
                                        disabled
                                    />
                                </label>

                                <label
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <p
                                        style={{
                                            marginBottom: 14,
                                            fontSize: 16,
                                            fontWeight: 600
                                        }}
                                    >
                                        Nilai perjanjian setelah addendum
                                    </p>
                                    <input
                                        className="form-control"
                                        type="text"
                                        style={{
                                            width: '100%',
                                            border: 1,
                                            borderStyle: 'solid',
                                            borderColor: '#d1d1d1'
                                        }}
                                    />
                                </label>

                            </div>
                            
                            <TableContainer
                                style={{
                                    padding: 10
                                }}
                            component={Paper}
                            >
                            <h1
                                style={{
                                    fontSize: 16,  
                                    fontWeight: 600
                                }}
                            >
                                Rincian harga pekerjaan awal
                            </h1>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>Dessert (100g serving)</TableCell>
                                                <TableCell align="left">Calories</TableCell>
                                                <TableCell align="left">Fat&nbsp;(g)</TableCell>
                                                <TableCell align="left">Carbs&nbsp;(g)</TableCell>
                                                <TableCell align="left">Protein&nbsp;(g)</TableCell> */}
                                            {/* <TableCell>
                                                    1
                                            </TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" >
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="left" scope="row">{row.calories}</TableCell>
                                                    <TableCell align="left">{row.fat}</TableCell>
                                                    <TableCell align="left">{row.carbs}</TableCell>
                                                    <TableCell align="left">{row.protein}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                            </TableContainer>


                            <TableContainer 
                                style={{
                                    padding:10
                                }}
                                component={Paper}
                            >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <h1
                                    style={{
                                        fontSize: 16,  
                                        fontWeight: 600
                                    }}
                                >
                                    Rincian harga PO-SAP
                                </h1>

                                <div>
                                    <button
                                        style={{
                                            color: 'white',
                                            backgroundColor: '#ffc045',
                                            borderRadius: 8,
                                            border: 'none',
                                            padding: '8px 14px'
                                        }}
                                    >
                                        Get PO-SAP
                                    </button>
                                </div>

                            </div>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>Dessert (100g serving)</TableCell>
                                                <TableCell align="left">Calories</TableCell>
                                                <TableCell align="left">Fat&nbsp;(g)</TableCell>
                                                <TableCell align="left">Carbs&nbsp;(g)</TableCell>
                                                <TableCell align="left">Protein&nbsp;(g)</TableCell> */}
                                            {/* <TableCell>
                                                    1
                                            </TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" >
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="left" scope="row">{row.calories}</TableCell>
                                                    <TableCell align="left">{row.fat}</TableCell>
                                                    <TableCell align="left">{row.carbs}</TableCell>
                                                    <TableCell align="left">{row.protein}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                            </TableContainer>

                            <TableContainer>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <h1
                                        style={{
                                            fontSize: 16,  
                                            fontWeight: 600
                                        }}
                                    >
                                        Addendum Rincian Harga Pekerjaan
                                    </h1>
                                </div>
                                <Table>
                                    <TableRow>
                                        {tableDummyJobPriceDetail.map((row) => (
                                            
                                            row.child.length > 0 ?
                                                <>
                                                    <ExpansionPanel>
                                                        <ExpansionPanelSummary
                                                            style={{
                                                                padding: 0
                                                            }}
                                                        >
                                                            <TableRow
                                                            key={row.item_desc}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" >
                                                                {row.qty}
                                                            </TableCell>
                                                            <TableCell align="left" scope="row">
                                                                {row.unit}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.unit_price}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.total_price}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.info}
                                                            </TableCell>
                                                            </TableRow>
                                                        </ExpansionPanelSummary>
                                                        {/* gabisa dibaca length nya */}
                                                        {row.child &&
                                                            row.child.map(() => (
                                                                    <ExpansionPanelDetails>
                                                                        <TableRow
                                                        key={row.item_desc}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" >
                                                            {row.qty}
                                                        </TableCell>
                                                        <TableCell align="left" scope="row">
                                                            {row.unit}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.unit_price}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.total_price}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.info}
                                                        </TableCell>
                                                                        </TableRow>
                                                                    </ExpansionPanelDetails>
                                                            )) 
                                                        }
                                                    </ExpansionPanel>
                                                </>
                                                :
                                                <>
                                                    <TableRow
                                                            key={row.item_desc}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" >
                                                                {row.qty}
                                                            </TableCell>
                                                            <TableCell align="left" scope="row">
                                                                {row.unit}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.unit_price}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.total_price}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.info}
                                                            </TableCell>
                                                    </TableRow>
                                                </>
                                        ))}
                                    </TableRow>
                                </Table>
                            </TableContainer>


                            {/* <TanStackTable /> */}


                            <div
                            >
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Sebelum Addendum</span>
                                <textarea
                                    disabled
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Setelah Addendum</span>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                    </div>
                }


                {/* <DataGridDemo /> */}

                {
                    currentActiveTab === 3 &&
                    <>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 28
                            }}
                        >
                            <div
                                style={{
                                    padding: 28,
                                    borderRadius: 14,
                                    border: 1,
                                    borderStyle: 'solid',
                                    borderColor: '#8c8a8a',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >

                                <div>
                                    Metode pembayaran kontrak awal
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 14,
                                            paddingTop: 14
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                gap: 12
                                            }}
                                        >
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                disabled 
                                                checked 
                                            />
                                            Full Pembayaran
                                        </label>
                                        <label
                                            style={{
                                                display: 'flex',
                                                gap: 12
                                            }}
                                        >
                                            <input type="radio" name="payment" disabled />
                                            Pembayaran Bertahap
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    Addendum metode pembayaran
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            rowGap: 14,
                                            paddingTop: 14
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: 'flex',
                                                gap: 12
                                            }}
                                        >
                                            <input 
                                                type="radio" 
                                                name="payment_addendum"
                                                onClick={() => setAddendumPaymentMethod('full')}
                                                checked={addendumPaymentMethod === 'full'}
                                            />
                                            Full Pembayaran
                                        </label>
                                        <label
                                            style={{
                                                display: 'flex',
                                                gap: 12
                                            }}
                                        >
                                            <input 
                                                type="radio" 
                                                name="payment_addendum"
                                                onClick={() => setAddendumPaymentMethod('gradual')}
                                                checked={addendumPaymentMethod === 'gradual'}
                                            />
                                            Pembayaran Bertahap
                                        </label>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            columnGap: 10,
                                            placeItems: 'center'
                                        }}
                                    >
                                        Tahap 1
                                        <input
                                            className="col-sm-3"
                                            type="text" 
                                            placeholder="Persentase" 
                                            disabled={addendumPaymentMethod !== 'gradual'}
                                        />
                                        <input 
                                            className="col-sm-6"
                                            type="text"
                                            placeholder="Deskripsi"
                                            disabled={addendumPaymentMethod !== 'gradual'} 
                                        />   
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            marginTop: 28
                                        }}
                                    >
                                        <button
                                            className="btn btn-primary mx-1"
                                            onClick={showAddPayment}
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div
                            >
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Sebelum Addendum</span>
                                <textarea
                                    disabled
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Setelah Addendum</span>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                        </div>

                    </>
                }

                {
                    currentActiveTab === 4 &&
                    <>
                        <div
                            style={{
                                padding: 28,
                                borderRadius: 14,
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: '#8c8a8a',
                                display: 'flex',
                                flexDirection: 'column',

                                // justifyContent: 'space-between'
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 34.5,
                                }}
                            >
                                <TableContainer
                                    style={{
                                        padding: 10
                                    }}
                                component={Paper}>
                                    <h1
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: '#2e1f22'
                                        }}
                                    >
                                        Denda Kontrak Awal
                                    </h1>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>Dessert (100g serving)</TableCell>
                                                <TableCell align="left">Calories</TableCell>
                                                <TableCell align="left">Fat&nbsp;(g)</TableCell>
                                                <TableCell align="left">Carbs&nbsp;(g)</TableCell>
                                                <TableCell align="left">Protein&nbsp;(g)</TableCell> */}
                                            {/* <TableCell>
                                                    1
                                            </TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" >
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="left" scope="row">{row.calories}</TableCell>
                                                    <TableCell align="left">{row.fat}</TableCell>
                                                    <TableCell align="left">{row.carbs}</TableCell>
                                                    <TableCell align="left">{row.protein}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TableContainer 
                                    style={{
                                        padding: 10
                                    }}
                                component={Paper}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            // marginTop: 34,
                                            // marginBottom: 20
                                        }}
                                    >
                                        <h1
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                                color: '#2e1f22',
                                            }}
                                        >
                                            Addendum Denda Pekerjaan
                                        </h1>
                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                maxHeight: 40
                                            }}
                                            onClick={showAddFine}
                                        >
                                            Denda
                                        </button>
                                    </div>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>Dessert (100g serving)</TableCell>
                                                <TableCell align="left">Calories</TableCell>
                                                <TableCell align="left">Fat&nbsp;(g)</TableCell>
                                                <TableCell align="left">Carbs&nbsp;(g)</TableCell>
                                                <TableCell align="left">Protein&nbsp;(g)</TableCell> */}
                                            {/* <TableCell>
                                                    1
                                            </TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" >
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="left" scope="row">{row.calories}</TableCell>
                                                    <TableCell align="left">{row.fat}</TableCell>
                                                    <TableCell align="left">{row.carbs}</TableCell>
                                                    <TableCell align="left">{row.protein}</TableCell>
                                                    <TableCell align="left">{actionButton}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>


                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 28
                                }}
                            >
                                <div
                                style={{
                                    marginTop: 28
                                }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 500
                                        }}
                                    >Pasal Sebelum Addendum</span>
                                    <textarea
                                        disabled
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                <div
                                >
                                    <span
                                        style={{
                                            fontWeight: 500
                                        }}
                                    >Pasal Setelah Addendum</span>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>
                            </div>

                        </div>
                    </>
                }

                {currentActiveTab === 5 && 
                    <>                    
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 28
                            }}
                        >

                            {/* jaminan kontrak awal */}
                            <div>
                                <span
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600
                                    }}
                                >
                                    Jaminan Kontrak Awal
                                </span>
                            </div>

                            {/* jaminan uang muka */}
                            {guaranteeBeforeAddendum && 
                                guaranteeBeforeAddendum.map((data, index) => (
                                    <>
                                        <div>
                                                
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 30,
                                                    alignItems: 'center'
                                                }}
                                            >   
                                                {/* jaminan uang muka */}
                                                <p
                                                    style={{
                                                        width: 150,
                                                        margin: 0
                                                    }}
                                                >
                                                    {data.title}
                                                </p>

                                                {/* ya / tidak */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 14,
                                                        alignItems: 'center'
                                                    }}
                                                >

                                                    <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                alignItems: 'center',
                                                                columnGap: 8
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${index}_down_payment_guarantee`}
                                                                checked={data.radio === 'yes'}
                                                            />
                                                            <span>
                                                                Ya
                                                            </span>
                                                    </label>

                                                    <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                alignItems: 'center',
                                                                columnGap: 8
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${index}_down_payment_guarantee`}
                                                                checked={data.radio === 'no'}
                                                            />
                                                            <span>
                                                                Tidak
                                                            </span>
                                                    </label>

                                                </div>

                                            </div>

                                            {/* tanggal mulai, selesai, evidence */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 20,
                                                    marginTop: 15
                                                }}
                                            >

                                                    {/* tanggal mulai */}
                                                    <div
                                                        className="col-sm-3"
                                                    >
                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <span>
                                                                Tanggal Mulai
                                                            </span>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    borderRadius: 4,
                                                                    padding: '10px 12px',
                                                                    border: 'none'
                                                                }}
                                                                value={data.startDate}
                                                                disabled
                                                            />
                                                        </label>
                                                    </div>

                                                    {/* tanggal selesai */}
                                                    <div
                                                        className="col-sm-3"
                                                    >
                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <span>
                                                                Tanggal Selesai
                                                            </span>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    borderRadius: 4,
                                                                    padding: '10px 12px',
                                                                    border: 'none'
                                                                }}
                                                                value={data.endDate}
                                                                disabled
                                                            />
                                                        </label>    
                                                    </div>

                                                
                                                    {/* evidence */}
                                                    <div
                                                        className="col-md-5"
                                                        style={{
                                                            padding: 0
                                                        }}
                                                    >
                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <span>
                                                                Evidence
                                                            </span>
                                                            <div>
                                                                <label
                                                                    htmlFor="upload"
                                                                    className={`input-group mb-3 col-sm-12 pointer`}
                                                                    style={{
                                                                        padding: 0
                                                                    }}
                                                                >

                                                                    <span
                                                                    className={`form-control text-truncate`} 
                                                                    style={{
                                                                        backgroundColor: '#e8f4fb'
                                                                    }}
                                                                    >
                                                                    {/* nama_file_upload.pdf */}
                                                                    {data.filename}
                                                                    </span>
                                                                    <div 
                                                                        className="input-group-prepend"
                                                                    >
                                                                        <span className="input-group-text"
                                                                            style={{
                                                                                backgroundColor: '#e8f4fb'
                                                                            }}    
                                                                        >
                                                                        <i className="fas fa-file-upload"></i>
                                                                        </span>
                                                                    </div>
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="d-none"
                                                                    id="upload"
                                                                    style={{
                                                                        backgroundColor: '#E8F4FB'
                                                                    }}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </label>
                                                    </div>

                                            </div>

                                        </div>
                                    </>
                                ))
                            }

                            {/* Addendum jaminan */}
                            <div>
                                <span
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600
                                    }}
                                >
                                    Addendum Jaminan
                                </span>
                            </div>

                            {guaranteeBeforeAddendum && 
                                guaranteeBeforeAddendum.map((data, index) => (
                                    <>
                                        <div>
                                                
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 30,
                                                    alignItems: 'center'
                                                }}
                                            >   
                                                {/* jaminan uang muka */}
                                                <p
                                                    style={{
                                                        width: 150,
                                                        margin: 0
                                                    }}
                                                >
                                                    {data.title}
                                                </p>

                                                {/* ya / tidak */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        gap: 14,
                                                        alignItems: 'center'
                                                    }}
                                                >

                                                    <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                alignItems: 'center',
                                                                columnGap: 8
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${index}_down_payment_guarantee`}
                                          
                                                            />
                                                            <span>
                                                                Ya
                                                            </span>
                                                    </label>

                                                    <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                alignItems: 'center',
                                                                columnGap: 8
                                                            }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`${index}_down_payment_guarantee`}
                                                        
                                                            />
                                                            <span>
                                                                Tidak
                                                            </span>
                                                    </label>

                                                </div>

                                            </div>

                                            {/* tanggal mulai, selesai, evidence */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 20,
                                                    marginTop: 15
                                                }}
                                            >

                                                    {/* tanggal mulai */}
                                                    <div
                                                        className="col-sm-3"
                                                    >
                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <span>
                                                                Tanggal Mulai
                                                            </span>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    borderRadius: 4,
                                                                    padding: '10px 12px',
                                                                    border: 'none'
                                                                }}
                                                                value={data.startDate}
                                              
                                                            />
                                                        </label>
                                                    </div>

                                                    {/* tanggal selesai */}
                                                    <div
                                                        className="col-sm-3"
                                                    >
                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <span>
                                                                Tanggal Selesai
                                                            </span>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    borderRadius: 4,
                                                                    padding: '10px 12px',
                                                                    border: 'none'
                                                                }}
                                                                value={data.endDate}
                                                            />
                                                        </label>    
                                                    </div>

                                                
                                                    {/* evidence */}
                                                    <div
                                                        className="col-md-5"
                                                        style={{
                                                            padding: 0
                                                        }}
                                                    >
                                                        <label
                                                            style={{
                                                                margin: 0,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <span>
                                                                Evidence
                                                            </span>
                                                            <div>
                                                                <label
                                                                    htmlFor="upload"
                                                                    className={`input-group mb-3 col-sm-12 pointer`}
                                                                    style={{
                                                                        padding: 0
                                                                    }}
                                                                >

                                                                    <span
                                                                    className={`form-control text-truncate`} 
                                                                    style={{
                                                                        backgroundColor: '#e8f4fb'
                                                                    }}
                                                                    >
                                                                    {data.filename}
                                                                    </span>
                                                                    <div 
                                                                        className="input-group-prepend"
                                                                    >
                                                                        <span className="input-group-text"
                                                                            style={{
                                                                                backgroundColor: '#e8f4fb'
                                                                            }}    
                                                                        >
                                                                        <i className="fas fa-file-upload"></i>
                                                                        </span>
                                                                    </div>
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="d-none"
                                                                    id="upload"
                                                                    style={{
                                                                        backgroundColor: '#E8F4FB'
                                                                    }}
                                                                />
                                                            </div>
                                                        </label>
                                                    </div>

                                            </div>

                                        </div>
                                    </>
                                ))
                            }

                        </div>
                    </>
                }

                {
                    currentActiveTab === 6 &&
                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 28
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600
                                }}
                            >
                                Nomor rekening kontrak awal
                            </h1>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 24,
                                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Nama rekening</span>
                                    <input 
                                        type="text"
                                        style={{
                                            backgroundColor: "#e8f4fb"
                                        }}
                                        disabled
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Nama bank</span>
                                    <input 
                                        type="text"
                                        style={{
                                            backgroundColor: "#e8f4fb"
                                        }}
                                        disabled
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Alamat bank</span>
                                    <input 
                                        type="text"
                                        style={{
                                            backgroundColor: "#e8f4fb"
                                        }}
                                        disabled
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Nomor rekening</span>
                                    <input 
                                        type="text"
                                        style={{
                                            backgroundColor: "#e8f4fb"
                                        }}
                                        disabled
                                    />
                                </div>
                            </div>

                            <h1
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600
                                }}
                            >
                                Addendum nomor rekening 
                            </h1>

                            <div
                                style={{
                                    display: 'grid',
                                    gap: 24,
                                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
                                }}
                            >
                                                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Nama rekening</span>
                                    <input 
                                        type="text"
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Nama bank</span>
                                    <input 
                                        type="text"
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Alamat bank</span>
                                    <input 
                                        type="text"
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <span>Nomor rekening</span>
                                    <input 
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600
                                    }}
                                >
                                    Surat pernyataan dari bank
                                </span>
                                <div>
                                    
                                    <label
                                                        htmlFor="upload"
                                                        className={`input-group mb-3 col-sm-3 pointer`}
                                                        style={{
                                                            padding: 0
                                                        }}
                                                    >

                                                        <span
                                                        className={`form-control text-truncate`} 
                                                        style={{
                                                            backgroundColor: '#e8f4fb'
                                                        }}
                                                        >
                                                        nama_file_upload.pdf
                                                        </span>
                                                        <div 
                                                            className="input-group-prepend"
                                                        >
                                                            <span className="input-group-text"
                                                                 style={{
                                                                    backgroundColor: '#e8f4fb'
                                                                }}    
                                                            >
                                                            <i className="fas fa-file-upload"></i>
                                                            </span>
                                                        </div>
                                    </label>

                                    <input
                                        type="file"
                                        className="d-none"
                                        id="upload"
                                        style={{
                                            backgroundColor: '#E8F4FB'
                                        }}
                                    />

                                </div>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Sebelum Addendum</span>
                                <textarea
                                    disabled
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <span
                                    style={{
                                        fontWeight: 500
                                    }}
                                >Pasal Setelah Addendum</span>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                        </div>
                    </>
                }

                </CardBody>
            </Card>
        </> 
    )

}

const defaultColumn = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
    },
  }
  
  function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current
  
    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
      shouldSkipRef.current = false
    }, [])
  
    React.useEffect(() => {
      shouldSkipRef.current = true
    })
  
    return [shouldSkip, skip]
  }

export default FormParameter