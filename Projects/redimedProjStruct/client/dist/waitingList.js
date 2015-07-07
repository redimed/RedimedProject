angular.module("app.loggedIn.waitingList",["app.loggedIn.waitingList.include"]),angular.module("app.loggedIn.waitingList.include",["app.loggedIn.waitingList.models","app.loggedIn.waitingList.directives.add","app.loggedIn.waitingList.directives.list"]),angular.module("app.loggedIn.waitingList.models",[]).factory("WaitingListModel",function(Restangular){var mainModel={},mainApi=Restangular.all("api/meditek/v1/waitingList");return mainModel.add=function(data){var instanceApi=mainApi.all("add");return instanceApi.post({data:data})},mainModel.list=function(data){var instanceApi=mainApi.all("list");return instanceApi.post({data:data})},mainModel.remove=function(data){var instanceApi=mainApi.all("remove");return instanceApi.post({data:data})},mainModel}),angular.module("app.loggedIn.waitingList.directives.add",[]).directive("waitingListAdd",function($modal,WaitingListModel,ConfigService,$cookieStore,OutreferralModel,PatientService){return{restrict:"EA",scope:{success:"=",doctorId:"=",patientId:"="},templateUrl:"modules/waitingList/directives/templates/add.html",link:function(scope,elem,attrs){scope.priorities=[{key:"high",value:"High"},{key:"normal",value:"Normal"},{key:"low",value:"Low"}];var user_id=$cookieStore.get("userInfo").id,model={doctor_id:null,Patient_id:null,priority:null,reason:null,Created_by:user_id};scope.$watch("doctorId",function(doctorId){if("undefined"!=typeof doctorId){var postData=doctorId;OutreferralModel.DotorFromUserId(postData).then(function(response){scope.waitingList.model.doctor_id=response.data[0].doctor_id,scope.doctor.name=response.data[0].NAME},function(error){})}}),scope.$watch("patientId",function(patientId){"undefined"!=typeof patientId&&PatientService.get(patientId).then(function(response){scope.waitingList.model.Patient_id=response.data.Patient_id,scope.patient.name=response.data.First_name+" "+response.data.Sur_name},function(error){})});var doctorSelect=function(){$modal.open({templateUrl:"selectDoctorDialog",size:"lg",controller:function($scope,$modalInstance){$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.waitingList.model.doctor_id=row.doctor_id,scope.doctor.name=row.NAME})},patientSelect=function(){$modal.open({templateUrl:"selectPatientDialog",size:"lg",controller:function($scope,$modalInstance){$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.waitingList.model.Patient_id=row.Patient_id,scope.patient.name=row.First_name+" "+row.Sur_name})};scope.doctor={name:"Select doctor",dialog:{select:function(){doctorSelect()}}},scope.patient={name:"Select patient",dialog:{select:function(){patientSelect()}}};var save=function(){ConfigService.beforeSave(scope.waitingList.errors);var postData=angular.copy(scope.waitingList.model);postData.Creation_date=moment().format("YYYY-MM-DD"),WaitingListModel.add(postData).then(function(response){scope.success=!0},function(error){scope.waitingList.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.waitingList.errors)})};scope.waitingList={model:angular.copy(model),save:function(){save()}}}}}),angular.module("app.loggedIn.waitingList.directives.list",[]).directive("waitingListList",function($modal,WaitingListModel,ConfigService,$cookieStore,OutreferralModel){return{restrict:"EA",scope:{success:"=",doctorId:"=",clickRow:"&"},templateUrl:"modules/waitingList/directives/templates/list.html",link:function(scope,elem,attrs){var load=function(){WaitingListModel.list().then(function(response){scope.waitingList.list=response.data},function(error){})};scope.waitingList={list:[],load:function(){load()}},scope.waitingList.load()}}});