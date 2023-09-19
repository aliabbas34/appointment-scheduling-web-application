function parseData(data){
    let parsedData=[];
    for(let i=0;i<data.length;i++){
        parsedData.push({
            st:data[i].start_time,
            et:data[i].end_time
        });
    }
    return parsedData;
}

export function getAvailableSlots(workingHours,Breaks,bookedAppointments,curTime){
    
const breaks=parseData(Breaks);
const working_hours={st:workingHours.opens_at,et:workingHours.closes_at};
const appointmentBooked=parseData(bookedAppointments);

//converting breaks to minutes
const breaksInMinutes=[];
breaks.map((data,index)=>{
    const stMins=convertToMinutes(data.st);
    const etMins=convertToMinutes(data.et);
    breaksInMinutes.push({st:stMins,et:etMins});
});

//adding first slot by converting working hours to minutes.
let slots=[];
const workingHoursInMinutes={
    st:convertToMinutes(working_hours.st),
    et:convertToMinutes(working_hours.et)
}
slots.push(workingHoursInMinutes);

//making slots by eliminating breaks from working hours
for(let i=0;i<breaksInMinutes.length;i++){
    const bst=breaksInMinutes[i].st; //break start time
    const bet=breaksInMinutes[i].et; //break end time
    for(let j=0;j<slots.length;j++){
        const sst=slots[j].st; //slot start time
        const sett=slots[j].et; //slot end time
        if(bst>=sst&&bet<=sett){
            if(bst===sst&&bet<sett){
                slots[j].st=bet;
            }
            else if(bst>sst&&bet===sett){
                slots[j].et=bst;
            }
            else if(bst>sst&&bet<sett){
                let newEt=sett;
                slots[j].et=bst;
                slots.push({st:bet,et:newEt});
            }
            else{
                slots.splice(j,j);
            }
        }
    }
}

//making one hour slots
for(let i=0;i<slots.length;i++){
    const et=slots[i].et;
    let newEt=slots[i].st+60;
    slots[i].et=newEt;
    newEt=newEt+60;
    while(newEt<=et){
        const stt=newEt-60;
        slots.push({st:stt,et:newEt});
        newEt=newEt+60;
        
    }
}

//sorting minutes
slots.sort((a,b)=>{
    return a.st-b.st;
});

if(curTime){
    const currentTime=convertToMinutes(curTime);
    slots=slots.filter((data)=>{
        let result=true;
        if(data.st<=currentTime) result=false;
        return result;
    });
}

//converting minutes into HH:MM format
let slotsInHour=[];
for(let k=0;k<slots.length;k++){
    const entry={
        start_time:convertToString(slots[k].st),
        end_time:convertToString(slots[k].et)
    }
    slotsInHour.push(entry);
}
console.log(slotsInHour,"slots in hour");
console.log(appointmentBooked,"appointments booked so far");
//filtering out available slots.
const availableSlots=slotsInHour.filter((dataOne)=>{
    let ans=true;
    appointmentBooked.map((dataTwo)=>{
        if(dataOne.start_time===dataTwo.st&&dataOne.end_time===dataTwo.et){
            ans=false;
        }
    });
    return ans;
});
console.log(availableSlots,"available slots");
return availableSlots;

}

//convert time given in HH:MM format to minutes.
function convertToMinutes(time){
    const arr=time.split(":");
    const hour=parseInt(arr[0]);
    const mins=parseInt(arr[1]);
    const minutes=hour*60+mins;
    return minutes;
}
//convert given minutes into time format HH:MM
function convertToString(minutes){
    //by dividing with 60 we can get a decimal value, value before decimal is hour and after decimal is minutes.
    //so we have to parse that accordingly.
    const calc=minutes/60;
    //check whether it is decimal or not
    let isDecimal=true;
    if((calc*10)%10===0) isDecimal=false;
    if(isDecimal){
        const str=calc.toString();
        const arr=str.split('.');
        //removing decimal from the decimal part.
        const len=arr[1].length;
        let divisor="1";
        for(let i=0;i<len;i++) divisor+="0";
        const divisorInt=parseInt(divisor);
        const minutes=Math.round((parseInt(arr[1])/divisorInt)*60);
        const hour=arr[0];
        const ansString=hour+":"+minutes;
        return ansString;
    }
    else{
        const ansString=calc.toString()+":00";
        return ansString;
    }
}