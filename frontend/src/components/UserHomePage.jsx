import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserHomePage(){

    const[userName,setUserName]=useState("");
    const[data,setData]=useState([]);

  const navigate=useNavigate();

    useEffect(()=>{
       async function fetchData(){
            try{
                const promise=await axios.get('http://localhost:3000/home',{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                const dataRecieved=promise.data.data;
                setUserName(dataRecieved.name);
                setData(dataRecieved.consultantData);
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    },[])

    // const userName="User";
    // const data=[{
    //     name:'consultant one',
    //     opens_at:'10:00',
    //     closes_at:'20:00',
    //     days_off:["saturday","sunday"]
    // },
    // {
    //     name:'consultant two',
    //     opens_at:'11:00',
    //     closes_at:'20:00',
    //     days_off:["friday","sunday"]
    // },
    // {
    //     name:'consultant three',
    //     opens_at:'11:00',
    //     closes_at:'20:00',
    //     days_off:["thursday","sunday"]
    // },
    // {
    //     name:'consultant four',
    //     opens_at:'10:00',
    //     closes_at:'20:00',
    //     days_off:["saturday","sunday"]
    // },
    // {
    //     name:'consultant five',
    //     opens_at:'10:00',
    //     closes_at:'20:00',
    //     days_off:["saturday","sunday"]
    // }
    // ];

    return(
        <div>
        <div style={{display:'flex',justifyContent:'end',margin:'30px'}}>
          <Button variant='text' sx={{marginRight:'20px'}} onClick={()=>{
            navigate("/show/appointment");
          }}>My appointments</Button>
          <Button variant='contained' onClick={()=>{
            localStorage.removeItem("token");
            navigate("/login");
          }}>Logout</Button>
        </div>
        <div style={{display:'flex',justifyContent:'center', margin:'30px'}}>
            <Typography variant='h4'>Welcome {userName}</Typography>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"start"}}>
            {data.map((data,index)=>{
                return(
                <Consultant data={data}/>
                )
            })}
        </div>
        </div>
    )
}

function Consultant(props){

  const navigate=useNavigate();
    
    return(
        <Card sx={{ minWidth: 275, margin:'10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Opens at: {props.data.opens_at}
        </Typography>
        <Typography variant="h5" component="div">
          {props.data.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Closes at: {props.data.closes_at}
        </Typography>
        <Typography variant="body2">
          Days off: {props.data.days_off.map((data)=>{
            return(
                <span>
                {data+" "}
                </span>
            )
          })}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{
          navigate("/book/"+props.data.id);
        }}>Book Appointment</Button>
      </CardActions>
    </Card>
    )
}

export default UserHomePage;