angular.module("app.loggedIn.claim",["app.loggedIn.claim.include"]).config(function($stateProvider){$stateProvider.state("loggedIn.patient.claim",{"abstract":!0,url:"/claim"}).state("loggedIn.patient.claim.list",{url:"/list",views:{"main-content@loggedIn.patient":{templateUrl:"modules/claim/views/patient/list.html",controller:"ClaimPatientListController"}}})}),angular.module("app.loggedIn.claim.include",["app.loggedIn.claim.directives.patientList","app.loggedIn.claim.directives.patientAdd","app.loggedIn.claim.directives.patientEdit","app.loggedIn.claim.controllers.patientList","app.loggedIn.claim.directives.patientShow","app.loggedIn.claim.model"]),angular.module("app.loggedIn.claim.model",[]).factory("ClaimModel",function(Restangular){var instanceService={},appApi=Restangular.all("api/meditek/v1/claim");return instanceService.listFollowPatient=function(data){var detailApi=appApi.all("listFollowPatient");return detailApi.post({data:data})},instanceService.listFollowPatientInsurer=function(data){var detailApi=appApi.all("listFollowPatientInsurer");return detailApi.post({data:data})},instanceService.listNoFollowPatient=function(data){var detailApi=appApi.all("listNoFollowPatient");return detailApi.post({data:data})},instanceService.getPatientInsurer=function(patientId){var detailApi=appApi.one("getPatientInsurer");return detailApi.get({patientId:patientId})},instanceService.add=function(data){var detailApi=appApi.all("add");return detailApi.post({data:data})},instanceService.addPatient=function(data){var detailApi=appApi.all("addPatient");return detailApi.post({data:data})},instanceService.edit=function(data){var detailApi=appApi.all("edit");return detailApi.post({data:data})},instanceService.remove=function(data){var detailApi=appApi.all("remove");return detailApi.post({data:data})},instanceService.one=function(data){var detailApi=appApi.all("one");return detailApi.post({data:data})},instanceService.OClose=function(data){var detailApi=appApi.all("oclose");return detailApi.post({data:data})},instanceService}),angular.module("app.loggedIn.claim.directives.patientAdd",[]).directive("claimPatientAdd",function($cookieStore,ClaimModel,ConfigService,InsurerService){return{restrict:"EA",scope:{patientId:"=",calId:"=",success:"=",successData:"=",insurerdata:"="},templateUrl:"modules/claim/directives/templates/patientAdd.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id,form={Patient_id:scope.patientId,Injury_name:"",Injury_date:null,How_Injury_Occurred:"",Location:"",Claim_date:null,Claim_no:"",Address:"",Case_manager:"",isCurr:"1",PO_number:"",Isenable:"1",Created_by:user_id,Last_updated_by:user_id,CAL_ID:scope.calId},save=function(){ConfigService.beforeSave(scope.claim.errors);var postData=angular.copy(scope.claim.form);postData.Creation_date=postData.Last_update_date=moment().format("YYYY-MM-DD"),postData.Injury_date&&(postData.Injury_date=ConfigService.convertToDB(postData.Injury_date)),postData.Claim_date&&(postData.Claim_date=ConfigService.convertToDB(postData.Claim_date)),ClaimModel.add(postData).then(function(response){scope.success=scope.insurerdata?response.data:!0},function(error){scope.claim.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.claim.errors)})},loadInsurer=function(){if(scope.insurerdata)scope.insurer.name=scope.insurerdata.insurer_name,form.insurer_id=scope.insurerdata.id,form.Insurer=scope.insurerdata.insurer_name;else{var postData={Patient_id:scope.patientId};InsurerService.oneFollowPatient(postData).then(function(response){"undefined"!=typeof response.data?(scope.insurer.name=response.data.insurer_name,form.insurer_id=response.data.id,form.Insurer=response.data.insurer_name):scope.insurer.name="No Insurer"},function(error){})}};scope.claim={form:form,errors:[],save:function(){save()}},scope.insurer={load:function(){loadInsurer()},name:""},scope.insurer.load()}}}),angular.module("app.loggedIn.claim.directives.patientEdit",[]).directive("claimPatientEdit",function($cookieStore,$stateParams,ClaimModel,ConfigService,InsurerService){return{restrict:"EA",scope:{claimId:"=",patientId:"=",success:"="},templateUrl:"modules/claim/directives/templates/patientEdit.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id,form={Patient_id:scope.patientId,Injury_name:"",Injury_date:null,How_Injury_Occurred:"",Location:"",Claim_date:null,Claim_no:"",Address:"",Case_manager:"",isCurr:"1",PO_number:"",Isenable:"0",Created_by:user_id,Last_updated_by:user_id},save=function(){ConfigService.beforeSave(scope.claim.errors);var postData=angular.copy(scope.claim.form);postData.Last_update_date=moment().format("YYYY-MM-DD"),postData.Injury_date&&(postData.Injury_date=ConfigService.convertToDB(postData.Injury_date)),postData.Claim_date&&(postData.Claim_date=ConfigService.convertToDB(postData.Claim_date)),ClaimModel.edit(postData).then(function(response){scope.success=!0},function(error){scope.claim.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.claim.errors)})},loadInsurer=function(){},load=function(){var postData={Patient_id:scope.patientId,Claim_id:scope.claimId};ClaimModel.one(postData).then(function(response){scope.insurer.name=null!==response.data.Insurer?response.data.Insurer:"No Insurer",angular.extend(scope.claim.form,response.data),scope.claim.form.Claim_date=ConfigService.convertToDate(scope.claim.form.Claim_date),scope.claim.form.Injury_date=ConfigService.convertToDate(scope.claim.form.Injury_date),scope.claim.form.isCurr=scope.claim.form.isCurr.toString(),scope.claim.form.Isenable=scope.claim.form.Isenable.toString(),delete scope.claim.form.Creation_date},function(error){})};scope.claim={errors:[],load:function(){load()},form:angular.copy(form),errors:[],save:function(){save()}},scope.insurer={load:function(){loadInsurer()},name:""},scope.claim.load(),scope.insurer.load()}}}),angular.module("app.loggedIn.claim.directives.patientList",[]).controller("ClaimPatientRemoveDialog",function($scope,$modalInstance,list){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.ok=function(){$modalInstance.close(list)}}).controller("ClaimPatientEditDialog",function($scope,$modalInstance,$stateParams,list){$scope.claim={Claim_id:list.Claim_id,Patient_id:$stateParams.patient_id,success:!1},$scope.$watch("claim.success",function(success){success&&$modalInstance.close("success")})}).controller("ClaimPatientShowDialog",function($scope,$modalInstance,$stateParams,list){$scope.claim={Claim_id:list.Claim_id,Patient_id:$stateParams.patient_id,success:!1},$scope.$watch("claim.success",function(success){success&&$modalInstance.close("success")})}).directive("claimPatientList",function(ClaimModel,$modal,toastr,$stateParams){return{restrict:"EA",scope:{reload:"=",limit:"=",patientId:"=",calId:"=",withoutPatient:"@",permission:"@",onRowClick:"&",addSuccess:"="},templateUrl:"modules/claim/directives/templates/patientList.html",link:function(scope,elem,attrs){scope.action="undefined"==typeof scope.permission?{edit:!0,remove:!0,add:!0,show:!0}:scope.$eval(scope.permission),console.log(scope.action);var search={page:1,limit:scope.limit,offset:0,max_size:5,Claim_no:"",Claim_date:"desc",Injury_name:"",Injury_date:"asc",Patient_id:scope.patientId},load=function(){var postData=angular.copy(scope.claim.search);"undefined"!=typeof scope.withoutPatient&&scope.withoutPatient?ClaimModel.listNoFollowPatient(postData).then(function(response){scope.claim.list=response.data,scope.claim.count=response.count},function(error){}):ClaimModel.listFollowPatient(postData).then(function(response){scope.claim.list=response.data,scope.claim.count=response.count},function(error){})},onPage=function(page){scope.claim.search.offset=(page-1)*scope.claim.search.limit,scope.claim.load()},onSearch=function(){scope.claim.load(),scope.claim.search.page=1},onOrderBy=function(option){switch(option.field){case"Claim_date":scope.claim.search.Claim_date=option.order;break;case"Injury_date":scope.claim.search.Injury_date=option.order}scope.claim.load()},remove=function(list){$modal.open({templateUrl:"dialogClaimRemove",controller:"ClaimPatientRemoveDialog",size:"sm",resolve:{list:function(){return list}}}).result.then(function(list){ClaimModel.remove(list).then(function(response){toastr.success("Deleted Successfully"),scope.claim.load()},function(error){})})},edit=function(list){$modal.open({templateUrl:"dialogClaimEdit",controller:"ClaimPatientEditDialog",size:"md",resolve:{list:function(){return list}}}).result.then(function(response){"success"===response&&(toastr.success("Edit Successfully"),scope.claim.load())})},add=function(){$modal.open({templateUrl:"claimAdd",controller:function($scope,$modalInstance,patientId,calId){$scope.claim={Patient_id:patientId,CAL_ID:calId,success:!1},$scope.$watch("claim.success",function(success){success&&$modalInstance.close("success")})},size:"lg",resolve:{patientId:function(){return scope.patientId},calId:function(){return scope.calId}}}).result.then(function(success){"success"===success&&(toastr.success("Add Successfully"),scope.addSuccess=!0)})},show=function(list){$modal.open({templateUrl:"dialogClaimShow",controller:"ClaimPatientShowDialog",size:"md",resolve:{list:function(){return list}}}).result.then(function(response){"success"===response&&(toastr.success("Edit Successfully"),scope.claim.load())})};scope.claim={dialog:{add:function(){add()},remove:function(list){remove(list)},edit:function(list){edit(list)},show:function(list){show(list)}},load:function(){load()},list:[],count:0,search:angular.copy(search),onPage:function(page){onPage(page)},onSearch:function(){onSearch()},onOrderBy:function(option){onOrderBy(option)}},scope.claim.load(),scope.$watch("reload",function(reload){scope.claim.search=angular.copy(search),reload&&scope.claim.load()})}}}),angular.module("app.loggedIn.claim.directives.patientShow",[]).directive("claimPatientShow",function($cookieStore,$stateParams,ClaimModel,ConfigService,InsurerService){return{restrict:"EA",scope:{claimId:"=",patientId:"=",success:"="},templateUrl:"modules/claim/directives/templates/patientShow.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id,form={Patient_id:scope.patientId,Injury_name:"",Injury_date:null,How_Injury_Occurred:"",Location:"",Claim_date:null,Claim_no:"",Address:"",Case_manager:"",isCurr:"1",PO_number:"",Isenable:"0",Created_by:user_id,Last_updated_by:user_id},save=function(){ConfigService.beforeSave(scope.claim.errors);var postData=angular.copy(scope.claim.form);postData.Last_update_date=moment().format("YYYY-MM-DD"),postData.Injury_date&&(postData.Injury_date=ConfigService.convertToDB(postData.Injury_date)),postData.Claim_date&&(postData.Claim_date=ConfigService.convertToDB(postData.Claim_date)),ClaimModel.edit(postData).then(function(response){scope.success=!0},function(error){scope.claim.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.claim.errors)})},loadInsurer=function(){},load=function(){var postData={Patient_id:scope.patientId,Claim_id:scope.claimId};ClaimModel.one(postData).then(function(response){scope.insurer.name=null!==response.data.Insurer?response.data.Insurer:"No Insurer",angular.extend(scope.claim.form,response.data),scope.claim.form.Claim_date=ConfigService.convertToDate(scope.claim.form.Claim_date),scope.claim.form.Injury_date=ConfigService.convertToDate(scope.claim.form.Injury_date),scope.claim.form.isCurr=scope.claim.form.isCurr.toString(),scope.claim.form.Isenable=scope.claim.form.Isenable.toString(),delete scope.claim.form.Creation_date},function(error){})};scope.claim={errors:[],load:function(){load()},form:angular.copy(form),errors:[],save:function(){save()}},scope.insurer={load:function(){loadInsurer()},name:""},scope.claim.load(),scope.insurer.load()}}}),angular.module("app.loggedIn.claim.controllers.patientList",[]).controller("ClaimPatientListController",function($scope,$modal,$stateParams,toastr){var add=function(){$modal.open({templateUrl:"dialogClaimAdd",controller:"ClaimPatientAddDialog",size:"md",resolve:{patientId:function(){return $stateParams.patient_id},calId:function(){return $stateParams.cal_id}}}).result.then(function(response){"success"===response&&(toastr.success("Added Successfully"),$scope.claim.reload=!0)})};$scope.claim={dialog:{add:function(){add(),$scope.claim.reload=!1}},reload:!1,limit:20,Patient_id:$stateParams.patient_id,CAL_ID:$stateParams.cal_id}}).controller("ClaimPatientAddDialog",function($scope,$modalInstance,patientId,calId){$scope.patientId=patientId,$scope.calId=calId,$scope.success=!1,$scope.$watch("success",function(success){success&&$modalInstance.close("success")})});