angular.module("app.loggedIn.mdtoutdoctor",["app.loggedIn.mdtoutdoctor.directives","app.loggedIn.mdtoutdoctor.services","app.loggedIn.mdtoutdoctor.add.dialog"]),angular.module("app.loggedIn.mdtoutdoctor.services",[]).factory("mdtOutdoctorService",function(Restangular){var mdtService={},mdtApi=Restangular.all("api/meditek/v1/mdtoutdoctor/");return mdtService.add=function(postData){var funcApi=mdtApi.all("add");return funcApi.post({add_data:postData})},mdtService.edit=function(id,postData){var funcApi=mdtApi.all("edit");return funcApi.post({edit_data:postData,edit_id:id})},mdtService.byId=function(id){var funcApi=mdtApi.all("byId");return funcApi.post({detail_id:id})},mdtService.search=function(option){var funcApi=mdtApi.all("search");return funcApi.post(option)},mdtService}),angular.module("app.loggedIn.mdtoutdoctor.directives",["app.loggedIn.mdtoutdoctor.detail.directive","app.loggedIn.mdtoutdoctor.search.directive","app.loggedIn.mdtoutdoctor.add.directive"]),angular.module("app.loggedIn.mdtoutdoctor.detail.directive",[]).directive("mdtoutdoctorDetail",function(mdtOutdoctorModel,ConfigService,mdtOutdoctorService,toastr){return{restrict:"EA",scope:{options:"=",params:"="},templateUrl:"modules/mdtoutdoctor/directives/templates/detail.html",link:function(scope,element,attrs){var init=function(){scope.isSubmit=!1,scope.params.permission.edit===!0&&mdtOutdoctorService.byId(scope.params.id).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),angular.extend(scope.mdtOutdoctorMap,response.data);for(var key in scope.mdtOutdoctorMap)scope.mdtOutdoctorMap[key]&&((-1!=key.indexOf("is")||-1!=key.indexOf("Is")||-1!=key.indexOf("IS"))&&(scope.mdtOutdoctorMap[key]=scope.mdtOutdoctorMap[key].toString()),(-1!=key.indexOf("date")||-1!=key.indexOf("Date")||-1!=key.indexOf("DATE"))&&(scope.mdtOutdoctorMap[key]=new Date(scope.mdtOutdoctorMap[key])))}),scope.mdtOutdoctorMap=angular.copy(mdtOutdoctorModel)};init(),scope.clickAction=function(){if(scope.isSubmit=!0,scope.mdtoutdoctorForm.$invalid)toastr.error("You got some fields left","Error");else{var postData=angular.copy(scope.mdtOutdoctorMap);for(var key in postData)postData[key]instanceof Date&&(postData[key]=ConfigService.getCommonDate(postData[key]));scope.params.permission.edit===!0?mdtOutdoctorService.edit(scope.params.id,postData).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),init(),toastr.success("Edit Successfully !!!","Success")}):(mdtOutdoctorService.add(postData).then(function(data){"error"==data.status&&toastr.error("Cannot Insert","Error"),toastr.success("Insert Successfully !!!","Success"),init()}),init())}}}}}),angular.module("app.loggedIn.mdtoutdoctor.search.directive",[]).directive("mdtoutdoctorSearch",function(mdtOutdoctorService,toastr,$modal){return{restrict:"EA",scope:{clickRow:"&",isClose:"@",data:"="},templateUrl:"modules/mdtoutdoctor/directives/templates/search.html",link:function(scope,element,attrs){scope.closePopup=function(){angular.element("#"+scope.isClose).fadeOut()},scope.OutSideDoctor=function(size){$modal.open({templateUrl:"modules/mdtoutdoctor/dialogs/templates/add.html",controller:"MdtoutdoctorAdddialog",size:"lg"}).result.then(function(response){"success"===response.status&&(toastr.success("Add Successfully"),scope.data=response.data,loadList())})};var init=function(){scope.list={},scope.params={pagination:{limit:5,offset:0,current_page:1,max_size:3},filters:[{type:"text",name:"provider_no",value:""},{type:"text",name:"name",value:""},{type:"text",name:"address",value:""}],select:["doctor_id","provider_no","name","address"]},scope.isClose&&scope.closePopup()},loadList=function(){mdtOutdoctorService.search(scope.params).then(function(response){"error"===response.status&&toastr.error("Cannot get Seacrh","Error"),scope.list=response})};init(),loadList(),scope.setPage=function(){scope.params.pagination.offset=(scope.params.pagination.current_page-1)*scope.params.pagination.limit,loadList()},scope.refresh=function(){loadList()}}}}),angular.module("app.loggedIn.mdtoutdoctor.add.directive",[]).directive("mdtoutdoctorAdd",function(mdtOutdoctorModel,ConfigService,mdtOutdoctorService,toastr){return{restrict:"EA",scope:{options:"=",params:"=",success:"=",data:"="},templateUrl:"modules/mdtoutdoctor/directives/templates/add.html",link:function(scope,element,attrs){scope.mdtOutdoctorMap={provider_no:null,name:null,address:null,suburb:null,state:null,phone:null},scope.errors=[],scope.save=function(){ConfigService.beforeSave(scope.errors);var postData=angular.copy(scope.mdtOutdoctorMap);mdtOutdoctorService.add(postData).then(function(data){scope.success=!0,scope.data=data},function(error){scope.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.errors)})}}}}),angular.module("app.loggedIn.mdtoutdoctor.add.dialog",[]).controller("MdtoutdoctorAdddialog",function($scope,$modalInstance){$scope.OutsideDoctor={success:!1,data:null},$scope.$watch("OutsideDoctor.success",function(success){success&&$scope.$watch("OutsideDoctor.data",function(success){$modalInstance.close($scope.OutsideDoctor.data)})})});