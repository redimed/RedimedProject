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
        cancel:'Cancel',
        lateCancellation:'Late Cancellation'
    },

    // bookingStatusDisplay={
    //     'Confirmed':{display:'Confirmed'},
    //     'Arrived':{display:'Arrived'},
    //     'Not Arrived':{display:'Not Arrived'},
    //     'Completed':{display:'Completed'},
    //     'Cancel':{display:'Cancelled'},
    //     'Late Cancellation':{display:'Late Cancellation'}
    // },
    
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
        REDiLEGAL:{alias:'rlob',name:'REDiLEGAL',display:'Medico-Legal'},
        Vaccination:{alias:'vaccinob',name:'Vaccination',display:'Vaccination'}
    },

    notifyJsColor:{
        warning:'warning',
        danger:'danger',
        success:'success'
    },
    
    //chien set document Status
    //phanquocchien.c1109g@gmail.com
    /*documentStatus:{
        notConfirmed:'Not confirmed',
        checked:'Checked',
        noDocuments:'No documents'
	},*/
    documentStatus:{
        noDocuments:{value:'No documents',display:'Not Received'},
        notConfirmed:{value:'Not confirmed',display:'Not confirmed'},
        checked:{value:'Checked',display:'Received'}
    },
    documentStatusFilter:{
        noDocuments:{value:'No documents',display:'Not Received'},
        checked:{value:'Checked',display:'Received'}
    },

    documentStatusDisplay:{
        'No documents':'Not received',
        'Not confirmed':'Not confirmed',
        'Checked':'Received'

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
    userType:{
        admin : 1,
        redimed : 2,
        company : 3,
        doctor : 4,
        nurse : 5,
        driver : 6,
        assistant : 7
    },

    registerStatus:{
        PENDING:{value:'PENDING',display:'Pending',style:'success'},
        APPROVE:{value:'APPROVE',display:'Approve',style:''},
        REJECT:{value:'REJECT',display:'Reject',style:'warning'}
    },

    msgPopupType:{
        success:'success',
        error:'error'
    },
    sponsorType:{
        emergency:'EMERGENCY',
        nonemergency:'NONEMERGENCY'
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

var rlobLang={
    rlobHeader:'Medico-Legal Online Booking'
}
var rlobMsg={
    popup:function(header,type,content)
    {
        $('#rlob-global-msg-popup .rlob-global-msg-popup-header').text(header);
        if(type==rlobConstant.msgPopupType.success)
        {
            $('#rlob-global-msg-popup .rlob-global-msg-popup-success').show();
            $('#rlob-global-msg-popup .rlob-global-msg-popup-error').hide();
            $('#rlob-global-msg-popup .rlob-global-msg-popup-success .rlob-global-msg-popup-content').text(content);
        }
        if(type==rlobConstant.msgPopupType.error)
        {
            $('#rlob-global-msg-popup .rlob-global-msg-popup-error').show();
            $('#rlob-global-msg-popup .rlob-global-msg-popup-success').hide();
            $('#rlob-global-msg-popup .rlob-global-msg-popup-error .rlob-global-msg-popup-content').text(content);
        }
        $("#rlob-global-msg-popup").modal({show:true,backdrop:'static'});
    }
}


/***
* scroll den 1 id xac dinh
* @param el
* @param offeset
* tannv.dts@gmail.com
*/
var rlobScrollTo= function(selector, offeset)
{
    var el=$(selector);
    var pos = (el && el.size() > 0) ? el.offset().top : 0;

    if (el) {
        if ($('body').hasClass('page-header-fixed')) {
            pos = pos - $('.page-header').height();
        }
        pos = pos + (offeset ? offeset : -1 * el.height());
    }

    $('html,body').animate({
        scrollTop: pos
    }, 'slow');
};


