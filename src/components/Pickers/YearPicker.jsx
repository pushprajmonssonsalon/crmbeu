import * as React from 'react';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';

export default function YearPicker({years,year,setYear}) {

  const handleChange = (event) => {
    setYear(event.target.value)
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-standard-label">Years</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={year}
          onChange={handleChange}
          label="Filter"
        >
        {
        years.map((year,index)=>(
          <MenuItem value={`${year}`}>{year}</MenuItem>
        ))
        }
    
        </Select>
      </FormControl>
    </div>
  );
}
