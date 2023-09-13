import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function LandingPage(){
    const navigate=useNavigate();
    return(
        <div>
        <h1>hello from landing page</h1>
        <Button variant='contained' onClick={()=>navigate("/consultant/login")}>Login</Button>
        <Button variant='contained' onClick={()=>navigate("/consultant/register")}>Register</Button>
        </div>
    )
}

export default LandingPage;