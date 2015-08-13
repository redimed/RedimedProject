function getUrlReport(){return 1==testReport?"http://localhost:3003/RedimedJavaREST/api/document":"http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document"}var invConst={billTo:{privateFund:{display:"Private Funds",value:"private_fund"},otherFeeType:{display:"Other Fee Types",value:"other_fee_type"}},feeGroupType:{private_fund:{value:"private_fund",display:"Private Fund",haveStartDate:!0,sourceFileTypes:{txt:{value:"txt",display:"txt"}}},medicare:{value:"medicare",display:"Medicare",haveStartDate:!1,sourceFileTypes:{xml:{value:"xml",display:"xml"}}},dva:{value:"dva",display:"DVA",haveStartDate:!0,sourceFileTypes:{xml:{value:"xml",display:"xml"}}},public_hospital:{value:"public_hospital",haveStartDate:!1,display:"Public Hospital"},workcover:{value:"workcover",haveStartDate:!1,display:"Workcover"}},feeGroupTypeAuto:{private_fund:{value:"private_fund",display:"Private Fund",haveStartDate:!0,sourceFileTypes:{txt:{value:"txt",display:"txt"}}},workcover:{value:"workcover",haveStartDate:!1,display:"Workcover"}}},testReport=!1;angular.module("app.loggedIn.invoice",["app.loggedIn.invoice.directives","app.loggedIn.invoice.services","app.loggedIn.invoice.controller"]).config(function($stateProvider){$stateProvider.state("loggedIn.invoice",{"abstract":!0,templateUrl:"modules/invoice/views/structure.html",controller:"InvoiceController"}).state("loggedIn.invoice.list",{url:"/invoice/list",views:{"main-content":{templateUrl:"modules/invoice/views/list.html",controller:"InvoiceListController"}}})}),angular.module("app.loggedIn.invoice.services",[]).factory("InvoiceService",function(Restangular){var mdtService={},mdtApi=Restangular.all("api/erm/v2"),api=Restangular.all("api");return mdtService.headerDetail=function(id){var funcApi=mdtApi.all("invoice/detail");return funcApi.post({header_id:id})},mdtService.save=function(id,postData){var funcApi=mdtApi.all("invoice/save");return funcApi.post({header_id:id,status:postData.STATUS,lines:postData.lines,service_id:postData.SERVICE_ID,postData:postData})},mdtService.update=function(id,postData){var funcApi=mdtApi.all("invoice/update");return funcApi.post({header_id:id,data:postData})},mdtService.add=function(postData){var funcApi=mdtApi.all("invoice/add");return funcApi.post({data:postData})},mdtService.removeInvoiceLine=function(data){var funcApi=mdtApi.all("invoice/remove_invoice_line");return funcApi.post({data:data})},mdtService.getInvoiceHeader=function(invoiceHeaderId){var result=api.all("invoice/vn/get-invoice-header");return result.post({invoiceHeaderId:invoiceHeaderId})},mdtService.getInvoiceListLines=function(invoiceHeaderId){var result=api.all("invoice/vn/get-invoice-list-lines");return result.post({invoiceHeaderId:invoiceHeaderId})},mdtService.createInvoiceLine=function(postData){var result=mdtApi.all("invoice/create_invoice_line");return result.post({postData:postData})},mdtService.updateInvoiceLine=function(postData){var result=mdtApi.all("invoice/update_invoice_line");return result.post({postData:postData})},mdtService.saveInvoiceLineSheet=function(postData){var result=mdtApi.all("invoice/save_invoice_line_sheet");return result.post({postData:postData})},mdtService.selectInvoiceHeaderBySession=function(patientId,calId){var result=mdtApi.all("invoice/select_invoice_header_by_session");return result.post({patientId:patientId,calId:calId})},mdtService.selectInvoiceLinesBySession=function(patientId,calId){var result=mdtApi.all("invoice/select_invoice_lines_by_session");return result.post({patientId:patientId,calId:calId})},mdtService.getitemfillterfeeid=function(postData){var funcApi=mdtApi.all("invoice/getitemfillterfeeid");return funcApi.post({data:postData})},mdtService.getpatientbyid=function(postData){var funcApi=mdtApi.all("invoice/getpatientbyid");return funcApi.post({data:postData})},mdtService.getFeegroupbyid=function(postData){var funcApi=mdtApi.all("invoice/feegroupbyid");return funcApi.post({data:postData})},mdtService.getFeeGroupByInsurer=function(postData){var funcApi=mdtApi.all("invoice/get_fee_group_by_insurer");return funcApi.post({data:postData})},mdtService.getFeeGroupByType=function(postData){var funcApi=mdtApi.all("invoice/get_fee_group_by_type");return funcApi.post({data:postData})},mdtService.getFeeType=function(postData){var funcApi=mdtApi.all("invoice/feetype");return funcApi.post({data:postData})},mdtService.getSaveManual=function(postData){var funcApi=mdtApi.all("invoice/savemanual");return funcApi.post({data:postData})},mdtService.getEditManual=function(postData){var funcApi=mdtApi.all("invoice/editmanual");return funcApi.post({data:postData})},mdtService.getOnemanual=function(postData){var funcApi=mdtApi.all("invoice/onemanual");return funcApi.post({data:postData})},mdtService.getfeetypefillter=function(postData){var funcApi=mdtApi.all("invoice/getfeetypefillter");return funcApi.post({data:postData})},mdtService.search=function(option){var funcApi=mdtApi.all("search");return funcApi.post(option)},mdtService.getCurrentFeeOfItems=function(postData){var funcApi=mdtApi.all("invoice/get_current_fee_of_items");return funcApi.post({postData:postData})},mdtService}),angular.module("app.loggedIn.invoice.controller",["app.loggedIn.invoice.list.controller"]).controller("InvoiceController",function($scope,ConfigService){}),angular.module("app.loggedIn.invoice.list.controller",[]).controller("InvoiceListController",function($scope,$state,toastr,ItemService,ConfigService,$modal){var invoice_status=[{label:"-- All --"}].concat($scope.options.invoice_status);$scope.invoiceClass=function(item){return{warning:"approach"==item.STATUS,success:"done"==item.STATUS,danger:"enter"==item.STATUS||null==item.STATUS}},$scope.invoicePanel={},$scope.invoiceOption={api:"api/erm/v2/invoice/search",method:"post",scope:$scope.invoicePanel,columns:[{field:"header_id",is_hide:!0},{field:"cal_id",is_hide:!0},{field:"Patient_id",label:"Patient",type:"custom",fn:function(item){return item.patient?item.patient.Title+". "+item.patient.First_name:void 0}},{field:"SOURCE_ID",label:"Bill to",type:"custom",fn:function(item){return item.cal_id?item.Insurer_id?item.insurer?"Insurer:"+item.insurer.insurer_name:null:item.Company_id?item.company?"Company:"+item.company.Company_name:null:item.patient?"Patient:"+item.patient.First_name+" "+item.patient.Sur_name:null:item.FEE_GROUP_TYPE==itemConst.feeGroupType.private_fund.value?item.insurer?itemConst.feeGroupType.private_fund.value+": "+item.insurer.insurer_name:null:item.feeGroup?item.feeGroup.FEE_GROUP_TYPE+": "+item.feeGroup.FEE_GROUP_NAME:null}},{field:"cal_id",label:"Invoice type",type:"custom",fn:function(item){return item.cal_id?"Auto":"Manual"}},{field:"Company_id",label:"Company",is_hide:!0,type:"custom",fn:function(item){return item.company?item.company.Company_name:void 0}},{field:"Insurer_id",label:"Insurer",is_hide:!0,type:"custom",fn:function(item){return item.insurer?item.insurer.insurer_name:void 0}},{field:"DOCTOR_ID",label:"Doctor",type:"custom",fn:function(item){return item.doctor?item.doctor.NAME:void 0}},{field:"SITE_ID",label:"Site",type:"custom",fn:function(item){return item.site?item.site.Site_name:void 0}},{field:"SERVICE_ID",label:"Service",type:"custom",fn:function(item){return item.service?item.service.SERVICE_NAME:void 0}},{field:"CREATION_DATE",order:"DESC",label:"Created Date",type:"custom",fn:function(item){return ConfigService.getCommonDateDefault(item.CREATION_DATE)}},{field:"STATUS",label:"Invoice status"}],use_filters:!0,filters:{STATUS:{type:"dropdown",values:invoice_status}},use_actions:!0,actions:[{"class":"fa fa-money",title:"Detail",callback:function(item){if(item.cal_id)$state.go("loggedIn.patient.invoice_detail",{header_id:item.header_id,patient_id:item.Patient_id,cal_id:item.cal_id});else{$modal.open({templateUrl:"popupEditManualInvoice",controller:function($scope,$modalInstance,options,item){$scope.options=options,$scope.addmanual={success:"",headerdata:item},$scope.$watch("addmanual.success",function(response){1==response&&$modalInstance.close({status:"success",data:response})}),$scope.cancel=function(){$modalInstance.dismiss("cancel")}},resolve:{options:function(){return $scope.options},item:function(){return item}},size:"lg"}).result.then(function(response){"success"==response.status&&$scope.invoicePanel.reload()})}}},{"class":"fa fa-list-alt",title:"Print Invoice",callback:function(item){window.open(getUrlReport()+"/redimedInvoice/"+item.header_id)}}]},$scope.invoiceParams={permission:{add:!0}},$scope.showAddFormInvoice=function(){$modal.open({templateUrl:"popupAddManualInvoice",controller:function($scope,$modalInstance,options){$scope.options=options,$scope.addmanual={success:""},$scope.$watch("addmanual.success",function(response){1==response&&$modalInstance.close({status:"success",data:response})}),$scope.cancel=function(){$modalInstance.dismiss("cancel")}},resolve:{options:function(){return $scope.options}},size:"lg"}).result.then(function(response){"success"==response.status&&(toastr.success("Add Manual Invoice Success !"),$scope.invoicePanel.reload())})},$scope.addFormInvoice={is_show:!1,open:function(){this.is_show=!0},close:function(){this.is_show=!1},success:function(){$scope.addFormInvoice.close(),$scope.invoicePanel.reload()}}}),angular.module("app.loggedIn.invoice.directives",["app.loggedIn.invoice.detail.directive","app.loggedIn.invoice.tnInvoiceDetail.directive","app.loggedIn.invoice.search.directive","app.loggedIn.invoice.add.directive","app.loggedIn.invoice.addMaunalInvoice.directive"]),angular.module("app.loggedIn.invoice.detail.directive",[]).directive("invoiceDetail",function(InvoiceHeaderModel,ConfigService,InvoiceService,ReceptionistService,toastr,$state,$timeout,$filter,CompanyService,$modal){var arrGetBy=$filter("arrGetBy");return{restrict:"EA",scope:{options:"=",params:"="},templateUrl:"modules/invoice/directives/templates/detail.html",controller:function($scope){$scope.goToAppt=function(patient_id,cal_id){$state.go("loggedIn.patient.appointment",{patient_id:patient_id,cal_id:cal_id})},$scope.feeGroupType=invConst.feeGroupType,$scope.feeGroups=[],$scope.feeTypes=[],$scope.InvoiceMap={FEE_GROUP_TYPE:null,FEE_GROUP_ID:null,FEE_TYPE_ID:null},$scope.feeGroupTypeChange=function(value){$scope.feeGroups=[],$scope.InvoiceMap.FEE_GROUP_ID=null,$scope.InvoiceMap.feeTypes=[],$scope.InvoiceMap.FEE_TYPE_ID=null,"private_fund"==value?InvoiceService.getFeeGroupByInsurer({id:$scope.InvoiceMap.Insurer_id}).then(function(response){$scope.feeGroups=response.data,$scope.InvoiceMap.FEE_GROUP_ID=response.data[0].FEE_GROUP_ID,$scope.feeGroupChange($scope.InvoiceMap.FEE_GROUP_ID)}):InvoiceService.getFeeGroupByType(value).then(function(response){$scope.feeGroups=response.data})},$scope.feeGroupChange=function(value){$scope.InvoiceMap.feeTypes=[],$scope.InvoiceMap.FEE_TYPE_ID=null,InvoiceService.getFeeType(value).then(function(response){$scope.feeTypes=response.data})},$scope.feeTypeChange=function(value){if(value){for(var postData={feeTypeId:value,listItem:[]},i=0;i<$scope.InvoiceMap.lines.length;i++)postData.listItem.push($scope.InvoiceMap.lines[i].ITEM_ID);InvoiceService.getCurrentFeeOfItems(postData).then(function(data){if("success"==data.status){toastr.success("Get current fee of items success","success");for(var feeMap={},i=0;i<data.data.length;i++){var item=data.data[i];feeMap[item.ITEM_ID]={FEE:item.FEE,PERCENT:item.PERCENT,FEE_START_DATE:item.FEE_START_DATE,ITEM_CODE:item.ITEM_CODE,TAX_ID:item.TAX_ID,TAX_CODE:item.TAX_CODE,TAX_RATE:item.TAX_RATE}}for(var i=0;i<$scope.InvoiceMap.lines.length;i++){var item=$scope.InvoiceMap.lines[i];item.PRICE=null,item.PRICE=feeMap[item.ITEM_ID]?feeMap[item.ITEM_ID].FEE:null}}else toastr.error("Get current fee of items fail.","error"),exlog.logErr("InvoiceDetailDirective->feeTypeChange",data)},function(err){toastr.error("Get current fee of items fail.","error"),exlog.logErr("InvoiceDetailDirective->feeTypeChange",err)})}},$scope.doctorSearch={open:function(){$modal.open({templateUrl:"popupDoctorSearch",controller:function($scope,$modalInstance,ConfigService){$scope.rowClick=function(item){ConfigService.system_service_by_clinical(item.CLINICAL_DEPT_ID).then(function(response){$modalInstance.close({item:item,response:response})})}},size:"md"}).result.then(function(data){$scope.InvoiceMap.DOCTOR_ID=data.item.doctor_id,$scope.InvoiceMap.DEPT_ID=data.item.CLINICAL_DEPT_ID,$scope.InvoiceMap.doctor={NAME:data.item.NAME},$scope.opt_services=[{SERVICE_ID:"",SERVICE_NAME:"-- Choose Service --"}].concat(data.response)})}},$scope.patientClaim={open:function(){$modal.open({templateUrl:"popupSelectClaim",controller:function($scope,$modalInstance,patient_id){$scope.patientClaimPanel={},$scope.options={api:"api/erm/v2/patients/claims",method:"post",scope:$scope.patientClaimPanel,columns:[{field:"Claim_id",is_hide:!0},{field:"Injury_name",label:"Injury"},{field:"Insurer"},{field:"insurer_id",is_hide:!0}],not_load:!1,search:{Patient_id:patient_id}},$scope.rowClick=function(item){$modalInstance.close({item:item})}},size:"md",resolve:{patient_id:function(){return $scope.patientClaim.Patient_id}}}).result.then(function(data){var postData={claim_id:data.item.Claim_id};InvoiceService.update($scope.params.id,postData).then(function(response){"success"==response.status&&($scope.InvoiceMap.claim=data.item,$scope.InvoiceMap.Insurer_id=data.item.insurer_id,$scope.InvoiceMap.claim_id=data.item.Claim_id,$scope.InvoiceMap.insurer={insurer_name:data.item.Insurer},toastr.success("Save Claim Successfully !!!","Success"))})})}},$scope.itemSearch={open:function(){$modal.open({templateUrl:"popupChooseItem",controller:function($scope,$modalInstance){$scope.itemSearchPanel={},$scope.itemSearchOption={api:"api/erm/v2/items/search",method:"post",scope:$scope.itemSearchPanel,columns:[{field:"ITEM_ID",is_hide:!0},{field:"ITEM_CODE",label:"Item Code",width:"10%"},{field:"ITEM_NAME",label:"Item Name"},{field:"TAX_ID",label:"Tax Id",is_hide:!0},{field:"TAX_CODE",label:"Tax Code"},{field:"TAX_RATE",label:"Tax Rate"}],use_filters:!0,filters:{ITEM_CODE:{type:"text"},ITEM_NAME:{type:"text"}}},$scope.rowClick=function(item){$modalInstance.close({item:item})}},size:"md"}).result.then(function(data){var t_item=arrGetBy($scope.InvoiceMap.lines,"ITEM_ID",data.item.ITEM_ID);if(!t_item){var newLine=data.item;newLine.HEADER_ID=$scope.InvoiceMap.header_id,newLine.QUANTITY=1,newLine.PRICE=0,newLine.has_price=!1,newLine.AMOUNT=0,newLine.TIME_SPENT=0,newLine.IS_ENABLE=1,newLine.invItem={ITEM_CODE:data.item.ITEM_CODE,ITEM_NAME:data.item.ITEM_NAME};var postData={ITEM_ID:newLine.ITEM_ID,FEE_TYPE_ID:$scope.InvoiceMap.FEE_TYPE_ID,CurrentDate:moment().format("YYYY-MM-DD hh:mm:ss")};InvoiceService.getfeetypefillter(postData).then(function(data){if("post-data-fail"==data.status)toastr.warning("Fee type no selected"),$scope.InvoiceMap.lines.push(newLine);else if("not-found"==data.status)toastr.warning("Price of item not found"),$scope.InvoiceMap.lines.push(newLine);else if("success"==data.status){var fee=data.data;newLine.FEE=fee.FEE,newLine.PRICE=fee.FEE,newLine.ITEM_FEE_ID=fee.ITEM_FEE_ID,newLine.has_price=!0,$scope.InvoiceMap.lines.push(newLine)}else toastr.error("Error when get price for item")})}})}}},link:function(scope,element,attrs){scope.showSave=!0,scope.statusDisable=!1,scope.claimShow=!0;var init=function(){scope.isSubmit=!1,scope.params.permission.edit===!0&&InvoiceService.headerDetail(scope.params.id).then(function(response){"error"==response.status&&toastr.error("Error Get Detail","Error"),angular.extend(scope.InvoiceMap,response.data),ConfigService.autoConvertData(scope.InvoiceMap),response.data.feeGroup&&(scope.InvoiceMap.FEE_GROUP_TYPE=response.data.SOURCE_TYPE,scope.feeGroupTypeChange(scope.InvoiceMap.FEE_GROUP_TYPE),scope.InvoiceMap.FEE_GROUP_ID=response.data.feeGroup.FEE_GROUP_ID),response.data.feeType&&(scope.feeGroupChange(scope.InvoiceMap.FEE_GROUP_ID),scope.InvoiceMap.FEE_TYPE_ID=response.data.feeType.FEE_TYPE_ID),scope.InvoiceMap.patient.full_name=scope.InvoiceMap.patient.Title+". "+scope.InvoiceMap.patient.First_name+" "+scope.InvoiceMap.patient.Sur_name,scope.InvoiceMap.lines=scope.InvoiceMap.lines.filter(function(item){return 1==item.IS_ENABLE});for(var i=0,amount=0,len=scope.InvoiceMap.lines.length;len>i;++i){var line=scope.InvoiceMap.lines[i];amount+=line.AMOUNT}scope.InvoiceMap.AMOUNT=amount,"done"===scope.InvoiceMap.STATUS&&(scope.showSave=!1,scope.statusDisable=!0,scope.claimShow=!1),scope.patientClaim.Patient_id=scope.InvoiceMap.Patient_id,ConfigService.system_service_by_clinical(scope.InvoiceMap.doctor.CLINICAL_DEPT_ID).then(function(response){scope.opt_services=[{SERVICE_ID:"",SERVICE_NAME:"-- Choose Service --"}].concat(response)})}),scope.InvoiceMap=angular.copy(InvoiceHeaderModel)};init(),scope.clickAction=function(){if(scope.params.permission.edit===!0)if(scope.InvoiceMap.lines&&0!==scope.InvoiceMap.lines.length){if("done"===scope.InvoiceMap.STATUS){var r=confirm('You cannot change this invoice information once you change the status to "Done". \n Are you sure?');if(0==r)return}InvoiceService.save(scope.params.id,scope.InvoiceMap).then(function(response){"fail"==response.status?toastr.error("Cannot send to ERP","Error"):toastr.success("Edit Successfully !!!","Success"),init()})}else toastr.error("Missing header / lines","Error!");else InvoiceService.add(postData).then(function(data){"error"==data.status&&toastr.error("Cannot Insert","Error"),toastr.success("Insert Successfully !!!","Success"),init()}),init()},scope.removeInvoiceLine=function(item){for(var index=-1,i=0;i<scope.InvoiceMap.lines.length;i++){var line=scope.InvoiceMap.lines[i];if(line.ITEM_ID==item.ITEM_ID){index=i;break}}scope.InvoiceMap.lines.splice(index,1)},scope.updateInvoiceLine=function(item){var postData={invoiceLine:item};InvoiceService.updateInvoiceLine(postData).then(function(data){"success"==data.status?(toastr.success("Update success.","Success"),item.notSave=!1):(exlog.logErr(data),toastr.error("Update error.","Error"))},function(err){exlog.logErr(err),toastr.error("Update error.","Error")})},scope.handleWhenLineChanged=function(item){item.notSave=!0;for(var amount=0,i=0;i<scope.InvoiceMap.lines.length;i++){var line=scope.InvoiceMap.lines[i];line.AMOUNT=line.QUANTITY*line.PRICE,amount+=line.AMOUNT}scope.InvoiceMap.AMOUNT=amount},scope.removeClaim=function(){var postData={claim_id:null};InvoiceService.update(scope.params.id,postData).then(function(response){"success"==response.status&&(toastr.success("Remove Claim Successfully !!!","Success"),scope.InvoiceMap.claim=null,scope.InvoiceMap.claim_id=null)})},scope.printReport=function(){window.open(getUrlReport()+"/redimedInvoice/"+scope.InvoiceMap.header_id)}}}}),angular.module("app.loggedIn.invoice.tnInvoiceDetail.directive",[]).directive("tnInvoiceDetail",function(){return{restrict:"E",scope:{invoiceHeaderId:"="},templateUrl:"modules/invoice/directives/templates/tnInvoiceDetail.html",controller:function($scope,ConsultationService,InvoiceService){$scope.apptPatient=null,$scope.invoiceHeader=null,$scope.invoiceListLines=null,InvoiceService.getInvoiceHeader($scope.invoiceHeaderId).then(function(data){if("success"==data.status){$scope.invoiceHeader=data.data;var postData={patientId:$scope.invoiceHeader.Patient_id,calId:$scope.invoiceHeader.cal_id};return ConsultationService.getApptPatient(postData)}exlog.logErr(data)},function(err){exlog.logErr(err)}).then(function(data){return"success"==data.status?($scope.apptPatient=data.data,InvoiceService.getInvoiceListLines($scope.invoiceHeaderId)):void exlog.logErr(data)},function(err){exlog.logErr(err)}).then(function(data){"success"==data.status?($scope.invoiceListLines=data.data,exlog.alert($scope.invoiceListLines)):exlog.logErr(data)},function(err){exlog.logErr(err)})}}}),angular.module("app.loggedIn.invoice.search.directive",[]).directive("invoiceSearch",function(InvoiceService,toastr){return{restrict:"EA",scope:{clickRow:"&"},templateUrl:"modules/invoice/directives/templates/search.html",link:function(scope,element,attrs){var init=function(){scope.list={},scope.params={pagination:{limit:5,offset:0,current_page:1,max_size:3},filters:[{type:"text",name:"cal_id",value:""},{type:"text",name:"claim_id",value:""},{type:"text",name:"Patient_id",value:""}],select:["cal_id","claim_id","Patient_id"]}},loadList=function(){InvoiceService.search(scope.params).then(function(response){"error"===response.status&&toastr.error("Cannot get Seacrh","Error"),scope.list=response})};init(),loadList(),scope.setPage=function(){scope.params.pagination.offset=(scope.params.pagination.current_page-1)*scope.params.pagination.limit,loadList()}}}}),angular.module("app.loggedIn.invoice.add.directive",[]).directive("invoiceAdd",function($stateParams,$modal,PatientService,InvoiceHeaderModel,ConfigService,InvoiceService,ReceptionistService,toastr,$filter,$state,CompanyService){var arrGetBy=$filter("arrGetBy");return{restrict:"EA",scope:{options:"=",params:"=",patient:"=",calendar:"=",onsuccess:"="},templateUrl:"modules/invoice/directives/templates/add.html",controller:function($scope){var init=function(){$scope.isSubmit=!1,$scope.InvoiceMap=angular.copy(InvoiceHeaderModel),$scope.InvoiceMap.SITE_ID=1,$scope.InvoiceMap.STATUS="enter",$scope.InvoiceMap.lines=[]};init(),$scope.patient&&($scope.InvoiceMap.Patient_id=$scope.patient,PatientService.mdtById($scope.patient).then(function(data){"success"==data.status&&($scope.InvoiceMap.patient={full_name:data.data.First_name+" "+data.data.Middle_name+" "+data.data.Sur_name},data.company&&($scope.InvoiceMap.Company_id=data.data.company_id,$scope.InvoiceMap.company={Company_name:data.company.Company_name}))})),$scope.calendar&&($scope.InvoiceMap.cal_id=$scope.calendar),$scope.doctorSearch={open:function(){$modal.open({templateUrl:"popupDoctorSearch",controller:function($scope,$modalInstance,ConfigService){$scope.rowClick=function(item){ConfigService.system_service_by_clinical(item.CLINICAL_DEPT_ID).then(function(response){$modalInstance.close({item:item,response:response})})}},size:"md"}).result.then(function(data){$scope.InvoiceMap.DOCTOR_ID=data.item.doctor_id,$scope.InvoiceMap.DEPT_ID=data.item.CLINICAL_DEPT_ID,$scope.InvoiceMap.doctor={NAME:data.item.NAME},$scope.opt_services=[{SERVICE_ID:"",SERVICE_NAME:"-- Choose Service --"}].concat(data.response)})}},$scope.patientClaim={open:function(){$modal.open({templateUrl:"popupSelectClaim",controller:function($scope,$modalInstance,patient_id){$scope.patientClaimPanel={},$scope.options={api:"api/erm/v2/patients/claims",method:"post",scope:$scope.patientClaimPanel,columns:[{field:"Claim_id",is_hide:!0},{field:"Injury_name",label:"Injury"},{field:"Insurer"},{field:"insurer_id",is_hide:!0}],not_load:!1,search:{Patient_id:patient_id}},$scope.rowClick=function(item){$modalInstance.close({item:item})}},size:"md",resolve:{patient_id:function(){return $scope.patient}}}).result.then(function(data){$scope.InvoiceMap.claim=data.item,$scope.InvoiceMap.Insurer_id=data.item.insurer_id,$scope.InvoiceMap.claim_id=data.item.Claim_id,$scope.InvoiceMap.insurer={insurer_name:data.item.Insurer}})}},$scope.itemSearch={open:function(){$modal.open({templateUrl:"popupChooseItem",controller:function($scope,$modalInstance){$scope.itemSearchPanel={},$scope.itemSearchOption={api:"api/erm/v2/items/search",method:"post",scope:$scope.itemSearchPanel,columns:[{field:"ITEM_ID",is_hide:!0},{field:"ITEM_CODE",label:"Item Code",width:"10%"},{field:"ITEM_NAME",label:"Item Name"},{field:"TAX_ID",label:"Tax Id",is_hide:!0},{field:"TAX_CODE",label:"Tax Code"},{field:"TAX_RATE",label:"Tax Rate"}],use_filters:!0,filters:{ITEM_CODE:{type:"text"},ITEM_NAME:{type:"text"}}},$scope.rowClick=function(item){$modalInstance.close({item:item})}},size:"md"}).result.then(function(data){var t_item=arrGetBy($scope.InvoiceMap.lines,"ITEM_ID",data.item.ITEM_ID);t_item||(data.item.ITEM_NAME=data.item.ITEM_NAME.substring(0,50),data.item.QUANTITY=1,data.item.TIME_SPENT=0,data.item.IS_ENABLE=1,$scope.InvoiceMap.lines.push(data.item),ReceptionistService.itemFeeAppt($scope.InvoiceMap.SERVICE_ID,[data.item.ITEM_ID]).then(function(response){response.list.length>0?(data.item.PRICE=response.list[0].SCHEDULE_FEE,data.item.has_price=!0):(data.item.PRICE=0,data.item.has_price=!1)}))})}},$scope.isHeaderOk=function(opt){for(var fields=[{field:"SERVICE_ID",label:"Service"},{field:"doctor",label:"Doctor"},{field:"patient",label:"Patient"}],i=fields.length-1;i>=0;i--){var f=fields[i];if(!$scope.InvoiceMap[f.field])return opt&&"alert"==opt&&toastr.error("Please choose `"+f.label+"`","Error"),!1}return!0},$scope.amountBill=function(){for(var amount=0,i=0,len=$scope.InvoiceMap.lines.length;len>i;++i){var line=$scope.InvoiceMap.lines[i];line.AMOUNT=line.PRICE*line.QUANTITY,amount+=line.AMOUNT}return Math.round(100*amount)/100}},link:function(scope,element,attrs){scope.removeInvoiceLine=function(item){scope.InvoiceMap.lines=_.remove(scope.InvoiceMap.lines,function(n){return n!=item})},scope.clickAction=function(){if(scope.isHeaderOk("alert")){var postData=angular.copy(scope.InvoiceMap);delete postData.doctor,delete postData.patient,delete postData.company;for(var insertArr=[],i=0;i<postData.lines.length;i++){var t={CLN_ITEM_ID:postData.lines[i].ITEM_ID,Patient_id:$stateParams.patient_id,cal_id:$stateParams.cal_id,PRICE:postData.lines[i].PRICE,TIME_SPENT:postData.lines[i].TIME_SPENT?postData.lines[i].TIME_SPENT:0,QUANTITY:postData.lines[i].QUANTITY,is_enable:1};insertArr.push(t)}InvoiceService.add(postData).then(function(response){"error"==response.status?toastr.error("Cannot Insert","Error"):"success"==response.status&&scope.onsuccess&&scope.onsuccess()})}}}}}),angular.module("app.loggedIn.invoice.addMaunalInvoice.directive",[]).directive("addmaunalInvoice",function($cookieStore,$stateParams,$modal,PatientService,InvoiceHeaderModel,ConfigService,InvoiceService,ReceptionistService,toastr,$filter,$state,CompanyService){return{restrict:"EA",scope:{options:"=",success:"=",checkedit:"=",headerdata:"=",patientid:"="},templateUrl:"modules/invoice/directives/templates/manualAdd.html",controller:function($scope){$filter("arrGetBy");if($scope.user_id=$cookieStore.get("userInfo").id,$scope.modelObjectMap={FEE_GROUP_TYPE:null,FEE_GROUP_ID:null,FEE_TYPE_ID:null},$scope.patientTest=!1,$scope.FORMULACal=[],$scope.insurers,$scope.patientName,$scope.patient,$scope.claim,$scope.feeGroupType=invConst.feeGroupType,$scope.feeGroupID=[],$scope.feeTypes=[],$scope.FORMULA,$scope.ArrayLineRoot=[],$scope.ArrayInv_ITEM={ITEM_FEE_ID:"",FEE:""},$scope.InvoiceMap={lines:[]},$scope.patientid){$scope.patientTest=!0;var postDataPatient={Patient_id:$scope.patientid};InvoiceService.getpatientbyid(postDataPatient).then(function(response){$scope.patient=response.data[0],$scope.patientName=response.data[0].First_name+" "+response.data[0].Sur_name})}$scope.patientSearch={open:function(){$modal.open({templateUrl:"popupPatientSearch",controller:function($scope,$modalInstance,ConfigService,options){$scope.options=options,$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.rowClick=function(item){$modalInstance.close(item)},$scope.patients={select:0,"class":function(patient){return{selected:patient.ID==$scope.patients.select}},options:{api:"api/erm/v2/patient/search",method:"post",columns:[{field:"Patient_id",is_hide:!0},{field:"First_name",label:"First name"},{field:"Sur_name",label:"Last name"},{field:"Address1",label:"Address"},{field:"Post_code",label:"Post Code"}],use_filters:!0,filters:{First_name:{type:"text"},Sur_name:{type:"text"},Address1:{type:"text"},Post_code:{type:"text"}}}},$scope.showAddPatient=function(){$modal.open({templateUrl:"popupAddPatient",controller:function($scope,$modalInstance,options){$scope.options=options,$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.patientAddForm={params:{permission:{edit:!1,create:!0}},is_show:!1,open:function(){this.is_show=!0},close:function(){this.is_show=!1},success:function(response){}},$scope.actionCenter={runWhenFinish:function(data){$modalInstance.close({status:"success",data:data})}}},resolve:{options:function(){return $scope.options}},size:"lg"}).result.then(function(response){"success"==response.status&&$modalInstance.close(response.data)})}},size:"lg",resolve:{options:function(){return $scope.options}}}).result.then(function(data){$scope.patientName=data.First_name+" "+data.Sur_name,$scope.patient=data,$scope.modelObjectMap.FEE_GROUP_TYPE=null})}},$scope.insurerSearch={open:function(){$scope.claim=null,$modal.open({templateUrl:"popupInsurerSearch",controller:function($scope,$modalInstance,ConfigService){$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.rowClick=function(item){$modalInstance.close(item)},$scope.insurer={select:0,"class":function(insurer){return{selected:insurer.ID==$scope.insurer.select}},options:{api:"api/erm/v2/insurers/search",method:"post",columns:[{field:"id",is_hide:!0},{field:"insurer_name",label:"Company Name"},{field:"address",label:"Address"},{field:"suburb",label:"Suburb"},{field:"isenable"},{field:"FEE_GROUP_ID",is_hide:!0}],use_filters:!0,filters:{insurer_name:{type:"text"},address:{type:"text"},suburb:{type:"text"},isenable:{type:"text"}}}}},size:"lg"}).result.then(function(data){$scope.insurers=data,$scope.feeGroupChange($scope.insurers.FEE_GROUP_ID)})}},$scope.claimSearch={open:function(){$modal.open({templateUrl:"popupClaimSearchInsurer",controller:function($scope,$modalInstance,ConfigService,ClaimModel,patientData,insurers){$scope.claim,$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.onRowClick=function(item){$modalInstance.close(item)},$scope.load=function(){var postData={page:1,limit:10,offset:0,max_size:5,Claim_no:"",Claim_date:"desc",Injury_name:"",Injury_date:"asc",Patient_id:patientData.Patient_id,insurer_id:insurers.id};ClaimModel.listFollowPatientInsurer(postData).then(function(response){$scope.claim=response.data})},$scope.load(),$scope.showAddClaim=function(){$modal.open({templateUrl:"popupAddClaim",controller:function($scope,$modalInstance,insurers,patientData){$scope.claim={Patient_id:patientData.Patient_id,insurers:insurers,success:""},$scope.cancel=function(){$modalInstance.dismiss("cancel")},$scope.$watch("claim.success",function(response){response.Claim_id&&$modalInstance.close({status:"success",data:response})})},resolve:{patientData:function(){return patientData},insurers:function(){return insurers}},size:"lg"}).result.then(function(response){"success"==response.status&&$modalInstance.close(response.data)})}},size:"lg",resolve:{patientData:function(){return $scope.patient},insurers:function(){return $scope.insurers}}}).result.then(function(data){$scope.claim=data})}},$scope.feeGroupTypeChange=function(value){$scope.feeGroupChange(""),$scope.modelObjectMap.FEE_GROUP_TYPE=value,$scope.insurers=null,$scope.feeTypes=null,InvoiceService.getFeeGroupByType(value).then(function(response){$scope.feeGroupID=response.data})},$scope.feeGroupChange=function(value){$scope.feeTypeChange(""),$scope.InvoiceMap.lines=[],$scope.modelObjectMap.FEE_TYPE_ID=null,$scope.modelObjectMap.FEE_GROUP_ID=value;for(var i=0;i<$scope.feeGroupID.length;i++)value==$scope.feeGroupID[i].FEE_GROUP_ID&&($scope.FORMULA=$scope.feeGroupID[i].FORMULA?$scope.feeGroupID[i].FORMULA:"100");InvoiceService.getFeeType(value).then(function(response){$scope.feeTypeID=response.data})},$scope.feeTypeChange=function(value){$scope.InvoiceMap.lines=[]},$scope.itemSearch={open:function(){$modal.open({templateUrl:"popupChooseMaunalItem",controller:function($scope,$modalInstance,FEE_TYPE_ID,ItemService){var search={page:1,limit:7,offset:0,max_size:5,ITEM_CODE:"",ITEM_NAME:"",TAX_CODE:"",TAX_RATE:"",FEE_TYPE_ID:FEE_TYPE_ID},load=function(){$scope.ItemAll.loading=!0,ItemService.insertManualLine(search).then(function(response){$scope.ItemAll.list=response.data,$scope.ItemAll.count=response.count})};$scope.rowClick=function(item){$modalInstance.close({item:item})};var setPage=function(page){$scope.ItemAll.search.offset=(page-1)*$scope.ItemAll.search.limit,
$scope.ItemAll.load()},onSearch=function(option){switch(option.field){case"ITEM_CODE":$scope.ItemAll.search.ITEM_CODE=option.value;break;case"ITEM_NAME":$scope.ItemAll.search.ITEM_NAME=option.value}$scope.ItemAll.load(),setPage(1)};$scope.ItemAll={search:search,count:0,loading:!1,list:[],load:function(){load()},setPage:function(page){setPage(page)},onSearch:function(option){onSearch(option)}},$scope.ItemAll.load(),$scope.clickOnRow=function(value){var postData={ITEM_ID:value.ITEM_ID,FEE_TYPE_ID:FEE_TYPE_ID,CurrentDate:moment().format("YYYY-MM-DD hh:mm:ss")};InvoiceService.getfeetypefillter(postData).then(function(response){$modalInstance.close(response.data)})}},size:"lg",resolve:{FEE_TYPE_ID:function(){return $scope.modelObjectMap.FEE_TYPE_ID}}}).result.then(function(data){function sortLine(a,b){return a.FEE<b.FEE?1:a.FEE>b.FEE?-1:0}var checkExit=0;for(key in $scope.InvoiceMap.lines)$scope.InvoiceMap.lines[key].ITEM_CODE==data.ITEM_CODE&&checkExit++;if($scope.FORMULACal=$scope.FORMULA.split(":"),0==checkExit){$scope.ArrayInv_ITEM.ITEM_FEE_ID=data.ITEM_FEE_ID,$scope.ArrayInv_ITEM.FEE=data.FEE,data.ITEM_NAME=data.ITEM_NAME.substring(0,50),data.QUANTITY=1,data.TIME_SPENT=0,data.IS_ENABLE=1,$scope.InvoiceMap.lines.push(data),$scope.InvoiceMap.lines.sort(sortLine);for(var i=0;i<$scope.InvoiceMap.lines.length;i++)$scope.FORMULACal[i]?($scope.InvoiceMap.lines[i].PRICE=$scope.InvoiceMap.lines[i].FEE*$scope.FORMULACal[i]/100,$scope.InvoiceMap.lines[i].Percent=$scope.FORMULACal[i]):($scope.InvoiceMap.lines[i].PRICE=$scope.InvoiceMap.lines[i].FEE*$scope.FORMULACal[$scope.FORMULACal.length-1]/100,$scope.InvoiceMap.lines[i].Percent=$scope.FORMULACal[$scope.FORMULACal.length-1])}})}},$scope.amountAll=function(){for(var amount=0,i=0,len=$scope.InvoiceMap.lines.length;len>i;++i){var line=$scope.InvoiceMap.lines[i];line.AMOUNT=line.PRICE*line.QUANTITY,amount+=line.AMOUNT}return Math.round(100*amount)/100},$scope.taxAmountAll=function(){for(var amount=0,i=0,len=$scope.InvoiceMap.lines.length;len>i;++i){var line=$scope.InvoiceMap.lines[i];line.AMOUNT=line.PRICE*line.QUANTITY*line.TAX_RATE,amount+=line.AMOUNT}return Math.round(100*amount)/100},$scope.totalAmount=function(){for(var amount=0,i=0,len=$scope.InvoiceMap.lines.length;len>i;++i){var line=$scope.InvoiceMap.lines[i];line.AMOUNT=line.PRICE*line.QUANTITY*line.TAX_RATE+line.PRICE*line.QUANTITY,amount+=line.AMOUNT}return Math.round(100*amount)/100},$scope.save=function(){$scope.isSubmit=!0,$scope.mainForm.$invalid||(postData="private_fund"==$scope.modelObjectMap.FEE_GROUP_TYPE?{Patient_id:$scope.patient.Patient_id,SOURCE_TYPE:$scope.modelObjectMap.FEE_GROUP_TYPE,SOURCE_ID:$scope.insurers.FEE_GROUP_ID,FEE_TYPE:$scope.modelObjectMap.FEE_TYPE_ID,FORMULA:$scope.FORMULA,Insurer_id:$scope.insurers.id,listLines:$scope.InvoiceMap.lines,claim_id:$scope.claim.Claim_id}:{Patient_id:$scope.patient.Patient_id,SOURCE_TYPE:$scope.modelObjectMap.FEE_GROUP_TYPE,SOURCE_ID:$scope.modelObjectMap.FEE_GROUP_ID,FEE_TYPE:$scope.modelObjectMap.FEE_TYPE_ID,FORMULA:$scope.FORMULA,listLines:$scope.InvoiceMap.lines},$scope.checkedit!==!0?(postData.CREATION_DATE=moment().format("YYYY-MM-DD HH:mm:ss"),postData.LAST_UPDATE_DATE=moment().format("YYYY-MM-DD HH:mm:ss"),postData.STATUS="enter",postData.user_id=$scope.user_id,InvoiceService.getSaveManual(postData).then(function(response){$scope.success=!0})):(postData.header_id=$scope.headerdata.header_id,postData.LAST_UPDATE_DATE=moment().format("YYYY-MM-DD HH:mm:ss"),postData.STATUS="enter",postData.user_id=$scope.user_id,InvoiceService.getEditManual(postData).then(function(response){toastr.success("Edit Manual Invoice Success !"),$scope.success=!0})))},$scope.removeInvoiceLine=function(item){for(var i=0;i<$scope.InvoiceMap.lines.length;i++)$scope.InvoiceMap.lines[i].ITEM_ID==item.ITEM_ID&&$scope.InvoiceMap.lines.splice(i,1)},$scope.resetEdit=function(){var postData={header_id:$scope.headerdata.header_id};InvoiceService.getOnemanual(postData).then(function(response){function sortLine(a,b){return a.FEE<b.FEE?1:a.FEE>b.FEE?-1:0}$scope.patientName=response.data[0].First_name+""+response.data[0].Sur_name,$scope.patient={Patient_id:response.data[0].Patient_id},$scope.feeGroupType=invConst.feeGroupType,$scope.feeGroupTypeChange(response.data[0].SOURCE_TYPE),$scope.feeGroupChange(response.data[0].groupFEE_GROUP_ID),$scope.modelObjectMap.FEE_TYPE_ID=response.data[0].typesFEE_TYPE_ID,$scope.InvoiceMap.lines=response.dataline,$scope.FORMULA=response.data[0].FORMULA?response.data[0].FORMULA:"100",$scope.FORMULACal=response.data[0].FORMULA.split(":"),$scope.InvoiceMap.lines.sort(sortLine);for(var i=0;i<$scope.InvoiceMap.lines.length;i++)$scope.InvoiceMap.lines[i].Percent=$scope.FORMULACal[i]?$scope.FORMULACal[i]:$scope.FORMULACal[$scope.FORMULACal.length-1];for(var i=0;i<$scope.InvoiceMap.lines.length;i++)$scope.InvoiceMap.lines[i].ITEM_NAME=$scope.InvoiceMap.lines[i].ITEM_NAME.substring(0,50);$scope.insurers={insurer_name:response.data[0].insurer_name,id:response.data[0].Insurer_id},$scope.claim={Claim_no:response.data[0].Claim_no}})},1==$scope.checkedit&&$scope.resetEdit(),$scope.printReport=function(){window.open(getUrlReport()+"/redimedInvoice/"+$scope.headerdata.header_id)}}}});