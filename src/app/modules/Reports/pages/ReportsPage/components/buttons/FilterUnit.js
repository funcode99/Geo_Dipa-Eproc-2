import React, { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";

const FilterUnit = ({ setQuery }) => {
  const options = useSelector((state) => state.auth.user.data.plant_data);
  const [selected, setSelected] = useState(options?.[0]?.name);

  const handleSelect = useCallback(
    (item) => {
      setQuery((e) => ({ ...e, unit: item?.name }));
      setSelected(item?.name);
    },
    [setQuery, setSelected]
  );

  useEffect(() => {
    if (!!options) {
      handleSelect(options?.[0]);
    }
  }, [options]);

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
