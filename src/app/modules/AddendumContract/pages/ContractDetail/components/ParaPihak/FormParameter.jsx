import React, { useState, useRef } from "react"
import {
    Card,
    CardBody,
  } from "_metronic/_partials/controls"
  import { 
    Formik, 
    Field, 
    Form, 
    useFormikContext 
} from 'formik'
import SVG from "react-inlinesvg"
import {toAbsoluteUrl} from "_metronic/_helpers/index"

import ButtonAction from "app/components/buttonAction/ButtonAction"
import DialogGlobal from "app/components/modals/DialogGlobal"

import { useParams } from "react-router-dom"

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

import { ReactSelect } from "percobaan/ReactSelect"

import { 
    fetch_api_sg, 
    getLoading 
} from "redux/globalReducer"
import { connect } from "react-redux"

import { useCollapse } from 'react-collapsed'
import { makeStyles } from "@material-ui/core/styles"
import Input from "@material-ui/core/Input"
import IconButton from "@material-ui/core/IconButton"
import DoneIcon from "@material-ui/icons/DoneAllTwoTone"
import RevertIcon from "@material-ui/icons/NotInterestedOutlined"
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles()
    const { isEditMode } = row

    return (
    <TableCell align="left" className={classes.tableCell}>
        {isEditMode ? (
        <Input
            value={row[name]}
            name={name}
            onChange={e => onChange(e, row)}
            className={classes.input}
        />
        ) : (
        row[name]
        )}
    </TableCell>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto"
    },
    table: {
      minWidth: 650
    },
    selectTableCell: {
      width: 60
    },
    tableCell: {
      width: 130,
      height: 40
    },
    input: {
      width: 130,
      height: 40
    },
    content: {
        display: 'table-row',
        width: '100%'
    }
}))

const createNewData = (item_desc, qty, unit, unit_price, total_price, information) => ({
    id: item_desc.replace(" ", "_"),
    item_desc,
    qty,
    unit,
    unit_price,
    total_price,
    information,
    isEditMode: false,
    children: []
})

const createNewPlaceman = (name, fullname, position, address, phone_number, fax) => ({
    name,
    fullname,
    position,
    address,
    phone_number,
    fax
})

// const toPush = useRef()

// const setPush = (e) => {
//   toPush.current.click()
// }

const CollapsibleRow = ({ 
    classes, 
    index, 
    onAddMode,
    onAddChildMode,
    onChange, 
    onChangeChild, 
    onDeleteMode,
    onDeleteChildMode,
    onRevert,
    onRevertChild,
    onToggleEditMode, 
    onToggleEditChildMode, 
    row
}) => 
{

    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()
        
       return (
            <>
                {/* parent table */}
                <TableRow>
                            <TableCell
                                className={classes.tableCell}
                            >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {`${index+1}`}
                                        {/* it work like a charm! */}
                                        {row.children.length > 0 &&
                                            <button {...getToggleProps()}>
                                                {isExpanded ? 
                                                    <KeyboardArrowUpIcon /> 
                                                    :
                                                    <KeyboardArrowDownIcon />
                                                }
                                            </button>
                                        }
                                    </div>
                            </TableCell>
                            <CustomTableCell {...{ row, name: "item_desc", onChange }} />
                            <CustomTableCell {...{ row, name: "qty", onChange }} />
                            <CustomTableCell {...{ row, name: "unit", onChange }} />
                            <CustomTableCell {...{ row, name: "unit_price", onChange }} />
                            <CustomTableCell {...{ row, name: "total_price", onChange }} />
                            <CustomTableCell {...{ row, name: "information", onChange }} />
                            {row.isEditMode ? 
                                (
                                    <TableCell>
                                                                        <IconButton
                                                                                aria-label="done"
                                                                                onClick={() => onToggleEditMode(row.id)}
                                                                            >
                                                                                <DoneIcon />
                                                                        </IconButton>
                                                                        <IconButton
                                                                                aria-label="revert"
                                                                                onClick={() => onRevert(row.id)}
                                                                            >
                                                                                <RevertIcon />
                                                                        </IconButton>
                                    </TableCell>
                                )
                                    : 
                                (
                                    <TableCell>
                                        <ButtonAction
                                            handleAction={(a, b, c) => {
                                                                                if(c === 'Hapus') {
                                                                                                        onDeleteMode(row.id)
                                                                                } else if (c === 'Edit') {
                                                                                                        onToggleEditMode(row.id)
                                                                                } else if (c === 'Tambah') {
                                                                                                        onAddMode()
                                                                                } else if (c === 'Tambah Sub Item') {
                                                                                    onAddChildMode(row.id, index)
                                                                                }
                                                                            }}
                                                                            ops={[
                                                                                                    {
                                                                                                        label: "Edit",
                                                                                                    },
                                                                                                    {
                                                                                                        label: "Hapus",
                                                                                                    },
                                                                                                    {
                                                                                                        label: "Tambah"
                                                                                                    },
                                                                                                    {
                                                                                                        label: 'Tambah Sub Item'
                                                                                                    }
                                            ]}
                                        >
                                        </ButtonAction>
                                    </TableCell>
                                )
                            }
                </TableRow>

                {/* children table */}
                {row?.children &&
                    row.children.map((data, childIndex) => (
                            
                        <TableRow 
                            key={index}
                            {...getCollapseProps()}
                        >
                                                                
                            <TableCell>
                                <div>
                                </div>
                            </TableCell>
                            <TableCell align="left" className={classes.tableCell}>
                                {data.isEditMode ? (
                                    <Input
                                        value={data.item_desc}
                                        name={'item_desc'}
                                        onChange={e => onChangeChild(e, data, index, childIndex)}
                                        className={classes.input}
                                    />
                                ) : 
                                (data.item_desc)}
                            </TableCell>
                            <TableCell align="left" className={classes.tableCell}>
                                {data.isEditMode ? (
                                                                        <Input
                                                                            value={data.calories}
                                                                            name={'calories'}
                                                                            onChange={e => onChangeChild(e, data, index, childIndex)}
                                                                            className={classes.input}
                                                                        />
                                ) : 
                                (data.calories)}
                            </TableCell>
                            <TableCell align="left" className={classes.tableCell}>
                                                                            {data.isEditMode ? 
                                                                                (
                                                                                <Input
                                                                                    value={data.fat}
                                                                                    name={'fat'}
                                                                                    onChange={e => onChangeChild(e, data, index, childIndex)}
                                                                                    className={classes.input}
                                                                                />
                                                                                ) 
                                                                            :
                                                                                (
                                                                                    data.fat
                                                                                )
                                                                            }
                            </TableCell>
                            <TableCell align="left" className={classes.tableCell}>
                                                                            {data.isEditMode ? 
                                                                                (
                                                                                    <Input
                                                                                        value={data.carbs}
                                                                                        name={'carbs'}
                                                                                        onChange={e => onChangeChild(e, data, index, childIndex)}
                                                                                        className={classes.input}
                                                                                    />
                                                                                ) 
                                                                            :
                                                                                (
                                                                                    data.carbs
                                                                                )
                                                                            }
                            </TableCell>
                            <TableCell align="left" className={classes.tableCell}>
                                                                            {data.isEditMode ? 
                                                                                (
                                                                                    <Input
                                                                                        value={data.protein}
                                                                                        name={'protein'}
                                                                                        onChange={e => onChangeChild(e, data, index, childIndex)}
                                                                                        className={classes.input}
                                                                                    />
                                                                                ) 
                                                                            :
                                                                                (
                                                                                    data.protein
                                                                                )
                                                                            }
                            </TableCell>
                        
                            {/* error karena data nya gak sampai kesini dulu */}
                        
                            {data.isEditMode ? 
                                (
                                    <TableCell>
                                        <IconButton
                                                                                    aria-label="done-child"
                                                                                    onClick={() => onToggleEditChildMode(data.id, index)}
                                                                                >
                                                                                    <DoneIcon />
                                        </IconButton>
                                        <IconButton
                                                                                    aria-label="revert-child"
                                                                                    onClick={() => onRevertChild(data.id, index)}
                                                                                >
                                                                                    <RevertIcon />
                                        </IconButton>
                                    </TableCell>
                                )
                                    : 
                                (
                                    <TableCell>
                                                                                <ButtonAction
                                                                                    handleAction={(a, b, c) => {
                                                                                        if(c === 'Hapus') {
                                                                                            onDeleteChildMode(data.id, index)
                                                                                        } else if (c === 'Edit') {
                                                                                            onToggleEditChildMode(data.id, index)
                                                                                        }
                                                                                    }}
                        
                                                                                    ops={[
                                                                                        {
                                                                                            label: "Edit",
                                                                                        },
                                                                                        {
                                                                                            label: "Hapus",
                                                                                        }
                                                                                    ]}
                                                                                >
                                                                                </ButtonAction>
                                    </TableCell>
                                )
                            }
                        
                        </TableRow>
                    
                    ))
                }
            </>
       )
        
    
        

}

