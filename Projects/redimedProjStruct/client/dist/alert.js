angular.module("app.loggedIn.alert",["app.loggedIn.alert.include"]).config(function($stateProvider){$stateProvider.state("loggedIn.alert",{url:"/alert",templateUrl:"modules/alert/views/list.html",controller:"AlertListController"}).state("loggedIn.patient.alert",{"abstract":!0,url:"/patientalert"}).state("loggedIn.patient.alert.list",{url:"/list",views:{"main-content@loggedIn.patient":{templateUrl:"modules/alert/views/patient/list.html",controller:"AlertPatientListController"}}})}),angular.module("app.loggedIn.alert.include",["app.loggedIn.alert.controllers.list","app.loggedIn.alert.controllers.patientList","app.loggedIn.alert.model","app.loggedIn.alert.directives.patientList","app.loggedIn.alert.directives.list","app.loggedIn.alert.directives.add","app.loggedIn.alert.directives.edit"]),angular.module("app.loggedIn.alert.model",[]).factory("AlertModel",function(Restangular){var instanceService={},appApi=Restangular.all("api/meditek/v1/alert");return instanceService.list=function(data){var detailApi=appApi.all("list");return detailApi.post({data:data})},instanceService.add=function(data){var detailApi=appApi.all("add");return detailApi.post({data:data})},instanceService.edit=function(data){var detailApi=appApi.all("edit");return detailApi.post({data:data})},instanceService.remove=function(data){var detailApi=appApi.all("remove");return detailApi.post({data:data})},instanceService.one=function(data){var detailApi=appApi.all("one");return detailApi.post({data:data})},instanceService.disableAlert=function(data){var detailApi=appApi.all("disableAlert");return detailApi.post({data:data})},instanceService.disablePatientAlert=function(data){var detailApi=appApi.all("disablePatientAlert");return detailApi.post({data:data})},instanceService.getMedication=function(data){var detailApi=appApi.all("getMedication");return detailApi.post({data:data})},instanceService.insertMedication=function(data){var detailApi=appApi.all("insertMedication");return detailApi.post({data:data})},instanceService.deleteMedication=function(data){var detailApi=appApi.all("deleteMedication");return detailApi.post({data:data})},instanceService.getdoctorid=function(data){var detailApi=appApi.all("getdoctorid");return detailApi.post({data:data})},instanceService.showcompanyid=function(data){var detailApi=appApi.all("showcompanyid");return detailApi.post({data:data})},instanceService.insertalert=function(data){var detailApi=appApi.all("insertalert");return detailApi.post({data:data})},instanceService.postshowalertpatient=function(data){var detailApi=appApi.all("postshowalertpatient");return detailApi.post({data:data})},instanceService.postlistalert=function(data){var detailApi=appApi.all("postlistalert");return detailApi.post({data:data})},instanceService}),angular.module("app.loggedIn.alert.controllers.list",[]).controller("AlertAddDialog",function($scope,$modalInstance){$scope.alert={success:!1},$scope.$watch("alert.success",function(success){success&&$modalInstance.close("success")})}).controller("AlertListController",function($scope,$modal,toastr){var add=function(){$scope.alert.reload=!1,$modal.open({templateUrl:"dialogAlertAdd",controller:"AlertAddDialog",size:"lg"}).result.then(function(response){"success"===response&&(toastr.success("Added Successfully"),$scope.alert.reload=!0)})};$scope.alert={dialog:{add:function(){add()}},reload:!1,limit:20}}),angular.module("app.loggedIn.alert.controllers.patientList",[]).controller("AlertPatientSelectDialog",function($scope,$modalInstance,Patient_id,CAL_ID,AlertModel,toastr){var onSaveCheck=function(data){var postData=angular.copy(data);AlertModel.insertalert(postData).then(function(response){toastr.success("Select Successfully"),$modalInstance.close("success")},function(error){})};$scope.alert={success:!1},$scope.$watch("alert.success",function(success){success&&$modalInstance.close("success")}),$scope.alert={Patient_id:Patient_id,CAL_ID:CAL_ID,limit:10,onSaveCheck:function(data){onSaveCheck(data)}}}).controller("AlertPatientListController",function($scope,$modal,$stateParams,toastr){var select=function(){$scope.alert.reload=!1,$modal.open({templateUrl:"dialogAlertPatientSelect",controller:"AlertPatientSelectDialog",size:"lg",resolve:{Patient_id:function(){return $stateParams.patient_id},CAL_ID:function(){return $stateParams.cal_id}}}).result.then(function(response){"success"===response&&($scope.alert.reload=!0)})},add=function(){$scope.alert.reload=!1,$modal.open({templateUrl:"dialogAddAlert",controller:"AlertPatientSelectDialog",size:"lg",resolve:{Patient_id:function(){return $stateParams.patient_id},CAL_ID:function(){return $stateParams.cal_id}}}).result.then(function(response){"success"===response&&($scope.alert.reload=!0)})};$scope.alert={dialog:{select:function(){select()},add:function(){add()}},reload:!1,Patient_id:$stateParams.patient_id,CAL_ID:$stateParams.cal_id,limit:20}}),angular.module("app.loggedIn.alert.directives.list",[]).controller("AlertRemoveDialog",function($scope,$modalInstance,list){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.ok=function(){$modalInstance.close(list)}}).controller("AlertEditDialog",function($scope,$modalInstance,list){$scope.alert={id:list.id,success:!1},$scope.$watch("alert.success",function(success){success&&$modalInstance.close("success")})}).directive("alertList",function($modal,AlertModel,toastr){return{restrict:"EA",scope:{limit:"=",reload:"="},templateUrl:"modules/alert/directives/templates/list.html",link:function(scope,elem,attrs){var search={page:1,limit:scope.limit,offset:0,max_size:5,name:"",description:"",SERVICE_COLOR:"",Creation_date:"desc",isenable:""},disableAlert=function(l){AlertModel.disableAlert(l).then(function(response){scope.alert.load()},function(error){})},load=function(){var postData=angular.copy(scope.alert.search);AlertModel.list(postData).then(function(response){scope.alert.list=response.data,scope.alert.count=response.count},function(error){})},onSearch=function(){scope.alert.search.offset=0,scope.alert.load(),scope.alert.search.page=1},onOrderBy=function(option){switch(option.field){case"Creation_date":scope.alert.search.Creation_date=option.order}scope.alert.load()},remove=function(list){$modal.open({templateUrl:"dialogAlertRemove",controller:"AlertRemoveDialog",size:"sm",resolve:{list:function(){return list}}}).result.then(function(list){AlertModel.remove(list).then(function(response){toastr.success("Delete Successfully"),scope.alert.load()},function(error){})})},edit=function(list){$modal.open({templateUrl:"dialogAlertEdit",controller:"AlertEditDialog",size:"lg",resolve:{list:function(){return list}}}).result.then(function(response){"success"===response&&(toastr.success("Edit Successfully"),scope.alert.load())})},onPage=function(page){scope.alert.search.offset=(page-1)*scope.alert.search.limit,scope.alert.load()};scope.alert={dialog:{remove:function(list){remove(list)},edit:function(list){edit(list)}},search:angular.copy(search),load:function(){load()},list:[],onSearch:function(){onSearch()},onOrderBy:function(option){onOrderBy(option)},onPage:function(page){onPage(page)},disableAlert:function(l){disableAlert(l)}},scope.alert.load(),scope.$watch("reload",function(reload){reload&&(scope.alert.search=angular.copy(search),scope.alert.load())})}}}),angular.module("app.loggedIn.alert.directives.patientList",[]).directive("alertPatientList",function($modal,$stateParams,AlertModel,toastr){return{restrict:"EA",scope:{patientId:"=",calId:"=",limit:"=",reload:"=",permission:"@",onSavecheck:"&"},templateUrl:"modules/alert/directives/templates/patientList.html",link:function(scope,elem,attrs){scope.action="undefined"==typeof scope.permission?{edit:!0,remove:!0,checkbox:!1}:scope.$eval(scope.permission);var search={page:1,limit:scope.limit,offset:0,max_size:5,name:"",description:"",Creation_date:"desc",Patient_id:scope.patientId,CAL_ID:scope.calId,isEnable:""},bysearch={page:1,max_size:5,limit:15,offset:0,patient_id:$stateParams.patient_id,cal_id:$stateParams.cal_id},searchlist={page:1,max_size:5,limit:10,offset:0};scope.setPage=function(page){scope.alert.searchlist.offset=(page-1)*scope.alert.searchlist.limit,scope.alert.load()},scope.onPaging=function(page){scope.alert.bysearch.offset=(page-1)*scope.alert.bysearch.limit,scope.alert.load()};var load=function(){1==scope.action.edit?AlertModel.postshowalertpatient(bysearch).then(function(response){scope.alert.count=response.count,scope.alert.bylist=response.data},function(error){}):AlertModel.showcompanyid($stateParams.patient_id).then(function(response){scope.alert.searchlist.company_id=response.data[0].company_id,AlertModel.postlistalert(scope.alert.searchlist).then(function(res){scope.alert.list=res.data,scope.alert.count_list=res.count},function(error){})},function(error){})},onSearch=function(){scope.alert.search.offset=0,scope.alert.load(),scope.alert.search.page=1},onOrderBy=function(option){switch(option.field){case"Creation_date":scope.alert.search.Creation_date=option.order}scope.alert.load()},remove=function(list){$modal.open({templateUrl:"dialogAlertRemove",controller:"AlertRemoveDialog",size:"sm",resolve:{list:function(){return list}}}).result.then(function(list){AlertModel.remove(list).then(function(response){toastr.success("Delete Successfully"),scope.alert.load()},function(error){})})},edit=function(list){$modal.open({templateUrl:"dialogAlertEdit",controller:"AlertEditDialog",size:"md",resolve:{list:function(){return list}}}).result.then(function(response){"success"===response&&(toastr.success("Edit Successfully"),scope.alert.load())})},onPage=function(page){scope.alert.search.offset=(page-1)*scope.alert.search.limit,scope.alert.load()},onCheckbox=function(option){if(option.value)scope.alert.checkbox.push({patient_id:scope.patientId,cal_id:$stateParams.cal_id,alert_id:option.list.id});else{var i=0;_.forEach(scope.alert.checkbox,function(checkbox){return checkbox.alert_id===option.list.id?void scope.alert.checkbox.splice(i,1):void i++})}};scope.alert={dialog:{remove:function(list){remove(list)},edit:function(list){edit(list)}},count:0,count_list:0,search:angular.copy(search),bysearch:angular.copy(bysearch),load:function(){load()},searchlist:searchlist,list:[],bylist:[],checkbox:[],onSearch:function(){onSearch()},onOrderBy:function(option){onOrderBy(option)},onPage:function(page){onPage(page)},onCheckbox:function(option){onCheckbox(option)},checkedit:scope.action.edit},scope.alert.load(),scope.$watch("reload",function(reload){reload&&(scope.alert.search=angular.copy(search),scope.alert.bysearch=angular.copy(bysearch),scope.alert.load())})}}}),angular.module("app.loggedIn.alert.directives.add",[]).directive("alertAdd",function($cookieStore,$stateParams,AlertModel,ConfigService,toastr){return{restrict:"EA",scope:{success:"=",alertid:"="},templateUrl:"modules/alert/directives/templates/add.html",link:function(scope,elem,attrs){$("#service_color").minicolors({control:"wheel"});var user_id=$cookieStore.get("userInfo").id,Patient_id=$stateParams.patient_id,Cal_id=$stateParams.cal_id,form={name:"",description:"",SERVICE_COLOR:"",company_id:0,Created_by:user_id,Last_updated_by:user_id},save=function(){ConfigService.beforeSave(scope.alert.errors);var postData=angular.copy(scope.alert.form);postData.Creation_date=postData.Last_update_date=moment().format("YYYY-MM-DD"),0!=scope.alertid&&scope.alertid&&(postData.company_id=scope.alertid),0!=Patient_id&&0!=Cal_id&&(postData.patient_id=Patient_id,postData.cal_id=Cal_id),AlertModel.add(postData).then(function(response){toastr.success("Added Successfully"),scope.success=!0},function(error){scope.alert.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.alert.errors)})};scope.alert={form:form,errors:[],save:function(){save()}}}}}),angular.module("app.loggedIn.alert.directives.edit",[]).directive("alertEdit",function($cookieStore,AlertModel,ConfigService){return{restrict:"EA",scope:{success:"=",alertId:"="},templateUrl:"modules/alert/directives/templates/edit.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id;$("#service_color").minicolors({control:"wheel"});var form={name:"",description:"",SERVICE_COLOR:"",Created_by:user_id,Last_updated_by:user_id},save=function(){ConfigService.beforeSave(scope.alert.errors);var postData=angular.copy(scope.alert.form);postData.Last_update_date=moment().format("YYYY-MM-DD"),AlertModel.edit(postData).then(function(response){scope.success=!0},function(error){scope.alert.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.alert.errors)})},load=function(){var postData={id:scope.alertId};AlertModel.one(postData).then(function(response){angular.extend(scope.alert.form,response.data),delete scope.alert.form.Creation_date},function(error){})};scope.alert={form:angular.copy(form),load:function(){load()},errors:[],save:function(){save()}},scope.alert.load()}}});