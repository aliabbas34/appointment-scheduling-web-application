import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import CircularProgress from '@mui/material/CircularProgress';

function BookAppointment(){
    const [date, setDate] = useState(dayjs());
    const id=useParams().id;
    const[consultantData,setConsultantData]=useState("");
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
            <div style={{flexGrow:2, maxWidth:'40%'}}>
                <LoadCalendar value={date} setValue={setDate} days_off={consultantData.days_off} />
            </div>
            <div style={{ flexGrow:1}}>
                timeslots
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
                <DateCalendar value={props.value} onChange={async(newValue) => {
                    props.setValue(newValue);
                    }} disablePast views={['day']}  shouldDisableDate={disableWeekends} />
            </LocalizationProvider>
        </div>
    )
}

export default BookAppointment;