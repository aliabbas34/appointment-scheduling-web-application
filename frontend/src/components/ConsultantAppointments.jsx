import axios from "axios";
import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";

function ConsultantAppointments(){

    const [appointmentData,setAppointmentData]=useState([]);

    useEffect(()=>{
        async function getAppointments(){
            const promise=await axios.get('http://localhost:3000/consultant/show/appointment',{
                headers:{
                "Authorization":"Bearer "+localStorage.getItem("token")
                }
            });
            setAppointmentData(promise.data.data);
        }
        getAppointments();
    },[])

    const navigate=useNavigate();

    return(
        <div>
        <div style={{display:'flex',justifyContent:'end', marginRight:'30px', marginTop:'20px'}}>
            <Button sx={{mr:1}} variant="text" onClick={()=>{
                navigate('/consultant/home')
            }}>Home</Button>
            <Button variant="contained" onClick={()=>{
                localStorage.removeItem("token");
                navigate("/consultant/login");
            }}>Logout</Button>
        </div>
        <div>
            <Typography variant="h2">My Appointments</Typography>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'start'}}>
        {appointmentData.map((data,index)=>{
            return(
                <Card sx={{ minWidth: 275 , m: 2}}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Appointment with
                    </Typography>
                    <Typography variant="h5" component="div">
                    {data.userName}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {data.appointmentData.date}
                    </Typography>
                    <Typography variant="body2">
                    Start time : {data.appointmentData.start_time}
                    <br />
                    End time : {data.appointmentData.end_time}
                    </Typography>
                </CardContent>
            </Card>
            )
        })}
        </div>
        </div>
    )
}

export default ConsultantAppointments;