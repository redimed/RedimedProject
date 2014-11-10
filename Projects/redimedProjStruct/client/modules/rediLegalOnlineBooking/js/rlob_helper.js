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
    bellType:{
        'changeStatus':"Change Booking Status",
        'result': 'Result',
        'message': 'Message',
        'changeCalendar':'Change Appointment Calendar'},

    letterType:{
        'result':'Result'
    },

    notificationType:{
        bell:   'bell',
        letter: 'letter'
    },

    bookingType:{

        REDiLEGAL:{alias:'rlob',name:'REDiLEGAL'},
        Vaccination:{alias:'vaccinob',name:'Vaccination'}
    },

    notifyJsColor:{
    warning:'warning',
    danger:'danger',
    success:'success'
    }
}

var exlog={
    alert:function(data)
    {
        alert(JSON.stringify(data));
    },
    log:function(data)
    {
        console.log(data);
    }
}
