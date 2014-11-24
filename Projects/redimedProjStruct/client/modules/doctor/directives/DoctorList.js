angular.module("app.loggedIn.doctor.list.directive", [])

.directive("doctorList", function(){
	return {
		restrict: "EA",
		scope: {

		},
		templateUrl: "modules/doctor/directives/templates/list.html",
		link: function(scope, element, attrs){
			var item_type_options = [
		        {code: 'Service', label: 'Service'},
		        {code: 'Goods', label: 'Goods'},
		    ]
		    scope.data_options = {
		        api: 'api/erm/doctors/search',
		        method: 'post',
		        columns: [
		            {field: 'doctor_id', is_hide: true},
		            {field: 'NAME', label: 'Doctor Name'},
		            {field: 'Email', label: 'Email'}
		        ],
		        show_index: true,
		        use_filters: true,
		        filters: {
		            NAME: {type: 'text'},
		            Email: {type: 'text'},
		        }
		    };

		    scope.clickRow = function (item) {
		        console.log(item);
		    }
		}
	} // end return
})