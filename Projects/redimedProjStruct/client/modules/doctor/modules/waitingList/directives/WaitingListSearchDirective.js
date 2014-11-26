angular.module("app.loggedIn.doctor.waitingList.search.directive", [])

.directive("waitingListSearch", function(WaitingListService){
	return {
		restrict: "EA",
		scope: {
			clickRow: "&",
			isClose: "@",
			options: "="
		},
		templateUrl: "modules/doctor/modules/waitingList/directives/templates/search.html",
		link: function(scope, element, attrs){
			//DECLARE
			var idSearchPatient = "#WaitingListSearchSearchPatient";
			var idSearchDoctor = "#WaitingListSearchSearchDoctor";

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
					{type: 'text', name: 'doctor_id', value:''},
					{type: 'text', name: 'Patient_id', value: ''},
					{type: 'select', name: 'priority', value: ''},
					{type: 'text', name: 'reason', value: ''}
				],
				select: ['doctor_id', 'Patient_id', 'priority', 'reason']
			}//END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			var loadList = function(){
				WaitingListService.search(scope.params).then(function(response){
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

			// FIND
			scope.findPatient = function(){
				angular.element(idSearchPatient).fadeIn();
			}

			scope.selectPatient = function(row){
				scope.params.filters[1].value = row.Patient_id;
				scope.selectedPatient = row;
				angular.element(idSearchPatient).fadeOut();
				loadList();
			}

			scope.selectDoctor = function(row){
				scope.params.filters[0].value = row.doctor_id;
				scope.selectedDoctor = row;
				angular.element(idSearchDoctor).fadeOut();
				loadList();
			}

			scope.findDoctor = function(){
				angular.element(idSearchDoctor).fadeIn();
			}

			scope.refreshSearch = function(){
				scope.params.filters[0].value = "";
				scope.params.filters[1].value = "";
				scope.params.filters[2].value = "";
				scope.params.filters[3].value = "";
				loadList();
			}
			// END FIND
		}// end link
	}// edn return
})