function EditableTable() {
    const [rows, setRows] = React.useState([
      createNewData("TX-76543 -- 001 ABCDEFFGH", 10, 'EA', '100.000.000', '1.000.000.000', 'Tidak Ada'),
      createNewData("TX-76543 -- 002 ABCDEFFGH", 10, 'EA', '100.000.000', '1.000.000.000', 'Tidak Ada'),
      createNewData("TX-76543 -- 003 ABCDEFFGH", 10, 'EA', '100.000.000', '1.000.000.000', 'Tidak Ada')
    ])
    const [previous, setPrevious] = React.useState({});
    const classes = useStyles();

    const onToggleEditMode = id => {
      setRows(state => {
        // isi state nya semua baris objek di dalam array tsb
        console.log('isi state onToggleEditMode', state)
        return rows.map(row => {
          if (row.id === id) {
            return { ...row, isEditMode: !row.isEditMode };
          }
          return row
        });
      });
    }
    
    const onDeleteMode = id => {
        setRows(state => {
            return rows.filter(row => {
              return row.id !== id;
            })
          })
    }

    const onChange = (e, row) => {
        if (!previous[row.id]) {
          setPrevious(state => ({ ...state, [row.id]: row }));
        }
        const value = e.target.value;
        const name = e.target.name;
        const { id } = row;
        const newRows = rows.map(row => {
          if (row.id === id) {
            return { ...row, [name]: value };
          }
          return row;
        });
        setRows(newRows);
    }
    
    const onRevert = id => {
        const newRows = rows.map(row => {
          if (row.id === id) {
            return previous[id] ? previous[id] : row;
          }
          return row;
        })
        // console.log('isi previous', previous[id])
        // console.log('isi new rows', newRows)
        setRows(newRows);
        setPrevious(state => {
          delete state[id]
          return state
        })
        onToggleEditMode(id)
    }
  
    const onAddMode = () => {
          setRows(state => [...state, 
            createNewData(
                "TX-76543 -- 002 ABCDEFFGH", 
                5, 
                'EA', 
                '100.000.000', 
                '500.000.000',
                'Tidak Ada'
                )
            ])
    }

    const onToggleEditChildMode = (id, index) => {
        setRows(prev => {
            const newState = prev
            const changedData = rows[index].children.map(row => {
                if (row.id === id) {
                    return { ...row, isEditMode: !row.isEditMode }
                }
                    return row
            })
            newState[index].children = changedData
            return [...newState]
        })
    }

    const onDeleteChildMode = (childId, index) => {

        // akhirnya bisa juga ngentiaw
        setRows((prev) => {
            const newState = prev;
            const items = rows[index].children.filter(
            (variant) => variant.id !== childId
            )
            console.log('setelah filter', items)
            newState[index].children = items;
            return [...newState]
        })

    }

    const onChangeChild = (e, row, parentIndex, childIndex) => {
           
        console.log('isi row di onchangechild', row)

          if (!previous[row.id]) {
            setPrevious(state => ({ ...state, [row.id]: row }));
          }

          const value = e.target.value;
          const name = e.target.name;
          const { id } = row;
          const newRows = rows[parentIndex].children.map(item => {
                return { ...row, [name] : value }
          })
          
          console.log('isi new rows', newRows)

          setRows((prev) => {
            const newState = prev;
            newState[parentIndex].children = newRows
            return [...newState]
          })

    }

    const onAddChildMode = (parentId, index) => {
       let result = rows.map(row => {
            if (row.id === parentId) {
                if(row.children) {
                    return { 
                        ...row, 
                        children: [
                            ...row.children, 
                            createNewData("Pudding", 591, 9.1, 60, 7.2)
                        ] 
                    }
                } 
                else {
                    return { 
                        ...row, 
                        children: [
                            createData("Pudding", 591, 9.1, 60, 7.2)
                        ]
                    }
                }
            }
            // wajib ada, kalo gak ada bakal error
            return row
        })
        setRows(result)
    }

    const onRevertChild = (id, index) => {

        // const newRows = rows[index].children.map(row => {
        //     if (row.id === id) {
        //       return previous[id] ? previous[id] : row;
        //     }
        //     return row;
        //   })
        //   setRows(newRows);
        //   setPrevious(state => {
        //     delete state[index].children[id];
        //     return state[index];
        //   })

        onToggleEditChildMode(id, index)

    }

    return (
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          
          {/* Table Header */}
          <TableBody>
            <TableRow>
              <TableCell size="small">No.</TableCell>
              <TableCell align="left">Deskripsi Item</TableCell>
              <TableCell align="left">QTY</TableCell>
              <TableCell align="left">Satuan</TableCell>
              <TableCell align="left">Harga Satuan</TableCell>
              <TableCell align="left">Harga Total</TableCell>
              <TableCell align="left">Keterangan</TableCell>
              <TableCell align="left">Aksi</TableCell>
            </TableRow>
          </TableBody>

          <TableBody>
                {rows.map((row, index) => (
                    row.children ?
                        
                        <>
    
                            <CollapsibleRow 
                                row={row}
                                index={index}
                                classes={classes}
                                onAddMode={onAddMode}
                                onAddChildMode={onAddChildMode}
                                onChange={onChange}
                                onChangeChild={onChangeChild}
                                onDeleteMode={onDeleteMode}
                                onDeleteChildMode={onDeleteChildMode}
                                onRevert={onRevert}
                                onRevertChild={onRevertChild}
                                onToggleEditChildMode={onToggleEditChildMode}
                                onToggleEditMode={onToggleEditMode}
                            />
    
                        </>

                            :

                        <>
                            {/* selalu masuk kesini */}
                            <TableRow key={row.id}>
                                <CustomTableCell {...{ row, name: "name", onChange }} />
                                <CustomTableCell {...{ row, name: "calories", onChange }} />
                                <CustomTableCell {...{ row, name: "fat", onChange }} />
                                <CustomTableCell {...{ row, name: "carbs", onChange }} />
                                <CustomTableCell {...{ row, name: "protein", onChange }} />
                                <TableCell className={classes.selectTableCell}>
                                    {row.isEditMode ? (
                                        <>
                                        <IconButton
                                            aria-label="done"
                                            onClick={() => onToggleEditMode(row.id)}
                                        >
                                            <DoneIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="revert"
                                            onClick={() => onRevert(row.id)}
                                        >
                                            <RevertIcon />
                                        </IconButton>
                                        </>
                                    ) : (
                                        <ButtonAction
                                            handleAction={(a, b, c) => {
                                                if(c === 'Hapus') {
                                                    onDeleteMode(row.id)
                                                } else if (c === 'Edit') {
                                                    onToggleEditMode(row.id)
                                                } else if (c === 'Tambah') {
                                                    onAddMode()
                                                } else if (c === 'Tambah Sub Item') {
                                                    onAddChildMode(row.id, index)
                                                }
                                            }}
                                            ops={[
                                                {
                                                    label: "Edit",
                                                },
                                                {
                                                    label: "Hapus",
                                                },
                                                {
                                                    label: "Tambah"
                                                },
                                                {
                                                    label: 'Tambah Sub Item'
                                                }
                                            ]}
                                        >
                                        </ButtonAction>
                                    )}
                                </TableCell>
                            </TableRow>
                        </>

                    ))
                }
          </TableBody>

        </Table>
      </Paper>
    );
}

