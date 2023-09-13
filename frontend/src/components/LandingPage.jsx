import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function LandingPage(){
    const navigate=useNavigate();
    return(
        <div>
        <h1>Below are the routes for consultants or hosts</h1>
        <Button variant='contained' sx={{margin:'10px'}} onClick={()=>navigate("/consultant/login")}>Login</Button>
        <Button variant='contained' onClick={()=>navigate("/consultant/register")}>Register</Button>
        <h1>Below are the routes for users</h1>
        <Button variant='contained' onClick={()=>navigate("/login")}>Login</Button>
        <Button variant='contained' sx={{margin:'10px'}} onClick={()=>navigate("/register")}>Register</Button>

        </div>
    )
}

export default LandingPage;