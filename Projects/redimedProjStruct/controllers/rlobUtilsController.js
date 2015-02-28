/**
 * Created by meditech on 11/14/2014.
 */
module.exports =
{
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
    }    
}