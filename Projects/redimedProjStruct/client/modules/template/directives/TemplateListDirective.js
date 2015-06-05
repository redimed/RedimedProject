angular.module('app.loggedIn.template.directives.list', [])

.directive('templateList', function($modal, AlertModel, toastr){
	return {
		restrict: 'EA',
		scope: {
			limit: '=',
			reload: '='
		},
		templateUrl: 'modules/template/directives/templates/list.html',
		link: function(scope, elem, attrs){
			scope.template = {
				inputfile: null
			}
			/*var search = {
				page: 1,
				limit: scope.limit,
				offset: 0,
				max_size: 5,
				name: '',
				description: '',
				Creation_date: 'desc',
				isenable:''
			}
			var disableAlert = function(l){
				AlertModel.disableAlert(l)
				.then(function(response){
					scope.alert.load();
				},function(error){

				})
			}
			var load = function(){
				var postData = angular.copy(scope.alert.search);
				AlertModel.list(postData)
				.then(function(response){
					scope.alert.list = response.data;
					scope.alert.count = response.count;
				}, function(error){})
			}

			var onSearch = function(){
				scope.alert.search.offset = 0;
				scope.alert.load();
				scope.alert.search.page = 1;
			}

			var onOrderBy = function(option){
				switch(option.field){
					case 'Creation_date':
						scope.alert.search.Creation_date = option.order;
						break;
				}

				scope.alert.load();
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
						scope.alert.load();
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
						scope.alert.load();
					}
				})
			}

			var onPage = function(page){
				scope.alert.search.offset = (page-1)*scope.alert.search.limit;
				scope.alert.load();
			}

			scope.alert = {
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
				onPage: function(page){ onPage(page); },
				disableAlert : function(l){disableAlert(l);}
			}

			scope.alert.load();

			scope.$watch('reload', function(reload){
				if(reload){
					scope.alert.search = angular.copy(search);
					scope.alert.load();
				}
			})*/
		}
	}
})