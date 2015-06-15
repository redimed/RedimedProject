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
        securityService.getLocationsFilter = function(){
            var getLF = securityApi.one('rlob/redimedsites/list');
            return getLF.get();
        }
        securityService.getRlSpecialtiesFilter = function(){
            var getTF = securityApi.one('rlob/cln_specialties/list');
            return  getTF.get();
        }
        securityService.getDoctorsFilter =  function(){
            var getDF = securityApi.one('rlob/doctors/get-doctors-for-source-type');
            return getDF.get();
        }
        securityService.getApointmentCalendar = function(specialityId,doctorId,locationId,fromTime){
            var getAC = securityApi.one('rlob/appointment-calendar/get-appointment-calendar');
            return getAC.get({Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime});

        }

        return securityService;
    })