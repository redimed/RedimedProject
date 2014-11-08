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

        adminBooking.updateAssessment = function(info){
            var add = api.all('assessment/edit');
            return add.post({info:info});
        }

        adminBooking.getAssessmentInfo = function(id)
        {
            var a = api.all('assessment/info');
            return a.post({id:id});
        }

        adminBooking.updatePrice = function(){
            var a = api.all('assessment/updatePrice');
            return a.post();
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

        adminBooking.insertNewCompany = function(info){
            var add = api.all('company/insert');
            return add.post({info:info});
        }

        adminBooking.editCompanyInfo = function(info){
            var edit = api.all('company/edit');
            return edit.post({info:info});
        }

        adminBooking.getListUser = function(){
            var list = api.one('users/list');
            return list.get();
        }

        adminBooking.getListCompany = function(){
            var list = api.one('company/list');
            return list.get();
        }

        adminBooking.getListFunction = function(){
            var list = api.one('function/list');
            return list.get();
        }

        adminBooking.getListEmployee = function(){
            var list = api.one('users/employee/list');
            return list.get();
        }

        adminBooking.insertNewUser = function(info){
            var user = api.all('users/insert');
            return user.post({info:info,isReg: false});
        }

        adminBooking.getSiteList = function(){
            var list = api.one('redimedsite/list');
            return list.get();
        }

        adminBooking.getSiteInfo = function(id){
            var info = api.all('redimedsite/info');
            return info.post({id:id});
        }

        adminBooking.insertNewSite = function(info){
            var insert = api.all('redimedsite/insert');
            return insert.post({info:info});
        }

        adminBooking.editSiteInfo = function(info){
            var edit = api.all('redimedsite/edit');
            return edit.post({info:info});
        }

        adminBooking.getCalendarBySiteId = function(id){
            var info = api.all('calendar/siteId');
            return info.post({id:id});
        }

        adminBooking.getCalendarById = function(id){
            var info = api.all('calendar/id');
            return info.post({id:id});
        }

        adminBooking.submitNewCalendar = function(info){
            var submit = api.all('calendar/submit');
            return submit.post({info:info});
        }

        adminBooking.getUserMenu = function(id){
            var list = api.all('users/menu');
            return list.post({id:id});
        }

        adminBooking.getMenuList = function(){
            var list = api.one('menu/list/root');
            return list.get();
        }

        adminBooking.getUserMenuDetails = function(id){
            var detail = api.all('users/menu/details');
            return detail.post({id:id});
        }

        adminBooking.editUserMenu = function(info){
            var edit = api.all('users/menu/edit');
            return edit.post({info:info});
        }

        adminBooking.insertUserMenu = function(info){
            var insert = api.all('users/menu/insert');
            return insert.post({info:info});
        }

        adminBooking.getStateById = function(id){
            var state = api.all('redimedsite/state/id');
            return state.post({id:id});
        }

        adminBooking.getSuburbById = function(id){
            var suburb = api.all('redimedsite/state/suburb/id');
            return suburb.post({id:id});
        }

        adminBooking.editStateInfo = function(info){
            var edit = api.all('redimedsite/state/edit');
            return edit.post({info:info});
        }

        adminBooking.editSuburbInfo = function(info){
            var edit = api.all('redimedsite/state/suburb/edit');
            return edit.post({info:info});
        }

        adminBooking.insertState = function(info){
            var insert = api.all('redimedsite/state/insert');
            return insert.post({info:info});
        }

        adminBooking.insertSuburb = function(info){
            var insert = api.all('redimedsite/state/suburb/insert');
            return insert.post({info:info});
        }

        return adminBooking;
})