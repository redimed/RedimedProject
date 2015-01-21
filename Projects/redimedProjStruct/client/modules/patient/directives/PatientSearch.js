angular.module("app.loggedIn.patient.search.directive", [])

.directive("patientSearch", function(PatientService){
	return {
		restrict: "EA",
		scope: {
			clickRow: "&",
			isClose: "@"
		},
		templateUrl: "modules/patient/directives/templates/search.html",
		link: function(scope, element, attrs){
			//DECLARE
			scope.list = {};

			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			scope.params = {
				pagination: {
					limit: 5,
					offset: 0,
					current_page: 1,
					max_size: 3
				},
				filters: [
					{type: 'text', name: 'First_name', value:''},
					{type: 'text', name: 'Sur_name', value: ''},
				],
				select: ['Patient_id', 'First_name', 'Sur_name', 'company_id']
			}//END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			var loadList = function(){
				PatientService.mdtSearch(scope.params).then(function(response){
					if(response.status==='success'){
						scope.list = response;
					}
				}, function(error){
					alert("Error Server");
				})
			}

			loadList();

			scope.refreshList = function(){
				loadList();
			}

			scope.setPage = function(){
				scope.params.pagination.offset = (scope.params.pagination.current_page-1)*scope.params.pagination.limit;
				loadList();
			}
		}// end link
	}// edn return
})