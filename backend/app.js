import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import dayjs from 'dayjs';
import { addUserData, addBreaks, addDaysOff, addWorkingHours, getUserByEmail, updateWorkinHours, getWorkingHoursByEmail, getAllDataByEmail, getBreaksByEmail, getDaysOffByEmail, deleteBreakById, updateBreakById, deleteDaysOffViaEmail, getAllConsultants, getUserById, getBookedAppointments, bookAppointment, getBookedAppointmentByEmail } from "./database.js";
import { getAvailableSlots } from "./appointment.js";
import { mailer } from "./mailer.js";

const app=express();

app.use(express.json());
app.use(cors());
dotenv.config();

//middleware
function authenticateAdmin(req,res,next){
    const authHeader=req.headers.authorization;
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.SECRET,async(err,data)=>{
        if(err) res.status(500).json({message:"error in middleware while verifying token"});
        else{
            let email=data.email;
            const userData=await getUserByEmail(email);
            let userDoNotExist=false;
            if(userData.length===0) userDoNotExist=true;
            if(!userDoNotExist){
                if(data.role==='consultant'){
                    req.email=email;
                    next();
                }
                else res.status(401).json({message:"Acess denied: not a consultant"});
            }
            else res.status(401).json({message:'Access denied: not an consultant'});
        }
    });
}

function authenticateUser(req,res,next){
    const authHeader=req.headers.authorization;
    const token=authHeader.split(' ')[1];
    jwt.verify(token,process.env.SECRET,async(err,data)=>{
        if(err) res.status(500).json({message:"error in middleware while verifying token"});
        else{
            let email=data.email;
            const userData=await getUserByEmail(email);
            let userDoNotExist=false;
            if(userData.length===0) userDoNotExist=true;
            if(!userDoNotExist){
                if(data.role==='user'){
                    req.email=email;
                    next();
                }
                else res.status(401).json({message:"Acess denied: not a user"});
            }
            else res.status(401).json({message:'Access denied: not an user'});
        }
    });
}

//register route for consultant.
/*
Consultant data format
{
    email:'abc@mail.com',
    name:'abc',
    password:'abcConsultant',
    working_hours:{
        opens_at:'09:00',
        closes_at:'20:00',
    },
    breaks:[
        {
            break_title:'lunch break',
            start_time:'14:00',
            end_time:'15:00',
        },
        {
            break_title:'Tea break',
            start_time:'17:00',
            end_time:'17:30',
        }
    ],
    days_off:[
        {
            day_name:'saturday'
        },
        {
            day_name:'sunday'
        }
    ]
}
*/
//consultant register route
app.post('/consultant/register',async(req,res)=>{
    try{
        const{email,name,password,working_hours,breaks,days_off}=req.body;

        //check whether user already exists or not.
        const userData=await getUserByEmail(email);
        let userDoNotExist=false;
        if(userData.length===0) userDoNotExist=true;

        if(userDoNotExist){//add data to database.
            await addUserData(email,name,"consultant",password);
            await addWorkingHours(email,working_hours.opens_at,working_hours.closes_at);
            breaks.map(async(data)=>{
                console.log(data);
                await addBreaks(data.break_title,email,data.start_time,data.end_time);
            });
            days_off.map(async(data)=>{
                await addDaysOff(data.day_name,email);
            });

            //create jwt token add email to it and send it back as a response.
            const token=jwt.sign({email,role:'consultant'},process.env.SECRET,{expiresIn:"12h"});
            res.status(200).json({message:"Registration successfull",token:token});
        }
        else res.status(400).json({message:"user already exist"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Some error occured in try block of consultant register route"});
    }
    
});

//consultant login route.
app.post('/consultant/login', async(req,res)=>{
    const {email,password}=req.body;
    const userData=await getUserByEmail(email);
    if(userData.length===1){
        if(userData[0].password===password&&userData[0].role==='consultant'){
            const token=jwt.sign({email,role:'consultant'},process.env.SECRET,{expiresIn:'12h'});
            res.status(200).json({message:"Login success",token:token});
        }
        else res.status(401).json({message:"wrong password"});
    }
    else res.status(401).json({message:"User does not exist"});
});


//backend routes for consultant home page
//to get all data for display
app.get('/consultant/all-data',authenticateAdmin, async(req,res)=>{
    try{
        const email=req.email;
        const data=await getAllDataByEmail(email);
        res.status(200).json({message:"data fetch successfull",data:data});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal error while fetching all data from backend for home page"});
    }
});



//consultant working hours get data
app.get('/consultant/working-hours/getData',authenticateAdmin, async(req,res)=>{
    try{
        const email=req.email;
        const data=await getWorkingHoursByEmail(email);
        res.status(200).json({message:"working hours data fetched successfully",data:data});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"some error occured while fetching working hours form database"});
    }
});

