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

var dayOfWeek={
    '0':{value:'0',display:'Sunday'},
    '1':{value:'1',display:'Monday'},
    '2':{value:'2',display:'Tueday'},
    '3':{value:'3',display:'Wednesday'},
    '4':{value:'4',display:'Thursday'},
    '5':{value:'5',display:'Friday'},
    '6':{value:'6',display:'Saturday'}

}


