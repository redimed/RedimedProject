angular.module("app.loggedIn.department",["app.loggedIn.department.controller","app.loggedIn.department.services","app.loggedIn.department.directives"]).config(function($stateProvider){$stateProvider.state("loggedIn.department",{"abstract":!0,templateUrl:"modules/department/views/structure.html",controller:"DepartmentController"}).state("loggedIn.department.list",{url:"/department/list",views:{"main-content":{templateUrl:"modules/department/views/list.html",controller:"DepartmentListController"}}})}),angular.module("app.loggedIn.department.services",[]).factory("DepartmentService",function(Restangular){var instanceService={},appApi=Restangular.all("api/erm");return instanceService.detail=function(department_id){var detailApi=appApi.all("v2/dept/detail");return detailApi.post({CLINICAL_DEPT_ID:department_id})},instanceService.insert=function(data){var detailApi=appApi.all("v2/dept/insert");return detailApi.post(data)},instanceService.update=function(department_id,data){var detailApi=appApi.all("v2/dept/update");return detailApi.post(data)},instanceService["delete"]=function(department_id){var detailApi=appApi.all("v2/dept/delete");return detailApi.post(department_id)},instanceService.saveDeptHeaders=function(dept_id,header_list){for(var list=[],i=header_list.length-1;i>=0;i--)list.push(header_list[i].POPULAR_HEADER_ID);var detailApi=appApi.all("v2/dept/insert_dept_headers");return detailApi.post({dept_id:dept_id,headers:list})},instanceService.saveDeptServices=function(dept_id,service_list){for(var list=[],i=service_list.length-1;i>=0;i--)list.push(service_list[i].SERVICE_ID);var detailApi=appApi.all("v2/dept/insert_dept_services");return detailApi.post({dept_id:dept_id,services:list})},instanceService.disableDeptHeader=function(dept_id,header_id){if(dept_id&&header_id){var detailApi=appApi.all("v2/dept/update_dept_header");return detailApi.post({CLINICAL_DEPT_ID:dept_id,POPULAR_HEADER_ID:header_id,ISENABLE:0})}},instanceService.enableDeptHeader=function(dept_id,header_id){if(dept_id&&header_id){var detailApi=appApi.all("v2/dept/update_dept_header");return detailApi.post({CLINICAL_DEPT_ID:dept_id,POPULAR_HEADER_ID:header_id,ISENABLE:1})}},instanceService.disableDeptService=function(dept_id,service_id){if(dept_id&&service_id){var detailApi=appApi.all("v2/dept/update_dept_service");return detailApi.post({CLINICAL_DEPT_ID:dept_id,SERVICE_ID:service_id,ISENABLE:0})}},instanceService.enableDeptService=function(dept_id,service_id){if(dept_id&&service_id){var detailApi=appApi.all("v2/dept/update_dept_service");return detailApi.post({CLINICAL_DEPT_ID:dept_id,SERVICE_ID:service_id,ISENABLE:1})}},instanceService}),angular.module("app.loggedIn.department.directives",["app.loggedIn.department.detail.directive"]),angular.module("app.loggedIn.department.detail.directive",[]).directive("departmentDetail",function(ClnDepartmentModel,DepartmentService,ConfigService,toastr){return{restrict:"EA",scope:{data:"@",options:"=",on_success:"=onsuccess"},templateUrl:"modules/department/directives/templates/detail.html",link:function(scope,element,attrs){var loadData=function(id){DepartmentService.detail(id).then(function(data){angular.extend(scope.modelObjectMap,data.data),ConfigService.autoConvertData(scope.modelObjectMap)})};if(scope.modelObjectMap=angular.copy(ClnDepartmentModel),scope.mode={type:"add",text:"Add Department"},scope.data){var data=scope.$eval(scope.data);data.id&&(loadData(data.id),scope.mode={type:"edit",text:"Edit Department"})}var addProcess=function(postData){DepartmentService.insert(postData).then(function(response){"success"===response.status&&(toastr.success("Added a new Department","Success"),scope.modelObjectMap=angular.copy(ClnDepartmentModel),scope.isSubmit=!1,scope.on_success&&scope.on_success(response))})},editProcess=function(postData){var id=postData.id;delete postData.id,DepartmentService.update(id,postData).then(function(response){"success"===response.status&&(toastr.success("Edit Department Successfully","Success"),scope.isSubmit=!1,scope.on_success&&scope.on_success(response))})};scope.clickAction=function(option){if("view"!=option.type&&(scope.isSubmit=!0,!scope.mainForm.$invalid)){var postData=angular.copy(scope.modelObjectMap);for(var key in postData)postData[key]instanceof Date&&(postData[key]=ConfigService.getCommonDate(postData[key]));"add"==option.type?addProcess(postData):"edit"==option.type&&editProcess(postData)}}}}}),angular.module("app.loggedIn.department.controller",["app.loggedIn.department.list.controller"]).controller("DepartmentController",function($scope,ConfigService){}),angular.module("app.loggedIn.department.list.controller",[]).controller("DepartmentListController",function($scope,$state,$filter,DepartmentService,toastr){var arrGetBy=$filter("arrGetBy");$scope.departmentInfo={},$scope.header_panel={},$scope.dept_panel={},$scope.service_panel={},$scope.department={select:0,"class":function(item){return{danger:0==item.ISENABLE,selected:item.CLINICAL_DEPT_ID==$scope.department.select}},options:{scope:$scope.dept_panel,api:"api/erm/v2/dept/search",method:"post",columns:[{field:"CLINICAL_DEPT_ID",is_hide:!0},{field:"CLINICAL_DEPT_NAME",label:"Department name"},{field:"ISENABLE",is_hide:!0,label:"Is Enable",type:"checkbox"}],use_actions:!0,actions:[{"class":"fa fa-check",title:"Show",callback:function(item){$scope.department.select=item.CLINICAL_DEPT_ID,$scope.invheader.show(item.CLINICAL_DEPT_ID),$scope.services.show(item.CLINICAL_DEPT_ID)}},{"class":"fa fa-pencil",title:"Edit",callback:function(item){console.log(item),$scope.departmentInfo.id=item.CLINICAL_DEPT_ID,$scope.formEditDept.open()}},{"class":"fa fa-check",title:"Enable"},{"class":"fa fa-times",title:"Disable"}]}},$scope.formAddDept={is_show:!1,open:function(){this.is_show=!0},close:function(){this.is_show=!1},success:function(response){console.log(response),"success"==response.status&&$scope.dept_panel.reload()}},$scope.formEditDept={is_show:!1,open:function(){this.is_show=!0},close:function(){this.is_show=!1},success:function(response){console.log(response),"success"==response.status&&$scope.dept_panel.reload()}},$scope.services={show:function(dept_id){$scope.services.options.search={CLINICAL_DEPT_ID:dept_id},$scope.service_panel.reload(),$scope.searchService.select_list=[]},"class":function(item){return item.just_add?"info":0==item.clnDeptService.ISENABLE?"danger":void 0},options:{scope:$scope.service_panel,api:"api/erm/v2/dept/dept_service",method:"post",columns:[{field:"SERVICE_ID",is_hide:!0},{field:"SERVICE_NAME",label:"Service Name"},{field:"DESCRIPTION",label:"Description"},{field:"SERVICE_COLOR",label:"Color",type:"color"}],use_filters:!0,search:{CLINICAL_DEPT_ID:0},not_load:!0,"static":!0,use_actions:!0,actions:[{"class":"fa fa-check",title:"Enable",callback:function(item){return 1==item.clnDeptService.ISENABLE?void toastr.info("Header is enable !!!","Information"):void DepartmentService.enableDeptService($scope.department.select,item.SERVICE_ID).then(function(response){"success"==response.status&&(toastr.success("Save Successfully!!!","Success"),item.clnDeptService.ISENABLE=1)})}},{"class":"fa fa-times",title:"Disable",callback:function(item){return 0==item.clnDeptService.ISENABLE?void toastr.info("Header is disable !!!","Information"):void DepartmentService.disableDeptService($scope.department.select,item.SERVICE_ID).then(function(response){"success"==response.status&&(toastr.success("Save Successfully!!!","Success"),item.clnDeptService.ISENABLE=0)})}}]}},$scope.invheader={show:function(dept_id){$scope.invheader.options.search={CLINICAL_DEPT_ID:dept_id},$scope.header_panel.reload(),$scope.searchHeader.select_list=[]},"class":function(item){return item.just_add?"info":0==item.clnDeptItemList.ISENABLE?"danger":void 0},options:{scope:$scope.header_panel,api:"api/erm/v2/dept/dept_header",method:"post",columns:[{field:"POPULAR_HEADER_ID",is_hide:!0},{field:"POPULAR_CODE",label:"Popular Code",width:"20%"},{field:"POPULAR_NAME",label:"Popular Name"}],use_filters:!0,search:{CLINICAL_DEPT_ID:0},not_load:!0,"static":!0,use_actions:!0,actions:[{"class":"fa fa-check",title:"Enable",callback:function(item){return 1==item.clnDeptItemList.ISENABLE?void toastr.info("Header is enable !!!","Information"):void DepartmentService.enableDeptHeader($scope.department.select,item.POPULAR_HEADER_ID).then(function(response){"success"==response.status&&(toastr.success("Save Successfully!!!","Success"),item.clnDeptItemList.ISENABLE=1)})}},{"class":"fa fa-times",title:"Disable",callback:function(item){return 0==item.clnDeptItemList.ISENABLE?void toastr.info("Header is disable !!!","Information"):void DepartmentService.disableDeptHeader($scope.department.select,item.POPULAR_HEADER_ID).then(function(response){"success"==response.status&&(toastr.success("Save Successfully!!!","Success"),item.clnDeptItemList.ISENABLE=0)})}}]}},$scope.searchHeader={is_show:!1,open:function(){this.is_show=!0},close:function(){this.is_show=!1},select_list:[],"class":function(item){var t_item=arrGetBy($scope.header_panel.data.items,"POPULAR_HEADER_ID",item.POPULAR_HEADER_ID);if(t_item)return"success";var t_item=arrGetBy($scope.searchHeader.select_list,"POPULAR_HEADER_ID",item.POPULAR_HEADER_ID);return t_item?"info":void 0},click:function(item){var t_item=arrGetBy($scope.header_panel.data.items,"POPULAR_HEADER_ID",item.POPULAR_HEADER_ID);if(!t_item){var t_item=arrGetBy($scope.searchHeader.select_list,"POPULAR_HEADER_ID",item.POPULAR_HEADER_ID);t_item||(item.just_add=!0,$scope.searchHeader.select_list.push(item),$scope.header_panel.data.more_items.push(item))}},save:function(){DepartmentService.saveDeptHeaders($scope.department.select,$scope.searchHeader.select_list).then(function(response){"success"===response.status&&(toastr.success("Save Successfully!!!","Success"),$scope.header_panel.reload())})},options:{api:"api/erm/v2/items/header_search",method:"post",columns:[{field:"POPULAR_HEADER_ID",is_hide:!0},{field:"POPULAR_CODE",label:"Code"},{field:"POPULAR_NAME",label:"Name"},{field:"ISENABLE",label:"Is enable"}]}},$scope.searchService={is_show:!1,select_list:[],"class":function(item){},click:function(item){var t_item=arrGetBy($scope.service_panel.data.items,"SERVICE_ID",item.SERVICE_ID);if(!t_item){var t_item=arrGetBy($scope.searchService.select_list,"SERVICE_ID",item.SERVICE_ID);t_item||(item.just_add=!0,$scope.searchService.select_list.push(item),$scope.service_panel.data.more_items.push(item))}},open:function(){this.is_show=!0},close:function(){this.is_show=!1},save:function(){DepartmentService.saveDeptServices($scope.department.select,$scope.searchService.select_list).then(function(response){"success"===response.status&&(toastr.success("Save Successfully!!!","Success"),$scope.service_panel.reload())})}}});