angular.module("app.loggedIn.booking",["app.loggedIn.booking.make.controller","app.loggedIn.booking.list.controller","app.loggedIn.booking.package.controller","app.loggedIn.booking.position.controller","app.loggedIn.booking.setting.controller","app.loggedIn.booking.services"]).config(function($stateProvider){$stateProvider.state("loggedIn.makeBooking",{url:"/onlineBooking/make",templateUrl:"modules/onlineBooking/views/makeBooking.html",controller:"MakeBookingController"}).state("loggedIn.bookingList",{url:"/onlineBooking/booking",templateUrl:"modules/onlineBooking/views/booking.html",controller:"BookingListController"}).state("loggedIn.package",{url:"/onlineBooking/package",templateUrl:"modules/onlineBooking/views/package.html",controller:"PackageController"}).state("loggedIn.position",{url:"/onlineBooking/position",templateUrl:"modules/onlineBooking/views/position.html",controller:"PositionController"}).state("loggedIn.setting",{url:"/onlineBooking/setting",templateUrl:"modules/onlineBooking/views/settings.html",controller:"SettingController"}).state("loggedIn.newUser",{url:"/onlineBooking/setting/newUser",templateUrl:"modules/onlineBooking/views/newUser.html",controller:"NewUserController"}).state("loggedIn.editUser",{url:"/onlineBooking/setting/editUser/:id",templateUrl:"modules/onlineBooking/views/newUser.html",controller:"EditUserController"})}),angular.module("app.loggedIn.booking.make.controller",[]).controller("MakeBookingController",function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore,$timeout){var companyInfo,userInfo;"undefined"!=typeof $cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo")),"undefined"!=typeof $cookieStore.get("userInfo")&&(userInfo=$cookieStore.get("userInfo")),$scope.companyName=null===companyInfo.Company_name?"":companyInfo.Company_name,$scope.companyList=[],$scope.packageList=[],$scope.data=[];var mPO,mResult,mInvoice,mIsProject;$scope.c={SubCompanyId:"",PO_number:"",result_email:"",invoice_email:"",Project:"",Comment:"",PackId:"",isProject:null==companyInfo.isProject?0:companyInfo.isProject},OnlineBookingService.deleteAllPending(),$scope.c=companyInfo,mPO=companyInfo.PO_number,mResult=companyInfo.result_email,mInvoice=companyInfo.invoice_email,mIsProject=companyInfo.isProject,null!=$scope.data&&($scope.tableParams=new ngTableParams({page:1,count:20},{counts:[],total:$scope.data.length,getData:function($defer,params){var filteredData=params.filter()?$filter("filter")($scope.data,params.filter()):$scope.data,orderedData=params.sorting()?$filter("orderBy")(filteredData,params.orderBy()):$scope.data;params.total(orderedData.length),$defer.resolve(orderedData.slice((params.page()-1)*params.count(),params.page()*params.count()))}})),OnlineBookingService.getSubCompany(companyInfo.id).then(function(response){"success"===response.status&&($scope.companyList=response.rs)}),OnlineBookingService.getPackage(companyInfo.id).then(function(data){"success"===data.status&&($scope.packageList=data.rs,$scope.packageList.push({PackId:-1,package_name:"Custom Package"}))});var arrCustomAss=[],period=null;$scope.packageChange=function(PackId){var arrAss=[];if(null!==PackId)if(-1==PackId){$scope.packAss=[];var modalInstance=$modal.open({templateUrl:"modules/onlineBooking/views/customPackage.html",controller:"CustomPackageController",size:"md"});modalInstance.result.then(function(data){for(var i=0;i<data.length;i++)arrAss.push({head_name:null==data[i].HeaderName||""==data[i].HeaderName?"":data[i].HeaderName,ass_name:data[i].ass_name}),arrCustomAss.push({ass_id:data[i].ass_id,ass_name:data[i].ass_name});$scope.packAss=_.groupBy(arrAss,"head_name"),$scope.newCandidate()},function(err){console.log(err)})}else{arrCustomAss=[],OnlineBookingService.getPackageAssById(PackId).then(function(data){if("success"===data.status){for(var i=0;i<data.rs.length;i++)arrAss.push({head_name:null==data.rs[i].HeaderName||""==data.rs[i].HeaderName?"":data.rs[i].HeaderName,ass_name:data.rs[i].ass_name});$scope.packAss=_.groupBy(arrAss,"head_name")}});for(var i=0;i<$scope.packageList.length;i++)PackId===$scope.packageList[i].PackId&&(period=$scope.packageList[i].period);$scope.newCandidate()}else $scope.packAss=[]},$scope.subChange=function(subId){null!==subId&&OnlineBookingService.getSubCompanyInfo(subId).then(function(data){$scope.c.SubCompanyId=data.id,$scope.c.PO_number=data.PO_number,$scope.c.result_email=data.result_email,$scope.c.invoice_email=data.invoice_email,$scope.c.isProject=null==data.isProject?0:data.isProject}),null===subId&&($scope.c.PO_number=mPO,$scope.c.result_email=mResult,$scope.c.invoice_email=mInvoice,$scope.c.isProject=mIsProject)},$scope.newCandidate=function(){if(null==$scope.c.PackId)toastr.error("Please Choose A Package First!","Error");else{var modalInstance=$modal.open({templateUrl:"modules/onlineBooking/views/newCandidate.html",controller:"NewCandidateController",size:"md",resolve:{companyId:function(){return companyInfo.id},editInfo:function(){return null},period:function(){return period},status:function(){return null==companyInfo.default_status||""==companyInfo.default_status?"Pending":companyInfo.default_status}}});modalInstance.result.then(function(candidateInfo){$scope.data.push(candidateInfo),$scope.tableParams.reload()},function(err){console.log(err)})}},$scope.editCandidate=function(b){var modalInstance=$modal.open({templateUrl:"modules/onlineBooking/views/newCandidate.html",controller:"NewCandidateController",size:"md",resolve:{companyId:function(){return companyInfo.id},editInfo:function(){return b},period:function(){return period},status:function(){return null==companyInfo.default_status||""==companyInfo.default_status?"Pending":companyInfo.default_status}}});modalInstance.result.then(function(candidateInfo){var index=$scope.data.indexOf(b);$scope.data[index]=candidateInfo,$scope.tableParams.reload()},function(err){console.log(err)})},$scope.deleteCandidate=function(b){OnlineBookingService.deletePending(b).then(function(data){if("success"==data.status){var index=$scope.data.indexOf(b);index>-1&&$scope.data.splice(index,1),$scope.tableParams.reload()}else toastr.error("Delete Failed!","Error")})},$scope.submitBooking=function(bookingForm){$scope.headInfo={PO_number:$scope.c.PO_number,result_email:$scope.c.result_email,invoice_email:$scope.c.invoice_email,ProjectIdentification:$scope.c.Project,Comment:$scope.c.Comment,PackageId:$scope.c.PackId,CompanyId:null==companyInfo.father_id?companyInfo.id:companyInfo.father_id,Booking_Person:userInfo.Booking_Person,contact_number:userInfo.Contact_number,subCompany_Id:null==$scope.c.SubCompanyId?null:$scope.c.SubCompanyId,contact_email:userInfo.Contact_email,arrCustomAss:arrCustomAss.length<=0?null:arrCustomAss},$scope.showClickedValidation=!0,bookingForm.$invalid?toastr.error("Please Input All Required Information!","Error"):$scope.data.length<=0?toastr.error("Please Add Some Candidate For Booking!","Error"):OnlineBookingService.submitBook($scope.data,$scope.headInfo).then(function(data){"success"===data.status?(toastr.success("Submit Booking Successfully!","Success"),$state.go("loggedIn.makeBooking",null,{reload:!0})):"error"===data.status&&toastr.error("Submit Booking Failed!","Error")})}}).controller("CustomPackageController",function($scope,$state,$modalInstance,OnlineBookingService,OnlineBookingAdminService,toastr){$scope.info={checkedAss:[]},OnlineBookingAdminService.getAssessment().then(function(data){$scope.assList=data}),$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.okClick=function(){OnlineBookingService.customPackage($scope.info.checkedAss).then(function(data){$modalInstance.close(data)})}}).controller("NewCandidateController",function($scope,$filter,$state,$modalInstance,OnlineBookingService,companyId,editInfo,period,status,toastr){if($scope.info={siteId:null,fromDate:null,toDate:null,calId:null,candidateName:null,dob:null,position:null,phone:null,email:null,stateId:null,suburbId:null,stateName:null,suburbName:null},$scope.siteList=[],$scope.calList=[],$scope.positionList=[],$scope.cancel=function(){$modalInstance.dismiss("cancel")},null!==editInfo&&($scope.info=editInfo,console.log($scope.info),null!=$scope.info.stateId&&OnlineBookingService.getSiteState($scope.info.siteId).then(function(data){$scope.stateList=data}),null!=$scope.info.suburbId&&OnlineBookingService.getStateSuburb($scope.info.stateId).then(function(data){$scope.suburbList=data})),"undefined"!=typeof $scope.info.siteId&&null!==$scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data})}OnlineBookingService.getSite().then(function(data){$scope.siteList=data}),OnlineBookingService.getPositionList(companyId).then(function(data){$scope.positionList=data}),$scope.minDate=new Date,$scope.maxDate=new Date,$scope.dateOptions={formatYear:"yy",startingDay:1},$scope.haveState=!1,$scope.haveSuburb=!1,$scope.siteChange=function(){if("undefined"!=typeof $scope.info.siteId&&null!==$scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){$scope.info.stateId=null,$scope.info.suburbId=null;var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getSiteState(id).then(function(data){null!=data&&data.length>0?($scope.calList=[],$scope.info.appointmentTime="",$scope.haveState=!0,$scope.stateList=data):($scope.haveState=!1,$scope.haveSuburb=!1,OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data}))})}else $scope.info.stateId=null,$scope.info.suburbId=null,$scope.haveState=!1,$scope.haveSuburb=!1,$scope.calList=[],$scope.info.appointmentTime=""},$scope.siteStateChange=function(id){null!=id?($scope.info.suburbId=null,$scope.suburbList=[],OnlineBookingService.getStateSuburb(id).then(function(data){null!=data&&data.length>0&&($scope.haveSuburb=!0,$scope.suburbList=data)})):($scope.info.suburbId=null,$scope.haveSuburb=!1)},$scope.fromDateChange=function(){if("undefined"!=typeof $scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data})}else $scope.calList=[],$scope.info.appointmentTime=""},$scope.toDateChange=function(){if("undefined"!=typeof $scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data})}else $scope.calList=[],$scope.info.appointmentTime=""},$scope.submitCandidate=function(candidateForm){if($scope.showClickedValidation=!0,candidateForm.$invalid)toastr.error("Please Input All Required Information!","Error");else{if($scope.candidateInfo={siteId:"",fromDate:"",toDate:"",calId:"",candidateName:"",dob:"",position:"",phone:"",email:"",siteName:"",submitDate:"",displayDate:"",stateId:"",suburbId:"",stateName:"",suburbName:"",calId2:null,calId3:null,calId4:null,calId5:null,status:status,candidateId:null},$scope.candidateInfo.candidateName=$scope.info.candidateName,$scope.candidateInfo.dob=$filter("date")($scope.info.dob,"yyyy-MM-dd"),$scope.candidateInfo.position=$scope.info.position,$scope.candidateInfo.phone=$scope.info.phone,$scope.candidateInfo.email=$scope.info.email,$scope.candidateInfo.siteId=$scope.info.siteId,$scope.candidateInfo.fromDate=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),$scope.candidateInfo.toDate=$filter("date")($scope.info.toDate,"yyyy-MM-dd"),$scope.candidateInfo.calId=$scope.info.calId,$scope.candidateInfo.stateId=$scope.info.stateId,$scope.candidateInfo.suburbId=$scope.info.suburbId,"undefined"!=typeof $scope.stateList||null!=$scope.stateList)for(var i=0;i<$scope.stateList.length;i++)$scope.info.stateId==$scope.stateList[i].state_id&&($scope.candidateInfo.stateName=$scope.stateList[i].state_name);if("undefined"!=typeof $scope.suburbList||null!=$scope.suburbList)for(var i=0;i<$scope.suburbList.length;i++)$scope.info.suburbId==$scope.suburbList[i].suburb_id&&($scope.candidateInfo.suburbName=$scope.suburbList[i].suburb_name);if($scope.candidateInfo.stateId=$scope.info.stateId,$scope.candidateInfo.suburbId=$scope.info.suburbId,"undefined"!=typeof $scope.stateList||null!=$scope.stateList)for(var i=0;i<$scope.stateList.length;i++)$scope.info.stateId==$scope.stateList[i].state_id&&($scope.candidateInfo.stateName=$scope.stateList[i].state_name);if("undefined"!=typeof $scope.suburbList||null!=$scope.suburbList)for(var i=0;i<$scope.suburbList.length;i++)$scope.info.suburbId==$scope.suburbList[i].suburb_id&&($scope.candidateInfo.suburbName=$scope.suburbList[i].suburb_name);null!==$scope.info.calId&&OnlineBookingService.getAppointmentTime($scope.info.calId).then(function(data){var submitDate=$filter("date")(data[0].From_time,"yyyy-MM-dd HH:mm:ss"),displayDate=$filter("date")(data[0].From_time,"dd/MM/yyyy HH:mm:ss");$scope.candidateInfo.submitDate=submitDate,$scope.candidateInfo.displayDate=displayDate});for(var i=0;i<$scope.siteList.length;i++)$scope.info.siteId===$scope.siteList[i].id&&($scope.candidateInfo.siteName=$scope.siteList[i].Site_name);for(var i=0;i<$scope.calList.length;i++)$scope.candidateInfo.calId==$scope.calList[i].cal_id&&(2==period?$scope.candidateInfo.calId2=$scope.calList[i+1].cal_id:3==period&&($scope.candidateInfo.calId2=$scope.calList[i+1].cal_id,$scope.candidateInfo.calId3=$scope.calList[i+2].cal_id));OnlineBookingService.pendingCalendar($scope.candidateInfo).then(function(data){"success"==data.status?($scope.candidateInfo.candidateId=data.newCanId,$modalInstance.close($scope.candidateInfo)):toastr.error("Submit Error!","Error")})}}}),angular.module("app.loggedIn.booking.list.controller",[]).controller("BookingListController",function($scope,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){var companyInfo;$scope.selectedCanId=null,$scope.selectedBookId=null,$scope.dateOptions={formatYear:"yy",startingDay:1},$scope.cId=null,$scope.isExtra=0,"undefined"!==$cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo"),$scope.cId=companyInfo.id,$scope.isExtra=1==companyInfo.isExtra?1:0),OnlineBookingService.getBookingList(companyInfo.id).then(function(data){"success"===data.status&&($scope.data=data.rs,$scope.tableParams=new ngTableParams({page:1,count:10},{total:$scope.data.length,getData:function($defer,params){var filteredData=params.filter()?$filter("filter")($scope.data,params.filter()):$scope.data,orderedData=params.sorting()?$filter("orderBy")(filteredData,params.orderBy()):$scope.data;params.total(orderedData.length),$defer.resolve(orderedData.slice((params.page()-1)*params.count(),params.page()*params.count()))}}))}),$scope.bookingSelected=function(b){$scope.selectedCanId=b.Candidate_id,$scope.selectedBookId=b.Booking_id},$scope.openDetail=function(b){$modal.open({templateUrl:"modules/onlineBooking/views/bookingDetailModal.html",controller:"BookingDetailController",size:"lg",resolve:{bookingId:function(){return b.Booking_id},candidateId:function(){return b.Candidate_id}}})},$scope.cancelBooking=function(b){$modal.open({templateUrl:"modules/onlineBooking/views/confirmCancel.html",controller:"CancelController",size:"md",resolve:{bookingId:function(){return b.Booking_id}}})},$scope.changeBookingTime=function(b){$modal.open({templateUrl:"modules/onlineBooking/views/changeBookingTime.html",controller:"ChangeBookingController",size:"md",resolve:{bookingId:function(){return b.Booking_id}}})},$scope.searchModal=function(){var modalInstance=$modal.open({templateUrl:"modules/onlineBooking/views/searchBookingModal.html",controller:"SearchBookingController",size:"md",resolve:{companyId:function(){return companyInfo.id}}});modalInstance.result.then(function(data){$scope.data=data,$scope.$watch("data",function(data){$scope.data=data,$scope.tableParams.reload()})})},$scope.updateNote=function(b){var a={bookingId:b.Booking_id,candidateId:b.Candidate_id,note:b.Appointment_notes};OnlineBookingService.updateNote(a).then(function(data){"success"===data.status?toastr.success("Edit Successfully!","Success"):toastr.error("Edit Failed!","Error")})}}).controller("SearchBookingController",function($scope,$modalInstance,OnlineBookingService,companyId){$scope.minDate=new Date,$scope.dateOptions={formatYear:"yy",startingDay:1},$scope.info={companyId:companyId,companyName:null,candidateName:null,fromDate:null,toDate:null,bookingPerson:null,status:null,siteName:null},$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.search=function(){OnlineBookingService.searchBooking($scope.info).then(function(data){$modalInstance.close(data)})},$scope.reset=function(){OnlineBookingService.getBookingList(companyId).then(function(data){$modalInstance.close(data.rs)})}}).controller("BookingDetailController",function($scope,$modalInstance,OnlineBookingService,bookingId,candidateId){$scope.cancel=function(){$modalInstance.dismiss("cancel")},OnlineBookingService.getBookingDetail(bookingId,candidateId).then(function(data){var arrAss=[];$scope.detail=data.rs[0],"undefined"!=typeof data.rs[0].package_id&&OnlineBookingService.getPackageAssById(data.rs[0].package_id).then(function(data){if("success"===data.status){for(var i=0;i<data.rs.length;i++)arrAss.push({head_name:data.rs[i].HeaderName,ass_name:data.rs[i].ass_name});$scope.detail.ass=_.groupBy(arrAss,"head_name")}})})}).controller("CancelController",function($scope,$state,$modalInstance,OnlineBookingService,bookingId){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.okClick=function(){OnlineBookingService.cancelBooking(bookingId).then(function(data){"success"===data.status?($modalInstance.dismiss("cancel"),$state.go("loggedIn.bookingList",null,{reload:!0})):alert("Failed")})}}).controller("ChangeBookingController",function($scope,$filter,$state,$modalInstance,OnlineBookingService,toastr,bookingId){$scope.info={siteId:"",fromDate:"",toDate:"",calId:"",appointmentTime:"",submitTime:""},$scope.siteList=[],$scope.calList=[],$scope.cancel=function(){$modalInstance.dismiss("cancel")},OnlineBookingService.getSite().then(function(data){$scope.siteList=data}),$scope.dateOptions={formatYear:"yy",startingDay:1},$scope.siteChange=function(){if("undefined"!=typeof $scope.info.siteId&&null!==$scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data})}else $scope.calList=[],$scope.info.appointmentTime=""},$scope.fromDateChange=function(){if("undefined"!=typeof $scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data})}else $scope.calList=[],$scope.info.appointmentTime=""},$scope.toDateChange=function(){if("undefined"!=typeof $scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate){var id=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd");OnlineBookingService.getCalendar(id,from,to).then(function(data){$scope.calList=data})}else $scope.calList=[],$scope.info.appointmentTime=""},$scope.calChange=function(){if(null!==$scope.info.calId&&"undefined"!=typeof $scope.info.calId){var calId=$scope.info.calId;OnlineBookingService.getAppointmentTime(calId).then(function(data){var date=$filter("date")(data[0].From_time,"dd/MM/yyyy HH:mm:ss"),submitDate=$filter("date")(data[0].From_time,"yyyy-MM-dd HH:mm:ss");$scope.info.appointmentTime=date,$scope.info.submitTime=submitDate})}else $scope.info.appointmentTime=""},$scope.submit=function(){if(null!==$scope.info.siteId&&"undefined"!=typeof $scope.info.fromDate&&"undefined"!=typeof $scope.info.toDate&&null!==$scope.info.calId){var siteId=$scope.info.siteId,from=$filter("date")($scope.info.fromDate,"yyyy-MM-dd"),to=$filter("date")($scope.info.toDate,"yyyy-MM-dd"),calId=$scope.info.calId,time=$scope.info.submitTime;OnlineBookingService.changeBookingTime(siteId,from,to,calId,time,bookingId).then(function(data){"success"===data.status?($modalInstance.dismiss("cancel"),toastr.success("Submit Successfully!","Success"),$state.go("loggedIn.bookingList",null,{reload:!0})):toastr.error("Submit Failed!","Error")})}}}),angular.module("app.loggedIn.booking.package.controller",[]).controller("PackageController",function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){var companyInfo;$scope.isSelected=!1,$scope.selectedPack=null;var ass=[];$scope.assList=[],$scope.data=[],$scope.data1=[],"undefined"!==$cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo")),OnlineBookingService.getPackage(companyInfo.id).then(function(data){"success"===data.status&&(OnlineBookingService.getAssList().then(function(data){$scope.assList=data}),$scope.data=data.rs,$scope.tableParams=new ngTableParams({page:1,count:10},{total:$scope.data.length,getData:function($defer,params){var filteredData=params.filter()?$filter("filter")($scope.data,params.filter()):$scope.data,orderedData=params.sorting()?$filter("orderBy")(filteredData,params.orderBy()):$scope.data;params.total(orderedData.length),$defer.resolve(orderedData.slice((params.page()-1)*params.count(),params.page()*params.count()))}}),OnlineBookingService.getPackageAss().then(function(data){ass=data.rs,$scope.tableParams2=new ngTableParams({page:1,count:10},{total:$scope.data1.length,getData:function($defer,params){var filteredData=params.filter()?$filter("filter")($scope.data1,params.filter()):$scope.data1,orderedData=params.sorting()?$filter("orderBy")(filteredData,params.orderBy()):$scope.data1;params.total(orderedData.length),$defer.resolve(orderedData.slice((params.page()-1)*params.count(),params.page()*params.count()))}})}))}),$scope.removePackage=function(p){OnlineBookingService.deletePackage(p.PackId,companyInfo.id).then(function(data){"success"===data.status?(OnlineBookingService.getPackage(companyInfo.id).then(function(d){"success"===d.status&&($scope.data=d.rs),$scope.$watch("data",function(data){$scope.data=data,$scope.tableParams.reload()})}),toastr.success("Delete Successfully","Success")):toastr.error("Delete Failed","Error")})},$scope.addPackage=function(){var modalInstance=$modal.open({templateUrl:"modules/onlineBooking/views/addPackage.html",controller:"AddPackageController",size:"md",resolve:{comId:function(){return companyInfo.id}}});modalInstance.result.then(function(){OnlineBookingService.getPackage(companyInfo.id).then(function(d){"success"===d.status&&($scope.data=d.rs),$scope.$watch("data",function(data){$scope.data=data,$scope.tableParams.reload()})})})},$scope.addPackageAss=function(){$modal.open({templateUrl:"modules/onlineBooking/views/addPackageAss.html",controller:"AddPackageAssController",size:"md",resolve:{packId:function(){return $scope.selectedPack}}})},$scope.showChild=function(p){$scope.data1=[],$scope.isSelected=!0,$scope.selectedPack=p.PackId;for(var i=0;i<ass.length;i++)p.PackId===ass[i].pack_id&&$scope.data1.push(ass[i]);$scope.tableParams2.reload()},$scope.removeAss=function(a){$scope.data1=[],OnlineBookingService.removePackAss(a.ass_id,a.pack_id).then(function(data){"success"===data.status?(toastr.success("Delete Successfully!","Success"),OnlineBookingService.getPackageAss().then(function(data){ass=data.rs;for(var i=0;i<ass.length;i++)p.PackId===ass[i].pack_id&&$scope.data1.push(ass[i])}),$scope.tableParams2.reload()):toastr.error("Delete Failed!","Error")})}}).controller("AddPackageController",function($scope,$state,toastr,$modalInstance,OnlineBookingService,comId){$scope.info={packName:""},$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.submit=function(){""!==$scope.info.packName&&OnlineBookingService.insertPackage($scope.info.packName,comId).then(function(data){"success"===data.status?(toastr.success("Insert Successfully!","Success"),$modalInstance.close()):toastr.error("Insert Failed!","Error")})}}).controller("AddPackageAssController",function($scope,$state,toastr,$modalInstance,OnlineBookingService,packId){OnlineBookingService.getAssList().then(function(data){$scope.assList=data}),$scope.a={id:""},$scope.b={price:null},$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.getPrice=function(id){null!=id?OnlineBookingService.getAssPrice(id).then(function(data){console.log(data[0].price),$scope.b.price=data[0].price}):$scope.b.price=""},$scope.submit=function(){null!==$scope.a.id&&OnlineBookingService.insertPackAss($scope.a.id,packId).then(function(data){"success"===data.status?(toastr.success("Insert Successfully!","Success"),$modalInstance.dismiss("cancel"),$state.go("loggedIn.package",null,{reload:!0})):toastr.error("Insert Failed!","Error")})}}),angular.module("app.loggedIn.booking.position.controller",[]).controller("PositionController",function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){var companyInfo;"undefined"!==$cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo")),$scope.data=[],OnlineBookingService.getPositionList(companyInfo.id).then(function(data){$scope.data=data,$scope.tableParams=new ngTableParams({page:1,count:10},{total:$scope.data.length,getData:function($defer,params){var filteredData=params.filter()?$filter("filter")($scope.data,params.filter()):$scope.data,orderedData=params.sorting()?$filter("orderBy")(filteredData,params.orderBy()):$scope.data;params.total(orderedData.length),$defer.resolve(orderedData.slice((params.page()-1)*params.count(),params.page()*params.count()))}})}),$scope.removePosition=function(p){OnlineBookingService.deletePosition(p.Position_name,companyInfo.id).then(function(data){"success"===data.status?(toastr.success("Delete Successfully!","Success"),$state.go("loggedIn.position",null,{reload:!0})):toastr.error("Delete Failed!","Error")})},$scope.addPosition=function(){$modal.open({templateUrl:"modules/onlineBooking/views/addPosition.html",controller:"AddPositionController",size:"md",resolve:{comId:function(){return companyInfo.id}}})}}).controller("AddPositionController",function($scope,$state,toastr,$modalInstance,OnlineBookingService,comId){$scope.info={positionName:""},$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.submit=function(){""!==$scope.info.positionName&&OnlineBookingService.insertPos($scope.info.positionName,comId).then(function(data){"success"===data.status?(toastr.success("Insert Successfully!","Success"),$modalInstance.dismiss("cancel"),$state.go("loggedIn.position",null,{reload:!0})):toastr.error("Insert Failed!","Error")})}}),angular.module("app.loggedIn.booking.setting.controller",[]).controller("SettingController",function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){var companyInfo,userInfo;$scope.data=[],"undefined"!=typeof $cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo")),"undefined"!=typeof $cookieStore.get("userInfo")&&(userInfo=$cookieStore.get("userInfo")),OnlineBookingService.getUserByCompany(companyInfo.id).then(function(data){$scope.data=data,$scope.tableParams=new ngTableParams({page:1,count:10},{total:data.length,getData:function($defer,params){var filteredData=params.filter()?$filter("filter")($scope.data,params.filter()):$scope.data,orderedData=params.sorting()?$filter("orderBy")(filteredData,params.orderBy()):$scope.data;params.total(orderedData.length),$defer.resolve(orderedData.slice((params.page()-1)*params.count(),params.page()*params.count()))}})}),$scope.newUser=function(){$state.go("loggedIn.newUser")},$scope.editUser=function(b){$state.go("loggedIn.editUser",{id:b.id})}}).controller("NewUserController",function($scope,$state,OnlineBookingService,toastr,$cookieStore){var companyInfo;$scope.isEdit=!1,$scope.data=[],"undefined"!=typeof $cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo")),$scope.info={bookPerson:null,email:null,isDownload:"1",isEnable:"1",isMakeBooking:"1",isPackage:"1",isPosition:"1",isSetting:"1",isShowAll:"1",isShowBooking:"1",isViewAllData:"1",password:null,phone:null,username:null,userType:"Company",companyId:companyInfo.id,poNum:null,invoiceEmail:null,resultEmail:null,reportEmail:null,function_id:null,empId:null,isCalendar:null,isProject:null,isAdmin:null,isReceiveEmail:null},$scope.submitUser=function(userForm){$scope.showClickedValidation=!0,userForm.$invalid?toastr.error("Please Input All Required Information!","Error"):OnlineBookingService.insertNewUser($scope.info).then(function(data){"success"===data.status?(toastr.success("Submit New User Successfully!","Success"),$state.go("loggedIn.newUser",null,{reload:!0})):"error"===data.status&&toastr.error("Submit New User Failed!","Error")})}}).controller("EditUserController",function($scope,$state,$stateParams,$modal,OnlineBookingService,toastr,$cookieStore){var companyInfo;$scope.isEdit=!0,$scope.data=[],"undefined"!=typeof $cookieStore.get("companyInfo")&&(companyInfo=$cookieStore.get("companyInfo")),$scope.info={userId:$stateParams.id,bookPerson:null,email:null,isDownload:"1",isEnable:"1",isMakeBooking:"1",isPackage:"1",isPosition:"1",isSetting:"1",isShowAll:"1",isShowBooking:"1",isViewAllData:"1",phone:null,username:null,companyId:companyInfo.id,userType:"Company"},OnlineBookingService.getUserInfo($stateParams.id).then(function(data){$scope.info.bookPerson=data.Booking_Person,$scope.info.email=data.Contact_email,$scope.info.isDownload=1==data.isDownloadResult?"1":"0",$scope.info.isEnable=1==data.isEnable?"1":"0",$scope.info.isMakeBooking=1==data.isMakeBooking?"1":"0",$scope.info.isPackage=1==data.isPackage?"1":"0",$scope.info.isPosition=1==data.isPosition?"1":"0",$scope.info.isSetting=1==data.isSetting?"1":"0",$scope.info.isShowAll=1==data.isAll?"1":"0",$scope.info.isShowBooking=1==data.isBooking?"1":"0",$scope.info.isViewAllData=1==data.isAllCompanyData?"1":"0",$scope.info.phone=data.Contact_number,$scope.info.username=data.user_name}),$scope.submitUser=function(userForm){$scope.showClickedValidation=!0,userForm.$invalid?toastr.error("Please Input All Required Information!","Error"):OnlineBookingService.editUserInfo($scope.info).then(function(data){"success"===data.status?toastr.success("Submit New User Successfully!","Success"):"error"===data.status&&toastr.error("Submit New User Failed!","Error")})},$scope.changePass=function(){$modal.open({templateUrl:"modules/onlineBooking/views/changePassModal.html",controller:"ChangePassController",size:"md",resolve:{userId:function(){return $stateParams.id}}})}}).controller("ChangePassController",function($scope,$filter,$state,$modalInstance,OnlineBookingService,userId,toastr){$scope.info={oldPass:null,newPass:null,id:userId},$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.okClick=function(){OnlineBookingService.changeUserPassword($scope.info).then(function(data){"success"===data.status?toastr.success("Change Password Successfully","Success"):"error"===data.status&&toastr.error("Change Password Failed","Error")})}}),angular.module("app.loggedIn.booking.services",[]).factory("OnlineBookingService",function(Restangular){
var bookingService={},api=Restangular.all("api");return bookingService.getSubCompany=function(id){var sub=api.all("company/sub");return sub.post({id:id})},bookingService.getSubCompanyInfo=function(id){var sub=api.all("company/info");return sub.post({comId:id})},bookingService.getPackage=function(id){var package=api.all("booking/packageList");return package.post({id:id})},bookingService.insertPackage=function(name,comId){var insert=api.all("package/insert");return insert.post({name:name,comId:comId})},bookingService.insertPackAss=function(id,packId){var insert=api.all("package/assessment/insert");return insert.post({id:id,packId:packId})},bookingService.insertPos=function(name,comId){var insert=api.all("booking/position/insert");return insert.post({name:name,comId:comId})},bookingService.getPackageAssById=function(id){var ass=api.all("package/assessment/id");return ass.post({id:id})},bookingService.getPackageAss=function(){var ass=api.one("package/assessment");return ass.get()},bookingService.getAssPrice=function(id){var ass=api.all("assessment/price");return ass.post({id:id})},bookingService.updatePackAss=function(oldId,newId,packId){var ass=api.all("package/assessment/update");return ass.post({oldId:oldId,newId:newId,packId:packId})},bookingService.removePackAss=function(id,packid){var del=api.all("package/assessment/delete");return del.post({id:id,packId:packid})},bookingService.getBookingList=function(id){var list=api.all("booking/list/companyId");return list.post({id:id})},bookingService.getBookingDetail=function(id,canId){var detail=api.all("booking/detail");return detail.post({id:id,canId:canId})},bookingService.cancelBooking=function(id){var cancel=api.all("booking/cancel");return cancel.post({id:id})},bookingService.getSite=function(){var site=api.one("redimedsite/list");return site.get()},bookingService.getCalendar=function(id,from,to){var cal=api.all("booking/calendar");return cal.post({siteId:id,fromDate:from,toDate:to})},bookingService.getAppointmentTime=function(id){var time=api.all("booking/appointmentTime");return time.post({id:id})},bookingService.changeBookingTime=function(siteId,from,to,calId,appTime,bookId){var submit=api.all("booking/changeBookingTime");return submit.post({siteId:siteId,from:from,to:to,calId:calId,appTime:appTime,bookId:bookId})},bookingService.deletePackage=function(id,comId){var delPackage=api.all("booking/delete/package");return delPackage.post({id:id,comId:comId})},bookingService.getAssList=function(){var assList=api.one("booking/assList");return assList.get()},bookingService.getPositionList=function(comId){var position=api.all("booking/position/list");return position.post({comId:comId})},bookingService.deletePosition=function(name,comId){var del=api.all("booking/position/delete");return del.post({name:name,comId:comId})},bookingService.submitBook=function(info,head){var submit=api.all("booking/submit");return submit.post({info:info,header:head})},bookingService.pendingCalendar=function(info){var submit=api.all("booking/pending");return submit.post({info:info})},bookingService.deleteAllPending=function(){var del=api.all("booking/delete/allPending");return del.post()},bookingService.deletePending=function(info){var del=api.all("booking/delete/pending");return del.post({info:info})},bookingService.getUserByCompany=function(comId){var user=api.all("users/company");return user.post({comId:comId})},bookingService.insertNewUser=function(info){var user=api.all("users/insert");return user.post({info:info})},bookingService.getUserInfo=function(id){var user=api.all("users/id");return user.post({id:id})},bookingService.editUserInfo=function(info){var user=api.all("users/edit");return user.post({info:info})},bookingService.changeUserPassword=function(info){var pass=api.all("users/changePass");return pass.post({info:info})},bookingService.getSiteState=function(id){var state=api.all("redimedsite/state");return state.post({id:id})},bookingService.getStateSuburb=function(id){var suburb=api.all("redimedsite/state/suburb");return suburb.post({id:id})},bookingService.customPackage=function(id){var pack=api.all("package/custom");return pack.post({id:id})},bookingService.searchBooking=function(info){var search=api.all("booking/search");return search.post({info:info})},bookingService.updateNote=function(info){var note=api.all("booking/edit/note");return note.post({info:info})},bookingService.exportExcel=function(){var ex=api.one("booking/export");return ex.get()},bookingService});