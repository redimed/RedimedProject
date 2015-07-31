angular.module('app.loggedIn.script.directive.list', [])

.directive('scriptList', function(ScriptModel, PatientService, $modal, $filter, $stateParams, $state, toastr){
	return {

		restrict: 'EA',
		templateUrl: 'modules/script/directives/templates/list.html',
		scope:{
			options: '=',
			limit: '@',
			medicare: '='
		},
		link: function(scope, ele, attrs){

			var search = {
				page: 1,
				limit: 20,
				offset: 0,
				max_size: 5,
				scriptNum: '',
				medication_name: '',
				isEnable: '',
				Patient_id: $stateParams.patient_id,
				CAL_ID: $stateParams.cal_id,
				Creation_date: 'desc'
			}

			var load = function(){
				console.log('fdsfds: ',scope.medicare);
				ScriptModel.list(search).then(function(response){

					scope.script.list = response.data;
					scope.script.count = response.count;		
				}, function(error) {})

			}

			var onSearch = function(option){

				switch(option.field){
					case 'scriptNum':{
						scope.script.search.scriptNum = option.value;
						break;
					}
					case 'medication_name':{
						scope.script.search.medication_name = option.value;
						break;
					}
				}
				scope.script.load();
			}

			var remove = function(id){

				var modalInstance = $modal.open({
					templateUrl: 'notifyToRemove',
					controller: function($scope, id, $modalInstance){
						$scope.ok = function(){
							$modalInstance.close(id);
						}
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'sm',
					resolve: {
						id: function(){
							return id;
						}
					}
				});
				modalInstance.result.then(function(id){
					if(id){
						ScriptModel.remove(id).then(function(deleted){
							toastr.success('Deleted Successfully');
							scope.script.load();
						}, function(error){

						})
					}
				})
			}

			scope.Scripts = function(type, index){
				if(type == 'new')
				{
					var modalInstance = $modal.open({
			        	templateUrl: 'notifyToAdd',
			         	controller: function ($scope,$modalInstance,medicare) {
			         		$scope.medicare = medicare;
			         	},
			         	size :'lg',
			         	resolve :{
			         		medicare :function(){
			         			return scope.medicare;
			         		}
			         	}
			       	})
			       	.result.then(function(response){
			        	scope.script.load();
			       	})
			   	}

			   	if(type == 'edit'){
			   		var modalInstance = $modal.open({
			         	templateUrl: 'notifyToEdit',
			         	controller: 'ScriptEditController',
			         	size :'lg',
			         	resolve: {
				         	ID: function(){
				         		return index;
				         	},
				         	medicare :function(){
			         			return scope.medicare;
			         		}
			         	}
			       	})
			       .result.then(function(response){
			       		if(response){
							scope.script.load();
						}
			       })
			   	}
			}

			var disable = function(row){
				
				ScriptModel.postDisable(row).then(function(response){
					scope.script.load();
				}, function(error) {})

			}

			scope.setPage = function (page) {
				scope.script.search.offset = (page-1)*scope.script.search.limit;
				scope.script.load();
			}

			scope.script = {
				search: search,
				dialog: {
					remove: function(id){ remove(id); }
				},
				loading: false,
				list: [],
				count: 0,
				error: '',
				disable: function(row){ disable(row); },
				load: function(){ load(); },
				onSearch: function(option){ onSearch(option); }
			}
			$scope.addFormScript = {
		        is_show: false,
		        open: function () {
		            this.is_show = true;
		        },
		        close: function () {
		            this.is_show = false;
		        }
		    }
			scope.script.load();

		}//end link

	}//end return
})
