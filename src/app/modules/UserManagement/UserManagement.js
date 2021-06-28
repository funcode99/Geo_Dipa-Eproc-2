import React, { useState, useEffect, useCallback } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Card, CardBody } from "../../../_metronic/_partials/controls";
import useToast from "../../components/toast";
import { TablePagination } from "@material-ui/core";
import {
    Dialog,
    DialogActions,
    DialogContent,
    Slide,
    Checkbox,
    FormControlLabel,
    Paper,
    Container
} from "@material-ui/core";
import { getBuyers, getRoles, assignBuyers } from "./_redux/UserManagementCrud";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import StyledSelect from "../../components/select-multiple";
import Tabs from "../../components/tabs";
import { MAIN_ROLES_AUTHORITY, UNIT_ROLES_AUTHORITY } from "../../../redux/BaseHost";
import UserRoles from "./pages/UserRoles";
import PicRoles from "./pages/PicRoles";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, disabled } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <h4>{children}</h4>
            {onClose ? (
                <IconButton
                    aria-label="Close"
                    className={classes.closeButton}
                    onClick={onClose}
                    disabled={disabled}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const TabLists = [
    {
        id: 'users',
        label: 'Users Eproc',
        icon: <i className="fas fa-user-friends mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
    {
        id: 'pic',
        label: 'PIC Vendors',
        icon: <i className="fas fa-user mb-0 mr-2" style={{ color: 'inherit' }}></i>,
    },
];

function UserManagement(props) {
    const { intl } = props;
    const [Toast, setToast] = useToast();
    const [filterTable, setFilterTable] = useState({});
    const [nameStateFilter, setNameStateFilter] = useState("");
    const [dialogState, setDialogState] = useState(false);
    const [isMainPlant, setIsMainPlant] = useState(false);
    const [mainRoles, setMainRoles] = useState([]);
    const [unitRoles, setUnitRoles] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [tabActiveMain, setTabActiveMain] = React.useState(0);
    const [paginations, setPaginations] = useState({
        numberColum: 0,
        page: 0,
        count: 0,
        rowsPerPage: 10,
    });
    const user_id = useSelector(
        (state) => state.auth.user.data.user_id,
        shallowEqual
    );
    function handleChangeTabMain(event, newTabActive) {
        setTabActiveMain(newTabActive);
    }
    const [filterData] = useState([
        {
            title: intl.formatMessage({
                id: "CONTRACT_DETAIL.LABEL.CONTRACT_NUMBER",
            }),
            name: "contract_no",
            type: "text",
        },
        {
            title: intl.formatMessage({
                id: "TITLE.PROCUREMENT_TITLE",
            }),
            name: "procurement_title",
            type: "text",
        },
        {
            title: intl.formatMessage({
                id: "TITLE.PO_NUMBER",
            }),
            name: "po_no",
            type: "text",
        },
        {
            title: intl.formatMessage({
                id: "CONTRACT_DETAIL.LABEL.VENDOR",
            }),
            name: "vendor_name",
            type: "text",
        },
    ]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState({});
    const [filterSort, setFilterSort] = useState({ filter: {}, sort: {} });
    const [sortData, setSortData] = useState({
        name: "",
        order: false,
    });
    const [err, setErr] = useState(false);

    const requestFilterSort = useCallback(
        (updateFilterTable, updateSortTable) => {
            setErr(false);
            setLoading(true);
            setData([]);
            let pagination = Object.assign({}, paginations);
            let filterSorts = filterSort;
            filterSorts.filter = JSON.stringify(
                updateFilterTable ? updateFilterTable : filterTable
            );
            filterSorts.sort = JSON.stringify(
                updateSortTable ? updateSortTable : sortData
            );
            pagination.page = pagination.page + 1;
            filterSorts = Object.assign({}, filterSorts, pagination);
            setFilterSort({ ...filterSorts });
            let params = new URLSearchParams(filterSorts).toString();
            getBuyers()
                .then((result) => {
                    setLoading(false);
                    setData(result.data.data);
                    //   setPaginations({ ...paginations, count: result.data.count || 0 });
                })
                .catch((err) => {
                    setErr(true);
                    setLoading(false);
                    setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
                });
        },
        [filterTable, sortData, filterSort, intl, setToast, paginations]
    );

    const getRolesData = useCallback(() => {
        try {
            getRoles(MAIN_ROLES_AUTHORITY)
                .then(response => {
                    setMainRoles(response.data.data)
                })
            getRoles(UNIT_ROLES_AUTHORITY)
                .then(response => {
                    setUnitRoles(response.data.data)
                })
        } catch {
            setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
        }
    }, [intl, setToast])

    useEffect(requestFilterSort, []);
    useEffect(getRolesData, []);

    const openFilterTable = (name, index) => {
        let idFilter = "filter-" + index;
        let idInputFilter = "filter-" + name;
        let status = document.getElementById(idFilter).getAttribute("status");
        if (nameStateFilter === "") {
            setNameStateFilter(idFilter);
            document.getElementById(idFilter).setAttribute("status", "open");
            document.getElementById(idFilter).classList.add("open");
        } else if (nameStateFilter === idFilter) {
            if (status === "closed") {
                document.getElementById(idFilter).setAttribute("status", "open");
                document.getElementById(idFilter).classList.add("open");
            } else {
                document.getElementById(idFilter).setAttribute("status", "closed");
                document.getElementById(idFilter).classList.remove("open");
                document.getElementById(idInputFilter).value =
                    filterTable[idInputFilter] || "";
            }
        } else {
            document.getElementById(nameStateFilter).setAttribute("status", "closed");
            document.getElementById(nameStateFilter).classList.remove("open");
            setNameStateFilter(idFilter);
            document.getElementById(idFilter).setAttribute("status", "open");
            document.getElementById(idFilter).classList.add("open");
        }
    };

    const updateValueFilter = (property, index) => {
        let filterTables = filterTable;
        filterTables["filter-" + property] = document.getElementById(
            "filter-" + property
        ).value;
        setFilterTable({ ...filterTables });
        openFilterTable(property, index);
        requestFilterSort();
    };

    const resetValueFilter = (property) => {
        let filterTables = filterTable;
        filterTables[property] = "";
        document.getElementById(property).value = "";
        setFilterTable({ ...filterTables });
        requestFilterSort();
    };

    const resetFilter = () => {
        setFilterTable({});
        document.getElementById("filter-form-all").reset();
        requestFilterSort({});
    };

    const handleChangePage = (event, newPage) => {
        let pagination = paginations;
        pagination.numberColum =
            newPage > pagination.page
                ? pagination.numberColum + pagination.rowsPerPage
                : pagination.numberColum - pagination.rowsPerPage;
        pagination.page = newPage;
        setPaginations({
            ...pagination,
        });
        requestFilterSort();
    };

    const handleChangeRowsPerPage = (event) => {
        let pagination = paginations;
        pagination.page = 0;
        pagination.rowsPerPage = parseInt(event.target.value, 10);
        pagination.numberColum = 0;
        setPaginations({
            ...pagination,
        });
        requestFilterSort();
    };

    const handleModal = (index) => {
        setDataUser(data[index]);
        setRolesData(data[index].roles_data)
        setDialogState(true);
        setIsMainPlant(data[index].plant_data.some(item => item.plant_id === 'f7fa30ab-1c4e-472f-a0d0-45b0a9b3fc69'));
    };

    const handleCheckbox = (e) => {
        if (e.target.checked) {
            setRolesData([...rolesData, e.target.value])
        } else {
            setRolesData(rolesData.filter(function (row) {
                return row !== e.target.value
            }))
        }
    }

    const handleSubmit = () => {
        setLoading(true);
        var data = {
            data: rolesData,
            buyer_id: dataUser.buyer_id,
            user_id: user_id,
        };
        assignBuyers(data)
            .then((response) => {
                getBuyers()
                    .then((result) => {
                        setLoading(false);
                        setData(result.data.data);
                        setToast(
                            intl.formatMessage({ id: "REQ.UPDATE_SUCCESS" }),
                            5000
                        );
                        setDialogState(false)
                    })
            })
            .catch((error) => {
                setToast(intl.formatMessage({ id: "REQ.REQUEST_FAILED" }), 5000);
                setLoading(false);
            });
    }

    return (
        <React.Fragment>
            <Toast />
            <Dialog
                open={dialogState}
                keepMounted
                maxWidth={"sm"}
                fullWidth={true}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form noValidate autoComplete="off">
                    <DialogTitle
                        id="alert-dialog-slide-title"
                        onClose={() => {
                            setDialogState(false);
                        }}
                        disabled={loading}
                    >
                        Peran Pengguna
                    </DialogTitle>
                    <DialogContent>
                        <div className="form-group row">
                            <label htmlFor="static_1" className="col-sm-5 col-form-label">
                                Kode
                            </label>
                            <div className="col-sm-7">
                                <input
                                    type="text"
                                    disabled
                                    className="form-control"
                                    defaultValue={dataUser.code}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="static_1" className="col-sm-5 col-form-label">
                                Nama Lengkap
                            </label>
                            <div className="col-sm-7">
                                <input
                                    type="text"
                                    disabled
                                    className="form-control"
                                    defaultValue={dataUser.full_name}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="static_1" className="col-sm-5 col-form-label">
                                Plant
                            </label>
                            <div className="col-sm-7">
                                <StyledSelect
                                    isDisabled={true}
                                    value={dataUser.plant_data}
                                    isMulti
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="static_1" className="col-sm-5 col-form-label">
                                Peran
                            </label>
                            <div className="col-sm-7">
                                {isMainPlant && mainRoles.map((item, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checked={rolesData?.includes(item.id)}
                                                    value={item.id}
                                                    color="secondary"
                                                    onChange={handleCheckbox}
                                                />
                                            }
                                            label={item.name}
                                        />
                                    )
                                })}
                                {!isMainPlant && unitRoles.map((item, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    checked={rolesData?.includes(item.id)}
                                                    value={item.id}
                                                    color="secondary"
                                                    onChange={handleCheckbox}
                                                />
                                            }
                                            label={item.name}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => setDialogState(false)}
                            disabled={loading}
                        >
                            <span>
                                <FormattedMessage id="AUTH.GENERAL.BACK_BUTTON" />
                            </span>
                        </button>
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            <span>
                                <FormattedMessage id="TITLE.UPDATE" />
                            </span>
                            {loading && (
                                <span
                                    className="spinner-border spinner-border-sm ml-1"
                                    aria-hidden="true"
                                ></span>
                            )}
                        </button>
                    </DialogActions>
                </form>
            </Dialog>
            <Paper>
                <Container>
                    <Tabs
                        tabActive={tabActiveMain}
                        handleChange={handleChangeTabMain}
                        tabLists={TabLists}
                    />
                </Container>
                <hr className="p-0 m-0" />
                {tabActiveMain === 0 && <UserRoles />}
                {tabActiveMain === 1 && <PicRoles />}
            </Paper>
        </React.Fragment>
    );
}

export default injectIntl(connect(null, null)(UserManagement));
