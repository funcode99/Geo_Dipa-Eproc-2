import React from "react";
import Select from 'react-select';

const StyledSelect = ({ options, value, onChange, isDisabled = false, placeholder = "Select..." }) => {
    const customStyles = {
        control: styles => ({
            ...styles,
            border: '1px solid #EBEDF3 !important',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        })
    }
    return (
        <Select
            value={value}
            isMulti
            onChange={onChange}
            options={options}
            isDisabled={isDisabled}
            className="form-control border-0 p-0 h-100"
            classNamePrefix="react-select"
            styles={customStyles}
            menuPosition={'fixed'} 
            placeholder={placeholder}
        />
    );
};

export default StyledSelect;
