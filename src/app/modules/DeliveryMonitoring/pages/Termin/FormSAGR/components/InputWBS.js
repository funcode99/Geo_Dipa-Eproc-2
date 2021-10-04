import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import _ from "lodash";
const useStyles = makeStyles((theme) => ({
  box: {
    border: "1px solid #E4E6EF",
    borderRadius: "0.42rem",
  },
  chip: {
    margin: theme.spacing(1),
  },
}));
const InputWBS = ({ onOpen, value, ...other }) => {
  const classes = useStyles();
  // console.log(`other`, other);
  return (
    <div className="form-group mb-0">
      <div className="input-group">
        {/* <input
          disabled
          type="text"
          className="form-control"
          placeholder="WBS Value"
        /> */}
        <div className={classes.box}>
          {_.isEmpty(value) ? (
            <div />
          ) : (
            value?.map((el, id) => (
              <Chip
                key={id}
                size={"small"}
                variant="outlined"
                label={`${el.name} (${el.value})`}
                className={classes.chip}
              />
            ))
          )}
          <ButtonContained
            baseColor="success"
            className={_.isEmpty(value) ? "mr-0" : "mr-2"}
            onClick={onOpen}
          >
            {_.isEmpty(value) ? "Add" : "Edit"} WBS
          </ButtonContained>
        </div>
        {/* <div className="input-group-append">
          <button className="btn btn-secondary" type="button" onClick={onOpen}>
            Add WBS
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default InputWBS;
