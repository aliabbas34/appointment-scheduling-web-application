import React, { useState } from "react";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function UserRegister(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name,setName]=useState("");

    const navigate=useNavigate();

    const handleClick=async ()=>{
        try{
        const promise= await axios.post('http://localhost:3000/register',{
            email:email,
            password:password,
            name:name
        });
        let data=promise.data;
        console.log(data.message);
        localStorage.setItem("token",data.token);
        navigate('/home');
        }catch (e){
            console.log(e);
            alert(e.response.data.message);
        }
    }

    return(
        <div 
    style={{
        height:"100vh", 
        width:"100vw", 
        backgroundColor:"rgb(243, 246, 249)", 
        display:"flex",
        flexDirection:"column",
        justifyContent:"center"
        }}>
        
        <div style={{display:"flex", justifyContent:"center"}}>
        
        <Card sx={{minWidth:"400px", minHeight:"350px", display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div 
        style={{
            display:"flex",
            justifyContent:"center",
            margin:"30px",
            marginBottom:"50px"
            }}>
        <Typography variant="button" gutterBottom>Register Page</Typography>
        </div>
        <TextField 
                id="outlined-basic" 
                label="Full name" 
                placeholder="Jhon doe" 
                variant="outlined"
                onChange={e =>setName(e.target.value)} 
                sx={{
                    marginRight:"30px",
                    marginLeft:"20px",
                    marginBottom:"10px"
                }}
            />
            <TextField 
                id="outlined-basic" 
                label="email" 
                placeholder="user@mail.com" 
                variant="outlined" 
                type="email" 
                onChange={e =>setEmail(e.target.value)} 
                sx={{
                    marginRight:"30px",
                    marginLeft:"20px",
                    marginBottom:"10px"
                }}
            />
            <TextField 
                id="outlined-basic" 
                label="password" 
                variant="outlined" 
                type="password" 
                onChange={e => setPassword(e.target.value)} 
                sx={{
                    marginTop:"10px",
                    marginRight:"30px",
                    marginLeft:"20px",
                    marginBottom:"10px"
                }}
            />
            <Button 
            sx={{
                marginTop:"10px",
                marginRight:"20px",
                marginLeft:"20px",
                marginBottom:"7px"
            }}
            variant="contained"
            onClick={handleClick}
            >
                register
            </Button>
            <div style={{display:"flex",justifyContent:"start", marginTop:"30px", marginLeft:"30px",marginBottom:"20px"}}>
             <Typography variant="body1" gutterBottom>Already a user? <a href="/login">Login</a></Typography>
             </div>
        </Card>
        </div>
    </div>
    )
}

export default UserRegister;