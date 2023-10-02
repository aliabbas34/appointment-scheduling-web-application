import * as React from 'react';
import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import PersonalDetails from './PersonalDetails';
import WorkingHours from './WorkingHours';
import Breaks from './Breaks';
import DaysOff from './DaysOff';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const steps = ['Personal details', 'Working hours', 'Breaks','Days off'];

function RegisterForm(){

    const navigate=useNavigate();

    const[activeStep, setActiveStep]=useState(0);

    const[personalDetails,setPersonalDetails]=useState({
        name:'',
        email:'',
        password:''
    });

    const[workingHours,setWorkingHours]=useState({
        opens_at:'',
        closes_at:''
    });

    const[breaks,setBreaks]=useState([]);

    const [daysOff, setDaysOff] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
      });

    const[renderBreaks,setRenderBreaks]=useState(false);

    const handleNext = async () => {
        if(activeStep===3){
            try{
                let daysOffData=[];
                if(daysOff.mon) daysOffData=[...daysOffData,{day_name:'monday'}];
                if(daysOff.tue) daysOffData=[...daysOffData,{day_name:'tuesday'}];
                if(daysOff.wed) daysOffData=[...daysOffData,{day_name:'wednesday'}];
                if(daysOff.thu) daysOffData=[...daysOffData,{day_name:'thursday'}];
                if(daysOff.fri) daysOffData=[...daysOffData,{day_name:'friday'}];
                if(daysOff.sat) daysOffData=[...daysOffData,{day_name:'saturday'}];
                if(daysOff.sun) daysOffData=[...daysOffData,{day_name:'sunday'}];
                const promise=await axios.post('http://localhost:3000/consultant/register',{
                    email:personalDetails.email,
                    name:personalDetails.name,
                    password:personalDetails.password,
                    working_hours:{
                        opens_at:workingHours.opens_at,
                        closes_at:workingHours.closes_at,
                    },
                    breaks:breaks,
                    days_off:daysOffData
                })
                let data=promise.data;
                console.log(data.message);
                localStorage.setItem("token",data.token);
                navigate('/consultant/home');
                }catch (e){
                    console.log(e);
                    alert(e.response.data.message);
                }
                return;
            }
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        
    };
    const handleBack = () => {
        if(activeStep===0) return;
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };



    return(
        <div>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div style={{display:'flex', justifyContent:'center'}}>
        <div style={{display:'flex',flexDirection:'column', justifyContent:'center'}}>
            {activeStep===0?<PersonalDetails data={personalDetails} setData={setPersonalDetails}></PersonalDetails>:<></>}
            {activeStep===1?<WorkingHours data={workingHours} setData={setWorkingHours}></WorkingHours>:<></>}
            {activeStep===2?<Breaks data={breaks} setData={setBreaks} render={renderBreaks} setRender={setRenderBreaks}></Breaks>:<></>}
            {activeStep===3?<DaysOff data={daysOff} setData={setDaysOff}></DaysOff>:<></>}
        </div>
        </div>
        <div style={{display:"flex",justifyContent:'center'}}>
        <Button onClick={handleBack}>
                back
        </Button>
        <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
        {/* <Button>
        {activeStep === steps.length - 1 ? <a style={{margin:'5px'}} href="http://localhost:3000/google">authenticate google account</a>:<></>}
        </Button> */}
        
        </div>
        <div style={{display:"flex",justifyContent:"start", marginTop:"30px", marginLeft:"30px",marginBottom:"20px"}}> <Typography variant="body1" gutterBottom>Already a user? <a href="/consultant/login">Login</a></Typography></div>
        </div>
    )
}

export default RegisterForm;





