angular.module('app.loggedIn.script.directive.list', [])

.directive('scriptList', function(ScriptModel, $filter, $stateParams, $state){
	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/list.html',
		scope:{
			options: '=',
			limit: '@'
		},
		link: function(scope, ele, attrs){

			var search = {
				page: 1,
				limit: 20,
				offset: 0,
				max_size: 5,
				scriptNum: '',
				Medicare: '',
				Patient_id: $stateParams.patientId,
				CAL_ID: $stateParams.calId,
				Creation_date: 'desc'
			}

			var load = function(){
				ScriptModel.list(search).then(function(response){

					scope.script.list = response.data;
					scope.script.count = response.count;
					//console.log(response.data);					
				}, function(error) {})

			}

			var onSearch = function(option){

				switch(option.field){
					case 'scriptNum':{
						scope.script.search.scriptNum = option.value;
						break;
					}
					case 'Medicare':{
						scope.script.search.Medicare = option.value;
						break;
					}
				}
				scope.script.load();
			}

			var remove = function(id){

				ScriptModel.remove(id).then(function(deleted){
					scope.script.load();
				}, 
					function(error){});
			}

			var add = function(){

				$state.go('loggedIn.script.add');

			}

			var edit = function(id){
				$state.go('loggedIn.script.edit', {scriptId: id});
			}
			scope.setPage = function (page) {
				scope.script.search.offset = (page-1)*scope.script.search.limit;
				scope.script.load();
			}

			scope.script = {
				search: search,
				loading: false,
				list: [],
				count: 0,
				error: '',
				load: function(){ load(); },
				add: function(){ add(); },
				edit: function(id){ edit(id); },
				remove: function(id){ remove(id); },
				onSearch: function(option){ onSearch(option); }
			}

			scope.script.load();

		}//end link

	}//end return
})
