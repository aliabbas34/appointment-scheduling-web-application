import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditDaysOff(){

    const navigate=useNavigate();

    const [daysOff, setDaysOff] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
      });

useEffect(()=>{
        async function getDaysOffData(){
            try{
                const promise=await axios.get('http://localhost:3000/consultant/daysOff/getData',{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                const daysOffData=promise.data.data;
                let loadData=daysOff;
                daysOffData.map((data)=>{
                    if(data.dayname==="monday") {
                        setDaysOff({...loadData,mon:true});
                        loadData={...loadData,mon:true};
                    }
                    if(data.dayname==="tuesday") {
                        setDaysOff({...loadData,tue:true});
                        loadData={...loadData,tue:true};
                    }
                    if(data.dayname==="wednesday") {
                        setDaysOff({...loadData,wed:true});
                        loadData={...loadData,wed:true};
                    }
                    if(data.dayname==="thursday") {
                        setDaysOff({...loadData,thu:true});
                        loadData={...loadData,thu:true};
                    }
                    if(data.dayname==="friday") {
                        setDaysOff({...loadData,fri:true});
                        loadData={...loadData,fri:true};
                    }
                    if(data.dayname==="saturday") {
                        setDaysOff({...loadData,sat:true});
                        loadData={...loadData,sat:true};
                    }
                    if(data.dayname==="sunday") {
                        setDaysOff({...loadData,sun:true});
                        loadData={...loadData,sun:true};
                    }
                });
            }catch(err){
                console.log(err);
            }
        }
        getDaysOffData();
    },[])

    const handleChange = (event) => {
        setDaysOff({
          ...daysOff,
          [event.target.name]: event.target.checked,
        });
      };

    const { mon,tue,wed,thu,fri,sat,sun } = daysOff;
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
      <div style={{display:'flex',justifyContent:'center'}}>
      <Button variant='contained' sx={{marginRight:'10px'}} onClick={()=>{navigate("/consultant/home")}}>Back</Button>
      <Button variant='contained' onClick={async()=>{
        try{
            let day_name=[];
                    if(daysOff.mon) {
                        day_name=[...day_name,"monday"];
                    }
                    if(daysOff.tue) {
                        day_name=[...day_name,"tuesday"];
                    }
                    if(daysOff.wed) {
                        day_name=[...day_name,"wednesday"];
                    }
                    if(daysOff.thu) {
                        day_name=[...day_name,"thursday"];
                    }
                    if(daysOff.fri) {
                        day_name=[...day_name,"friday"];
                    }
                    if(daysOff.sat) {
                        day_name=[...day_name,"saturday"];
                    }
                    if(daysOff.sun) {
                        day_name=[...day_name,"sunday"];
                    }
            const promise=await axios.put('http://localhost:3000/consultant/daysOff/update',day_name,{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                console.log(promise.data.message);
        }catch(err){
            console.log(err);
        }
      }}>Update</Button>
      </div>
      </Card>
        </div>
    )
}

export default EditDaysOff;