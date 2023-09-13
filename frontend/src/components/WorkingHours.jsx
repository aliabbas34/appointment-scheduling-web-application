import { Card } from "@mui/material";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function WorkingHours(props){
    return(
        <div style={{display:'flex',flexDirection:'column', justifyContent:"center", height:'80dvh'}}>
        <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', minWidth:'500px'}}>
        
        <Typography variant="button" display="block" gutterBottom sx={{marginLeft:'20px'}}>*Enter time in 24H Format</Typography>
        
        <TextField required id="outlined-basic" label="Opens at" variant="outlined" value={props.data.opens_at} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginTop:'30px'}} placeholder="HH:MM" onChange={(e)=>props.setData({...props.data,opens_at:e.target.value})} />

        <TextField required id="outlined-basic" label="Closes at" variant="outlined" value={props.data.closes_at} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginBottom:'60px'}} placeholder="HH:MM" onChange={(e)=>props.setData({...props.data,closes_at:e.target.value})} />

        </Card>
        </div>
    )
}

export default WorkingHours;