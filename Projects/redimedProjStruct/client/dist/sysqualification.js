angular.module("app.loggedIn.sysqualification",["app.loggedIn.sysqualification.directives","app.loggedIn.sysqualification.services"]),angular.module("app.loggedIn.sysqualification.services",[]).factory("sysQualificationService",function(Restangular){var mdtService={},mdtApi=Restangular.all("api/meditek/v1/sysqualification/");return mdtService.add=function(postData){var funcApi=mdtApi.all("add");return funcApi.post({add_data:postData})},mdtService.edit=function(id,postData){var funcApi=mdtApi.all("edit");return funcApi.post({edit_data:postData,edit_id:id})},mdtService.byId=function(id){var funcApi=mdtApi.all("byId");return funcApi.post({detail_id:id})},mdtService.search=function(option){var funcApi=mdtApi.all("search");return funcApi.post(option)},mdtService}),angular.module("app.loggedIn.sysqualification.directives",["app.loggedIn.sysqualification.detail.directive","app.loggedIn.sysqualification.search.directive"]),angular.module("app.loggedIn.sysqualification.detail.directive",[]).directive("sysqualificationDetail",function(sysQualificationModel,ConfigService,sysQualificationService,toastr){return{restrict:"EA",scope:{options:"=",params:"="},templateUrl:"modules/sysqualification/directives/templates/detail.html",link:function(scope,element,attrs){var init=function(){scope.isSubmit=!1,scope.params.permission.edit===!0&&sysQualificationService.byId(scope.params.id).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),angular.extend(scope.sysQualificationMap,response.data);for(var key in scope.sysQualificationMap)scope.sysQualificationMap[key]&&((-1!=key.indexOf("is")||-1!=key.indexOf("Is")||-1!=key.indexOf("IS"))&&(scope.sysQualificationMap[key]=scope.sysQualificationMap[key].toString()),(-1!=key.indexOf("date")||-1!=key.indexOf("Date")||-1!=key.indexOf("DATE"))&&(scope.sysQualificationMap[key]=new Date(scope.sysQualificationMap[key])))}),scope.sysQualificationMap=angular.copy(sysQualificationModel)};init(),scope.clickAction=function(){if(scope.isSubmit=!0,scope.sysqualificationForm.$invalid)toastr.error("You got some fields left","Error");else{var postData=angular.copy(scope.sysQualificationMap);for(var key in postData)postData[key]instanceof Date&&(postData[key]=ConfigService.getCommonDate(postData[key]));scope.params.permission.edit===!0?sysQualificationService.edit(scope.params.id,postData).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),init(),toastr.success("Edit Successfully !!!","Success")}):(sysQualificationService.add(postData).then(function(data){"error"==data.status&&toastr.error("Cannot Insert","Error"),toastr.success("Insert Successfully !!!","Success"),init()}),init())}}}}}),angular.module("app.loggedIn.sysqualification.search.directive",[]).directive("sysqualificationSearch",function(sysQualificationService,toastr){return{restrict:"EA",scope:{clickRow:"&"},templateUrl:"modules/sysqualification/directives/templates/search.html",link:function(scope,element,attrs){var init=function(){scope.list={},scope.params={pagination:{limit:5,offset:0,current_page:1,max_size:3},filters:[{type:"text",name:"name",value:""},{type:"text",name:"Isenable",value:""},{type:"text",name:"Created_by",value:""}],select:["name","Isenable","Created_by"]}},loadList=function(){sysQualificationService.search(scope.params).then(function(response){"error"===response.status&&toastr.error("Cannot get Seacrh","Error"),scope.list=response})};init(),loadList(),scope.setPage=function(){scope.params.pagination.offset=(scope.params.pagination.current_page-1)*scope.params.pagination.limit,loadList()}}}});