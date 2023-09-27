import {
  Checkbox,
  Chip,
  FormControlLabel,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import _, { isEmpty } from "lodash";
import React, { forwardRef, useRef, useState } from "react";
import ButtonContained from "../../../../../../components/button/ButtonGlobal";
import ModalAdendum from "./ModalAdendum";

const useStyles = makeStyles((theme) => ({
  box: {
    border: "1px solid #E4E6EF",
    borderRadius: "0.42rem",
    minHeight: "40px",
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

const AdendumInput = forwardRef(({ initAdendum }, ref) => {
  const classes = useStyles();

  const [checked, setChecked] = useState(false);
  const [dataAdendum, setDataAdendum] = useState([]);
  const adendumRef = useRef(null);

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };
  const handleSetAdendum = (data) => {
    setDataAdendum(data);
    adendumRef.current.close();
  };
  const handleOpenModal = () => {
    adendumRef.current.open();
  };

  React.useImperativeHandle(ref, () => ({ dataAdendum }));

  React.useEffect(() => {
    if (!isEmpty(initAdendum)) {
      setDataAdendum(initAdendum.map((el) => el?.text));
      setChecked(true);
    }
  }, [initAdendum]);

  return (
    <div>
      <ModalAdendum
        innerRef={adendumRef}
        onSubmit={handleSetAdendum}
        initData={dataAdendum}
      />
      <div className="row">
        <div className="col-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleCheck}
                name="checkedB"
                color="primary"
              />
            }
            label="Memiliki adendum"
          />
        </div>
        <div className="col-8">
          *Jika kontrak memiliki addendum, maka tambahkan kolom untuk addendum
        </div>
      </div>
      {!!checked && (
        <div className="form-group row">
          <label className={`col-sm-4 col-form-label`}>Adendum</label>
          <div className={`col-sm-8`}>
            <div className="form-group mb-0">
              {/* <div className="input-group"> */}
              <div className={clsx(classes.box)}>
                {_.isEmpty(dataAdendum) ? (
                  <div />
                ) : (
                  dataAdendum?.map((addendumNo, id) => (
                    <Chip
                      key={id}
                      size={"small"}
                      variant="outlined"
                      label={`${addendumNo}`}
                      className={classes.chip}
                    />
                  ))
                )}
              </div>
              <ButtonContained
                baseColor="success"
                className={clsx(
                  _.isEmpty(dataAdendum) ? "mr-0" : "mr-2",
                  "mt-2"
                )}
                onClick={handleOpenModal}
              >
                {_.isEmpty(dataAdendum) ? "Add" : "Edit"} Adendum
              </ButtonContained>
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdendumInput;
