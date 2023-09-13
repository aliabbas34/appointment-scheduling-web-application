import { Card } from "@mui/material";
import TextField from '@mui/material/TextField';
function PersonalDetails(props){
    return(
        <div style={{display:'flex',flexDirection:'column', justifyContent:"center", height:'80dvh'}}>

        <Card sx={{display:'flex', flexDirection:'column', justifyContent:'center', minWidth:'500px'}}>

        <TextField required id="outlined-basic" label="Full Name" variant="outlined" value={props.data.name} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginTop:'30px'}} onChange={(e)=>props.setData({...props.data,name:e.target.value})} />

        <TextField required id="outlined-basic" label="Email" variant="outlined" value={props.data.email} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px'}} onChange={(e)=>props.setData({...props.data,email:e.target.value})} />

        <TextField required id="outlined-basic" label="Password" type="password" variant="outlined" value={props.data.password} sx={{margin:'10px',marginRight:'60px',marginLeft:'30px',marginBottom:"60px"}} onChange={(e)=>props.setData({...props.data,password:e.target.value})} />

        </Card>
        </div>
    )
}

export default PersonalDetails;