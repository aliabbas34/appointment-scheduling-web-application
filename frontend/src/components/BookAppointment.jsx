import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from "@mui/material";

function BookAppointment(){
    const [date, setDate] = useState(dayjs());
    const id=useParams().id;
    const[consultantData,setConsultantData]=useState("");
    const[appointmentData,setAppointmentData]=useState({});
    useEffect(()=>{
        async function getConsultantData(){
            try{
                const promise=await axios.get('http://localhost:3000/book/consultant-data/'+id,{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                setConsultantData(promise.data.data);
            }catch(err){
                console.log(err);
            }
        }
        getConsultantData();
    },[])
    
    return(
        <div style={{backgroundColor:"rgb(243, 246, 249)",height: '98.3vh',width:'98.3dvw', display:'flex',justifyContent:'space-evenly'}}>
            <div style={{ flexGrow:1, maxWidth:'40%'}}>
                <Consultant data={consultantData}></Consultant>
            </div>
            <div style={{flexGrow:2}}>
                <div style={{display:'flex',justifyContent:'center'}}>
                    <LoadCalendar value={date} setValue={setDate} days_off={consultantData.days_off} id={id} setAppointment={setAppointmentData}/>
                </div>
            </div>
            <div style={{ flexGrow:1}}>
                <div style={{display:'flex',justifyContent:'center'}}>
                    <Timeslots date={date} data={appointmentData} email={consultantData.email}></Timeslots>
                </div>
            </div>
        </div>
    )
}

function Consultant(props){
    
    return(
            <div style={{marginTop:'60px',marginLeft:'30px'}}>
            <Typography variant="button" gutterBottom>{props.data.name}</Typography>
            <Typography variant="h3" gutterBottom>1 Hour Meeting</Typography>
            </div>
    )
}

function LoadCalendar(props){


    async function getAppointmentData(date){
        try{
            const promise=await axios.post('http://localhost:3000/book/appointment',{
                id:props.id,
                dateTime:date
            },
            {
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("token")
                }
            });
            
            props.setAppointment(promise.data.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getAppointmentData(props.value);
    },[])

    function disableWeekends(date) {
        const data=props.days_off;
        let check=false;
        for(let i=0;i<data.length;i++){
            if(dayjs(date).get('day')===data[i]) check=true;
        }
        return check;
      }

      if(!props.days_off)return(
        <CircularProgress />
      )
    return(
        <div style={{width:'70%'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar value={props.value} onChange={(newValue) =>{
                    props.setValue(newValue);
                    getAppointmentData(newValue);
                    }} disablePast views={['day']}  shouldDisableDate={disableWeekends} />
            </LocalizationProvider>
        </div>
    )
}

function Timeslots(props){

    const[timeSlot,setTimeSlot]=useState({
        email:props.email,
        start_time:"",
        end_time:""
    });
    const[warning,setWarning]=useState(false);
    let variant="outlined";
    if(!props.data){
        return(
            <CircularProgress></CircularProgress>
        )
    }
    if(props.data.dayOff){
        return(
            <Typography variant="h4">It is a day off</Typography>
        )
    }
    if(!props.data.slots){
        return(
            <CircularProgress></CircularProgress>
        )
    }
    if(props.data.slots.length===0){
        return(
            <Typography variant="button">No appointment available for today</Typography>
        )
    }
    return(
        <div >

        <Typography sx={{marginBottom:'30px',marginTop:'20px'}} variant="h5">Available slots </Typography>
        <div>
            {warning?<Typography sx={{color:'red'}} variant="overline">*select a slot please</Typography>:<></>}
        </div>
        <div style={{display:'flex',flexDirection:'column',justifyContent:"column"}}>
            {props.data.slots.map((data,index)=>{
                return(
                <Button sx={{maxWidth:'180px',margin:'10px'}} variant="outlined" onClick={()=>{
                    setTimeSlot({...timeSlot,start_time:data.start_time,end_time:data.end_time});
                    setWarning(false);
                }}>{data.start_time+" - "+data.end_time}</Button>
                )
            })}
        </div>
        <div style={{marginTop:'30px'}}>
            <Button variant="text" onClick={()=>{
                if(timeSlot.start_time===""&&timeSlot.end_time===""){
                    setWarning(true);
                    return;
                }
                alert(timeSlot)//backend req.
            }}>Book Appointment</Button>
        </div>
        
        </div>
    )
}

export default BookAppointment;