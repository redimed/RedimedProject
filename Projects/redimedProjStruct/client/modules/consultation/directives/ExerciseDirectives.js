angular.module('app.loggedIn.patient.exercise.directives.list', [])
.controller('ExerciseDialog', function($scope, $modalInstance, list){
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	$scope.ok = function(){
		$modalInstance.close(list);
	}
})
.controller('ExerciseAddDialog', function($scope, $modalInstance){
	$scope.exercise = {
		success: false
	}

	$scope.$watch('exercise.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})
.controller('ExerciseEditDialog', function($scope, $modalInstance,list){
	$scope.exercise = {
		id: list.Exercise_id,
		success: false
	}
	$scope.$watch('exercise.success', function(success){
		if(success)
			$modalInstance.close('success');
	})	
})
.directive('listExercise', function($modal, ConsultationService, toastr,$stateParams){
	return {
		restrict: 'EA',
		scope: {
			limit: '=',
			reload: '='
		},
		templateUrl: "modules/consultation/directives/templates/exercise/listExercise.html",
		link: function(scope, elem, attrs){
			var search = {
				page: 1,
				limit: scope.limit,
				offset: 0,
				max_size: 5,
				patient_id:$stateParams.patient_id,
				cal_id:$stateParams.cal_id,
			}
			var load = function(){
				var postData = angular.copy(scope.exercise.search);
				ConsultationService.listExercise(postData)
				.then(function(response){
					scope.exercise.list = response.data;
					scope.exercise.count = response.count;
				}, function(error){

				})
			}
			scope.add = function(list){
				$modal.open({
					templateUrl: 'dialogExerciseAdd',
					controller: 'ExerciseAddDialog'
				})
				.result.then(function(list){
					scope.exercise.load();
					toastr.success('Add Successfully');
				})
			}
			scope.edit = function(list){
				$modal.open({
					templateUrl: 'dialogExerciseEdit',
					controller: 'ExerciseEditDialog',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(list){
					scope.exercise.load();
					toastr.success('Edit Successfully');
				})
			}
			scope.delete = function(list){
				$modal.open({
					templateUrl: 'dialogExerciseRemove',
					controller: 'ExerciseDialog',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(list){
					ConsultationService.deleteExercise(list)
					.then(function(response){
						toastr.success('Delete Successfully');
						scope.exercise.load();
					}, function(error){})
				})
			}
			var onSearch = function(){
				scope.exercise.search.offset = 0;
				scope.exercise.load();
				scope.exercise.search.page = 1;
			}

			var onPage = function(page){
				scope.exercise.search.offset = (page-1)*scope.exercise.search.limit;
				scope.exercise.load();
			}

			scope.exercise = {
				search: angular.copy(search),
				load: function(){load();},
				list: [],
				onSearch: function(){ onSearch(); },
				onPage: function(page){ onPage(page); }
			}
			scope.exercise.load();
		}
	}
})
.directive('addExercise', function($cookieStore, ConsultationService, ConfigService,$stateParams){
	return {
		restrict: 'EA',
		scope: {
			success: '='
		},
		templateUrl: "modules/consultation/directives/templates/exercise/addExercise.html",
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var form = {
				exercise: '',
				lastest_weight: '',
				sets: '',
				reps: '',
				other: '',
				Created_by: user_id,
				Last_updated_by: user_id,
				patient_id:$stateParams.patient_id,
				cal_id:$stateParams.cal_id,
			}

			var save = function(){
				ConfigService.beforeSave(scope.exercise.errors);
				var postData = angular.copy(scope.exercise.form);
				postData.Last_update_date = moment().format('YYYY-MM-DD');

				ConsultationService.addExercise(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.exercise.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.exercise.errors);
				})
			}

			var load = function(){
			}

			scope.exercise = {
				form: angular.copy(form),
				load: function(){ load(); },
				errors: [],
				save: function(){ save(); }
			}//end exercise

			//INIT
			scope.exercise.load();
		}//end link
	}
})
.directive('editExercise', function($cookieStore, ConsultationService, ConfigService,$stateParams){
	return {
		restrict: 'EA',
		scope: {
			success: '=',
			exerciseId: '='
		},
		templateUrl: "modules/consultation/directives/templates/exercise/addExercise.html",
		link: function(scope, elem, attrs){
			var user_id = $cookieStore.get('userInfo').id;

			var form = {
				exercise: '',
				lastest_weight: '',
				sets: '',
				reps: '',
				other: '',
				//Created_by: user_id,
				//Last_updated_by: user_id,
				patient_id:$stateParams.patient_id,
				cal_id:$stateParams.cal_id,
			}

			var save = function(){
				ConfigService.beforeSave(scope.exercise.errors);
				var postData = angular.copy(scope.exercise.form);
				postData.Last_update_date = moment().format('YYYY-MM-DD');

				ConsultationService.updateExercise(postData)
				.then(function(response){
					scope.success = true;
				}, function(error){
					scope.exercise.errors = angular.copy(error.data.errors);
					ConfigService.beforeError(scope.exercise.errors);
				})
			}

			var load = function(){
				var postData = {id: scope.exerciseId};
				ConsultationService.getOneExercise(postData)
				.then(function(response){
					angular.extend(scope.exercise.form, response.data);
					delete scope.exercise.form.Creation_date;
				}, function(error){})
			}

			scope.exercise = {
				form: angular.copy(form),
				load: function(){ load(); },
				errors: [],
				save: function(){ save(); }
			}//end exercise

			//INIT
			scope.exercise.load();
		}//end link
	}
})