const timePeriodBeforeAddendum = [
    {
        title: 'Jangka Waktu Perjanjian',
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
        // radio: 'SKPP'
    },
    {
        title: 'Jangka Waktu Masa Pemeliharaan',
        startDate: '2023-09-29',
        endDate: '2023-09-30',
        totalMonth: 6,
        calendarDay: 15,
        // radio: 'SPMK'
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

  
  
  const FormParameter = ({
      currentActiveTab,
      fetch_api_sg,
      jsonData,
      authorizedOfficial,
      jobDirector,
      jobSupervisor
    }) => {

        const [bankIndex, setBankIndex] = useState(0)
        const [authorizedOfficialIndex, setauthorizedOfficialIndex] = useState(0)
        const [jobDirectorIndex, setJobDirectorIndex] = useState(0)
        const [jobSupervisorIndex, setJobSupervisorIndex] = useState(0)
        const changeDataBankIndex = (num) => {
            setBankIndex(num)
        }
        const changeDataauthorizedOfficial = (num) => {
            setauthorizedOfficialIndex(num)
        }
        const changeDataJobDirector = (num) => {
            setJobDirectorIndex(num)
        }
        const changeDataJobSupervisor = (num) => {
            setJobSupervisorIndex(num)
        }

        const [addendumRows, setAddendumRows] = useState([
          createData(1, 'Keterlambatan Pekerjaan', 10, 30, '%')
        ])
    // console.log('tab yang aktif sekarang', currentActiveTab)
    console.log('isi jsonData', jsonData)   

    const [dataArr, setDataArr] = React.useState([])
    const [dataArrFine, setDataArrFine] = React.useState([])
    const { contract_id } = useParams()
    const [placeman, setPlaceman] = useState({
        workDirector: [
            createNewPlaceman(
                'Herdian', 
                'Herdian Ardi Febrianto', 
                'General Manager Unit Dieng', 
                'Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo',
                '+62-286-3342020',
                '+62-286-3342022'
            )
        ],
        workSupervisor: [
            createNewPlaceman(
                '',
                '',
                'Logistic Supervisor',
                'Jl. Raya Dieng Batur, Karangtengah Batur Banjarnegara',
                '+62-286-3342020',
                '+62-286-3342022'
            )
        ]
    })

    const getDataPenalties = async () => {
        fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/refference/get-all-pinalties`,
        onSuccess: (res) => {
            // console.log(`res.data`, res.data);
            // generateTableContent(res.data);
            setDataArr(
            res.data.map((item) => ({
                id: item.id,
                name: item.pinalty_name
            }))
            )
        },
        });
    }

    const getDataBankAccounts = async () => {
        fetch_api_sg({
        key: keys.fetch,
        type: "get",
        url: `/adendum/refference/get-party-bank/${contract_id}`,
        onSuccess: (res) => {
            setDataArrFine(
            res.data.map((item) => ({
                id: item.id,
                name: item.pinalty_name
            }))
            )
        },
        });
    }

    React.useEffect(() => {
        getDataPenalties()
        getDataBankAccounts()
    }, [])

    React.useEffect(() => {
        console.log('isi dataArr',dataArr)
    }, [dataArr])

    const [addendumPaymentMethod, setAddendumPaymentMethod] = useState('full')

    const openCloseAddFine = React.useRef()
    const showAddFine = () => {
        openCloseAddFine.current.open()
    }

    const openCloseAddDetail = React.useRef()
    const showAddDetail = () => {
        openCloseAddDetail.current.open()
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
                onYes={() => {
                    setPlaceman(placeman => {
                        return {
                            ...placeman,
                            workSupervisor: [
                                ...placeman.workSupervisor,
                                createNewPlaceman(
                                    "TX-76543 -- 002 ABCDEFFGH", 
                                    5, 
                                    'EA', 
                                    '100.000.000', 
                                    '500.000.000',
                                    'Tidak Ada'
                                )
                            ] 
                        }
                    }
                        
                    )
                 }}
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
                 onYes={() => {
                    setPlaceman(placeman => {
                        return {
                            ...placeman,
                            workDirector: [
                                ...placeman.workDirector,
                                createNewPlaceman(
                                    "TX-76543 -- 002 ABCDEFFGH", 
                                    5, 
                                    'EA', 
                                    '100.000.000', 
                                    '500.000.000',
                                    'Tidak Ada'
                                )
                            ] 
                        }
                    }
                        
                    )
                 }}
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
                            // kalo ada value nya jadi statis, gabisa diisi apa2
                            // value={""}
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
                            // value={""}
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
                            // value={""}
                        />
                    </div>

                    </div>

                </div>
            </DialogGlobal>

            {/* modal tambah rincian */}
            <DialogGlobal
              ref={openCloseAddDetail}
              isCancel={false}
              isSubmit={false}
              yesButton={false}
              noButton={false}
              maxWidth={'sm'}
            >

              <Formik
                    initialValues={{
                        fine_type: '',
                        value: '',
                        max_day: '',
                        value_type: ''
                    }}
                onSubmit={
                    (values) => {
                        setAddendumRows(data => {
                            return [
                                ...data,
                                createData(
                                    1,
                                    values.fine_type, 
                                    values.value, 
                                    values.max_day, 
                                    values.value_type
                                )
                            ]
                        }
                        )
                    }
                }
              >
                {({values}) => (
                    <>

                        <Form>

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
                                    Tambah Rincian Harga Pekerjaan
                                </h1>

                            </div>

                            {/* form flex */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    padding: '0 12px',
                                    columnGap: '72px',
                                    rowGap: '14px'
                                }}
                            >
                                
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        flex: 1
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            Deskripsi Item
                                        </span>
                                        <Field 
                                            type="text"
                                            name="item_desc"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#8c8a8a',
                                                opacity: .8
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            QTY
                                        </span>
                                        <Field 
                                            type="text" 
                                            name="quantity"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#8c8a8a',
                                                opacity: .8
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            Satuan
                                        </span>
                                        <Field 
                                            type="text" 
                                            name="uom" 
                                            style={{
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    border: 1,
                                                    borderStyle: 'solid',
                                                    borderColor: '#8c8a8a',
                                                    opacity: .8
                                            }}
                                        />
                                    </div>

                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        flex: 1
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            Harga Satuan
                                        </span>

                                        <Field 
                                            type="text" 
                                            name="unit_price"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#8c8a8a',
                                                opacity: .8
                                            }}
                                        />

                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            Harga Total
                                        </span>
                                        <Field 
                                            type="text" 
                                            name="value"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#8c8a8a',
                                                opacity: .8
                                            }} 
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            Keterangan
                                        </span>
                                        <Field 
                                            type="text" 
                                            name="note"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                border: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#8c8a8a',
                                                opacity: .8
                                            }} 
                                        />
                                    </div>

                                    {/* <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}
                                        >
                                            Type Nilai
                                        </span>
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
                                    </div> */}

                                </div>

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: 52,
                                    padding: '0 12px'
                                }}
                            >
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save
                                </button>
                            </div>

                        </Form>
                    </>
                )}
              </Formik>

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

              <Formik
                    initialValues={{
                        fine_type: '',
                        value: '',
                        max_day: '',
                        value_type: ''
                    }}
                onSubmit={
                    (values) => {
                        setAddendumRows(data => {
                            return [
                                ...data,
                                createData(
                                    1,
                                    values.fine_type, 
                                    values.value, 
                                    values.max_day, 
                                    values.value_type
                                )
                            ]
                        }
                        )
                    }
                }
              >
                {({values}) => (
                    <>

                        <Form>
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
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600
                                    }}
                                >
                                    Jenis Denda
                                </span>
                                <Field
                                    as="select"
                                    name="fine_type"
                                    style={{
                                        padding: '10px 0',
                                        backgroundColor: '#e8f4fb',
                                        borderRadius: 4
                                    }}
                                >
                                    {dataArrFine.length > 0 &&
                                        
                                        (
                                            dataArr.map((data) => {
                                            return (
                                                <>
                                                    <option
                                                        style={{
                                                            display:'none'
                                                        }}
                                                    >
                                                    </option>
                                                    <option
                                                                key={data.id}
                                                                style={{
                                                                    padding: '10px 12px',
                                                                    backgroundColor: 'white',
                                                                    borderRadius: 4
                                                                }}
                                                                value={data.name}
                                                        >
                                                            {data.name}
                                                    </option>
                                                </>
                                            ) 
                                            
                                            })
                                        )
                                        
                                    }
                                </Field>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600
                                    }}
                                >
                                    Nilai
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
                                    value={"Procurement Staff"}
                                /> */}
                                <Field 
                                    type="text" 
                                    name="value" 
                                    style={{
                                        padding: 8,
                                        borderRadius: 4,
                                        border: 1,
                                        borderStyle: 'solid',
                                        borderColor: '#8c8a8a',
                                        opacity: .8
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600
                                    }}
                                >
                                    Maksimal Hari
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
                                    value={"user.4@geodipa.co.id"}
                                /> */}
                                <Field 
                                    type="text" 
                                    name="max_day" 
                                    style={{
                                        padding: 8,
                                        borderRadius: 4,
                                        border: 1,
                                        borderStyle: 'solid',
                                        borderColor: '#8c8a8a',
                                        opacity: .8
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 10
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600
                                    }}
                                >
                                    Type Nilai
                                </span>
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
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save
                                </button>
                            </div>
                        </Form>
                    </>
                )}
              </Formik>

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

                {/* Para Pihak */}
                {currentActiveTab === 0 &&                
                    <>

                        {/* Pihak 1 + 2 */}
                        <div
                            className="parties-wrapper"
                            style={{
                                border: 1,
                                borderStyle: 'solid',
                                borderColor: 'black',
                                borderRadius: 14,
                                padding: '28px 15.5px',
                                marginBottom: 40
                            }}
                        >
                            
                            {/* Header pihak pertama */}
                            <div
                                style={{
                                    backgroundColor: '#cdcdcd',
                                    display: 'inline-block',
                                    padding: 8,
                                    borderRadius: 6,
                                    marginBottom: 14,
                                    marginLeft: 12.5
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

                            {/* Baris pihak pertama */}
                            <div
                                className="row col-md-12"
                            >

                                {/* Pihak pertama */}
                                <div
                                    className="col-md-6"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 28
                                    }}
                                >

                                    {/* Pejabat Berwenang */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >
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
                                                    rowGap: 4,
                                                    height: 65.5
                                                }}
                                            >
                                                <span>Username</span>
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_contract_signature_username}`}
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
                                                <span>Nama</span>
                                                <input 
                                                    type="text"
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_contract_signature_name}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_position_of_autorize}`}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>
                                        <div>
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
                                                    value={`${
                                                        jsonData?.
                                                        authority?.
                                                        address
                                                    }`}
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
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                    value={`${
                                                        jsonData?.
                                                        authority?.
                                                        phone
                                                    }`}
                                                />
                                            </label>
                                        </div>
                                        <div>
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
                                                    value={`${
                                                        jsonData?.
                                                        authority?.
                                                        fax
                                                    }`}
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>
                                        <div>
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
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_1_sk_no}`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date" 
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_1_sk_date}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_notary_act_autorized_name}`}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>
                                        <div>
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
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_1_notary_act_autorized_no}`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date" 
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_1_notary_act_autorized_no}`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                        <div>
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
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_1_autorized_kemenkumham_no}`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date"
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_1_autorized_kemenkumham_no}`}
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
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >
                                        
                                        <div
                                            style={{
                                                height: 44.89
                                            }}
                                        >
                                            <h1
                                                style={{
                                                    fontSize: '16px',
                                                    minHeight: 38.17
                                                }}
                                            >
                                                Direksi pekerjaan
                                            </h1>
                                        </div>

                                        <div
                                        >
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    height: 65.5
                                                }}
                                            >
                                                <span>Username</span>
                                                <input
                                                    type="text" 
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_director_position_username}`}
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
                                                <span>Nama Lengkap</span>
                                                <input
                                                    type="text" 
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_director_position_full_name}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_director_position}`}   
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_director_position_address}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_director_position_phone}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_director_position_fax}`}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>

                                    </div>

                                    {/* Pengawas Pekerjaan */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >
                                        
                                        <div
                                            style={{
                                                height: 44.89
                                            }}
                                        >
                                            <h1
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Pengawas pekerjaan
                                            </h1>
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_job_supervisor.name}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_job_supervisor.address}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_job_supervisor.telp}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_1_job_supervisor.fax}`}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>

                                    </div>

                                </div>

                                {/* Addendum pihak pertama */}
                                <div
                                    className="col-md-6"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 28
                                    }}
                                >

                                    {/* Pejabat Berwenang */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >

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
                                                {/* <ReactSelect /> */}
                                                <ReactSelect
                                                    data={authorizedOfficial}
                                                    func={changeDataauthorizedOfficial}
                                                    labelName={`authorized_official_username`}
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
                                                <span>Nama</span>
                                                <input 
                                                    type="text"
                                                    value={
                                                        authorizedOfficial[authorizedOfficialIndex]?.
                                                        authorized_official_name
                                                    }
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
                                                    value={
                                                        authorizedOfficial[authorizedOfficialIndex]?.
                                                        authorized_official_position
                                                    }
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
                                                    // value={"Jl Raya Dieng - Batur Banjarnegara PO BOX 01 Wonosobo"}
                                                    value={
                                                        authorizedOfficial[authorizedOfficialIndex]?.
                                                        address
                                                    }
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
                                                    value={
                                                        authorizedOfficial[authorizedOfficialIndex]?.
                                                        phone
                                                    }
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
                                                    value={
                                                        authorizedOfficial[authorizedOfficialIndex]?.
                                                        fax
                                                    }
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
                                                        value={
                                                            authorizedOfficial[authorizedOfficialIndex]?.
                                                            assignment_deed_no
                                                        }
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date" 
                                                        value={
                                                            authorizedOfficial[authorizedOfficialIndex]?.
                                                            assignment_deed_date
                                                        }
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
                                                    value={
                                                        authorizedOfficial[authorizedOfficialIndex]?.
                                                        name_notary_deed_of_authorized_official
                                                    }
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
                                                        value={
                                                            authorizedOfficial[authorizedOfficialIndex]?.
                                                            authorized_official_deed_no
                                                        }
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date" 
                                                        value={
                                                            authorizedOfficial[authorizedOfficialIndex]?.
                                                            authorized_official_deed_date
                                                        }
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
                                                        value={
                                                            authorizedOfficial[authorizedOfficialIndex]?.
                                                            authorized_official_sk_kemenkumham_no
                                                        }
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date"
                                                        value={
                                                            authorizedOfficial[authorizedOfficialIndex]?.
                                                            authorized_official_sk_kemenkumham_date
                                                        }
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
                                    {/* addendum direksi pekerjaan 1 */}
                                    {placeman.workDirector && 
                                        placeman.workDirector.map((data, index) => {
                                            return <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 14
                                            }}
                                            >
                                                
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        height: 44.89
                                                    }}
                                                >
                                                        <h1
                                                            style={{
                                                                fontSize: '16px',

                                                            }}
                                                        >
                                                            Addendum Direksi pekerjaan
                                                        </h1>

                                                        {index === 0 &&                                                
                                                            <button
                                                                className="btn btn-primary mx-1"
                                                                onClick={showAddWorkDirector}
                                                            >
                                                                Tambah
                                                            </button>
                                                        }
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
                                                        <ReactSelect
                                                            data={jobDirector}
                                                            func={changeDataJobDirector}
                                                            labelName={`username`}
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
                                                        <span>Nama Lengkap</span>
                                                        <input
                                                            type="text" 
                                                            value={jobDirector[jobDirectorIndex]?.full_name}
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
                                                            // value={`${data.position}`}
                                                            value={jobDirector[jobDirectorIndex]?.position_name}
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
                                                            // value={`${data.address}`}
                                                            value={authorizedOfficial[authorizedOfficialIndex]?.address}
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
                                                            value={authorizedOfficial[authorizedOfficialIndex]?.phone}
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
                                                            value={authorizedOfficial[authorizedOfficialIndex]?.fax}
                                                            className="form-control"
                                                            style={{ backgroundColor: "#e8f4fb" }}
                                                        />
                                                    </label>
                                                </div>

                                            </div>
                                        })
                                    }

                                    {/* Pengawas Pekerjaan */}
                                    {placeman.workSupervisor && 
                                        placeman.workSupervisor.map((data, index) => {
                                            return <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 14
                                                }}
                                            >
                                                
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

                                                        {index === 0 &&
                                                            <button
                                                                className="btn btn-primary mx-1"
                                                                onClick={showAddWorkSupervisor}
                                                            >
                                                                Tambah
                                                            </button>
                                                        }
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
                                                            value={`${data.position}`}
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
                                                        {/* <input
                                                            type="text" 
                                                            value={`${data.address}`}
                                                            className="form-control"
                                                            style={{ backgroundColor: "#e8f4fb" }}
                                                        /> */}
                                                        <ReactSelect 
                                                            data={jobSupervisor}
                                                            func={changeDataJobSupervisor}
                                                            labelName={'facility_name'}
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
                                                            // value={`${data.phone_number}`}
                                                            value={jobSupervisor[jobSupervisorIndex]?.phone}
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
                                                            // value={`${data.fax}`}
                                                            value={jobSupervisor[jobSupervisorIndex]?.fax}
                                                            className="form-control"
                                                            style={{ backgroundColor: "#e8f4fb" }}
                                                        />
                                                    </label>
                            </div>

                        </div>
                                        })
                                    }

                                </div>

                            </div>

                            {/* Header pihak kedua */}
                            <div
                                style={{
                                    backgroundColor: '#cdcdcd',
                                    display: 'inline-block',
                                    padding: 8,
                                    borderRadius: 6,
                                    marginBottom: 14,
                                    marginTop: 40,
                                    marginLeft: 12.5
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

                            {/* Baris pihak kedua */}
                            <div
                                className="row col-md-12"
                            >
                                
                                {/* Pihak kedua */}
                                <div
                                    className="col-md-6"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 28
                                    }}
                                >

                                    {/* Pejabat Berwenang */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >

                                        <div

                                        >

                                            <h1
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Pejabat berwenang
                                            </h1>
                                        </div>

                                        <div
                                        >
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    height: 65.5
                                                }}
                                            >
                                                <span>Username</span>
                                                <input 
                                                    type="text" 
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_contract_signature_username}`}
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
                                                <span>Nama</span>
                                                <input 
                                                    type="text"
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_autorize_name}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_position}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_address}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_phone}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_fax}`}
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
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_2_sk_no}`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date"
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_2_sk_date}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_notary_act_autorized_name
                                                    }`}
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
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_2_notary_act_autorized_no
                                                        }`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date"
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_2_notary_act_autorized_date
                                                        }`}
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
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_2_autorized_kemenkumham_no
                                                        }`}
                                                        className="form-control"
                                                        style={{
                                                            backgroundColor: "#e8f4fb"
                                                        }}
                                                    />
                                                    -
                                                    <input 
                                                        type="date"
                                                        value={`${
                                                            jsonData?.
                                                            contract_party?.
                                                            party_2_autorized_kemenkumham_date
                                                        }`}
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
                                    <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                gap: 14
                                                                            }}
                                    >
                                        
                                        <div
                                            style={{
                                                minHeight: 44.89
                                            }}
                                        >
                                            <h1
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Direksi pekerjaan
                                            </h1>
                                        </div>

                                        <div
                                        >
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    height: 65.5
                                                }}
                                            >
                                                <span>Username</span>
                                                <input
                                                    type="text" 
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_username}`}
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
                                                <span>Nama Lengkap</span>
                                                <input
                                                    type="text"
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_full_name}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_address}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_phone}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_director_position_fax}`}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>

                                    </div>

                                    {/* Pengawas Pekerjaan */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >
                                        
                                        <div
                                            style={{
                                                minHeight: 44.89
                                            }}
                                        >
                                            <h1
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Pengawas pekerjaan
                                            </h1>
                                        </div>

                                        <div
                                        >
                                            <label
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    rowGap: 4,
                                                    // height: 65.5
                                                }}
                                            >
                                                <span>Jabatan</span>
                                                <input
                                                    type="text"
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_job_supervisor.name}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_job_supervisor.address}`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_job_supervisor.telp
                                                    }`}
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
                                                    value={`${
                                                        jsonData?.
                                                        contract_party?.
                                                        party_2_job_supervisor.fax
                                                    }`}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#e8f4fb" }}
                                                />
                                            </label>
                                        </div>

                                    </div>

                                </div>
                                
                                {/* Addendum pihak kedua */}
                                <div
                                    className="col-md-6"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 28
                                    }}
                                >

                                    {/* Pejabat Berwenang */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >

                                        <div>
                                            <h1
                                                style={{
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Addendum Pejabat berwenang
                                            </h1>
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
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14
                                        }}
                                    >
                                        
                                        {/* addendum direksi pekerjaan pihak kedua */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                height: 44.89
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
                        </div>

                        {/* Klausul Perubahan */}
                        <div
                            className="clause-change-wrapper"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                border: 1,
                                borderColor: 'black',
                                borderStyle: 'solid',
                                padding: 28,
                                borderRadius: 14
                            }}
                        >
                            
                            <div>
                                <div
                                    style={{
                                        backgroundColor: '#cdcdcd',
                                        display: 'inline-block',
                                        padding: 8,
                                        borderRadius: 14
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: '#2e1f22'
                                        }}
                                    >
                                        C. Perubahan Klausul Kontrak Para Pihak
                                    </span>
                                </div>
                            </div>

                            <h1
                                style={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    margin: 0
                                }}
                            >
                                C.1 Body Kontrak
                            </h1>

                            <div>
                                <input 
                                    type="text"
                                    placeholder="Masukkan Nomor Pasal"
                                    style={{
                                        padding: 8,
                                        borderRadius: 4,
                                        minWidth: 400
                                    }}
                                />
                            </div>

                            {/* Pasal */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    // marginTop: 28
                                }}
                            >
                                
                                {/* pasal sebelum addendum */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 14
                                        }}
                                    >Pasal Sebelum Addendum</p>
                                    <textarea
                                        disabled
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                {/* pasal setelah addendum */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 14
                                        }}
                                    >Pasal Setelah Addendum</p>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                            </div>

                            <h1
                                style={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    margin: 0
                                }}
                            >
                                C.2 Lampiran
                            </h1>
                            
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Masukkan Angka Lampiran"
                                    style={{
                                        padding: 8,
                                        borderRadius: 4,
                                        minWidth: 400
                                    }}
                                />
                            </div>

                            <div>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    className="btn btn-primary text-white add-new-clause"
                                    style={{
                                        marginTop: 14
                                    }}
                                >
                                    Tambah Klausul Lampiran
                                </button>
                            </div>

                        </div>

                    </>
                }

                {/* Harga Pekerjaan */}
                {currentActiveTab === 1 &&
                    <>
                    
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 40
                            }}
                        >
                            
                            {/* Rincian Harga Pekerjaan */}
                            <div
                                className="job-price-section"
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
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="left">No</TableCell>
                                                        <TableCell align="left">Deskripsi Item</TableCell>
                                                        <TableCell align="left">QTY</TableCell>
                                                        <TableCell align="left">Satuan</TableCell>
                                                        <TableCell align="left">Harga Satuan</TableCell>
                                                        <TableCell align="left">Harga Total</TableCell>
                                                        <TableCell align="left">Keterangan</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                                <TableBody>
                                                    {jsonData?.contract_items?.map((row, index) => (
                                                        <TableRow
                                                        key={row.product_name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell align="l">
                                                                {index+1}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.product_name}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.qty}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.uom}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.unit_price}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.subtotal}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.note}
                                                            </TableCell>
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
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell align="left">No</TableCell>
                                                        <TableCell align="left">Deskripsi Item</TableCell>
                                                        <TableCell align="left">QTY</TableCell>
                                                        <TableCell align="left">Satuan</TableCell>
                                                        <TableCell align="left">Harga Satuan</TableCell>
                                                        <TableCell align="left">Harga Total</TableCell>
                                                        <TableCell align="left">Keterangan</TableCell>
                                                    </TableRow>
                                                </TableBody>
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
                                                B. Addendum Rincian Harga Pekerjaan
                                            </h1>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: 14
                                                }}
                                            >
                                                <button
                                                    className="btn btn-success text-white"
                                                >
                                                    + Harga Pekerjaan By Excel
                                                </button>
                                                <button
                                                    className="btn btn-primary text-white"
                                                    onClick={showAddDetail}
                                                >
                                                    + Tambah Rincian
                                                </button>
                                            </div>
                                        </div>

                                        <EditableTable
                                        />
                                        
                                    </TableContainer>

                            </div>

                            {/* Klausul Perubahan */}
                            <div
                                        className="clause-change-wrapper"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14,
                                            border: 1,
                                            borderColor: 'black',
                                            borderStyle: 'solid',
                                            padding: 28,
                                            borderRadius: 14
                                        }}
                                    >
                                        
                                        <div>
                                            <div
                                                style={{
                                                    backgroundColor: '#cdcdcd',
                                                    display: 'inline-block',
                                                    padding: 8,
                                                    borderRadius: 14
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        color: '#2e1f22'
                                                    }}
                                                >
                                                    C. Perubahan Klausul Kontrak Para Pihak
                                                </span>
                                            </div>
                                        </div>

                                        <h1
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 16,
                                                margin: 0
                                            }}
                                        >
                                            C.1 Body Kontrak
                                        </h1>

                                        <div>
                                            <input 
                                                type="text"
                                                placeholder="Masukkan Nomor Pasal"
                                                style={{
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    minWidth: 400
                                                }}
                                            />
                                        </div>

                                        {/* Pasal */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 14,
                                                // marginTop: 28
                                            }}
                                        >
                                            
                                            {/* pasal sebelum addendum */}
                                            <div>
                                                <p
                                                    style={{
                                                        fontWeight: 500,
                                                        marginBottom: 14
                                                    }}
                                                >Pasal Sebelum Addendum</p>
                                                <textarea
                                                    disabled
                                                    rows="4"
                                                    className="form-control"
                                                ></textarea>
                                            </div>

                                            {/* pasal setelah addendum */}
                                            <div>
                                                <p
                                                    style={{
                                                        fontWeight: 500,
                                                        marginBottom: 14
                                                    }}
                                                >Pasal Setelah Addendum</p>
                                                <textarea
                                                    rows="4"
                                                    className="form-control"
                                                ></textarea>
                                            </div>

                                        </div>

                                        <h1
                                            style={{
                                                fontWeight: 600,
                                                fontSize: 16,
                                                margin: 0
                                            }}
                                        >
                                            C.2 Lampiran
                                        </h1>
                                        
                                        <div>
                                            <input 
                                                type="text"
                                                placeholder="Masukkan Angka Lampiran"
                                                style={{
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    minWidth: 400
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <textarea
                                                rows="4"
                                                className="form-control"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <button
                                                className="btn btn-primary text-white add-new-clause"
                                                style={{
                                                    marginTop: 14
                                                }}
                                            >
                                                Tambah Klausul Lampiran
                                            </button>
                                        </div>

                            </div>

                        </div>

                    </>
                }

                {currentActiveTab === 2 &&
                    <>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                border: 1,
                                borderColor: 'black',
                                borderStyle: 'solid',
                                borderRadius: 14,
                                padding: 28
                            }}
                        >
                            {/* Jangka waktu kontrak awal */}
                            <h1
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    marginBottom: 14
                                }}
                            >
                                Jangka waktu kontrak awal
                            </h1>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14
                                }}
                            >
                                {timePeriodBeforeAddendum && 
                                    timePeriodBeforeAddendum.map((data, index) => (
                                            <>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-end',
                                                        columnGap: 18
                                                    }}
                                                >

                                                    <div>
                                                                    <div
                                                                        className="upper-for-title"
                                                                    >
                                                                        <p
                                                                            style={{
                                                                                margin: 0
                                                                            }}
                                                                        >
                                                                            {data.title}
                                                                        </p>
                                                                    </div>

                                                                    <div
                                                                        className="bottom-for-input col-md-3"
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'flex-end',
                                                                            columnGap: 10,
                                                                            padding: 0
                                                                        }}
                                                                    >
                                                                        
                                                                        <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    rowGap: 4,
                                                                                    padding: 0,
                                                                                }}
                                                                            >

                                                                                <input
                                                                                    type="date"
                                                                                    style={{
                                                                                        backgroundColor: "#e8f4fb",
                                                                                        borderRadius: 4,
                                                                                        padding: '10px 12px',
                                                                                        border: 'none',                                                                  display: 'flex',
                                                                                        flexDirection: 'row-reverse',
                                                                                        columnGap: 10,
                                                                                    }}
                                                                                    value={data.startDate}
                                                                                    disabled
                                                                                />

                                                                        </div>
                                                                                
                                                                        <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    placeItems: 'center',
                                                                                    minHeight: 41.5
                                                                                }}
                                                                            >
                                                                                -
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

                                                                                </span>

                                                                                <input
                                                                                    type="date"
                                                                                    disabled
                                                                                    style={{
                                                                                        backgroundColor: "#e8f4fb",
                                                                                        borderRadius: 4,
                                                                                        padding: '10px 12px',
                                                                                        border: 'none',
                                                                                        display: 'flex',
                                                                                        flexDirection: 'row-reverse',
                                                                                        columnGap: 10,
                                                                                    }}
                                                                                    value={data.endDate}
                                                                                />

                                                                        </div>

                                                                    </div>
                                                    </div>

                                                    <div
                                                                    className="month-day-wrapper"
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        minHeight: 41.5
                                                                    }}
                                                                >

                                                                    <p
                                                                        style={{
                                                                            margin: 0
                                                                        }}
                                                                    >
                                                                        {data.totalMonth} Bulan {data.calendarDay} Hari
                                                                    </p>

                                                    </div>

                                                    {data.radio &&    
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                gap: 20,
                                                                marginLeft: 10,
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
                                                    }

                                                </div>
                                            </>
                                    ))
                                }
                            </div>

                            {/* Addendum jangka waktu */}
                            <h1
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    marginTop: 28,
                                    marginBottom: 14
                                }}
                            >
                                A. Addendum jangka waktu
                            </h1>

                            <div
                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 14
                                }}
                            >
                                {timePeriodBeforeAddendum && 
                                    timePeriodBeforeAddendum.map((data, index) => (
                                        <>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    columnGap: 18
                                                }}
                                            >

                                                <div>
                                                        
                                                        <div
                                                                        className="upper-for-title"
                                                                    >
                                                                        <p
                                                                            style={{
                                                                                margin: 0
                                                                            }}
                                                                        >
                                                                            {data.title}
                                                                        </p>
                                                        </div>

                                                        <div
                                                            className="bottom-for-input col-md-3"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-end',
                                                                columnGap: 10,
                                                                padding: 0
                                                            }}
                                                        >
                                                                            
                                                            <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    rowGap: 4,
                                                                                    padding: 0,
                                                                                }}
                                                                            >

                                                                                <input
                                                                                    type="date"
                                                                                    style={{
                                                                                        borderRadius: 4,
                                                                                        padding: '10px 12px',
                                                                                        border: 'none',
                                                                                        display: 'flex',
                                                                                        flexDirection: 'row-reverse',
                                                                                        columnGap: 10,
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
                                                                                -
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

                                                                                </span>

                                                                                <input
                                                                                    type="date"
                                                                                    style={{
                                                                                        borderRadius: 4,
                                                                                        padding: '10px 12px',
                                                                                        border: 'none',
                                                                                        display: 'flex',
                                                                                        flexDirection: 'row-reverse',
                                                                                        columnGap: 10,
                                                                                    }}
                                                                                    value={data.endDate}
                                                                                />

                                                            </div>

                                                        </div>

                                                </div>

                                                <div
                                                                    className="month-day-wrapper"
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        minHeight: 41.5
                                                                    }}
                                                                >

                                                                    <p
                                                                        style={{
                                                                            margin: 0
                                                                        }}
                                                                    >
                                                                        {data.totalMonth} Bulan {data.calendarDay} Hari
                                                                    </p>

                                                </div>

                                                {data.radio &&                                                
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: 20,
                                                            marginLeft: 10,
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
                                                                            name={`${index+1}_down_payment_guarantee`}
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
                                                                            name={`${index+2}_down_payment_guarantee`}
                                                                            value={"SPMK"}
                                                                        />
                                                                        <span>
                                                                            SPMK
                                                                        </span>
                                                        </label>

                                                    </div>
                                                }

                                            </div>
                                        </>
                                    ))
                                }
                            </div>

                        </div>


                        {/* Klausul Perubahan */}
                        <div
                            className="clause-change-wrapper"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                border: 1,
                                borderColor: 'black',
                                borderStyle: 'solid',
                                padding: 28,
                                borderRadius: 14,
                                marginTop: 40
                            }}
                        >
                            
                            <div>
                                <span
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: '#2e1f22'
                                    }}
                                >
                                    B. Perubahan Klausul Kontrak Para Pihak
                                </span>
                            </div>

                            <h1
                                style={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    margin: 0
                                }}
                            >
                                B.1 Body Kontrak
                            </h1>

                            <div>
                                <input 
                                    type="text"
                                    placeholder="Masukkan Nomor Pasal"
                                    style={{
                                        padding: 8,
                                        borderRadius: 4,
                                        minWidth: 400
                                    }}
                                />
                            </div>

                            {/* Pasal */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    // marginTop: 28
                                }}
                            >
                                
                                {/* pasal sebelum addendum */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 14
                                        }}
                                    >Pasal Sebelum Addendum</p>
                                    <textarea
                                        disabled
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                {/* pasal setelah addendum */}
                                <div>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 14
                                        }}
                                    >Pasal Setelah Addendum</p>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                            </div>

                            <h1
                                style={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    margin: 0
                                }}
                            >
                                B.2 Lampiran
                            </h1>
                            
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Masukkan Angka Lampiran"
                                    style={{
                                        padding: 8,
                                        borderRadius: 4,
                                        minWidth: 400
                                    }}
                                />
                            </div>

                            <div>
                                <textarea
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    className="btn btn-primary text-white add-new-clause"
                                    style={{
                                        marginTop: 14
                                    }}
                                >
                                    Tambah Klausul Lampiran
                                </button>
                            </div>

                        </div>

                    </>
                }

                {currentActiveTab === 3 &&
                    <>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 40
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

                                <div
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <h1
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600
                                        }}
                                    >
                                        Metode pembayaran kontrak awal
                                    </h1>
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

                                <div
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <h1
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600
                                        }}
                                    >
                                        A. Addendum metode pembayaran
                                    </h1>
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
                                            style={{
                                                flex: 1,
                                                padding: '10px 12px',
                                                borderRadius: 4
                                            }}
                                            type="text" 
                                            placeholder="Persentase" 
                                            disabled={addendumPaymentMethod !== 'gradual'}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 14,
                                            display: 'flex'
                                        }}
                                    >
                                        <textarea
                                            style={{
                                                flex: 1,
                                                padding: '10px 12px',
                                                borderRadius: 4
                                            }}
                                            placeholder="Deskripsi"
                                            disabled={addendumPaymentMethod !== 'gradual'}
                                        ></textarea>
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

                            {/* Klausul Perubahan */}
                            <div
                                className="clause-change-wrapper"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    border: 1,
                                    borderColor: 'black',
                                    borderStyle: 'solid',
                                    padding: 28,
                                    borderRadius: 14,
                                    // marginTop: 40
                                }}
                            >
                                
                                <div>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: '#2e1f22'
                                        }}
                                    >
                                        B. Perubahan Klausul Kontrak Para Pihak
                                    </span>
                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    B.1 Body Kontrak
                                </h1>

                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Nomor Pasal"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                {/* Pasal */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        // marginTop: 28
                                    }}
                                >
                                    
                                    {/* pasal sebelum addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Sebelum Addendum</p>
                                        <textarea
                                            disabled
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                    {/* pasal setelah addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Setelah Addendum</p>
                                        <textarea
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    B.2 Lampiran
                                </h1>
                                
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Angka Lampiran"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                <div>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-primary text-white add-new-clause"
                                        style={{
                                            marginTop: 14
                                        }}
                                    >
                                        Tambah Klausul Lampiran
                                    </button>
                                </div>

                            </div>

                        </div>

                    </>
                }

                {/* denda */}
                {currentActiveTab === 4 &&
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
                                marginBottom: 40
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
                                    component={Paper}
                                >
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
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left">No</TableCell>
                                                <TableCell align="left">Jenis Denda</TableCell>
                                                <TableCell align="left">Nilai</TableCell>
                                                <TableCell align="left">Maksimal Hari</TableCell>
                                                <TableCell align="left">Type Nilai</TableCell>
                                            </TableRow>
                                        </TableBody>
                                        <TableBody>
                                            {jsonData.
                                            penalty_fine_data.
                                            map((data, index) => (
                                                <TableRow
                                                    key={data.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" >
                                                       {index+1}
                                                    </TableCell>
                                                    <TableCell align="left" scope="row">
                                                        {data.pinalty_name}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {data.nilai}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {data.max_day}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {data.type_nilai}
                                                    </TableCell>
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
                                            A. Addendum Denda Pekerjaan
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
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left">No</TableCell>
                                                <TableCell align="left">Jenis Denda</TableCell>
                                                <TableCell align="left">Nilai</TableCell>
                                                <TableCell align="left">Maksimal Hari</TableCell>
                                                <TableCell align="left">Tipe Nilai</TableCell>
                                                <TableCell align="left">Aksi</TableCell>
                                            </TableRow>
                                        </TableBody>
                                        <TableBody>
                                            {addendumRows.map((row) => (
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

                        </div>

                        {/* Klausul Perubahan */}
                        <div
                                className="clause-change-wrapper"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    border: 1,
                                    borderColor: 'black',
                                    borderStyle: 'solid',
                                    padding: 28,
                                    borderRadius: 14,
                                    // marginTop: 40
                                }}
                            >
                                
                                <div>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: '#2e1f22'
                                        }}
                                    >
                                        B. Perubahan Klausul Kontrak Para Pihak
                                    </span>
                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    B.1 Body Kontrak
                                </h1>

                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Nomor Pasal"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                {/* Pasal */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        // marginTop: 28
                                    }}
                                >
                                    
                                    {/* pasal sebelum addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Sebelum Addendum</p>
                                        <textarea
                                            disabled
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                    {/* pasal setelah addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Setelah Addendum</p>
                                        <textarea
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    B.2 Lampiran
                                </h1>
                                
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Angka Lampiran"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                <div>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-primary text-white add-new-clause"
                                        style={{
                                            marginTop: 14
                                        }}
                                    >
                                        Tambah Klausul Lampiran
                                    </button>
                                </div>

                        </div>

                    </>
                }

                {/* jaminan */}
                {currentActiveTab === 5 && 
                    <>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    rowGap: 28,
                                    border: 1,
                                    borderStyle: 'solid',
                                    borderColor: 'black',
                                    borderRadius: 14,
                                    padding: 28,
                                    marginBottom: 40
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
                                                                        border: 'none',
                                                                        display: 'flex',
                                                                        flexDirection: 'row-reverse',
                                                                        columnGap: 10,
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
                                                                        border: 'none',
                                                                        display: 'flex',
                                                                        flexDirection: 'row-reverse',
                                                                        columnGap: 10,
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
                                        A. Addendum Jaminan
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
                                                                        border: 'none',
                                                                        display: 'flex',
                                                                        flexDirection: 'row-reverse',
                                                                        columnGap: 10,
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
                                                                        border: 'none',
                                                                        display: 'flex',
                                                                        flexDirection: 'row-reverse',
                                                                        columnGap: 10,
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

                        {/* Klausul Perubahan */}
                        <div
                                className="clause-change-wrapper"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    border: 1,
                                    borderColor: 'black',
                                    borderStyle: 'solid',
                                    padding: 28,
                                    borderRadius: 14,
                                    // marginTop: 40
                                }}
                            >
                                
                                <div>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: '#2e1f22'
                                        }}
                                    >
                                        B. Perubahan Klausul Kontrak Para Pihak
                                    </span>
                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    B.1 Body Kontrak
                                </h1>

                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Nomor Pasal"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                {/* Pasal */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        // marginTop: 28
                                    }}
                                >
                                    
                                    {/* pasal sebelum addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Sebelum Addendum</p>
                                        <textarea
                                            disabled
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                    {/* pasal setelah addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Setelah Addendum</p>
                                        <textarea
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    B.2 Lampiran
                                </h1>
                                
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Angka Lampiran"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                <div>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-primary text-white add-new-clause"
                                        style={{
                                            marginTop: 14
                                        }}
                                    >
                                        Tambah Klausul Lampiran
                                    </button>
                                </div>

                        </div>

                    </>
                }

                {/* nomor rekening */}
                {currentActiveTab === 6 &&
                    <>
                        
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                rowGap: 40
                            }}
                        >
                            
                            <div
                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: 14,
                                                                    border: 1,
                                                                    borderColor: 'black',
                                                                    borderStyle: 'solid',
                                                                    padding: 28,
                                                                    borderRadius: 14,
                                                                    // marginTop: 40
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        rowGap: 24,

                                    }}
                                >

                                    <div>

                                        <h1
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                                marginBottom: 14
                                            }}
                                        >
                                            Nomor rekening kontrak awal
                                        </h1>

                                        <div
                                            style={{
                                                // display: 'grid',
                                                // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 24,
                                                fontSize: 14,
                                                fontWeight: 500,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Nomor rekening</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: "#e8f4fb",
                                                        padding: '10px 12px',
                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={"128574647483"}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Nama rekening</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: "#e8f4fb",
                                                        padding: '10px 12px',
                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={"GOLDEN PRATAMA ENGINEERING"}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Nama bank</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: "#e8f4fb",
                                                        padding: '10px 12px',
                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={"MANDIRI"}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Alamat bank</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: "#e8f4fb",
                                                        padding: '10px 12px',
                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={"Jl Warung Buncit Raya"}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <h1
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                                marginBottom: 14
                                            }}
                                        >
                                           A. Addendum nomor rekening 
                                        </h1>

                                        <div
                                            style={{
                                                // display: 'grid',
                                                // gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 24,
                                                fontSize: 14,
                                                fontWeight: 500,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Nomor rekening</span>
                                                <ReactSelect 
                                                    data={    
                                                        jsonData?.data_bank
                                                    }
                                                    func={changeDataBankIndex}
                                                    labelName={`account_number`}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Nama rekening</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={jsonData?.data_bank[bankIndex]?.account_holder_name}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Nama bank</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',

                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={jsonData?.data_bank[bankIndex]?.bank.full_name}
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    flex: 1
                                                }}
                                            >
                                                <span>Alamat bank</span>
                                                <input 
                                                    type="text"
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        borderColor: 'black',
                                                        border: 1,
                                                        borderStyle: 'solid',
                                                        borderRadius: 4,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        marginTop: 4
                                                    }}
                                                    disabled
                                                    value={jsonData?.data_bank[bankIndex]?.address?.postal_address}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* surat pernyataan dari bank */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                            gap: 24
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                                <span
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    Surat pernyataan dari bank
                                                </span>
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        padding: 0,
                                                        margin: 0
                                                    }}
                                                >
                                                    <input
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px 10px 46px',
                                                            color: '#3699ff',
                                                            borderColor: 'black',
                                                            border: 1,
                                                            borderStyle: 'solid',
                                                            borderRadius: 4,
                                                            fontSize: 14,
                                                            fontWeight: 500,
                                                            marginTop: 4
                                                        }}
                                                        type="text"
                                                        value={`surat_pernyataan_bank_bca.pdf`}
                                                        disabled
                                                    />
                                                    <SVG 
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            bottom: 0,
                                                            left: 12,
                                                            margin: 'auto 0'
                                                            // width:10,
                                                            // height:10
                                                        }}
                                                        src={toAbsoluteUrl("/media/svg/icons/All/upload.svg")}
                                                    />
                                                </div>
                                                {/* <div>
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
                                                </div> */}
                                        </div>
                                        <div>
                                                
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Klausul Perubahan */}
                            <div
                                    className="clause-change-wrapper"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        border: 1,
                                        borderColor: 'black',
                                        borderStyle: 'solid',
                                        padding: 28,
                                        borderRadius: 14,
                                        // marginTop: 40
                                    }}
                                >
                                    
                                    <div>
                                        <span
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 600,
                                                color: '#2e1f22'
                                            }}
                                        >
                                            B. Perubahan Klausul Kontrak Para Pihak
                                        </span>
                                    </div>

                                    <h1
                                        style={{
                                            fontWeight: 600,
                                            fontSize: 16,
                                            margin: 0
                                        }}
                                    >
                                        B.1 Body Kontrak
                                    </h1>

                                    <div>
                                        <input 
                                            type="text"
                                            placeholder="Masukkan Nomor Pasal"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                minWidth: 400
                                            }}
                                        />
                                    </div>

                                    {/* Pasal */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 14,
                                            // marginTop: 28
                                        }}
                                    >
                                        
                                        {/* pasal sebelum addendum */}
                                        <div>
                                            <p
                                                style={{
                                                    fontWeight: 500,
                                                    marginBottom: 14
                                                }}
                                            >Pasal Sebelum Addendum</p>
                                            <textarea
                                                disabled
                                                rows="4"
                                                className="form-control"
                                            ></textarea>
                                        </div>

                                        {/* pasal setelah addendum */}
                                        <div>
                                            <p
                                                style={{
                                                    fontWeight: 500,
                                                    marginBottom: 14
                                                }}
                                            >Pasal Setelah Addendum</p>
                                            <textarea
                                                rows="4"
                                                className="form-control"
                                            ></textarea>
                                        </div>

                                    </div>

                                    <h1
                                        style={{
                                            fontWeight: 600,
                                            fontSize: 16,
                                            margin: 0
                                        }}
                                    >
                                        B.2 Lampiran
                                    </h1>
                                    
                                    <div>
                                        <input 
                                            type="text"
                                            placeholder="Masukkan Angka Lampiran"
                                            style={{
                                                padding: 8,
                                                borderRadius: 4,
                                                minWidth: 400
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <textarea
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <button
                                            className="btn btn-primary text-white add-new-clause"
                                            style={{
                                                marginTop: 14
                                            }}
                                        >
                                            Tambah Klausul Lampiran
                                        </button>
                                    </div>

                            </div>

                        </div>

                    </>
                }

                {/* lainnya */}
                {currentActiveTab === 7 &&
                    <>
                        {/* Klausul Perubahan */}
                        <div
                                className="clause-change-wrapper"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14,
                                    border: 1,
                                    borderColor: 'black',
                                    borderStyle: 'solid',
                                    padding: 28,
                                    borderRadius: 14,
                                    // marginTop: 40
                                }}
                            >
                                
                                <div>
                                    <span
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: '#2e1f22'
                                        }}
                                    >
                                        A. Perubahan Klausul Kontrak Para Pihak
                                    </span>
                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    A.1 Body Kontrak
                                </h1>

                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Nomor Pasal"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                {/* Pasal */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                        // marginTop: 28
                                    }}
                                >
                                    
                                    {/* pasal sebelum addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Sebelum Addendum</p>
                                        <textarea
                                            disabled
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                    {/* pasal setelah addendum */}
                                    <div>
                                        <p
                                            style={{
                                                fontWeight: 500,
                                                marginBottom: 14
                                            }}
                                        >Pasal Setelah Addendum</p>
                                        <textarea
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                </div>

                                <h1
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 16,
                                        margin: 0
                                    }}
                                >
                                    A.2 Lampiran
                                </h1>
                                
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Masukkan Angka Lampiran"
                                        style={{
                                            padding: 8,
                                            borderRadius: 4,
                                            minWidth: 400
                                        }}
                                    />
                                </div>

                                <div>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                    ></textarea>
                                </div>

                                <div>
                                    <button
                                        className="btn btn-primary text-white add-new-clause"
                                        style={{
                                            marginTop: 14
                                        }}
                                    >
                                        Tambah Klausul Lampiran
                                    </button>
                                </div>

                        </div>
                    </>
                }

                </CardBody>
            </Card>
        </> 
    )

}

    const keys = {
    fetch: "get-data-penalties",
    }
  
    const mapState = (state) => ({
        loadings: {
        fetch: getLoading(state, keys.fetch),
        },
        status: state.auth.user.data.status,
    })
  
    const mapDispatch = {
        fetch_api_sg,
    }

  export default connect(mapState, mapDispatch)(FormParameter)

// export default FormParameter