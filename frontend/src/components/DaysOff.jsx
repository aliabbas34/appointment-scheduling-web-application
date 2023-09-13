import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { Card } from '@mui/material';

function DaysOff(props){

      const handleChange = (event) => {
        props.setData({
          ...props.data,
          [event.target.name]: event.target.checked,
        });
      };

    const { mon,tue,wed,thu,fri,sat,sun } = props.data;
    const error = [mon,tue,wed,thu,fri,sat,sun].filter((v) => v).length <1;

    return(
        <div style={{display:'flex', justifyContent:"center", height:'80dvh'}}>
        <Card sx={{minWidth:'500px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{display:'flex',justifyContent:'center'}}>
        <FormControl
        required
        error={error}
        component="fieldset"
        sx={{ m: 3 }}
        variant="standard"
      >
        <FormLabel component="legend">Pick atleast one</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={mon} onChange={handleChange} name="mon" />
            }
            label="Monday"
          />
          <FormControlLabel
            control={
              <Checkbox checked={tue} onChange={handleChange} name="tue" />
            }
            label="Tuesday"
          />
          <FormControlLabel
            control={
              <Checkbox checked={wed} onChange={handleChange} name="wed" />
            }
            label="Wednesday"
          />
          <FormControlLabel
            control={
              <Checkbox checked={thu} onChange={handleChange} name="thu" />
            }
            label="Thursday"
          />
          <FormControlLabel
            control={
              <Checkbox checked={fri} onChange={handleChange} name="fri" />
            }
            label="Friday"
          />
          <FormControlLabel
            control={
              <Checkbox checked={sat} onChange={handleChange} name="sat" />
            }
            label="Saturday"
          />
          <FormControlLabel
            control={
              <Checkbox checked={sun} onChange={handleChange} name="sun" />
            }
            label="Sunday"
          />
        </FormGroup>
      </FormControl>
      </div>
      </Card>
        </div>
    )
}

export default DaysOff;