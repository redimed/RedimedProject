angular.module("app.loggedIn.doctor")

.directive("doctorSearch", function(DoctorService){
	return {
		restrict: "EA",
		scope: {
			clickRow: "&",
			isClose: "@"
		},
		templateUrl: "modules/doctor/directives/templates/search.html",
		link: function(scope, element, attrs){
			//DECLARE
			scope.list = {};

			if(scope.isClose){
				var idClose = "#"+scope.isClose;
			}

			scope.params = {
				pagination: {
					limit: 10,
					offset: 0,
					current_page: 1,
					max_size: 5
				},
				filters: [
					{type: 'text', name: 'NAME', value:''},
					{type: 'text', name: 'Email', value: ''}
				],
				select: ['doctor_id', 'NAME', 'Email']
			}//END DECLARE

			//POPUP
			scope.closePopup = function(){
				angular.element(idClose).fadeOut();
			}
			//END POPUP

			var loadList = function(){
				DoctorService.mdtSearch(scope.params).then(function(response){
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