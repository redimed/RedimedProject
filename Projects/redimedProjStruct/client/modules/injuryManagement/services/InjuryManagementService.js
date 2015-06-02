/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.patient.injuryManagement.services",[])
    .factory("InjuryManagementService",function(Restangular){
        var imService = {};
        var api = Restangular.all("api");

       imService.getInjuryList = function(){
            return api.one('im/list').get();
        }

        imService.getInjuryListByPatient = function(patient_id){
            return api.all('im/listByPatient').post({patient_id:patient_id});
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

        imService.searchByDate = function(from,to){
            return api.all('im/searchByDate').post({from:from,to:to});
        }

        imService.searchByDatePatient = function(from,to,patient_id){
            return api.all('im/searchByDatePatient').post({from:from,to:to,patient_id:patient_id});
        }

        imService.getMedicalDevices = function(){
            return api.one('im/getDevices').get();
        }

        imService.getDeviceDataByPatient = function(id,patientId){
            return api.all('medicalDevice/getData').post({id:id,patient_id:patientId});
        }

        imService.editDeviceMeasure = function(info,id){
            return api.all('medicalDevice/edit').post({id:id,info:info});
        }

        return imService;
    })