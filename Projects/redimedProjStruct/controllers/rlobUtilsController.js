/**
 * Created by meditech on 11/14/2014.
 */
var isTestSendMail=true;
module.exports =
{
    //Khoang thoi gian mac dinh cua 1 phien kham benh
    periodTimeDefault:30,
    //Khoang thoi gian kham benh cua cac rlType
    periodTimeOfRlType:{
        2:{value:45,desc:'IME'},
        1:{value:30,desc:'PI'}
    },

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