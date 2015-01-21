/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.im.services",[])
    .factory("InjuryManagementService",function(Restangular){
        var imService = {};
        var api = Restangular.all("api");

       imService.getInjuryList = function(){
            return api.one('im/list').get();
        }

        imService.searchInjury = function(info){
            return api.all('im/search').post({info:info});
        }

        imService.getInjuryById = function(id){
            return api.all('im/getById').post({injury_id:id});
        }

        imService.getImageByInjury = function(id){
            return api.all('im/images').post({injury_id:id});
        }

        imService.listDriver = function(){
            return api.one('im/getListDriver').get();
        }

        imService.allocateDriver = function(dId,pId,iId){
            return api.all('im/allocateDriver').post({driverId:dId,patientId:pId,injuryId:iId});
        }

        imService.getOnlineUsers = function(){
            return api.one('im/getOnlineUsers').get();
        }

        return imService;
    })