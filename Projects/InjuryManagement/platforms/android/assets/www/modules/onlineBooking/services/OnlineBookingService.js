/**
 * Created by meditech on 24/09/2014.
 */
angular.module('starter.booking.services',[])
.factory('OnlineBookingService',function(Restangular){
        var bookingService = {};
        var api = Restangular.all('api');

        bookingService.getSubCompany = function(id){
            var sub = api.all('company/sub');
            return sub.post({id:id});
        }

        bookingService.getSubCompanyInfo = function(id){
            var sub = api.all('company/info');
            return sub.post({comId:id});
        }


        bookingService.getPackage = function(id){
            var package = api.all('booking/packageList');
            return package.post({id:id});
        }

        bookingService.insertPackage = function(name,comId){
            var insert = api.all('package/insert');
            return insert.post({name:name,comId:comId});
        }

        bookingService.insertPackAss = function(id,packId){
            var insert = api.all('package/assessment/insert');
            return insert.post({id:id,packId:packId});
        }



        bookingService.insertPos = function(name,comId){
            var insert = api.all('booking/position/insert');
            return insert.post({name:name,comId:comId});
        }

        bookingService.getPackageAssById = function(id){
            var ass = api.all('package/assessment/id');
            return ass.post({id:id});
        }

        bookingService.getPackageAss = function(){
            var ass = api.one('package/assessment');
            return ass.get();
        }

        bookingService.getAssPrice = function(id){
            var ass = api.all('assessment/price');
            return ass.post({id:id});
        }

        bookingService.updatePackAss = function(oldId,newId,packId){
            var ass = api.all('package/assessment/update');
            return ass.post({oldId:oldId,newId:newId,packId:packId});
        }

        bookingService.removePackAss = function(id,packid){
            var del = api.all('package/assessment/delete');
            return del.post({id:id,packId:packid});
        }

        bookingService.getBookingList = function(id){
            var list = api.all('booking/list/companyId');
            return list.post({id:id});
        }

        bookingService.getBookingDetail = function(id,canId){
            var detail = api.all('booking/detail');
            return detail.post({id:id,canId:canId});
        }

        bookingService.cancelBooking = function(id){
            var cancel = api.all('booking/cancel');
            return cancel.post({id:id});
        }

        bookingService.getSite = function(){
            var site = api.one('redimedsite/list');
            return site.get();
        }

        bookingService.getCalendar = function(id,from,to){
            var cal = api.all('booking/calendar');
            return cal.post({siteId:id,fromDate:from,toDate:to});
        }

        bookingService.getAppointmentTime = function(id){
            var time = api.all('booking/appointmentTime');
            return time.post({id:id});
        }

        bookingService.changeBookingTime = function(siteId,from,to,calId,appTime,bookId){
            var submit = api.all('booking/changeBookingTime');
            return submit.post({siteId:siteId,from:from,to:to,calId:calId,appTime:appTime, bookId:bookId});
        }

        bookingService.deletePackage = function(id,comId){
            var delPackage = api.all('booking/delete/package');
            return delPackage.post({id:id,comId:comId});
        }

        bookingService.getAssList = function(){
            var assList = api.one('booking/assList');
            return assList.get();
        }

        bookingService.getPositionList = function(comId){
            var position = api.all('booking/position/list');
            return position.post({comId:comId});
        }

        bookingService.deletePosition = function(name,comId){
            var del = api.all('booking/position/delete');
            return del.post({name:name,comId:comId});
        }

        bookingService.submitBook = function(info,head){
            var submit = api.all('booking/submit');
            return submit.post({info:info,header:head});
        }

        bookingService.pendingCalendar = function(info){
            var submit = api.all('booking/pending');
            return submit.post({info:info});
        }

        bookingService.deleteAllPending = function(){
            var del = api.all('booking/delete/allPending')
            return del.post();
        }

        bookingService.deletePending = function(info){
            var del = api.all('booking/delete/pending');
            return del.post({info:info});
        }


        bookingService.getUserByCompany = function(comId){
            var user = api.all('users/company');
            return user.post({comId:comId});
        }

        bookingService.insertNewUser = function(info){
            var user = api.all('users/insert');
            return user.post({info:info});
        }

        bookingService.getUserInfo = function(id){
            var user = api.all('users/id');
            return user.post({id:id});
        }

        bookingService.editUserInfo = function(info){
            var user = api.all('users/edit');
            return user.post({info:info});
        }

        bookingService.changeUserPassword = function(info){
            var pass = api.all('users/changePass');
            return pass.post({info:info});
        }

        bookingService.getSiteState = function(id){
            var state = api.all('redimedsite/state');
            return state.post({id:id});
        }

        bookingService.getStateSuburb = function(id){
            var suburb = api.all('redimedsite/state/suburb');
            return suburb.post({id:id});
        }


        bookingService.customPackage = function(id){
            var pack = api.all('package/custom');
            return pack.post({id:id});
        }

        bookingService.searchBooking = function(info){
            var search = api.all('booking/search');
            return search.post({info:info});
        }

        bookingService.updateNote = function(info){
            var note = api.all('booking/edit/note');
            return note.post({info:info});
        }

        bookingService.exportExcel = function(){
            var ex = api.one('booking/export');
            return ex.get();
        }
        bookingService.getLocationsFilter = function(){
            var getLF = api.one('rlob/redimedsites/list');
            return getLF.get();
        }
        bookingService.getRlSpecialtiesFilter = function(){
            var getTF = api.one('rlob/cln_specialties/list');
            return  getTF.get();
        }
        bookingService.getDoctorsFilter =  function(){
            var getDF = api.one('rlob/doctors/get-doctors-for-source-type');
            return getDF.get();
        }
        bookingService.getApointmentCalendar = function(specialityId,doctorId,locationId,fromTime){
            var getAC = api.one('rlob/appointment-calendar/get-appointment-calendar');
            return getAC.get({Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime});

        }
        bookingService.getInfoLocation = function(locationId){
            var getIL = api.all('redimedsite/info');
            return getIL.post({id:locationId});

        }
        bookingService.submitBooking = function(infoBooking){
            var postSB = api.all('im/submit');
            return postSB.post({info:infoBooking});
        }



        return bookingService;
    })