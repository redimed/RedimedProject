angular.module('app.loggedIn.patient.problem.detail.directive',[])
.directive('problemDetail',function(ProblemModel, ProblemService, ConfigService, toastr, $stateParams){
	return {
		restrict:'EA',
		scope: {
	       data: "@",
	       options: "=",
	       onsuccess: '=onsuccess'
	    },
	    templateUrl: "modules/problem/directives/templates/detail.html",
	    link: function(scope, element, attrs){
	    	var patient_id = $stateParams.patient_id;
	    	var loadData = function (id) {
                ProblemService.detail(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.data);
                    ConfigService.autoConvertData(scope.modelObjectMap);
                });
            };

            scope.modelObjectMap = angular.copy(ProblemModel);
            scope.mode = {type: 'add', text: 'Add problem'};

            scope.modelObjectMap.From_date = new Date();

            if (scope.data) {
                var data = scope.$eval(scope.data);
                if (data.id) { 
                    loadData(data.id);
                    scope.mode = {type: 'edit', text: 'Edit problem'};
                }
            }

            var addProcess = function (postData) {
            	postData.Patient_id = patient_id;
                ProblemService.insert(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Problem added", "Success");
                        scope.modelObjectMap = angular.copy(ProblemModel);
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
                        }
                    }
                })
            }

            var editProcess = function (postData) {
                ProblemService.update(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Edit problem Successfully", "Success");
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