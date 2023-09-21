import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SENDER_MAIL,
        pass:process.env.MAIL_PASS
    }
});

export async function mailer(from,to,subject,text){
    let mailData={
        from:`${from}`,
        to:`${to}`,
        subject:`${subject}`,
        text:`${text}`
    }
    const info=await transporter.sendMail(mailData,(err,info)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Message sent: %s", info.messageId);
        }
    });
}

// mailer('captorcaptor36@gmail.com','aliabbas7317@gmail.com','Testing with arguments','check text');