/**
 * tannv.dts@gmail.com
 * 16-06-2016
 */

angular.module('app.loggedIn.invoice.tnInvoiceDetail.directive', [])
	.directive('tnInvoiceDetail', function() {
        return {
            restrict: 'E',
            //transclude:true,
            //required:['^ngModel'],
            scope: {
                invoiceHeaderId:'='
            },
            templateUrl: 'modules/invoice/directives/templates/tnInvoiceDetail.html',
            controller: function ($scope,ConsultationService,InvoiceService)
            {
            	$scope.apptPatient=null;
            	$scope.invoiceHeader=null;
            	$scope.invoiceListLines=null;

            	//tannv.dts@gmail.com
            	//lay thong tin invoice header
				InvoiceService.getInvoiceHeader($scope.invoiceHeaderId)
				.then(function(data){
					if(data.status=='success')
					{
						$scope.invoiceHeader=data.data;
						var postData={
			        		patientId:$scope.invoiceHeader.Patient_id,
			        		calId:$scope.invoiceHeader.cal_id
			        	}
			        	//promise lay thong tin appt patient
			        	return ConsultationService.getApptPatient(postData);
					}
					else
					{
						exlog.logErr(data);
					}
				},function(err){
					exlog.logErr(err);
				})
				//tannv.dts@gmail.com
				//lay thong tin appt patient
				.then(function(data){
					if(data.status=='success')
					{
						$scope.apptPatient=data.data;
						//promise lay thong tin invoice lines
						return InvoiceService.getInvoiceListLines($scope.invoiceHeaderId);
					}
					else
					{
						exlog.logErr(data);
					}
				},function(err){
					exlog.logErr(err);
				})
				//tannv.dts@gmail.com
				//lay thong tin invoice lines
				.then(function(data){
					if(data.status=='success')
					{	
						$scope.invoiceListLines=data.data;
						exlog.alert($scope.invoiceListLines);
					}
					else
					{
						exlog.logErr(data);
					}
				},function(err){
					exlog.logErr(err);
				})

            }

        };
    })