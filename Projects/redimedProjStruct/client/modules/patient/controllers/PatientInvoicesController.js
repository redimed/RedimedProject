angular.module("app.loggedIn.patient.invoices.controller", [])
.controller("PatientInvoicesController", function($scope, $state, $stateParams, PatientService, ConfigService){
	var patient_id = $stateParams.patient_id;
    $scope.patient_id = patient_id;
    var cal_id = $stateParams.cal_id;
    $scope.cal_id = cal_id;
    $scope.invoicePanel = {};

    $scope.invoiceClick = function(item){
        $state.go('loggedIn.patient.invoice_detail', {header_id: item.header_id}); 
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
            {field: 'Company_id', label: 'Company', type: 'custom', fn: function(item){
            	if(item.company) return item.company.Company_name;
            }},
            {field: 'cal_id', label: 'From Time', type: 'custom', fn: function(item){
                if(item.appointment.FROM_TIME)
                    return ConfigService.getCommonDatetime(item.appointment.FROM_TIME);
            }},
            {field: 'cal_id', label: 'To Time', type: 'custom', fn: function(item){
                if(item.appointment.TO_TIME)
                    return ConfigService.getCommonDatetime(item.appointment.TO_TIME);
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
            	return ConfigService.getCommonDateDefault(item.CREATION_DATE);
            }},
        ],
        search: {patient_id: patient_id, cal_id:cal_id},
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

    $scope.addFormInvoice = {
        open: function () {
            $modal.open({
                templateUrl: 'popupDoctorSearch',
                controller: function($scope, $modalInstance){
                    
                },
                size: 'lg'
            })
        },
        success: function(){
            $scope.addFormInvoice.close();
            $scope.invoicePanel.reload();
        }
    }

});