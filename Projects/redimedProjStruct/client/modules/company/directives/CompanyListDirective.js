angular.module('app.loggedIn.company.directives.list', [])

.directive('listCompany', function(CompanyModel, $filter,$state,$stateParams,$modal,toastr){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/list.html',
		scope: {
			options: '=',
			limit: '@',
			onRowClick: '&'
		},
		link: function(scope, elem, attrs){
			var search = {
				page: 1,
				offset: 0,
				limit: parseInt(scope.limit),
				company_id :$stateParams.companyId,
				patient_id :$stateParams.patientId,
				Company_name:'',
				Industry:'',
				Addr:'',
				country:''
			}
			scope.onRowClick = function(row){
				scope.updateCompany.id = row.id;
				scope.updateCompany.patient_id =$stateParams.patientId; 
				var postData = angular.copy(scope.updateCompany);
				 CompanyModel.upCompanyPatient(postData)
		  			.then(function(response){
		  				toastr.success('Change Active Company Successfully');
		  				scope.company.load();
		  			}, function(error){
		  				scope.company.errors = angular.copy(error.data.errors);
		  			})

			}
			var remove = function(row){
				$modal.open({
					templateUrl:  'modules/company/dialogs/templates/remove.html',
					controller: 'CompanyRemoveDialog',
					size: 'sm',
					resolve: {
						row: function(){
							return row;
						}
					}
				})
			    .result.then(function(row){
			    	CompanyModel.remove(row)
					.then(function(response){
						toastr.success('Delete Successfully');
						scope.company.load();
					}, function(error){})
			    })
			}

			scope.clickEdit = function(row){
					$state.go('loggedIn.company.edit',{companyId:row.id});
			}
			var load = function(){
				scope.company.loading = true;
				CompanyModel.list(search).then(function(response){
					scope.company.loading = false;
					scope.company.error = '';
					scope.company.list = response.data;
					scope.company.count = response.count;
					scope.company.search.page = 1;
					scope.company.company_idActive = response.data1[0].company_id;
				}, function(error){
					scope.company.loading = false;
					scope.company.error = $filter('translate')(error.data.code);
				})
			}
			scope.addClick = function(){
				$state.go('loggedIn.company.add');
			}
			var onSearch = function(option){
				switch(option.field){
					case 'Company_name':
						scope.company.search.Company_name = option.value;
						break;
					case 'Industry':
						scope.company.search.Industry = option.value;
						break;
					case 'Addr':
						scope.company.search.Addr = option.value;
						break;
					case 'country':
						scope.company.search.country = option.value;
						break;
				}//end switch
				scope.company.load();
				loadPage(1);
			}
			
			var loadPage = function(page){
				scope.company.search.offset = (page-1)*scope.company.search.limit;
				scope.company.load();
			}
			scope.disableCompany = function(row){
				var postData ={
					patient_id :$stateParams.patientId,
					company_id : row.id,
					isEnable : row.checkisEnable
				}
				CompanyModel.disableCompany(postData)
				.then(function(response){
					scope.company.load();
				},function(error){

				})
			}
			scope.Select = function(){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/listNotFollowPatient.html',
			      controller: 'CompanyListNoFollowDialog',
			      size :''
			    })
			    .result.then(function(row){
			    	console.log(row);
			    	var postData = {
			    		patient_id:$stateParams.patientId,
			    		company_id:row.id
			    	}
			    	CompanyModel.AddlistNotFollow(postData)
			    	.then(function(response){
			    		scope.company.load();
			    	})
			    })
			}
			scope.company = {
				search: search,
				error: '',
				count: 0,
				loading: false,
				list: [],
				company_idActive:'',
				load: function(){ load(); },
				loadPage: function(page){ loadPage(page); },
				onSearch: function(option){ onSearch(option)},
				remove : function(size){remove(size)}
			}
			scope.updateCompany ={
				id:'',
				patient_id:''
			}

			/* LOAD FIRST */
			scope.company.load();
			/* END LOAD FIRST */
		}//end link
	}//end return
	
})
