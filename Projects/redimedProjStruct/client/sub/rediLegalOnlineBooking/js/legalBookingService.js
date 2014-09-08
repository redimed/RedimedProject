/**
 * Created by meditech on 8/29/2014.
 */

app.service("locationService", function () {
    var items=[];
    this.allSync=function(){return items};
    this.getLocationById=function(id){
        var item={};
        for(var i=0;i<items.length;i++)
        {
            if(items[i].id==id)
            {
                item=items[i];
            }
        }
        return item;
    }
})

app.service("rlTypesService", function () {
    var types=[] ;
    this.allSync=function(){return types};
});

app.service('clnSpecialitiesService',function(){
    var items=[] ;
    this.allSync=function(){return items};
    this.getSpecialitiesForType=function(type)
    {
        var itemsOfType=[];
        for(var i=0;i<items.length;i++)
        {
            if(items[i].RL_TYPE_ID==type)
            {
                itemsOfType.push(items[i]);
            }
        }
        return itemsOfType;
    }
});

app.service('doctorsService',function(){
    var items=[];
    this.allSync=function(){return items};
    this.getDoctorForSpeciality=function(speciality)
    {
        var itemsOfSpeciality=[];
        for(var i=0;i<items.length;i++)
        {
            if(items[i].Specialties_id==speciality)
            {
                itemsOfSpeciality.push(items[i]);
            }
        }
        return itemsOfSpeciality;
    }
    this.getDoctorById=function(id)
    {
        var item={};
        for(var i=0;i<items.length;i++)
        {
            if(items[i].doctor_id==id)
            {
                item=items[i];
            }
        }
        return item;
    }
});

app.service('appointmentCalendarService',function(){
    var items=[] ;
    var selectedItem={};
    this.allSync=function(){return items};
    this.getAppointmentById=function(id)
    {
        var item={};
        for(var i=0;i<items.length;i++)
        {
            if(items[i].CAL_ID==id)
            {
                item=items[i];
                break;
            }
        }
        return item;
    }
    this.setSelectedItem=function(appointment){
        selectedItem=appointment;
    }
    this.getSelectedItem=function(){
        return selectedItem;
    }
});

app.service('bookingService',function(){
    var selectedInfo={};
    this.getSelectedInfo=function(){
        return selectedInfo;
    }
});

app.service('loginService',function(){
    var user={};
    this.getUser=function(){
        return user;
    }

});
