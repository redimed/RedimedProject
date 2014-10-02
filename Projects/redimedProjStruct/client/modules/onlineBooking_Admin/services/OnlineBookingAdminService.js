/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin.services',[])
    .factory('OnlineBookingAdminService',function(Restangular) {
        var adminBooking = {};
        var api = Restangular.all('api');

        adminBooking.getList = function(){
            var list = api.one('booking/list');
            return list.get();
        }

        adminBooking.editBookingInfo = function(info){
            var edit = api.all('booking/edit');
            return edit.post({info:info});
        }

        adminBooking.confirmBooking = function(info){
            var confirm = api.all('booking/confirm');
            return confirm.post({info:info});
        }

        adminBooking.getAssHeader = function(){
            var head = api.one('assessment/header');
            return head.get();
        }

        adminBooking.getAssessment = function(){
            var a = api.one('assessment');
            return a.get();
        }

        adminBooking.deleteHeaderAssessment = function(id){
            var del = api.all('assessment/header/remove');
            return del.post({id:id});
        }

        adminBooking.addNewHeaderAssessment = function(info){
            var add = api.all('assessment/header/insert');
            return add.post({info:info});
        }

        adminBooking.deleteAssessment = function(id){
            var del = api.all('assessment/remove');
            return del.post({id:id});
        }

        adminBooking.addNewAssessment = function(info){
            var add = api.all('assessment/insert');
            return add.post({info:info});
        }

        adminBooking.getCompanyList = function(){
            var list = api.one('company/list');
            return list.get();
        }

        adminBooking.getSubCompany = function(id){
            var sub = api.all('company/sub');
            return sub.post({id:id});
        }

        adminBooking.getCompanyInfo = function(id){
            var sub = api.all('company/info');
            return sub.post({comId:id});
        }

        return adminBooking;
})