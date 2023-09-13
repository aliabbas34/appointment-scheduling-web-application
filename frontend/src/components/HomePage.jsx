import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function HomePage(){

    const navigate=useNavigate();

    const[userData,setUserData]=useState({});
    const[workingHoursData,setWorkingHoursData]=useState({});
    const[breaksData,setBreaksData]=useState([]);
    const[daysOffData,setDaysOffData]=useState([]);

    useEffect(()=>{
        async function getAllData(){
            try{
                const promise=await axios.get('http://localhost:3000/consultant/all-data',{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                const fetchedData=promise.data.data;
                setUserData(fetchedData.userData[0]);
                setWorkingHoursData(fetchedData.workingHoursData[0]);
                setBreaksData(fetchedData.breaksData);
                setDaysOffData(fetchedData.daysOffData);
            }
            catch(err){
                console.log(err);
            }
        }
        getAllData();
    },[])

    return(
        <div style={{backgroundColor:"rgb(243, 246, 249)"}}>
            <div style={{display:'flex',justifyContent:'end'}}>
                <Button variant='contained' onClick={()=>{
                    localStorage.removeItem("token");
                    navigate("/consultant/login");
                }}>Logout</Button>
            </div>
            <div style={{display:'flex',justifyContent:"center",marginBottom:'5px'}}>
                <Typography variant='h4' gutterBottom>Welcome {userData.name}</Typography>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <WorkingHours data={workingHoursData} nav={navigate}/>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <Breaks data={breaksData} nav={navigate}></Breaks>
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <DaysOff data={daysOffData} nav={navigate}></DaysOff>
            </div>
        </div>
    )
}

function WorkingHours(props){
    return(
        <div>
            <Card sx={{display:'flex',justifyContent:'center',minWidth:'600px'}}>
            <div style={{display:'flex',flexDirection:'column',justifyContent:'center',margin:'10px'}}>
                <Typography variant="h5" gutterBottom>Working Hours</Typography>
                <div style={{display:'flex',justifyContent:'start',margin:'5px'}}>
                <Typography variant='h6' gutterBottom>Opens At :</Typography>
                <Typography variant='h6' gutterBottom>{props.data.opens_at}</Typography>
                </div>
                <div style={{display:'flex',justifyContent:'start'}}>
                <Typography variant='h6' gutterBottom>Closes At :</Typography>
                <Typography variant='h6' gutterBottom>{props.data.closes_at}</Typography>
                </div>
                <Button variant="contained" sx={{margin:'10px',width:'100px'}} onClick={()=>{props.nav("/consultant/working-hours")}}>Edit</Button>
                </div>
            </Card>
        </div>
    )
}

function Breaks(props){
    return(
        <Card sx={{minWidth:'600px',margin:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between', margin:'10px'}}>
            <Typography variant="h5">Break title</Typography>
            <Typography variant="h5">Starts at</Typography>
            <Typography variant="h5">Ends at</Typography>
        </div>
        {props.data.map((data,index)=>{
            return(
                <div style={{display:'flex',justifyContent:'space-between', margin:'10px'}}>
                <Typography variant="h6" gutterBottom>{data.break_title}</Typography>
                <Typography variant="h6" gutterBottom>{data.start_time}</Typography>
                <Typography variant="h6" gutterBottom>{data.end_time}</Typography>
                </div>
            )
        })}
        <div style={{display:'flex',justifyContent:'center'}}>
        <Button variant="contained" sx={{margin:'10px',width:'100px'}} onClick={()=>{props.nav("/consultant/breaks")}}>Edit</Button>
        </div>
        </Card>
    )
}

function DaysOff(props){
    return(
        <Card sx={{minWidth:'600px',margin:'10px',display:'flex',justifyContent:'center'}}>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'flex'}}>
            <Typography variant="h5" gutterBottom>Days off</Typography>
            {props.data.map((data)=>{
                return(
                    <div>
                    <Typography variant="h6" gutterBottom>{data.dayname}</Typography>
                    </div>
                )
            })}
            <Button variant='contained' sx={{margin:'8px',width:"100px"}} onClick={()=>{props.nav("/consultant/days-off")}}>Edit</Button>
            </div>
        </Card>
    )
}

export default HomePage;