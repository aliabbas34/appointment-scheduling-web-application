import { Card } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditBreaks(){

    const[breaksData,setBreaksData]=useState([]);
    const[render,setRender]=useState(false);
    useEffect(()=>{
        async function getBreaksData(){
            try{
                const promise=await axios.get('http://localhost:3000/consultant/breaks/allData',{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                console.log(promise.data.data);
                setBreaksData(promise.data.data);
                if(promise.data.data.length>0) setRender(true);
            }catch(err){
                console.log(err);
            }
        }
        getBreaksData();
    },[])

    return(

        <div style={{display:"flex",justifyContent:"center", margin:'20px'}}>
            <CreateBreak data={breaksData} setData={setBreaksData} setRender={setRender}></CreateBreak>
            <Card sx={{minWidth:'500px'}}>
            {render?<ListAllBreaks data={breaksData} setData={setBreaksData} setRender={setRender}/>:<Typography variant="overline" display="block" sx={{display:'flex',justifyContent:'center'}} gutterBottom>Atleast add one break.</Typography>}
            </Card>
        </div>
    )
}

function CreateBreak(props){

    const navigate=useNavigate();

    const[breaks,setBreaks]=useState({
        break_title:'',
        start_time:'',
        end_time:''
    });

    return(
        <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', minWidth:'500px', marginRight:'10px'}}>

        <TextField required id="outlined-basic" label="Break title" variant="outlined" value={breaks.break_title} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginTop:'30px'}} onChange={(e)=>setBreaks({...breaks,break_title:e.target.value})} />

        <TextField required id="outlined-basic" label="Starts at" variant="outlined" value={breaks.start_time} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px'}} onChange={(e)=>setBreaks({...breaks,start_time:e.target.value})} />

        <TextField required id="outlined-basic" label="Ends at" variant="outlined" value={breaks.end_time} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginBottom:"60px"}} onChange={(e)=>setBreaks({...breaks,end_time:e.target.value})} />

        <div style={{display:'flex',justifyContent:'space-between'}}>
        <Button variant="contained" sx={{minWidth:'100px',marginLeft:'80px', marginBottom:"20px"}} onClick={()=>navigate("/consultant/home")}>Back</Button>
        <Button variant="contained" sx={{minWidth:'100px',marginRight:'80px', marginBottom:"20px"}} onClick={async()=>{
            try{
                const promise=await axios.post('http://localhost:3000/consultant/breaks/addData',breaks,{
                    headers:{
                        "Authorization":"Bearer "+localStorage.getItem("token")
                    }
                });
                props.setData([...props.data,breaks]);
                props.setRender(true);
                setBreaks({...breaks,break_title:'',start_time:'',end_time:''});
            }catch(err){
                console.log(err);
            }
        }}>Add</Button>
        </div>
        </Card>
    )
}

function ListAllBreaks(props){
    return(
        <div>
        <div style={{display:'flex',justifyContent:'space-between', margin:'10px'}}>
            <Typography variant="h6">Break title</Typography>
            <Typography variant="h6">Starts at</Typography>
            <Typography variant="h6">Ends at</Typography>
            <Typography variant="h6">Action</Typography>
        </div>
        {props.data.map((data,index)=>{
            return(
                <div style={{display:'flex',justifyContent:'space-between', margin:'10px'}}>
                <Typography variant="overline" gutterBottom>{data.break_title}</Typography>
                <Typography variant="overline" gutterBottom>{data.start_time}</Typography>
                <Typography variant="overline" gutterBottom>{data.end_time}</Typography>
                <Button variant="contained" color="error" onClick={async()=>{
                    //send backend request to delete a break
                    try{
                        const promise=await axios.delete('http://localhost:3000/consultant/breaks/del/'+data.id,{
                            headers:{
                                "Authorization":"Bearer "+localStorage.getItem("token")
                            }
                        });
                        console.log(promise.data.message);
                        const result=props.data.filter((element)=>{
                            if(element.break_title!=data.break_title){
                                return element;
                            }});
                        props.setData(result);
                        if(props.data.length===0){
                            props.setRender(false);
                        }
                    }catch(err){
                        console.log(err);
                    }
                }}>Delete</Button>
                </div>
            )
            
        })}
        </div>
    )
}

export default EditBreaks;