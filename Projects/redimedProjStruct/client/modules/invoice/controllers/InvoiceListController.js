angular.module("app.loggedIn.invoice.list.controller",[
])
.controller("InvoiceListController", function($scope, $state, toastr, ItemService, ConfigService,$modal){

    /*
    *   SET UP TABLE - INVOICE 
    */
	var invoice_status = [{label: '-- All --'}].concat($scope.options.invoice_status);
    
	$scope.invoiceClass = function(item) {
        return {
            warning: (item.STATUS == 'approach'),
            success: (item.STATUS == 'done'),
            danger: (item.STATUS == 'enter' || item.STATUS == null)
        }
	}

    $scope.invoicePanel = {};

	$scope.invoiceOption = {
        api: 'api/erm/v2/invoice/search',
        method: 'post',
        scope: $scope.invoicePanel,
        columns: [
            {field: 'header_id', is_hide: true},
            {field: 'cal_id', is_hide: true},
         
            {field: 'Patient_id', label: 'Patient', type: 'custom', fn: function(item){
            	if(item.patient) return item.patient.Title + '. ' + item.patient.First_name;
            }},

            //tannv add
            {field:'SOURCE_ID',label:'Bill to',type:'custom',fn:function(item){
                if(item.cal_id)//neu la auto invoice
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
                else//neu la manual invoice
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

            //tannv add
            {field:'cal_id',label:'Invoice type',type:'custom',fn:function(item){
                // exlog.log(item)
                if(item.cal_id)
                    return 'Auto';
                else
                    return 'Manual';
            }},

            //tannv.dts hide field amount
			/*{field: 'AMOUNT', label: 'Amount', type: 'custom',is_hide:true, fn: function(item){
				if(!item.AMOUNT) 
					return '$0';
            	return '$' + Number((item.AMOUNT).toFixed(2));
            }},*/

            //tannv.dts hide
            {field: 'Company_id', label: 'Company',is_hide:true, type: 'custom', fn: function(item){
            	if(item.company) return item.company.Company_name;
            }},
            //tannv.dts hide
            {field: 'Insurer_id', label: 'Insurer',is_hide:true, type: 'custom', fn: function(item){
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
            {field: 'CREATION_DATE', order: 'DESC', label: 'Created Date', type: 'custom', fn: function(item){
            	return ConfigService.getCommonDateDefault(item.CREATION_DATE);
            }},
            {field: 'STATUS', label: 'Invoice status'},
        ],
        use_filters: true,
        filters: {
    		STATUS: { type: 'dropdown', values: invoice_status}
    	},
        use_actions: true, 
        actions: [              
            {
                class: 'fa fa-money', title: 'Detail',
                callback: function(item){
                    if (item.cal_id) {
                       $state.go('loggedIn.patient.invoice_detail', {header_id: item.header_id,patient_id:item.Patient_id,cal_id:item.cal_id}); 
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
                                $scope.invoicePanel.reload();
                               };
                            }) 
                   };
               		 
                }
            },

            {
                class: 'fa fa-list-alt',title:'Print Invoice',
                callback:function(item){
                    window.open(getUrlReport()+"/redimedInvoice/"+item.header_id);
                }

            },
        ],
	};

    $scope.invoiceParams = {
        permission: {
            add: true,
        }
    }
    $scope.showAddFormInvoice = function(){
       var modalInstance=$modal.open({
            templateUrl:'popupAddManualInvoice',
            controller:function($scope,$modalInstance,options){
                $scope.options = options;
                $scope.addmanual ={
                    success:''
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
                }
            },
            size:'lg'
        })
        .result.then(function(response){
           if (response.status == 'success') {
            toastr.success('Add Manual Invoice Success !');
            $scope.invoicePanel.reload();
           };
        }) 
    }
    $scope.addFormInvoice = {
        is_show: false,
        open: function () {
            this.is_show = true;
        },
        close: function () {
            this.is_show = false;
        },
        success: function(){
            $scope.addFormInvoice.close();
            $scope.invoicePanel.reload();
        }
    }

});
