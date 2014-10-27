/**
 * Created by meditech on 9/21/2014.
 * Require: Cmoment.min.js
 */

var rlobHelper={
    setSlimCroll:function(selector)
    {
        $(selector).slimscroll({});
    }
}

var rlobConstant={
    rlobNotificationType:{
        'changeStatus':"Change Booking Status",
        'result': 'Result',
        'message': 'Message',
        'changeCalendar':'Change Appointment Calendar'},

    notificationType:{
        bell:   'bell',
        letter: 'letter'
    },

    bookingType:{

        REDiLEGAL:{alias:'rlob',name:'REDiLEGAL'},
        Vaccination:{alias:'vaccinob',name:'Vaccination'}
    }
}
