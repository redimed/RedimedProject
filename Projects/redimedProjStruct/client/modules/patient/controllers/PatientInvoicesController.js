angular.module("app.loggedIn.patient.invoices.controller", [])
.controller("PatientInvoicesController", function($scope, $state, $stateParams, PatientService, ConfigService){
	var patient_id = $stateParams.patient_id;


	$scope.invoiceClass = function(item) {
		console.log(item)
		if(item.STATUS == 'approach')
			return 'warning';
		if(item.STATUS == 'done')
			return 'success';

		return 'danger'; // enter
	}
	$scope.invoiceOption = {
        api: 'api/erm/v2/invoice/search',
        method: 'post',
        columns: [
            {field: 'header_id', is_hide: true},
            {field: 'cal_id', is_hide: true},
            {field: 'STATUS', is_hide: true},
            {field: 'Company_id', label: 'Company', type: 'custom', fn: function(item){
            	if(item.company) return item.company.Company_name;
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
        search: {patient_id: patient_id},
        use_actions: true, 
        actions: [              
            {
                class: 'fa fa-money', title: 'Invoice',
                callback: function(item){
                	console.log(item)
               		$state.go('loggedIn.patient.invoice_detail', {header_id: item.header_id}); 
                }
            },
        ],
	};

});