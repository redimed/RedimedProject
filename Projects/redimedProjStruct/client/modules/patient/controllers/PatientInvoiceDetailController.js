angular.module("app.loggedIn.patient.invoice_detail.controller", [])
.controller("PatientInvoiceDetailController", function($scope, $state, $stateParams, toastr, PatientService, ConfigService){
	var header_id = $stateParams.header_id;

	$scope.invoiceOpt = {
		permission: {
			edit: true,
		},
		id: header_id
	}

	

	$scope.invoiceSave  = function(){
		PatientService.invoiceSave(header_id)
		.then(function(response){
			toastr.success('Save successfully !!!', 'Success');
		})
	}


 	PatientService.invoiceDetail(header_id)
 	.then(function(response){
 		console.log(response.data);
 		$scope.invoice = response.data;

 		$scope.invoice.lines = $scope.invoice.lines.filter(function(item){
 			return item.IS_ENABLE == 1;
 		})

 		for(var i = 0, len = $scope.invoice.lines.length; i < len; ++i) {
 			var line = $scope.invoice.lines[i];
 			// line.AMOUNT = line.PRICE * line.QUANTITY;
 			$scope.invoice.AMOUNT +=  line.AMOUNT;
 		}
 	});
});