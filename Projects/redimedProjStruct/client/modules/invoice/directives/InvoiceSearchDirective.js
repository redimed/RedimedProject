angular.module('app.loggedIn.invoice.search.directive', []).directive('invoiceSearch', function(InvoiceService, toastr){
	return {
		restrict: 'EA',
		scope: {
			clickRow: '&',
		},
		templateUrl: 'modules/invoice/directives/templates/search.html',
		link: function(scope, element, attrs){
			var init = function(){
				scope.list = {};
				scope.params = {
					pagination: {
						limit: 5,
						offset: 0,
						current_page: 1,
						max_size: 3
					},
					filters: [
						{type: 'text', name: 'cal_id', value:''},
						{type: 'text', name: 'claim_id', value:''},
						{type: 'text', name: 'Patient_id', value:''}
					],
					select: [
						'cal_id', 'claim_id', 'Patient_id'
					]
				}
			}//end init
			var loadList = function(){
				InvoiceService.search(scope.params).then(function(response){
					if(response.status==='error') toastr.error('Cannot get Seacrh', 'Error')
					scope.list = response;
				})
			}
			init();
			loadList();
			scope.setPage = function(){
				scope.params.pagination.offset = (scope.params.pagination.current_page-1)*scope.params.pagination.limit;
				loadList();
			}
		}//end link
	}//end return
})