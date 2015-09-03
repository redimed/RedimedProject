angular.module('app.loggedIn.company.directives.listInsurer', [])

.directive('listInsurer', function(CompanyModel, $filter,$state, $modal,toastr){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/listInsurer.html',
		scope: {
			options: '=',
			limit: '@',
			onRowClick: '&',
			insurerArray:'=',
			responsedata:'='
		},
	    link: function(scope, elem, attrs){
			var setPage = function(page){
				scope.company.search.offset = (page-1)*scope.company.search.limit;
				scope.company.load();
			}
			var search = {
				page: 1,
				offset: 0,
				limit: 7,
				max_size: 5,
				Company_name: '',
				insurerArray :scope.insurerArray,
				insurer_name:'',
				address:''
			}
			/*
			load : Get listInsurer
			input param : insurerArray (list insurer selected)
			output param : listInsurer
			*/
			var load = function(){
				scope.company.loading = true;
				CompanyModel.listInsurer(search).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.list = response.data;
					scope.company.count = response.count;
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
			}
			var onSearch = function(option){
				switch(option.field){
					case 'insurer_name':
						scope.company.search.insurer_name = option.value;
						break;
					case 'address':
						scope.company.search.address = option.value;
						break;
				}//end switch
				scope.company.load();
				setPage(1);
			}
			/*
			addNewInsurer : add insurer for company
			input param : list insurer selected
			output param : insurer id and insurer name
			*/
			scope.addNewInsurer = function(){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addNewInsurer.html',
			      controller: 'CompanyAddNewInsurerDialgosController',
			      size :''
			    })
			    .result.then(function(response){
			    	 if(response.status === 'success'){
						CompanyModel.selectInsurer(response.data.insertId)
					    	.then(function(response){
					    		scope.responsedata = response.data[0];
					    	})
					} 	
			    })
			}
			scope.company = {
				search: search,
				error: '',
				count: 0,
				loading: false,
				list: [],
				load: function(){ load(); },
				setPage: function(page){ setPage(page); },
				onSearch: function(option){ onSearch(option)}
			}

			/* LOAD FIRST */
			scope.company.load();
			/* END LOAD FIRST */
		}//end link
	}//end return
	
})
