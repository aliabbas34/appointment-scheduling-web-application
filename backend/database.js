import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise();

export async function addUserData(email,name,role,password){
    await pool.query(`
    INSERT INTO user(email,name,role,password)
    VALUES(?,?,?,?)
    `,[email,name,role,password]);
}

export async function addWorkingHours(email,opens_at,closes_at){
    await pool.query(`
    INSERT INTO working_hours(email,opens_at,closes_at)
    VALUES(?,?,?)
    `,[email,opens_at,closes_at]);
}

export async function addBreaks(break_title,email,start_time,end_time){
    await pool.query(`
    INSERT INTO breaks(break_title,email,start_time,end_time)
    VALUES(?,?,?,?)
    `,[break_title,email,start_time,end_time]);
}

export async function addDaysOff(day_name,email){
    await pool.query(`
    INSERT INTO days_off(dayname,email)
    VALUES(?,?)
    `,[day_name,email]);
}

export async function getUserByEmail(email){
    const result= await pool.query(`
    SELECT * FROM user WHERE email=?
    `,[email]);
    return result[0];
}

export async function getAllDataByEmail(email){
    const userData=await getUserByEmail(email);
    const workingHoursData=await getWorkingHoursByEmail(email);
    const breaksData=await getBreaksByEmail(email);
    const daysOffData=await getDaysOffByEmail(email);
    const alldata={userData,workingHoursData,breaksData,daysOffData};
    return alldata;
}

export async function getWorkingHoursByEmail(email){
    const result=await pool.query(`
    SELECT * FROM working_hours WHERE email=?
    `,[email]);
    return result[0];
}

export async function updateWorkinHours(opens_at,closes_at,email){
    await pool.query(`
    UPDATE working_hours SET opens_at=? , closes_at=? WHERE email=?
    `,[opens_at,closes_at,email]);
}

export async function getBreaksByEmail(email){
    const result=await pool.query(`
    SELECT * FROM breaks WHERE email=?
    `,[email]);
    return result[0];
}

export async function getDaysOffByEmail(email){
    const result=await pool.query(`
    SELECT * FROM days_off WHERE email=?
    `,[email]);
    return result[0];
}

export async function deleteBreakById(id){
    await pool.query(`DELETE FROM breaks WHERE id=?`,[id]);
}

export async function updateBreakById(id,break_title,start_time,end_time){
    await pool.query(`UPDATE breaks SET break_title=?,start_time=?,end_time=?`,[break_title,start_time,end_time]);
}

export async function deleteDaysOffViaEmail(email){
    await pool.query(`DELETE FROM days_off WHERE email=?`,[email]);
}

export async function getAllConsultants(){
    const consultant = await pool.query("SELECT name,email,id FROM user WHERE role='consultant'");
    return consultant[0];
}

export async function getUserById(id){
    const data=await pool.query(`SELECT name,email FROM user WHERE id=?`,[id]);
    return data[0][0];
}

export async function getBookedAppointments(email,date){
    const data=await pool.query(`
    SELECT start_time,end_time FROM appointment
    Where consultant=? AND date=?
    `,[email,date]);
    return data[0];
}

export async function bookAppointment(userEmail,consultantEmail,date,start_time,end_time){
    try{
        await pool.query(`
        INSERT INTO appointment(user,consultant,date,start_time,end_time)
        VALUES(?,?,?,?,?)
        `,[userEmail,consultantEmail,date,start_time,end_time])
    }catch(err){
        console.log(err);
    }
}

// const result =await getBookedAppointments('test1@mail.com','2023-09-19');
// console.log(result);

// const result =await pool.query('SELECT * FROM appointment');
// console.log(result);

