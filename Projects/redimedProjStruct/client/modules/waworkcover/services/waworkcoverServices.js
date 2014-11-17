/**
 * Created by Minh on 11/5/2014.
 */
angular.module('app.loggedIn.waworkcover.services',[

])
    .factory('waworkcoverService',function(Restangular){
        var waworkcoverService = {};
        var waworkcoverapi = Restangular.all("api/erm");

        waworkcoverService.insertFirst = function(data){
            var insertFirstapi = waworkcoverapi.all("v1/wa/workcover/first/insert_as");
            return insertFirstapi.post(data);
        };

        waworkcoverService.editFirst = function(data){
            var editFirstapi = waworkcoverapi.all("v1/wa/workcover/first/edit_as");
            return editFirstapi.post(data);
        };

        waworkcoverService.test = function(){
            console.log('Testing completed! Service is running!');

        };

        waworkcoverService.getCompanyFromPatient = function(company_id){
            var getCompany = waworkcoverapi.all("company/getDetail");
            return getCompany.post({'company_id': company_id});
        }

        waworkcoverService.getFirstAssess = function(data){
           var getFirstAsessapi = waworkcoverapi.all("v1/wa/workcover/first/select_as");
            return getFirstAsessapi.post(data);
        };

        waworkcoverService.insertProgress = function(data){
            var insertProgressapi = waworkcoverapi.all("v1/wa/workcover/progress/insert_as");
            return insertProgressapi.post(data);
        };

        waworkcoverService.getProgressAssess = function(data){
            var getProgressAssessapi = waworkcoverapi.all("v1/wa/workcover/progress/select_as");
            return getProgressAssessapi.post(data);
        };

        waworkcoverService.editProgress = function(data){
            var editProgressapi = waworkcoverapi.all("v1/wa/workcover/progress/edit_as");
            return editProgressapi.post(data);
        };

        waworkcoverService.insertFinal = function(data){
            var insertFinalapi = waworkcoverapi.all("v1/wa/workcover/final/insert_as");
            return insertFinalapi.post(data);
        };

        waworkcoverService.getFinalAssess = function(data){
            var getFinalAssessapi = waworkcoverapi.all("v1/wa/workcover/final/select_as");
            return getFinalAssessapi.post(data);
        };
        waworkcoverService.editFinal = function(data){
            var editFinalapi = waworkcoverapi.all("v1/wa/workcover/final/edit_as");
            return editFinalapi.post(data);
        };

        return waworkcoverService;
    })
;