// consultant working hours update data.
app.put('/consultant/working-hours',authenticateAdmin, async(req,res)=>{
    try{
        const{opens_at, closes_at}=req.body;
        const email=req.email;
        await updateWorkinHours(opens_at,closes_at,email);
        res.status(200).json({message:"update successfull"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"update failed due to error in backend"});
    }
});


//breaks routes
//get all breaks data
app.get('/consultant/breaks/allData',authenticateAdmin, async (req,res)=>{
    try{
        const email=req.email;
        const data=await getBreaksByEmail(email);
        res.status(200).json({message:"breaks data fetch successfull",data:data});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"error while fetching breaks data via backend"});
    }
    
});


//Delete a break
app.delete('/consultant/breaks/del/:id',authenticateAdmin,async(req,res)=>{
    try{
        const id=parseInt(req.params.id);
        await deleteBreakById(id);
        res.status(200).json({message:"successfully deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"error occured while deleting a break form breaks table"});
    }
});


//Update a break
app.put('/consultant/breaks/update/:id',authenticateAdmin, async(req,res)=>{
    try{
        const {break_title,start_time,end_time}=req.body;
        const id=req.params;
        await updateBreakById(id,break_title,start_time,end_time);
        res.status(200).json({message:"delete successfull"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"error occured while deleting a break"});
    }

});


//Create new break
app.post('/consultant/breaks/addData', authenticateAdmin,async(req,res)=>{
    try{
        const {break_title,start_time,end_time}=req.body;
        const email=req.email;
        await addBreaks(break_title,email,start_time,end_time);
        res.status(200).json({message:"successfully created"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'error in creating new break'});
    }
});

//days off

//get daysOff
app.get('/consultant/daysOff/getData',authenticateAdmin,async(req,res)=>{
    try{
        const email=req.email;
        const daysOff=await getDaysOffByEmail(email);
        res.status(200).json({message:"days off fetched successfully",data:daysOff});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"error while fetching days off via backend"});
    }
});

//update daysOff
app.put('/consultant/daysOff/update',authenticateAdmin, async(req,res)=>{
    try{
        const email=req.email;
        const day_name=req.body;
        await deleteDaysOffViaEmail(email);
        day_name.map(async(data)=>{
            await addDaysOff(data,email);
        });
        res.status(200).json({message:"days off update successfull"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"error occured while updating days off via backend"});
    }
});

app.get('/consultant/show/appointment',authenticateAdmin,async (req,res)=>{
    try{
        const email=req.email;
        const role='consultant';
        let data=[];
        const appointmentData=await getBookedAppointmentByEmail(email,role);
        for(let i=0;i<appointmentData.length;i++){
            const userData=await getUserByEmail(appointmentData[i].user);
            data.push({appointmentData:appointmentData[i],userName:userData[0].name});
        }
        res.status(200).json({message:"fetch successfull",data:data});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong while fetching data through backend"});
    }
})


//user routes

//user login route
app.post('/login', async(req,res)=>{
    const {email,password}=req.body;
    const userData=await getUserByEmail(email);
    if(userData.length===1){
        if(userData[0].password===password&&userData[0].role==='user'){
            const token=jwt.sign({email,role:'user'},process.env.SECRET,{expiresIn:'12h'});
            res.status(200).json({message:"Login success",token:token});
        }
        else res.send(401).json({message:"wrong password"});
    }
    else res.status(401).json({message:"User does not exist"});
});

app.post('/register', async(req,res)=>{
    try{
        const{email,password,name}=req.body;
        const userData=await getUserByEmail(email);
        let userDoNotExist=false;
        if(userData.length===0) userDoNotExist=true;
        if(userDoNotExist){//add user to schema.
            await addUserData(email,name,"user",password);
            const token=jwt.sign({email,role:'user'},process.env.SECRET,{expiresIn:'12h'});
            res.status(200).json({message:"user registration successfull",token:token});
        }
        else{
            res.status(401).json({message:"user already exist"});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:"some error occured in backend while user registration"});
    }
});

app.get('/home',authenticateUser, async(req,res)=>{
    try{
        const email=req.email;
        const user=await getUserByEmail(email);
        const consultants=await getAllConsultants();
        let consultantData=[];
        consultants.map(async(data)=>{
            const name=data.name;
            const working_hours=await getWorkingHoursByEmail(data.email);
            const days_off=await getDaysOffByEmail(data.email);
            let daysOffData=[];
            days_off.map(async(data)=>{
                daysOffData=[...daysOffData,data.dayname];
            });
            const newData={
                id:data.id,
                name:name,
                opens_at:working_hours[0].opens_at,
                closes_at:working_hours[0].closes_at,
                days_off:daysOffData
            };
            consultantData.push(newData);
        })//remove set timeout by studying promise.all
        setTimeout(()=>{
            res.status(200).json({message:"data fetch successfull",data:{name:user[0].name,consultantData:consultantData}});
        },100);
        // res.status(200).json({message:"data fetch successfull",data:{name:user[0].name,consultantData:consultantData}});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"error occured in backend's home route"});
    }
})

