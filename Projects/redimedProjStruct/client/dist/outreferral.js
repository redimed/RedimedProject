angular.module("app.loggedIn.outreferral",["app.loggedIn.outreferral.include"]).config(function($stateProvider){$stateProvider.state("loggedIn.patient.outreferral",{"abstract":!0,url:"/outreferral"}).state("loggedIn.patient.outreferral.list",{url:"/list",views:{"main-content@loggedIn.patient":{templateUrl:"modules/outreferral/views/patient/list.html",controller:"OutreferralPatientListController"}}})}),angular.module("app.loggedIn.outreferral.include",["app.loggedIn.outreferral.directives.patientList","app.loggedIn.outreferral.directives.patientAdd","app.loggedIn.outreferral.directives.patientEdit","app.loggedIn.outreferral.directives.patientShow","app.loggedIn.outreferral.controllers.patientList","app.loggedIn.outreferral.model"]),angular.module("app.loggedIn.outreferral.model",[]).factory("OutreferralModel",function(Restangular){var instanceService={},appApi=Restangular.all("api/meditek/v1/outreferral");return instanceService.checkPatientCalendar=function(data){var detailApi=appApi.all("checkPatientCalendar");return detailApi.post({data:data})},instanceService.listFollowPatient=function(data){var detailApi=appApi.all("listFollowPatient");return detailApi.post({data:data})},instanceService.listNoFollowPatient=function(data){var detailApi=appApi.all("listNoFollowPatient");return detailApi.post({data:data})},instanceService.checkReferral=function(data){var detailApi=appApi.all("checkReferral");return detailApi.post({data:data})},instanceService.add=function(data){var detailApi=appApi.all("add");return detailApi.post({data:data})},instanceService.select=function(data){var detailApi=appApi.all("selectPatient");return detailApi.post({data:data})},instanceService.addPatient=function(data){var detailApi=appApi.all("addPatient");return detailApi.post({data:data})},instanceService.edit=function(data){var detailApi=appApi.all("edit");return detailApi.post({data:data})},instanceService.remove=function(data){var detailApi=appApi.all("remove");return detailApi.post({data:data})},instanceService.one=function(data){var detailApi=appApi.all("one");return detailApi.post({data:data})},instanceService.updateEnable=function(data){var detailApi=appApi.all("updateEnable");return detailApi.post({data:data})},instanceService.DotorFromUserId=function(data){var detailApi=appApi.all("DotorFromUserId");return detailApi.post({data:data})},instanceService}),angular.module("app.loggedIn.outreferral.controllers.patientList",[]).controller("OutreferralPatientListController",function($scope,$modal,$stateParams,toastr){var add=function(){$modal.open({templateUrl:"dialogOutreferralAdd",controller:"OutreferralPatientAddDialog",size:"lg",resolve:{patientId:function(){return $stateParams.patient_id}}}).result.then(function(response){"success"===response&&(toastr.success("Added Successfully"),$scope.outreferral.reload=!0)})};$scope.outreferral={dialog:{add:function(){add(),$scope.outreferral.reload=!1}},reload:!1,limit:20,Patient_id:$stateParams.patient_id}}).controller("OutreferralPatientAddDialog",function($scope,$modalInstance,$stateParams,patientId,AppointmentModel){$scope.patientId=patientId,$scope.calId=$stateParams.cal_id,$scope.success=!1,AppointmentModel.one({CAL_ID:$scope.calId}).then(function(response){$scope.doctorId=response.data.DOCTOR_ID}),$scope.$watch("success",function(success){success&&$modalInstance.close("success")})}),angular.module("app.loggedIn.outreferral.directives.patientList",[]).controller("OutreferralPatientRemoveDialog",function($scope,$modalInstance,list){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.ok=function(){$modalInstance.close(list)}}).controller("OutreferralPatientEditDialog",function($scope,$modalInstance,$stateParams,list){$scope.outreferral={id:list.id,patient_id:list.patient_id,success:!1},$scope.$watch("outreferral.success",function(success){success&&$modalInstance.close("success")})}).controller("OutreferralPatientShowDialog",function($scope,$modalInstance,$stateParams,list){$scope.outreferral={id:list.id,patient_id:list.patient_id,success:!1},$scope.$watch("outreferral.success",function(success){success&&$modalInstance.close("success")})}).directive("outreferralPatientList",function(OutreferralModel,$modal,toastr,$stateParams,$timeout){return{restrict:"EA",scope:{reload:"=",limit:"=",patientId:"=",calId:"=",doctorId:"=",withoutPatient:"@",permission:"@",onRowClick:"&",addSuccess:"="},templateUrl:"modules/outreferral/directives/templates/patientList.html",link:function(scope,elem,attrs){scope.action="undefined"==typeof scope.permission?{edit:!0,remove:!0,add:trues}:scope.$eval(scope.permission);var search={page:1,limit:scope.limit,offset:0,max_size:5,patient_id:scope.patientId},load=function(){var postData=angular.copy(scope.outreferral.search);"undefined"!=typeof scope.withoutPatient&&scope.withoutPatient?OutreferralModel.listNoFollowPatient(postData).then(function(response){scope.outreferral.list=response.data,scope.outreferral.count=response.count},function(error){}):OutreferralModel.listFollowPatient(postData).then(function(response){scope.outreferral.list=response.data,scope.outreferral.count=response.count},function(error){})},clickEnable=function(row){var postData={CAL_ID:$stateParams.cal_id,patient_id:row.patient_id,outreferral_id:row.id,isEnable:row.isEnable};OutreferralModel.updateEnable(postData).then(function(response){console.log(response),scope.outreferral.load()},function(error){})},clickDisale=function(row){console.log($stateParams.cal_id);var postData={CAL_ID:$stateParams.cal_id,patient_id:row.patient_id,outreferral_id:row.id,isEnable:row.isEnable};console.log(postData),OutreferralModel.updateEnable(postData).then(function(response){console.log(response),scope.outreferral.load()},function(error){})},onPage=function(page){scope.outreferral.search.offset=(page-1)*scope.outreferral.search.limit,scope.outreferral.load()},onSearch=function(){scope.outreferral.load(),scope.outreferral.search.page=1},onOrderBy=function(option){switch(option.field){case"Claim_date":scope.outreferral.search.Claim_date=option.order;break;case"Injury_date":scope.outreferral.search.Injury_date=option.order}scope.outreferral.load()},remove=function(list){$modal.open({templateUrl:"dialogOutreferralRemove",controller:"OutreferralPatientRemoveDialog",size:"sm",resolve:{list:function(){return list}}}).result.then(function(list){OutreferralModel.remove(list).then(function(response){toastr.success("Deleted Successfully"),scope.outreferral.load()},function(error){})})},edit=function(list){$modal.open({templateUrl:"dialogOutreferralEdit",controller:"OutreferralPatientEditDialog",size:"lg",resolve:{list:function(){return list}}}).result.then(function(response){"success"===response&&(toastr.success("Edit Successfully"),scope.outreferral.load())})},add=function(){$modal.open({templateUrl:"referralAdd",controller:function($scope,$modalInstance,patientId,calId,doctorId){$scope.outreferral={Patient_id:patientId,success:!1,calId:calId},$timeout(function(){$scope.outreferral.doctorId=doctorId,$scope.outreferral.calId=calId},600),$scope.$watch("outreferral.success",function(success){success&&$modalInstance.close("success")})},size:"lg",resolve:{patientId:function(){return scope.patientId},calId:function(){return scope.calId},doctorId:function(){return scope.doctorId}}}).result.then(function(success){"success"===success&&(toastr.success("Add Successfully"),scope.addSuccess=!0)})},show=function(list){$modal.open({templateUrl:"dialogOutreferralShow",controller:"OutreferralPatientShowDialog",size:"lg",resolve:{list:function(){return list}}}).result.then(function(response){"success"===response&&(toastr.success("Edit Successfully"),scope.outreferral.load())})};scope.outreferral={dialog:{add:function(){add()},remove:function(list){remove(list)},edit:function(list){edit(list)},show:function(list){show(list)}},load:function(){load()},list:[],count:0,search:angular.copy(search),onPage:function(page){onPage(page)},onSearch:function(){onSearch()},onOrderBy:function(option){onOrderBy(option)},clickEnable:function(row){clickEnable(row)},clickDisale:function(row){clickDisale(row)}},scope.outreferral.load(),scope.$watch("reload",function(reload){scope.outreferral.search=angular.copy(search),reload&&scope.outreferral.load()})}}}),angular.module("app.loggedIn.outreferral.directives.patientAdd",[]).directive("outreferralPatientAdd",function($cookieStore,$modal,OutreferralModel,ConfigService,$stateParams){return{restrict:"EA",scope:{patientId:"=",calId:"=",success:"=",doctorId:"=",data:"="},templateUrl:"modules/outreferral/directives/templates/patientAdd.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id,form=($cookieStore.get("userInfo").user_type,{CAL_ID:scope.calId,patient_id:scope.patientId,date_issued:null,date_started:null,duration:null,expire_date:null,referred_to_doctor:null,doctor_id:null,created_by:user_id,last_updated_by:user_id});scope.$watch("calId",function(calId){"undefined"!=typeof calId&&(form.CAL_ID=calId)});var save=function(){ConfigService.beforeSave(scope.outreferral.errors);var postData=angular.copy(scope.outreferral.form);postData.Creation_date=postData.Last_update_date=moment().format("YYYY-MM-DD"),postData.date_issued&&(postData.date_issued=ConfigService.convertToDB(postData.date_issued)),postData.date_started&&(postData.date_started=ConfigService.convertToDB(postData.date_started)),postData.expire_date&&(postData.expire_date=ConfigService.convertToDB(postData.expire_date)),OutreferralModel.addPatient(postData).then(function(response){scope.success=!0},function(error){scope.outreferral.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.outreferral.errors)})};scope.$watch("doctorId",function(doctorId){if("undefined"!=typeof doctorId){var postData=doctorId;OutreferralModel.DotorFromUserId(postData).then(function(response){scope.outreferral.form.referred_to_doctor=response.data[0].doctor_id,scope.referdoctor.name=response.data[0].NAME},function(error){})}});var load=function(){},outdoctorSelect=function(){$modal.open({templateUrl:"selectOutdoctorDialog",size:"lg",controller:function($scope,$modalInstance){$scope.$watch("data",function(data){"undefined"!=typeof data&&$modalInstance.close(data)}),$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.outreferral.form.doctor_id=row.doctor_id,scope.outdoctor.name=row.name})},doctorSelect=function(){$modal.open({templateUrl:"selectDoctorDialog",size:"lg",controller:function($scope,$modalInstance){$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.outreferral.form.referred_to_doctor=row.doctor_id,scope.referdoctor.name=row.NAME})};scope.outreferral={form:angular.copy(form),errors:[],save:function(){save()}},scope.outdoctor={name:"Select Outside Doctor",dialog:{select:function(){outdoctorSelect()}}},scope.referdoctor={name:"Referred To Doctor",dialog:{select:function(){doctorSelect()}}},scope.onChange=function(){if(null!=scope.outreferral.form.date_started)if(null==scope.outreferral.form.duration)scope.outreferral.form.expire_date=scope.outreferral.form.date_started;else{var a=parseInt(scope.outreferral.form.duration),date_started=ConfigService.convertToDB(scope.outreferral.form.date_started);date_started=moment(date_started).format();var b=moment(date_started).add(a,"months").toString(),date=moment(b).format("YYYY-MM-DD");date=ConfigService.convertToDate(date),scope.outreferral.form.expire_date=date}},scope.outreferral={form:angular.copy(form),load:function(){load()},errors:[],save:function(){save()}},scope.outreferral.load()}}}),angular.module("app.loggedIn.outreferral.directives.patientShow",[]).directive("outreferralPatientShow",function($cookieStore,$modal,OutreferralModel,ConfigService){return{restrict:"EA",scope:{patientId:"=",id:"=",success:"="},templateUrl:"modules/outreferral/directives/templates/patientShow.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id,form={patient_id:scope.patientId,date_issued:null,date_started:null,duration:null,expire_date:null,referred_to_doctor:null,doctor_id:null,created_by:user_id,last_updated_by:user_id},save=function(){ConfigService.beforeSave(scope.outreferral.errors);var postData=angular.copy(scope.outreferral.form);postData.Creation_date=postData.Last_update_date=moment().format("YYYY-MM-DD"),postData.date_issued&&(postData.date_issued=ConfigService.convertToDB(postData.date_issued)),postData.date_started&&(postData.date_started=ConfigService.convertToDB(postData.date_started)),postData.expire_date&&(postData.expire_date=ConfigService.convertToDB(postData.expire_date)),OutreferralModel.edit(postData).then(function(response){scope.success=!0},function(error){scope.outreferral.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.outreferral.errors)})},outdoctorSelect=function(){$modal.open({templateUrl:"selectOutdoctorDialog",controller:function($scope,$modalInstance){$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.outreferral.form.doctor_id=row.doctor_id,scope.outdoctor.name=row.name})},doctorSelect=function(){$modal.open({templateUrl:"selectDoctorDialog",controller:function($scope,$modalInstance){$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.outreferral.form.referred_to_doctor=row.doctor_id,scope.referdoctor.name=row.NAME})},load=function(){var postData={id:scope.id};OutreferralModel.one(postData).then(function(response){angular.extend(scope.outreferral.form,response.data),scope.outreferral.form.date_issued=ConfigService.convertToDate(scope.outreferral.form.date_issued),scope.outreferral.form.expire_date=ConfigService.convertToDate(scope.outreferral.form.expire_date),scope.outreferral.form.date_started=ConfigService.convertToDate(scope.outreferral.form.date_started),scope.referdoctor.name=scope.outreferral.form.doctor_name,scope.outdoctor.name=scope.outreferral.form.outdoctor_name,delete scope.outreferral.form.creation_date,delete scope.outreferral.form.doctor_name,delete scope.outreferral.form.outdoctor_name},function(error){})};scope.outreferral={form:angular.copy(form),load:function(){load()},errors:[],save:function(){save()}},scope.outdoctor={name:"Select Outside Doctor",dialog:{select:function(){outdoctorSelect()}}},scope.referdoctor={name:"Referred To Doctor",dialog:{select:function(){doctorSelect()}}},scope.outreferral.load()}}}),angular.module("app.loggedIn.outreferral.directives.patientEdit",[]).directive("outreferralPatientEdit",function($cookieStore,$modal,OutreferralModel,ConfigService){return{restrict:"EA",scope:{patientId:"=",id:"=",success:"=",data:"="},templateUrl:"modules/outreferral/directives/templates/patientEdit.html",link:function(scope,elem,attrs){var user_id=$cookieStore.get("userInfo").id,form={patient_id:scope.patientId,date_issued:null,date_started:null,duration:null,expire_date:null,referred_to_doctor:null,doctor_id:null,created_by:user_id,last_updated_by:user_id},save=function(){ConfigService.beforeSave(scope.outreferral.errors);var postData=angular.copy(scope.outreferral.form);postData.Creation_date=postData.last_update_date=moment().format("YYYY-MM-DD"),postData.date_issued&&(postData.date_issued=ConfigService.convertToDB(postData.date_issued)),postData.date_started&&(postData.date_started=ConfigService.convertToDB(postData.date_started)),postData.expire_date&&(postData.expire_date=ConfigService.convertToDB(postData.expire_date)),OutreferralModel.edit(postData).then(function(response){scope.success=!0},function(error){scope.outreferral.errors=angular.copy(error.data.errors),ConfigService.beforeError(scope.outreferral.errors)})},outdoctorSelect=function(){$modal.open({templateUrl:"selectOutdoctorDialog",size:"lg",controller:function($scope,$modalInstance){$scope.$watch("data",function(data){"undefined"!=typeof data&&$modalInstance.close(data)}),$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.outreferral.form.doctor_id=row.doctor_id,scope.outdoctor.name=row.name})},doctorSelect=function(){$modal.open({templateUrl:"selectDoctorDialog",size:"lg",controller:function($scope,$modalInstance){$scope.clickRow=function(row){$modalInstance.close(row)}}}).result.then(function(row){scope.outreferral.form.referred_to_doctor=row.doctor_id,scope.referdoctor.name=row.NAME})},load=function(){var postData={id:scope.id};OutreferralModel.one(postData).then(function(response){angular.extend(scope.outreferral.form,response.data),scope.outreferral.form.date_issued=ConfigService.convertToDate(scope.outreferral.form.date_issued),scope.outreferral.form.expire_date=ConfigService.convertToDate(scope.outreferral.form.expire_date),scope.outreferral.form.date_started=ConfigService.convertToDate(scope.outreferral.form.date_started),scope.referdoctor.name=scope.outreferral.form.doctor_name,scope.outdoctor.name=scope.outreferral.form.outdoctor_name,delete scope.outreferral.form.creation_date,delete scope.outreferral.form.doctor_name,delete scope.outreferral.form.outdoctor_name},function(error){})};scope.onChange=function(){if(null!=scope.outreferral.form.date_started)if(null==scope.outreferral.form.duration)scope.outreferral.form.expire_date=scope.outreferral.form.date_started;else{var a=parseInt(scope.outreferral.form.duration),date_started=ConfigService.convertToDB(scope.outreferral.form.date_started);date_started=moment(date_started).format();var b=moment(date_started).add(a,"months").toString(),date=moment(b).format("YYYY-MM-DD");date=ConfigService.convertToDate(date),scope.outreferral.form.expire_date=date}},scope.outreferral={form:angular.copy(form),load:function(){load()},errors:[],save:function(){save()}},scope.outdoctor={name:"Select Outside Doctor",dialog:{select:function(){outdoctorSelect()}}},scope.referdoctor={name:"Referred To Doctor",dialog:{select:function(){doctorSelect()}}},scope.outreferral.load()}}});