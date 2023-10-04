import React, { useState } from 'react';
import Select from 'react-select';
import { colourOptions } from './data';

const Checkbox = ({ children, ...props }
) => (
  <label style={{ marginRight: '1em' }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
)

export const ReactSelect = () => {
  const [isClearable, setIsClearable] = useState(true)
  const [isSearchable, setIsSearchable] = useState(true)

  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={colourOptions[0]}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name="color"
        options={colourOptions}
      />

      <div
        style={{
          color: 'hsl(0, 0%, 40%)',
          display: 'inline-block',
          fontSize: 12,
          fontStyle: 'italic',
          marginTop: '1em',
        }}
      >
      </div>
    </>
  )
}