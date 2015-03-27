/**
 * Created by meditech on 11/14/2014.
 */
var isTestSendMail=false;
module.exports =
{
    userRegisterType:'Company',
    
    isTestSendMail:isTestSendMail,

    getMailSender:function()
    {
        if(isTestSendMail)
        {
            return "REDiMED <vnlegal123@gmail.com>";
        }
        else
        {
            return "REDiMED <healthscreenings@redimed.com.au>";
        }
    },

    getMedicoLegalMailSender:function()
    {
        if(isTestSendMail)
        {
            return "REDiMED <vnlegal123@gmail.com>";
        }
        else
        {
            return "Health Screening Mailbox <medicolegal@redimed.com.au>";
        }
    },

    fulltext:function(str)
    {
        return '%'+str+'%';
    },

    sourceType:{
        REDiLEGAL:'REDiLEGAL',
        Vaccination:'Vaccination'
    },

    notificationAppearance:{
        once:'ONCE',
        whenAccess:'WHEN ACCESS'
    },

    bookingStatus:{
        confirmed:'Confirmed',
        arrived:'Arrived',
        notArrived:'Not Arrived',
        completed:'Completed',
        canel:'Cancel'
    },

    redilegalServiceId:7,

    calendarStatus:{
        noAppointment:'No Appointment',
        booked:'BOOKED'
    },

    registerStatus:{
        pending:'PENDING',
        approve:'APPROVE',
        reject:'REJECT'
    }
}