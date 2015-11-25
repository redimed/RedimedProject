angular.module('starter.security.services',[])
    .factory("SecurityService", function(Restangular){
        var securityService = {};
        var securityApi = Restangular.all("api");
        securityService.dataSuccess = {};
        securityService.login = function(options){
            var loginApi = securityApi.all("phUser/login");
            return loginApi.post(options);
        }
        //insert emergency
        securityService.insertEmergency=function(info)
        {
            var result=securityApi.all('rlob/sponsor/insert-emergency');
            return result.post({info:info});
        }
        
        //insert nonemergency
        securityService.insertNonEmergency=function(info)
        {
            var result=securityApi.all('rlob/sponsor/insert-nonemergency');
            return result.post({info:info});
        }
        securityService.getLocationsFilter = function(date,serviceId){
            var getLF = securityApi.all('rlob/redimedsites/list-mobile');
            return getLF.post({date:date,serviceId:serviceId});
        }
        securityService.getRlSpecialtiesFilter = function(){
            var getTF = securityApi.one('rlob/cln_specialties/list');
            return  getTF.get();
        }
        securityService.getDoctorsFilter =  function(date,serviceId){
            var getDF = securityApi.all('rlob/doctors/get-doctors-for-source-type-mobile');
            return getDF.post({date:date,serviceId:serviceId});
        }
        securityService.getApointmentCalendar = function(specialityId,doctorId,locationId,fromTime,serviceId){
            var getAC = securityApi.one('rlob/appointment-calendar/get-appointment-calendar-mobile');
            return getAC.get({DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime,serviceId:serviceId});

        }

        return securityService;
    })