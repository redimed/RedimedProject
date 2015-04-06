/**
 * Created by meditech on 11/14/2014.
 */
var isTestSendMail=true;
module.exports =
{
    //Neu user la cua redilegal thi function co id= rlobFirstScreenFunctionId duoc chon lam man hinh chinh
    //tannv.dts@gmail.com
    rlobFirstScreenFunctionId:22,
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
            return "MEDICO-LEGAL <vnlegal123@gmail.com>";
        }
        else
        {
            return "MEDICO-LEGAL <healthscreenings@redimed.com.au>";
        }
    },

    getMedicoLegalMailSender:function()
    {
        if(isTestSendMail)
        {
            return "MEDICO-LEGAL <vnlegal123@gmail.com>";
        }
        else
        {
            return "MEDICO-LEGAL <healthscreenings@redimed.com.au>";
            //return "MEDICO-LEGAL <medicolegal@redimed.com.au>";
        }
    },

    getMedicoLegalCC:function()
    {
        if(isTestSendMail)
        {
            return "MEDICO-LEGAL <vnlegal123@gmail.com>";
        }
        else
        {
            return "MEDICO-LEGAL <medicolegal@redimed.com.au>";
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
        canel:'Cancel',
        lateCancellation:'Late Cancellation'
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
    },

    documentStatus:{
        noDocuments:'No documents',
        notConfirmed:'Not confirmed',
        checked:'Checked'
    },
}