angular.module('app.loggedIn.mdtspecialty.listByDoctor.dialog', [])

.directive('mdtspecialtyListbydoctor', function($modal, mdtSpecialtyService, toastr){
	return {
		restrict: 'EA',
		scope: {
			limit: '=',
			reload: '=',
			doctorId: '=',
			onRowClick: '&'
		},
		templateUrl: 'modules/mdtspecialty/dialogs/templates/listDoctor.html',
		link: function(scope, elem, attrs){
			var search = {
				page: 1,
				limit: scope.limit,
				offset: 0,
				max_size: 5,
				Specialties_name: '',
				Creation_date: 'desc',
				doctor_id: scope.doctorId
			}

			var load = function(){
				var postData = angular.copy(scope.speciality.search);

				mdtSpecialtyService.loadWithoutDoctor(postData)
				.then(function(response){
					scope.speciality.list = response.data;
					scope.speciality.count = response.count;					
				})
			}

			var onSearch = function(){
				scope.speciality.search.offset = 0;
				scope.speciality.load();
				scope.speciality.search.page = 1;
			}

			var onOrderBy = function(option){
				switch(option.field){
					case 'Creation_date':
						scope.speciality.search.Creation_date = option.order;
						break;
				}

				scope.speciality.load();
			}

			var remove = function(list){
				$modal.open({
					templateUrl: 'dialogAlertRemove',
					controller: 'AlertRemoveDialog',
					size: 'sm',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(list){
					AlertModel.remove(list)
					.then(function(response){
						toastr.success('Delete Successfully');
						scope.speciality.load();
					}, function(error){})
				})
			}

			var edit = function(list){
				$modal.open({
					templateUrl: 'dialogAlertEdit',
					controller: 'AlertEditDialog',
					size: 'lg',
					resolve: {
						list: function(){
							return list;
						}
					}
				})
				.result.then(function(response){
					if(response === 'success'){
						toastr.success('Edit Successfully');
						scope.speciality.load();
					}
				})
			}

			var onPage = function(page){
				scope.speciality.search.offset = (page-1)*scope.speciality.search.limit;
				scope.speciality.load();
			}

			scope.speciality = {
				dialog: {
					remove: function(list){
						remove(list);
					},
					edit: function(list){
						edit(list);
					}
				},
				search: angular.copy(search),
				load: function(){load();},
				list: [],
				onSearch: function(){ onSearch(); },
				onOrderBy: function(option){ onOrderBy(option); },
				onPage: function(page){ onPage(page); }
			}

			scope.speciality.load();

			scope.$watch('reload', function(reload){
				if(reload){
					scope.speciality.search = angular.copy(search);
					scope.speciality.load();
				}
			})
		}
	}
})