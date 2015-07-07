angular.module("app.security",["app.security.controller","app.security.services","app.webpatient.controller"]).config(function($stateProvider){$stateProvider.state("security",{"abstract":!1,views:{root:{templateUrl:"modules/security/views/structure.html",controller:"SecurityController"}}}).state("security.login",{url:"/login",views:{"main-content":{templateUrl:"modules/security/views/login.html",controller:"SecurityLoginController"}}}).state("security.forgot",{url:"/forgot",views:{"main-content":{templateUrl:"modules/security/views/forgot.html",controller:"SecurityForgotController"}}}).state("security.term",{url:"/terms",views:{"main-content":{templateUrl:"modules/security/views/terms.html",controller:"SecurityTermsController"}}}).state("security.rlobRegister",{url:"/rlob-register",views:{"main-content":{templateUrl:"/modules/rediLegalOnlineBooking/views/register.html",controller:"rlobRegisterController"}}}).state("security.rlobSponsor",{url:"/rlob-sponsor",views:{"main-content":{templateUrl:"/modules/rediLegalOnlineBooking/views/mobile/sponsor1.html",controller:"rlobSponsor1Controller"}}}).state("security.rlobSponsor.emergency",{url:"/emergency",templateUrl:"/modules/rediLegalOnlineBooking/views/mobile/emergency.html",controller:"rlobEmergencyController"}).state("security.rlobSponsor.nonemergency",{url:"/nonemergency",templateUrl:"/modules/rediLegalOnlineBooking/views/mobile/nonemergency.html",controller:"rlobNonEmergencyController"}).state("security.redirect",{url:"/redirect/:userId/:patient_id",views:{"main-content":{template:"<div> Waitting </div>",controller:"SecurityRedirectController"}}}).state("security.portalPatient",{url:"/portal-patient",views:{"main-content":{templateUrl:"/modules/security/views/portal-patient.html"}}}).state("webpatient",{"abstract":!1,views:{root:{templateUrl:"modules/security/views/web-patient.html",controller:"WebPatientController"}}}).state("webpatient.checkin",{url:"/portal-patient/web-checkin",templateUrl:"/modules/patient/views/web-checkin.html",controller:"PatientCheckinController"}).state("webpatient.register",{url:"/portal-patient/register",templateUrl:"/modules/patient/views/patient-register.html"}).state("webpatient.booking",{url:"/portal-patient/booking",templateUrl:"/modules/rediLegalOnlineBooking/views/mobile/patient-booking.html"})}),angular.module("app.security.services",[]).factory("SecurityService",function(Restangular){var securityService={},securityApi=Restangular.all("api"),restfulApi=Restangular.all("api/restful");return securityService.getSocket=function(socket){return restfulApi.one("User").get({SOCKET:socket})},securityService.login=function(options){var loginApi=securityApi.all("users/login");return loginApi.post(options)},securityService.company=function(){var companyList=securityApi.one("company/list");return companyList.get()},securityService.regNewUser=function(user){var userList=securityApi.all("users/insert");return userList.post({user:user,isReg:!0})},securityService.checkEmail=function(email){var emailCheck=securityApi.one("users/checkEmail");return emailCheck.get({email:email})},securityService.checkUserName=function(username){var usernameCheck=securityApi.one("users/checkUser");return usernameCheck.get({user_name:username})},securityService.forgotPass=function(email){var forgotMail=securityApi.one("users/forgotPassword");return forgotMail.get({email:email})},securityService}),angular.module("app.security.controller",["app.security.login.controller","app.security.forgot.controller","app.security.register.controller","app.security.redirect.controller","app.security.terms.controller"]).controller("SecurityController",function($scope){$scope.modelUser={username:"",password:"",remember:!1,isAgree:!1}}),angular.module("app.webpatient.controller",[]).controller("WebPatientController",function($scope,ConfigService,$state){$scope.modelObject={Title:"Mr",First_name:"",Sur_name:"",Middle_name:"",Known_as:"",Address1:"",Address2:"",Post_code:null,Country:"AU",DOB:"",Sex:"Male",Home_phone:null,Work_phone:null,Mobile:null,No_SMS:"0",Account_type:"",Account_holder:"",Account_Seft:null,Medicare_no:null,Ref:null,Exp_medicare:"",Private_fund_id:"",MemberShip_no:null,UPI:null,HCC_Pension_No:null,Exp_pension:"",DVA_No:null,Balance:null,Pays_Gap_Only:"1",Email:"",Suburb:"",Alias_First_name:"",Alias_Sur_name:"",Phone_ext:null},$scope.options={};var loadOptionsApi=function(){ConfigService.countries_option().then(function(response){"success"===response.status&&($scope.options.countries=response.data)}),ConfigService.title_option().then(function(response){"success"===response.status&&($scope.options.titles=response.data)}),ConfigService.account_type_option().then(function(response){"success"===response.status&&($scope.options.account_types=response.list)}),ConfigService.private_type_option().then(function(response){"success"===response.status&&($scope.options.private_types=response.list)})};loadOptionsApi(),$scope.params={permission:{create:!0,edit:!1}},$scope.patientInfoCalendar={},$scope.actionCenter={runWhenFinish:function(patienInfo){patienInfo&&($scope.patientInfoCalendar=patienInfo,console.log($scope.patientInfoCalendar),$state.go("webpatient.booking"),console.log(patienInfo))}}}),angular.module("app.security.login.controller",[]).controller("SecurityLoginController",function($http,$scope,$state,$modal,$cookieStore,localStorageService,SecurityService,toastr,UserService,ConfigService,DoctorService,socket){function login(username){socket.emit("updateSocketLogin",username),socket.on("login_success",function(){UserService.detail().then(function(response){if("undefined"!=typeof response.userInfo){$cookieStore.put("userInfo",response.userInfo),$cookieStore.put("isRemember",$scope.modelUser.isRemember),"undefined"!=typeof response.companyInfo&&$cookieStore.put("companyInfo",response.companyInfo);var gotoFunction=function(){null!=response.userInfo.function_id?UserService.getFunction(response.userInfo.function_id).then(function(data){if("undefined"!=typeof data.definition){var rs=data.definition.split("(");if(null!=rs[0])if(null!=rs[1]){var r=rs[1].split(")"),params=eval("("+r[0]+")");$state.go(rs[0],params,{location:"replace",reload:!0})}else $state.go(rs[0],{location:"replace",reload:!0})}else $state.go("loggedIn.home",null,{location:"replace",reload:!0})}):$state.go("loggedIn.home",null,{location:"replace",reload:!0})};"Doctor"==response.userInfo.UserType.user_type?DoctorService.getByUserId(response.userInfo.id).then(function(data){data&&$cookieStore.put("doctorInfo",{doctor_id:data.doctor_id,NAME:data.NAME,Provider_no:data.Provider_no,CLINICAL_DEPT_ID:data.CLINICAL_DEPT_ID}),gotoFunction()},function(err){gotoFunction()}):gotoFunction()}})})}$scope.showClickedValidation=!1,$scope.isLogging=!1,$scope.modelUser={username:null,password:null,isRemember:!1},$scope.login=function(){$scope.showClickedValidation=!0,$scope.loginForm.$invalid?toastr.error("Please Input Your Username And Password!","Error"):SecurityService.login($scope.modelUser).then(function(response){"success"==response.status&&($cookieStore.put("token","abcdefghklf"),socket.emit("checkLogin",$scope.modelUser.username),socket.on("isSuccess",function(){login($scope.modelUser.username)}),socket.on("isError",function(){$scope.isLogging=!1;var modalInstance=$modal.open({templateUrl:"modules/security/views/confirmLogin.html",controller:"ConfirmLoginController",size:"md",backdrop:"static",keyboard:!1});modalInstance.result.then(function(acceptLogin){acceptLogin&&socket.emit("forceLogin",$scope.modelUser.username)},function(err){console.log(err)})}))},function(error){toastr.error("Wrong Username Or Password!")})}}).controller("ConfirmLoginController",function($scope,$filter,$state,$modalInstance,SecurityService,UserService,toastr,socket){$scope.acceptLogin=!1,$scope.cancelLogin=function(){$scope.acceptLogin=!1,$modalInstance.close($scope.acceptLogin)},$scope.acceptLogin=function(){$scope.acceptLogin=!0,$modalInstance.close($scope.acceptLogin)}}),angular.module("app.security.terms.controller",[]).controller("SecurityTermsController",function($scope,$cookieStore,$state){var from=$cookieStore.get("fromState"),params={};console.log(from),$scope.changeState=function(){$state.go(from.fromState.name,params,{location:"replace",reload:!1})}}),angular.module("app.security.forgot.controller",[]).controller("SecurityForgotController",function($scope,toastr,$state,SecurityService){$scope.forgotPass=function(){$scope.showClickedValidation=!0,$scope.forgetForm.$invalid?toastr.error("Please input email.","Error"):SecurityService.forgotPass($scope.email).then(function(data){"success"==data.status?(toastr.success("Change Password Success","Success"),$state.go("loggedIn.home")):toastr.error("Change Password Fail","Fail")},function(err){toastr.error("Change Password Fail","Fail")})}}),angular.module("app.security.register.controller",[]).controller("SecurityRegisterController",function($scope,$state,$cookieStore,SecurityService,toastr){$scope.register=function(){var checkmail="",checkuser="";$scope.showClickedValidation=!0,$scope.registerForm.$invalid?toastr.error("Please check form.","Error"):SecurityService.checkEmail($scope.user.email).then(function(data){checkmail=data}).then(function(){checkmail.length>0?(console.log(checkmail.length),$scope.showClickedValidation=!0,toastr.error("Email da Ton Tai","Error"),$scope.check=!0):SecurityService.checkUserName($scope.user.username).then(function(data){checkuser=data}).then(function(){if(checkuser.length>0)console.log(checkuser),$scope.showClickedValidation=!0,toastr.error("Username da Ton Tai","Error");else{var user={Booking_Person:$scope.user.fname+$scope.user.lname,Contact_email:$scope.user.email,user_name:$scope.user.username,password:$scope.user.password,Contact_number:$scope.user.phone,company_id:$scope.user.companyId};console.log(user),SecurityService.regNewUser(user).then(function(data){console.log(data),toastr.success("Register Success!","Success"),$state.go("loggedIn.home")})}})})},$scope.companyList=[],SecurityService.company().then(function(response){$scope.companyList=response})}),angular.module("app.security.redirect.controller",[]).controller("SecurityRedirectController",function($scope,$state,$location,socket,$stateParams,$location,$cookieStore,SecurityService,UserService){var userId=$stateParams.userId,patient_id=$stateParams.patient_id;UserService.getUserInfo(userId).then(function(data){data&&(delete data.img,$cookieStore.put("userInfo",data),socket.emit("mobileConnect",data.id),$state.go("loggedIn.patient.appointment",{cal_id:0,patient_id:patient_id}))})}),angular.module("app.lockscreen.controller",[]).controller("lockscreenController",function($scope,$rootScope,$state,$cookieStore,SecurityService,UserService,toastr,$window,socket,$location,$rootScope){var userInfo,from=$cookieStore.get("fromState"),isLocking=!0,params={};$rootScope.$on("$stateChangeStart",function(event,toState,toParams,fromState,fromParams){console.log("this is state change to",toState),isLocking===!0&&("security.login"!==toState.name&&"call"!==toState.name?(event.preventDefault(),toastr.error("Please provide your password to unlock the system!","Password required!")):isLocking=!1)}),(null!=from.fromParams||"undefined"!=typeof from.fromParams)&&angular.forEach(from.fromParams,function(value,key){params[key]=value}),null==$cookieStore.get("userInfo")||"undefined"==typeof $cookieStore.get("userInfo")?$state.go("security.login"):userInfo=$cookieStore.get("userInfo"),$scope.modelUser={username:userInfo.user_name,password:null},UserService.getUserInfo(userInfo.id).then(function(data){$scope.img=data.img}),$scope.name=userInfo.Booking_Person,$scope.email=userInfo.Contact_email,$scope.notUser=function(){socket.emit("logout",$cookieStore.get("userInfo").user_name,$cookieStore.get("userInfo").id,$cookieStore.get("userInfo").UserType.user_type),$cookieStore.remove("userInfo"),$cookieStore.remove("companyInfo"),$cookieStore.remove("doctorInfo"),$state.go("security.login",null,{location:"replace",reload:!0}),socket.removeAllListeners()},$scope.returnHome=function(lockForm){$scope.showClickedValidation=!0,lockForm.$invalid?toastr.error("Please Check Your Password!","Error"):(SecurityService.login($scope.modelUser).then(function(response){console.log(response),null!=response&&"success"==response.status?(isLocking=!1,$state.go(from.fromState.name,params,{location:"replace",reload:!0})):toastr.error("Wrong Username Or Password!","Error")}),function(error){toastr.error("Wrong Username Or Password!","Error")})}});