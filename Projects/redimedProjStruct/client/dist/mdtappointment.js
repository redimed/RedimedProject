angular.module("app.loggedIn.mdtappointment",["app.loggedIn.mdtappointment.directives","app.loggedIn.mdtappointment.services"]),angular.module("app.loggedIn.mdtappointment.services",[]).factory("mdtAppointmentService",function(Restangular){var mdtService={},mdtApi=Restangular.all("api/erm/v2/appt/");return mdtService.byId=function(id){var funcApi=mdtApi.one("detail");return funcApi.get({id:id})},mdtService.edit=function(id,postData){var funcApi=mdtApi.all("update");return funcApi.post({data:postData,cal_id:id})},mdtService.add=function(postData){var funcApi=mdtApi.all("add");return funcApi.post({add_data:postData})},mdtService.search=function(option){var funcApi=mdtApi.all("search");return funcApi.post(option)},mdtService}),angular.module("app.loggedIn.mdtappointment.directives",["app.loggedIn.mdtappointment.detail.directive","app.loggedIn.mdtappointment.search.directive"]),angular.module("app.loggedIn.mdtappointment.detail.directive",[]).directive("mdtAppointmentDetail",function(mdtAppointmentModel,ConfigService,mdtAppointmentService,toastr){return{restrict:"EA",scope:{options:"=",params:"="},templateUrl:"modules/mdtappointment/directives/templates/detail.html",link:function(scope,element,attrs){var init=function(){scope.isSubmit=!1,scope.params.permission.edit===!0&&-1!=scope.params.id&&mdtAppointmentService.byId(scope.params.id).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),angular.extend(scope.mdtAppointmentMap,response.data),ConfigService.autoConvertData(scope.mdtAppointmentMap);for(var cols=["ARR_TIME","ATTEND_TIME","FROM_TIME","TO_TIME"],i=0;i<cols.length;++i){var col=cols[i];scope.mdtAppointmentMap[col]=new Date(scope.mdtAppointmentMap[col])}ConfigService.system_service_by_clinical(scope.mdtAppointmentMap.CLINICAL_DEPT_ID).then(function(response){scope.serviceList=response})}),scope.mdtAppointmentMap=angular.copy(mdtAppointmentModel)};init(),scope.clickAction=function(){if(scope.isSubmit=!0,scope.mdtappointmentForm.$invalid)toastr.error("You got some fields left","Error");else{var postData=angular.copy(scope.mdtAppointmentMap);for(var key in postData)postData[key]instanceof Date&&(postData[key]=ConfigService.getCommonDate(postData[key]));if(scope.params.permission.edit===!0){for(var cols=["doctor","Patient_id","CAL_ID","CLINICAL_DEPT_ID","SITE_ID","DOCTOR_ID","FROM_TIME","TO_TIME","PATIENTS"],i=0;i<cols.length;++i){var col=cols[i];delete postData[col]}mdtAppointmentService.edit(scope.params.id,postData).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),init(),toastr.success("Edit Successfully !!!","Success")})}else mdtAppointmentService.add(postData).then(function(data){"error"==data.status&&toastr.error("Cannot Insert","Error"),toastr.success("Insert Successfully !!!","Success"),init()}),init()}}}}}),angular.module("app.loggedIn.mdtappointment.search.directive",[]).directive("mdtappointmentSearch",function(mdtAppointmentService,toastr){return{restrict:"EA",scope:{clickRow:"&"},templateUrl:"modules/mdtappointment/directives/templates/search.html",link:function(scope,element,attrs){var init=function(){scope.list={},scope.params={pagination:{limit:5,offset:0,current_page:1,max_size:3},filters:[{type:"text",name:"DOCTOR_ID",value:""},{type:"text",name:"SITE_ID",value:""},{type:"text",name:"FROM_TIME",value:""}],select:["DOCTOR_ID","SITE_ID","FROM_TIME"]}},loadList=function(){mdtAppointmentService.search(scope.params).then(function(response){"error"===response.status&&toastr.error("Cannot get Seacrh","Error"),scope.list=response})};init(),loadList(),scope.setPage=function(){scope.params.pagination.offset=(scope.params.pagination.current_page-1)*scope.params.pagination.limit,loadList()}}}});