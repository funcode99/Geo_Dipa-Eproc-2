import React, { useState, useEffect } from 'react'
import { Col, Row } from "react-bootstrap"
import { 
    Formik, 
    Field, 
    Form, 
    useFormikContext 
} from 'formik'
import {
    Card,
    CardBody,
} from "_metronic/_partials/controls"

  import { makeStyles } from "@material-ui/core/styles";
  import Table from "@material-ui/core/Table";
  import TableBody from "@material-ui/core/TableBody";
  import TableCell from "@material-ui/core/TableCell";
  import TableRow from "@material-ui/core/TableRow";
  import Input from "@material-ui/core/Input";
  import Paper from "@material-ui/core/Paper";
  import IconButton from "@material-ui/core/IconButton";

  // Icons
  import EditIcon from "@material-ui/icons/EditOutlined";
  import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
  import RevertIcon from "@material-ui/icons/NotInterestedOutlined"

  import ButtonAction from "app/components/buttonAction/ButtonAction"

  import { useCollapse } from 'react-collapsed'

  import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
  import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

    const CustomTableCell = ({ row, name, onChange }) => {
    const classes = useStyles();
    const { isEditMode } = row;

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
    );
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

  const createData = (name, calories, fat, carbs, protein) => ({
    id: name.replace(" ", "_"),
    name,
    calories,
    fat,
    carbs,
    protein,
    isEditMode: false,
    children: []
  })

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
                            <TableCell>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {`${index}`}
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
                            <CustomTableCell {...{ row, name: "name", onChange }} />
                            <CustomTableCell {...{ row, name: "calories", onChange }} />
                            <CustomTableCell {...{ row, name: "fat", onChange }} />
                            <CustomTableCell {...{ row, name: "carbs", onChange }} />
                            <CustomTableCell {...{ row, name: "protein", onChange }} />
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
                                                                            value={data.name}
                                                                            name={'name'}
                                                                            onChange={e => onChangeChild(e, data, index, childIndex)}
                                                                            className={classes.input}
                                                                        />
                                                                        ) : (
                                                                        // row[name]
                                                                        data.name
                                                                        )}
                            </TableCell>
                            <TableCell align="left" className={classes.tableCell}>
                                                                        {data.isEditMode ? (
                                                                        <Input
                                                                            value={data.calories}
                                                                            name={'calories'}
                                                                            onChange={e => onChangeChild(e, data, index, childIndex)}
                                                                            className={classes.input}
                                                                        />
                                                                        ) : (
                                                                        data.calories
                                                                        )}
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

  function App() {
    const [rows, setRows] = React.useState([
      createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
      createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
      createData("Eclair", 262, 16.0, 24, 6.0)
    ]);
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
        console.log('isi previous', previous[id])
        console.log('isi new rows', newRows)
        setRows(newRows);
        setPrevious(state => {
          delete state[id]
          return state
        })
        onToggleEditMode(id)
    }
  
    const onAddMode = () => {
          setRows(state => [...state, createData("Hot Coffee", 195, 9.0, 42, 6.0)])
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
                            createData("Pudding", 591, 9.1, 60, 7.2)
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
              <TableCell align='left'>No.</TableCell>
              <TableCell align="left">Dessert (100g serving)</TableCell>
              <TableCell align="left">Calories</TableCell>
              <TableCell align="left">Fat&nbsp;(g)</TableCell>
              <TableCell align="left">Carbs&nbsp;(g)</TableCell>
              <TableCell align="left">Protein&nbsp;(g)</TableCell>
              <TableCell align="left">Action</TableCell>
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

  const FormPermohonan = (
        props
    ) => {

        const FormObserver = () => {
            const { values } = useFormikContext();
            
            useEffect(() => {
            console.log("FormObserver::values", values.checked)
            props.assignTabLists(values.checked)
            }, [values]);
        
            return null;
        };

        return (
            <>  

                <App />

                <Card>
                    <CardBody>
                        
                        <Card>
                            <form>
                                <div 
                                    style={{
                                        display: 'flex', 
                                        columnGap: 40, 
                                        flexWrap: 'wrap'
                                    }}
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

                        <Formik
                            initialValues={{
                                checked: props.checkedValues,
                                others: [],
                                additional_price: '',
                                substraction_price: null
                            }}
                            onSubmit={
                                (values) => {
                                    props.checkedLength(values.checked.length)
                                }
                            }
                        >
                            {({ values }) => (

                                <>
                                    <Form>
                                        
                                        <FormObserver />

                                        <div
                                            style={{
                                                marginTop: 28,
                                                marginBottom: 28,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 4
                                            }}
                                        >
                                            
                                            <h1
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    margin: 0
                                                }}
                                            >
                                                <span style={{ color: '#dc0526' }}>*</span>
                                                Tanggal Dokumen Permohonan
                                            </h1>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: '#dc0526',
                                                    fontWeight: 400
                                                }}
                                            >Silahkan pilih tanggal permohonan</span>
                                            <div>
                                                <input 
                                                    type='date'
                                                    // pakai strip bukan garing
                                                    value="2023-07-15"
                                                />
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 14
                                            }}
                                        >
                                            <h1
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: 16
                                                }}
                                            >
                                                Perihal Addendum
                                            </h1>
                                            {/* checkbox */}
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                                    columnGap: 8,
                                                    rowGap: 8
                                                }}
                                            >
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 8
                                            
                                                    }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="parties"
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Data Para Pihak
                                                </label>
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 8
                                                    }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="payment_method"
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Metode Pembayaran
                                                </label>
                                                <label
                                                        style={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 8
                                                        }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="fine" 
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Denda
                                                </label>
                                                <label
                                                        style={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 8
                                                        }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="account_number" 
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Nomor Rekening
                                                </label>
                                            </div>   
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                                    columnGap: 8
                                                }}
                                            >
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 8
                                                    }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="job_price"
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Harga Pekerjaan
                                                </label>
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 8
                                                    }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="time_period" 
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Jangka Waktu
                                                </label>
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        gap: 8
                                            
                                                    }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="checked" 
                                                        value="guarantee" 
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                    />
                                                    Jaminan
                                                </label>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    columnGap: 8
                                                }}
                                            >
                                                <label
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexWrap: 'wrap',
                                                            gap: 8,
                                                            margin: 0
                                                        }}
                                                >
                                                    <Field 
                                                        type="checkbox" 
                                                        name="others" 
                                                        value="Lainnya"
                                                        style={{
                                                            height: 20,
                                                            width: 20
                                                        }}
                                                        />
                                                    Lainnya
                                                </label>
                                                <input
                                                    style={{
                                                        minWidth: '300px',
                                                        padding: 8,
                                                        borderRadius: 4
                                                    }}
                                                    type='text'
                                                    placeholder='Masukkan perihal addendum lainnya'
                                                    disabled={values.others.length === 0 ? true : false}
                                                />
                                            </div>
                                        </div>

                        
                                    <Row
                                        style={{
                                            marginTop: 28
                                        }}
                                    >
                                        <Col md={12}>
                                            <Row>
                                                <Col md={12}>
                                                    <div className='form-group row'>
                                                        <label className='col-sm-4 col-form-label'>
                                                            Harga Pekerjaan Awal
                                                        </label>
                                                        <div className='col-sm-8'>
                                                            <input 
                                                                className='form-control' 
                                                                type='text' 
                                                                value={`Rp 7.422.000.000,00`}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Row>
                                                <Col md={12}>
                                                    <div className='form-group row'>
                                                        <label className='col-sm-4 col-form-label'>
                                                            Harga Pekerjaan Addendum Terakhir
                                                        </label>
                                                        <div className='col-sm-8'>
                                                            <input 
                                                                className='form-control' 
                                                                type='text'
                                                                value={"Rp 0"}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                        Penambahan Harga Pekerjaan
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <Field 
                                                                className='form-control'
                                                                type="text" 
                                                                name="additional_price" 
                                                                // value={values.additional_price}
                                                                value={`Rp 0`} 
                                                            />
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div
                                                    className=
                                                {`form-group row ${values.additional_price !== '' ? '' : 'd-none'}`}
                                                >
                                                    <label className='col-sm-4 col-form-label'>
                                                        
                                                    </label>
                                                    <div className='col-sm-8' 
                                                        style={{ 
                                                            display: 'flex',
                                                            placeItems: 'center',
                                                            gap: 12
                                                        }}>
                                                        <input
                                                            type='checkbox' 
                                                            style={{
                                                                height: 20,
                                                                width: 20
                                                            }}
                                                            />
                                                        <label
                                                            style={{
                                                                margin: 0
                                                            }}
                                                        >
                                                            Ketersediaan Anggaran* 
                                                        </label>
                                                        <span 
                                                            style={{color: '#dc0526'}}
                                                        >
                                                            (jika penambahan harga pekerjaan diisi)
                                                        </span>
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                        Pengurangan Harga Pekerjaan
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <input 
                                                            className='form-control' 
                                                            type='text'
                                                            value={"Rp 121.100.000,00"}
                                                        />
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                    Harga Pekerjaan Setelah Addendum
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <input 
                                                            className='form-control' 
                                                            type='text' 
                                                            value={`Rp 7.300.900.000,00`}
                                                            disabled 
                                                        />
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                    Persentase Addendum
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <input 
                                                            className='form-control' 
                                                            type='text'
                                                            value={`3%`}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                                <div className='form-group row'>
                                                    <label className='col-sm-4 col-form-label'>
                                                    Kesimpulan
                                                    </label>
                                                    <div className='col-sm-8'>
                                                        <input 
                                                            className='form-control' 
                                                            type='text'
                                                            value={`Harga pekerjaan setelah addendum dibawah 10% dari harga pekerjaan awal`}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <button 
                                            className={`btn ${values.checked.length === 0 ? `btn-secondary` : `btn-primary`} `}
                                            type='submit' 
                                            disabled={values.checked.length === 0 ? true : false}
                                            style={{
                                                minWidth: 100
                                            }}
                                        >
                                            <h5
                                                style={{
                                                    margin: 0
                                                }}
                                            >Next</h5>
                                        </button>
                                    </div>

                                    </Form>
                                </>

                            )}


                        </Formik>

                    </CardBody>
                </Card>

            </>
        )

    }

export default FormPermohonan