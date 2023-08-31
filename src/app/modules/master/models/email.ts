export interface Email{
    id:string;
    to:string[];
    cc:string[];
    subject:string;
    dateTime:string;
    timeZone:string;
    body:string; 
    jobGroup:string;
    description:string;
    startTime:string;
    status:string;
    jobId:string;
    message:string;
    triggerName:string;
    jobName:string;
    file:string;
}