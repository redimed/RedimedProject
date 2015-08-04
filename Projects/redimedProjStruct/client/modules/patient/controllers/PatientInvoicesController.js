angular.module("app.loggedIn.patient.invoices.controller", [])
.controller("PatientInvoicesController", function($scope, $state,toastr,$modal, $stateParams, PatientService, ConfigService){
	var patient_id = $stateParams.patient_id;
    $scope.patient_id = patient_id;
    var cal_id = $stateParams.cal_id;
    $scope.cal_id = cal_id;
    $scope.invoicePanel = {};

    $scope.invoiceClick = function(item){
        
        if (item.cal_id) {
            $state.go('loggedIn.patient.invoice_detail', {header_id: item.header_id}); 
        }else{
              var modalInstance=$modal.open({
                    templateUrl:'popupEditManualInvoice',
                    controller:function($scope,$modalInstance,options,item){
                        $scope.options = options;
                        $scope.addmanual ={
                            success:'',
                            headerdata:item
                        }
                         $scope.$watch('addmanual.success', function(response){
                            if (response == true) {
                                $modalInstance.close({status:'success',data:response});
                            };
                             
                        })
                        $scope.cancel=function(){
                            $modalInstance.dismiss('cancel');
                        }
                    },
                    resolve:{
                        options:function(){
                            return $scope.options;
                        },
                        item:function(){
                            return item;
                        }
                    },
                    size:'lg'
                })
                .result.then(function(response){
                   if (response.status == 'success') {
                  ///  toastr.success('Edit Manual Invoice Success !');
                    $scope.invoicePanel.reload();
                   };
                }) 
       };
        
    }

	$scope.invoiceClass = function(item) {
        return {
            warning: (item.STATUS == 'approach'),
            success: (item.STATUS == 'done'),
            danger: (item.STATUS == 'enter' || item.STATUS == null),
            selected: (item.cal_id == cal_id)
        }
	}
	$scope.invoiceOption = {
        api: 'api/erm/v2/invoice/search',
        method: 'post',
        scope: $scope.invoicePanel,
        columns: [
            {field: 'header_id', order: 'DESC', is_hide: true},
            {field: 'cal_id', is_hide: true},
            {field: 'STATUS', is_hide: true},
                        {field: 'Patient_id', label: 'Patient', type: 'custom', fn: function(item){
                if(item.patient) return item.patient.First_name;
            }},

            {field:'SOURCE_ID',label:'Bill to',type:'custom',fn:function(item){
                if(item.cal_id)
                {
                    if(item.Insurer_id)
                    {
                        if(item.insurer) 
                            return 'Insurer:'+item.insurer.insurer_name;
                        else
                            return null;
                    }
                    else if(item.Company_id)
                    {
                        if(item.company) 
                            return 'Company:'+item.company.Company_name;
                        else
                            return null;
                    }
                    else
                    {
                        if(item.patient)
                        {
                            return 'Patient:'+item.patient.First_name+" "+item.patient.Sur_name;
                        }
                        else
                            return null;
                    }
                }
                else
                {
                    if(item.FEE_GROUP_TYPE==itemConst.feeGroupType.private_fund.value)
                    {
                        if(item.insurer) 
                            return itemConst.feeGroupType.private_fund.value+": "+item.insurer.insurer_name;
                        else
                            return null;
                    }
                    else
                    {
                        if(item.feeGroup)
                            return item.feeGroup.FEE_GROUP_TYPE+": "+item.feeGroup.FEE_GROUP_NAME;
                        else
                            return null;
                    }
                }
            }},

            {field:'cal_id',label:'Invoice type',type:'custom',fn:function(item){
                if(item.cal_id)
                    return 'Auto';
                else
                    return 'Manual';
            }},
            // {field: 'Company_id', label: 'Company', type: 'custom', fn: function(item){
            // 	if(item.company) return item.company.Company_name;
            // }},
            {field: 'cal_id', label: 'From Time', type: 'custom', fn: function(item){
                if(item.appointment){
                    return ConfigService.getCommonDatetime(item.appointment.FROM_TIME);
                }
                else{
                    return null;
                }
            }},
            {field: 'cal_id', label: 'To Time', type: 'custom', fn: function(item){
                if(item.appointment){
                    return ConfigService.getCommonDatetime(item.appointment.TO_TIME);
                }
                else{
                    return null;
                }
            }},
            {field: 'Insurer_id', label: 'Insurer', type: 'custom', fn: function(item){
            	if(item.insurer) return item.insurer.insurer_name;
            }},
            {field: 'DOCTOR_ID', label: 'Doctor', type: 'custom', fn: function(item){
            	if(item.doctor) return item.doctor.NAME;
            }},
            {field: 'SITE_ID', label: 'Site', type: 'custom', fn: function(item){
            	if(item.site) return item.site.Site_name;
            }},
            {field: 'SERVICE_ID', label: 'Service', type: 'custom', fn: function(item){
            	if(item.service) return item.service.SERVICE_NAME;
            }},
            {field: 'CREATION_DATE', label: 'Created Date', type: 'custom', fn: function(item){
            	return moment.utc(new Date(item.CREATION_DATE)).format('YYYY-MM-DD HH:mm:ss');
            }},
        ],
        search: {patient_id: patient_id, cal_id:-1},
        // use_actions: true, 
        // actions: [              
        //     {
        //         class: 'fa fa-money', title: 'Detail',
        //         callback: function(item){
        //         	console.log(item)
        //        		$state.go('loggedIn.patient.invoice_detail', {header_id: item.header_id}); 
        //         }
        //     },
        // ],
	};
    $scope.showAddFormInvoice = function(){// Show Popup Add Manual
       var modalInstance=$modal.open({
            templateUrl:'popupAddManualInvoice',
            controller:function($scope,$modalInstance,options,patient_id){
                $scope.options = options;
                $scope.addmanual ={
                    success:'',
                    patient_id:patient_id
                }
                $scope.$watch('addmanual.success', function(response){
                    if (response == true) {
                        $modalInstance.close({status:'success',data:response});
                    };
                })
                $scope.cancel=function(){
                    $modalInstance.dismiss('cancel');
                }
            },
            resolve:{
                options:function(){
                    return $scope.options;
                },
                 patient_id:function(){
                    return $stateParams.patient_id;
                }
            },
            size:'lg'
        })
        .result.then(function(response){
           if (response.status == 'success') {
            $scope.invoicePanel.reload();
            toastr.success('Add Manual Invoice Success !');
           };
        }) 
    }
    $scope.addFormInvoice = {
        open: function () {
            $modal.open({
                templateUrl: 'popupAddInvoice',
                controller: function($scope, $modalInstance,options,patient_id,cal_id){
                    $scope.options = options;
                    $scope.patient_id = patient_id;
                    $scope.cal_id = cal_id;
                    $scope.success = function(){
                        $modalInstance.close({'status':'success'});
                    }
                },
                size: 'lg',
                resolve:{
                    options:function(){
                        return $scope.options;
                    },
                    patient_id:function(){
                        return $stateParams.patient_id;
                    },
                    cal_id:function(){
                        return $stateParams.cal_id;
                    }

                }
            })
            .result.then(function(data){
                if (data.status == 'success') {
                    $scope.invoicePanel.reload();
                    toastr.success('Save successfully!','Success!');
                };
            })
        }
    }

});