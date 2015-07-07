angular.module("app.loggedIn.mdtdoctor",["app.loggedIn.mdtdoctor.directives","app.loggedIn.mdtdoctor.services"]),angular.module("app.loggedIn.mdtdoctor.services",[]).factory("mdtDoctorService",function(Restangular){var mdtService={},mdtApi=Restangular.all("api/meditek/v1/mdtdoctor/");return mdtService.add=function(postData){var funcApi=mdtApi.all("add");return funcApi.post({add_data:postData})},mdtService.edit=function(id,postData){var funcApi=mdtApi.all("edit");return funcApi.post({edit_data:postData,edit_id:id})},mdtService.byId=function(id){var funcApi=mdtApi.all("byId");return funcApi.post({detail_id:id})},mdtService.search=function(option){var funcApi=mdtApi.all("search");return funcApi.post(option)},mdtService.specialities=function(option){var funcApi=mdtApi.all("specialities");return funcApi.post(option)},mdtService}),angular.module("app.loggedIn.mdtdoctor.directives",["app.loggedIn.mdtdoctor.detail.directive","app.loggedIn.mdtdoctor.search.directive"]),angular.module("app.loggedIn.mdtdoctor.detail.directive",[]).controller("SpecialtyRemoveDialog",function($scope,$modalInstance,list){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.ok=function(){$modalInstance.close(list)}}).directive("mdtdoctorDetail",function(mdtDoctorModel,ConfigService,mdtDoctorService,mdtSpecialtyService,UserService,ReceptionistService,toastr,$cookieStore,$modal,$stateParams){return{restrict:"EA",scope:{options:"=",params:"=",itemUpdate:"=",onsuccess:"=onsuccess"},templateUrl:"modules/mdtdoctor/directives/templates/detail.html",link:function(scope,element,attrs){scope.closePopup=function(){angular.element("#"+scope.params.popupId).fadeOut()},scope.users=null,scope.siteList=null,UserService.all().then(function(response){scope.users=response.data}),ReceptionistService.getSite().then(function(rs){"success"==rs.status&&(scope.siteList=rs.data)});var init=function(){scope.isSubmit=!1,scope.params.permission.edit===!0&&mdtDoctorService.byId(scope.params.id).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),angular.extend(scope.mdtDoctorMap,response.data);for(var key in scope.mdtDoctorMap)scope.mdtDoctorMap[key]&&((-1!=key.indexOf("is")||-1!=key.indexOf("Is")||-1!=key.indexOf("IS"))&&(scope.mdtDoctorMap[key]=scope.mdtDoctorMap[key].toString()),(-1!=key.indexOf("date")||-1!=key.indexOf("Date")||-1!=key.indexOf("DATE"))&&(scope.mdtDoctorMap[key]=new Date(scope.mdtDoctorMap[key])));scope.mdtDoctorMap.Title=parseInt(scope.mdtDoctorMap.Title),scope.mdtDoctorMap.Created_by=$cookieStore.get("userInfo").id,scope.mdtDoctorMap.Last_updated_by=$cookieStore.get("userInfo").id,scope.mdtDoctorMap.Medical_Registration_no=parseInt(scope.mdtDoctorMap.Medical_Registration_no)}),scope.mdtDoctorMap=angular.copy(mdtDoctorModel)};init(),scope.clickAction=function(){if(scope.isSubmit=!0,!scope.mdtdoctorForm.$invalid){var postData=angular.copy(scope.mdtDoctorMap);for(var key in postData)postData[key]instanceof Date&&(postData[key]=ConfigService.getCommonDate(postData[key]));postData.Last_update_date=ConfigService.getCommonDatetime(new Date),(null==postData.numsOfRoom||""==postData.numsOfRoom)&&(postData.numsOfRoom=0),scope.params.permission.edit===!0?mdtDoctorService.edit(scope.params.id,postData).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),init(),toastr.success("Edit Successfully !!!","Success"),scope.itemUpdate=!0,scope.onsuccess&&(console.log(scope.onsuccess),scope.onsuccess(response))}):(postData.Creation_date=ConfigService.getCommonDatetime(new Date),mdtDoctorService.add(postData).then(function(response){"error"==response.status&&toastr.error("Cannot Insert","Error"),toastr.success("Insert Successfully !!!","Success"),init(),scope.itemUpdate=!0,scope.onsuccess&&(console.log(scope.onsuccess),scope.onsuccess(response))}),init())}},scope.clearSignature=function(){scope.mdtDoctorMap.Signature=""};var addDialog=function(){$modal.open({templateUrl:"dialogSelectSpeciality",controller:function($scope,$modalInstance,doctorId){var clickRow=function(row){$modalInstance.close(row)};$scope.speciality={limit:10,reload:!1,doctorId:doctorId,clickRow:function(row){clickRow(row)}}},size:"lg",resolve:{doctorId:function(){return $stateParams.doctorId}}}).result.then(function(row){var postData={doctor_id:$stateParams.doctorId,Specialties_id:row.Specialties_id,Isenable:1};mdtSpecialtyService.selectServiceDoctor(postData).then(function(response){toastr.success("Select Successfully"),scope.speciality.load()},function(error){})})},load=function(){var postData={doctor_id:$stateParams.doctorId};mdtSpecialtyService.listByServiceDoctor(postData).then(function(response){scope.speciality.list=response.data},function(error){})},onActiveList=function(list){mdtSpecialtyService.active({doctor_id:$stateParams.doctorId,Specialty_id:list.Specialties_id}).then(function(response){toastr.success("Active Successfully"),scope.doctor.load(),scope.speciality.load()},function(error){})},removeDialog=function(list){$modal.open({templateUrl:"dialogSpecialtyRemove",controller:"SpecialtyRemoveDialog",size:"sm",resolve:{list:function(){return list}}}).result.then(function(list){var postData={doctor_id:$stateParams.doctorId,Specialties_id:list.Specialties_id};mdtSpecialtyService.removeServiceDoctor(postData).then(function(response){toastr.success("Delete Successfully"),scope.speciality.load()},function(error){})})};scope.disable=function(list){var postData={doctor_id:$stateParams.doctorId,Specialties_id:list.Specialties_id,Isenable:list.Isenable};mdtSpecialtyService.removeServiceDoctor(postData).then(function(response){scope.speciality.load()},function(error){})},scope.speciality={list:[],onActiveList:function(list){onActiveList(list)},load:function(){load()},dialog:{add:function(){addDialog()},remove:function(list){removeDialog(list)}},active:0},scope.option={titles:null,providers:null,qualifications:null,departments:null},ConfigService.title_option().then(function(response){"success"===response.status&&(scope.option.titles=response.data)}),ConfigService.provider_option().then(function(response){"success"===response.status&&(scope.option.providers=response.data)}),ConfigService.department_option().then(function(response){"success"===response.status&&(scope.option.departments=response.data)}),ConfigService.qualification_option().then(function(response){"success"===response.status&&(scope.option.qualifications=response.data)}),scope.speciality.load();var doctorLoad=function(){mdtDoctorService.byId($stateParams.doctorId).then(function(response){scope.speciality.active=response.data.Specialty_id},function(error){})};scope.doctor={item:{},load:function(){doctorLoad()}},scope.doctor.load()}}}),angular.module("app.loggedIn.mdtdoctor.search.directive",[]).directive("mdtdoctorSearch",function(mdtDoctorService,toastr,$modal){return{restrict:"EA",scope:{clickRow:"&",isClose:"@"},templateUrl:"modules/mdtdoctor/directives/templates/search.html",link:function(scope,element,attrs){scope.closePopup=function(){angular.element("#"+scope.isClose).fadeOut()};var init=function(){scope.list={},scope.params={pagination:{limit:7,offset:0,current_page:1,max_size:3},filters:[{type:"text",name:"NAME",value:""},{type:"text",name:"Email",value:""},{type:"text",name:"Phone",value:""},{type:"text",name:"Isenable",value:"1"}],select:["doctor_id","NAME","Email","Phone","CLINICAL_DEPT_ID"]},scope.isClose&&scope.closePopup()},loadList=function(){mdtDoctorService.search(scope.params).then(function(response){"error"===response.status&&toastr.error("Cannot get Seacrh","Error"),scope.list=response})};init(),loadList(),scope.setPage=function(){scope.params.pagination.offset=(scope.params.pagination.current_page-1)*scope.params.pagination.limit,loadList()},scope.addDoctor=function(){$modal.open({templateUrl:"AddDoctorDialog",size:"lg",controller:function($scope,$modalInstance){$scope.params_doctor={permission:{create:!0,edit:!1}},$scope.itemUpdate=!1,$scope.$watch("itemUpdate",function(item){item===!0&&$modalInstance.close("success")})}}).result.then(function(response){})},scope.refresh=function(){loadList()}}}});