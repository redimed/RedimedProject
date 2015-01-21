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
    bookingStatus:{
        confirmed:'Confirmed',
        arrived:'Arrived',
        notArrived:'Not Arrived',
        completed:'Completed',
        canel:'Cancel'
    },
    
    bellType:{
        'changeStatus':"Change Booking Status",
        'result': 'Result',
        'message': 'Message',
        'changeCalendar':'Change Appointment Calendar',
        'notification':'Notification'
    },

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
    },
    
    //chien set document Status
    //phanquocchien.c1109g@gmail.com
    documentStatus:{
        notConfirmed:'Not confirmed',
        checked:'Checked',
        noDocuments:'No documents'
	},

    documentStatusSummaryStyleClass:{
        notConfirmed:'booking-item document-status-not-confirmed',
        checked:'booking-item document-status-checked',
        noDocuments:'booking-item document-status-no-documents'
    },

    notificationAppearance:{
        once:'ONCE',
        whenAccess:'WHEN ACCESS'
    },
    uersType:{
        admin : 2,
        doctor : 4,
        assistant : 1
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

var rlobDate={
    daysOfWeek:
        [
            {value:0,alias:'sun',display:'Sunday'},
            {value:1,alias:'mon',display:'Monday'},
            {value:2,alias:'tue',display:'Tueday'},
            {value:3,alias:'wed',display:'Wednesday'},
            {value:4,alias:'thu',display:'Thursday'},
            {value:5,alias:'fri',display:'Friday'},
            {value:6,alias:'sat',display:'Saturday'}
        ],

    /**
     * tannv.dts@gmail.com
     * @param date: javascript primary Date type
     * return moment Date()
     */
    getDateStartWeek:function(date)
    {
        var dayValue=date.getDay();
        return moment(date).add((1-dayValue),'days');
    },


    getDateEndWeek:function(date)
    {
        var dayValue=date.getDay();
        return moment(date).add((6-dayValue),'days');
    }
}




