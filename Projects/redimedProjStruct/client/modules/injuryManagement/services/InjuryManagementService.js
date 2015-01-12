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

        imService.getInjuryById = function(id){
            return api.all('im/getById').post({injury_id:id});
        }

        imService.getImageByInjury = function(id){
            return api.all('im/images').post({injury_id:id});
        }

        return imService;
    })