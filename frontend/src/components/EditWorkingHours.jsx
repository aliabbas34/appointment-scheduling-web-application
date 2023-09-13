import { Card } from "@mui/material";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditWorkingHours(){

    const[workingHoursData,setWorkingHoursData]=useState({
        opens_at:'',
        closes_at:'',
        id:null,
        email:''
    });

    useEffect(()=>{
        async function getWorkingHoursData(){
            try{
                const promise=await axios.get('http://localhost:3000/consultant/working-hours/getData',{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                const data=promise.data.data[0];
                setWorkingHoursData({...workingHoursData,id:data.id,email:data.email,opens_at:data.opens_at,closes_at:data.closes_at});
            }catch(err){
                console.log(err);
            }
        }
        getWorkingHoursData();
    },[])

    return(
        <div style={{display:'flex',justifyContent:'center'}}>
            <EditComponent data={workingHoursData} setData={setWorkingHoursData}/>
        </div>
    )
}

function EditComponent(props){
    const navigate=useNavigate();
    return(
        <div style={{display:'flex',flexDirection:'column', justifyContent:"center", height:'80dvh'}}>
        <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', minWidth:'600px'}}>
        
        <Typography variant="button" display="block" gutterBottom sx={{marginLeft:'20px'}}>*Enter time in 24H Format</Typography>
        
        <TextField required id="outlined-basic" label="Opens at" variant="outlined" 
        value={props.data.opens_at} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginTop:'30px'}} placeholder="HH:MM" onChange={(e)=>props.setData({...props.data,opens_at:e.target.value})} />

        <TextField required id="outlined-basic" label="Closes at" variant="outlined" value={props.data.closes_at} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginBottom:'60px'}} placeholder="HH:MM" onChange={(e)=>props.setData({...props.data,closes_at:e.target.value})} />

        <div style={{display:'flex',justifyContent:'center'}}>
        <Button variant="contained" sx={{maxWidth:"150px", marginBottom:'20px',marginRight:'10px'}} onClick={()=>navigate("/consultant/home")}>Back</Button>
        <Button variant="contained" sx={{maxWidth:"150px", marginBottom:'20px'}} onClick={async ()=>{
            try{
                const promise=await axios.put('http://localhost:3000/consultant/working-hours',{
                    opens_at:props.data.opens_at,
                    closes_at:props.data.closes_at
                },{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                alert(promise.data.message);
                navigate("/consultant/home");
            }catch(err){
                console.log(err);
            }
        }}>Update</Button>
        </div>

        </Card>
        </div>
    )
}

export default EditWorkingHours;