import { Card } from "@mui/material";
import TextField from '@mui/material/TextField';
import { useState } from "react";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function Breaks(props){
    const[breaks,setBreaks]=useState({
        break_title:'',
        start_time:'',
        end_time:''
    });
    return(

        <div style={{display:'flex', justifyContent:"center", height:'80dvh'}}>

        <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', minWidth:'500px', marginRight:'10px'}}>

        <TextField required id="outlined-basic" label="Break title" variant="outlined" value={breaks.break_title} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginTop:'30px'}} onChange={(e)=>setBreaks({...breaks,break_title:e.target.value})} />

        <TextField required id="outlined-basic" label="Starts at" variant="outlined" value={breaks.start_time} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px'}} onChange={(e)=>setBreaks({...breaks,start_time:e.target.value})} />

        <TextField required id="outlined-basic" label="Ends at" variant="outlined" value={breaks.end_time} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginBottom:"60px"}} onChange={(e)=>setBreaks({...breaks,end_time:e.target.value})} />

        <div style={{display:'flex',justifyContent:'right'}}>
        <Button variant="contained" sx={{minWidth:'100px',marginRight:'80px'}} onClick={()=>{
            props.setData([...props.data,breaks]);
            props.setRender(true);
            setBreaks({...breaks,break_title:'',start_time:'',end_time:''});
        }}>Add</Button>
        </div>
        </Card>

        <Card sx={{ minWidth:'500px',marginLeft:'10px'}}>
            {props.render?<ListAllBreaks data={props.data} setData={props.setData} setRender={props.setRender}/>:<Typography variant="overline" display="block" sx={{display:'flex',justifyContent:'center'}} gutterBottom>Atleast add one break.</Typography>}
            {console.log(props.data)}
        </Card>
        
        </div>
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
                <Button variant="contained" color="error" onClick={()=>{
                    const result=props.data.filter((element)=>{
                        if(element.break_title!=data.break_title){
                            return element;
                        }});
                    props.setData(result);
                    if(props.data.length===0){
                        props.setRender(false);
                    }
                }}>Delete</Button>
                </div>
            )
            
        })}
        </div>
    )
}
export default Breaks;