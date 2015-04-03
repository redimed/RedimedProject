angular.module('app.loggedIn.company.directives.add', [])

.directive('addCompany', function(CompanyModel, $filter,$state,$modal  ){
	return {
		restrict: 'EA',
		templateUrl: 'modules/company/directives/templates/add.html',
		scope: {
			options: '='
		},
		link: function(scope, elem, attrs)
		{
			var form ={
		        Company_name:'',
		        Industry:'',
		        Addr:'',
		        postcode:'',
		        State:'',
		        Description:'',
		        latitude:'',
		        longitude:'',
		        country:'',
		        result_email:'',
		        invoice_email:'',
		        PO_number:'',
		        isProject:'',
		        isCalendar:'',
		        father_id:'',
		        report_to_email:'',
		        default_status:'',
		        isInvoiceEmailToUser:'',
		        isAddContactEmailToResult:'',
		        IMA:'',
		        Site_name:'',
		        Medic_contact_no:'',
		        Email:'',
		        CODE:'',
		        Insurer:'',
		        Phone:'',
		        Site_medic:'',
		        User_id:'',
		        isPO:'',
		        isExtra:'',
		        parent_id :'',
		        listInsurerid :[]
			}
			var addCompany = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addParent.html',
			      controller: 'CompanyAddParentDialgosController',
			      size :'lg'
			    })
			    .result.then(function(row){
			    	scope.company.Company_name_Parent = row.Company_name;
			    	scope.company.form.parent_id = row.id;
			    })
			}

			var addInsurer = function(size){
				var modalInstance = $modal.open({
			      templateUrl: 'modules/company/dialogs/templates/addInsurer.html',
			      controller: 'CompanyInsurerDialgosController',
			      size :''
			    })
			    .result.then(function(row){
					var flag = 0
					for (var i = 0; i <= scope.company.listTemp.length; i++) {
						if (scope.company.listTemp[i] == row.id) {
							flag = flag +1;
						} else{
						}
					}
					if (flag<=0) {
						scope.company.listTemp.push(row.id);
						scope.company.listInsurer.push(row);
					};
					
				})
			}
			var save = function(){
		    	var postData = angular.copy(scope.company.form);
		    	postData.listInsurerid = scope.company.listTemp;
		    	console.log(postData);
		  		CompanyModel.add(postData)
		  			.then(function(response){
		  				$state.go('loggedIn.company');
		  			}, function(error){
		  			})
		    }
		    scope.company = {
		    	form:form,
		    	listInsurer:[],
		    	listTemp:[],
		    	Company_name_Parent:'',
		    	save :function(){save();},
		    	addCompany :function(){addCompany();},
		    	addInsurer :function(){addInsurer();}
		    }
		}//end link
		
	}//end return
})