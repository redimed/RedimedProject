angular.module('starter.user.services',[])
    .factory("UserService", function(Restangular){
        var userService = {};
        var userApi = Restangular.all("api");

        userService.detail = function(){
            var detailApi = userApi.one("users/loggedin");
            return detailApi.get();
        }

        userService.menu = function(id){
            var menuApi = userApi.all("menu/side");
            return menuApi.post({id:id,isWeb:false});
            return menuApi.post({id:id, isWeb:false});
        }
        userService.getFunction = function(id){
            var a = userApi.all('function/id');
            return a.post({id:id});
        }

        userService.getCompany = function(){
            var comp = userApi.one('company/list');
            return comp.get();
        }

        userService.updateProfile = function(info){
            var edit = userApi.all('users/editProfile');
            return edit.post({info:info});
        }

        userService.getUserInfo = function(id){
            var info = userApi.all('users/id');
            return info.post({id:id});
        }
        userService.getPatientMenu = function(id){
            var info = userApi.one('im/menu');
            return info.get();
        }
        userService.getPatientInCompany = function(company_id, currentRecord){
            var info = userApi.all('company/patients');
            return info.post({companyId:company_id, currentRecord:currentRecord});
        }
        userService.countPatientsInCompany = function(company_id){
            var info = userApi.all('company/countPatients');
            return info.post({companyId:company_id});
        }
        userService.getPatientbyID = function(patientID){
            var info = userApi.all('im/patients/getById');
            return info.post({id:patientID});
        }
        userService.updateWorker = function(dataPatien){
            var info = userApi.all('im/patients/update');
            return info.post({patient:dataPatien});
        }
        userService.checkOnline = function(userId){
            var checkOnline = userApi.all('user/checkOnline');
            return checkOnline.post({user_id: userId});
        }
        userService.changeUserPassword = function(info) {
        var pass = userApi.all('users/changePass');
            return pass.post({
                info: info
            });
        }

        return userService;
    })