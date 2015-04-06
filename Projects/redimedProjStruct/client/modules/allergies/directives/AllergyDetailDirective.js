angular.module('app.loggedIn.allergy.detail.directive',[
	
])
.directive('allergyDetail',function(AllergyModel, AllergyService, ConfigService, toastr){
	return {
		restrict:'EA',
		scope: {
	       data: "@",
	       options: "=",
	       onsuccess: '=onsuccess'
	    },
	    templateUrl: "modules/allergies/directives/templates/detail.html",
	    link: function(scope, element, attrs){

	    	scope.medicine_unit_options = ConfigService.medicine_unit_option();

	    	var loadData = function (id) {
                AllergyService.detail(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.data);
                    ConfigService.autoConvertData(scope.modelObjectMap);
                });
            };

            scope.modelObjectMap = angular.copy(AllergyModel);
            scope.mode = {type: 'add', text: 'Add allergy'};

            if (scope.data) {
                var data = scope.$eval(scope.data);
                if (data.id) { 
                    loadData(data.id);
                    scope.mode = {type: 'edit', text: 'Edit referral'};
                }
            }

            var addProcess = function (postData) {
                AllergyService.insert(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Allergy added", "Success");
                        scope.modelObjectMap = angular.copy(AllergyModel);
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
                        }
                    }
                })
            }

             var editProcess = function (postData) {
                AllergyService.update(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Edit allergy Successfully", "Success");
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
                        }
                    }
                })
            }

            scope.clickAction = function (option) {
                if (option.type != 'view') {
                    scope.isSubmit = true;
                    if (!scope.mainForm.$invalid) {
                        var postData = angular.copy(scope.modelObjectMap);

                        // DATE
                        for (var key in postData) {
                            if (postData[key] instanceof Date) {
                                postData[key] = ConfigService.getCommonDate(postData[key]);
                            }
                        }
                        // END DATE

                        if (option.type == 'add') {
                            addProcess(postData);
                        } else if (option.type == 'edit') {
                            editProcess(postData);
                        }
                    }
                } else {
                    // view process
                }
            }
	    }
	}
});