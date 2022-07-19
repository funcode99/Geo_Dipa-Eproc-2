import React, { useCallback, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";

const FilterUnit = (onFetch) => {
  const options = useSelector((state) => state.auth.user.data.plant_data);
  const [selected, setSelected] = useState(options?.[0]?.name);

  const handleSelect = useCallback(
    (item) => {
      //   onFetch(item?.id);
      setSelected(item?.name);
    },
    [onFetch, setSelected]
  );
  return (
    <Dropdown className="dropdown-inline ml-3" drop="down" alignRight>
      <Dropdown.Toggle
        className="btn-primary btn-sm font-weight-bolder dropdown-toggle px-5"
        variant="transparent"
        id="dropdown-toggle-top"
      >
        {selected || "Choose Unit"}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
        <ul className="navi navi-hover">
          {options?.map((opt, id) => (
            <li key={id} className="navi-item">
              <Dropdown.Item
                // href="#"
                className="navi-link"
                onClick={() => handleSelect(opt)}
              >
                <span className="navi-text">{opt?.name}</span>
              </Dropdown.Item>
            </li>
          ))}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterUnit;