app.get('/book/consultant-data/:id',authenticateUser,async (req,res)=>{
    try{
        const id=parseInt(req.params.id);
        const data=await getUserById(id);
        const days_off=await getDaysOffByEmail(data.email);
        let parsedDaysOff=parseDaysOff(days_off);
        res.status(200).json({message:'consultant name fetch successfull',data:{...data,days_off:parsedDaysOff}});
    }catch(err){
        console.log(err);
        res.status(500).json({message:'error occured while fetching consultant data'});
    }
})


app.post('/book/appointment',authenticateUser,async(req,res)=>{
    try{
        const id=req.body.id;
        const dateTime=req.body.dateTime;
        const recievedDate=dayjs(dateTime.split('T')[0]);
        const day=recievedDate.get('day');
        const emailObject=await getUserById(id);
        const email=emailObject.email;
        const days_off=await getDaysOffByEmail(email);
        const parsedDaysOff=parseDaysOff(days_off);
        let dayOff=false;
        for(let i=0;i<parsedDaysOff.length;i++){
            if(parsedDaysOff[i]===day){//check type of day
                dayOff=true;
                break;
            }
        }
        if(dayOff) res.status(200).json({message:'fetch succesfull',data:{dayOff:dayOff}});
        const working_hours=await getWorkingHoursByEmail(email);
        const breaks=await getBreaksByEmail(email);
        const curDate=recievedDate.format('YYYY-MM-DD');
        const todaysDate=dayjs().format('YYYY-MM-DD');
        let curTime="";
        if(curDate===todaysDate){
            curTime=dayjs().format('HH:mm');
        }
        const appointments=await getBookedAppointments(email,curDate);
        const availableSlots=getAvailableSlots(working_hours[0],breaks,appointments,curTime);
        res.status(200).json({message:'fetch successful',data:{slots:availableSlots,dayOff:dayOff}});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"some error occured in backend while fetching data for available slots"});
    }
})

app.post('/book/appointment-slot',authenticateUser,async(req,res)=>{
    try{
        const userEmail=req.email;
        const data=req.body;
        const consultantEmail=data.email;
        const start_time=data.start_time;
        const end_time=data.end_time;
        const date=data.date.split('T')[0];
        await bookAppointment(userEmail,consultantEmail,date,start_time,end_time);
        const consultantData=await getUserByEmail(consultantEmail);
        const userData=await getUserByEmail(userEmail);
        //send mail here
        const from=process.env.SENDER_MAIL;
        const to=userEmail;
        const subject=`Appointment booked with ${consultantData[0].name}`;
        const text=`
        Hey ${userData[0].name},

        Your appointment with ${consultantData[0].name} is booked on ${date} for 1 hour, starting at : ${start_time} and ending at : ${end_time}.
        
        Thankyou!`;
        // console.log(from,to,subject,text);
        await mailer(from,to,subject,text);
        res.status(200).json({message:'appointment booked'});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"some error occured in backend while booking appointment slot"});
    }
})

app.get('/show/appointment',authenticateUser,async (req,res)=>{
    try{
        const email=req.email;
        const role='user';
        let data=[];
        const appointmentData=await getBookedAppointmentByEmail(email,role);
        for(let i=0;i<appointmentData.length;i++){
            const userData=await getUserByEmail(appointmentData[i].consultant);
            data.push({appointmentData:appointmentData[i],consultantName:userData[0].name});
        }
        res.status(200).json({message:"fetch successfull",data:data});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong while fetching data through backend"});
    }
})

function parseDaysOff(days_off){
    let parsedDaysOff=[];
        for(let i=0;i<days_off.length;i++){
            if(days_off[i].dayname==='sunday') parsedDaysOff.push(0);
            else if(days_off[i].dayname==='monday') parsedDaysOff.push(1);
            else if(days_off[i].dayname==='tuesday') parsedDaysOff.push(2);
            else if(days_off[i].dayname==='wednesday') parsedDaysOff.push(3);
            else if(days_off[i].dayname==='thursday') parsedDaysOff.push(4);
            else if(days_off[i].dayname==='friday') parsedDaysOff.push(5);
            else if(days_off[i].dayname==='saturday') parsedDaysOff.push(6);
        }
        return parsedDaysOff;
}

app.listen(3000,()=>{
    console.log("server running on port 3000");
});

