angular.module("app.loggedIn.consult.script.controller",[])
	.controller("ScriptController",function($scope,$filter,$state,$modal,toastr,$modalInstance,ConsultationService,$stateParams, script){
		$scope.scriptInfo = {
			medication: null,
			strength: null,
			form: null,
			qty: 0,
			code: null,
			script: null,
			dose: null,
			frequency: null,
			instructions: null,
			repeat: null,
			reason: null,
			category: null
		};

		$scope.selectedPerson = null;

		if(script != null)
			$scope.scriptInfo = angular.copy(script);

		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}

		$scope.okClick = function(){
			console.log($scope.selectedPerson);
			$modalInstance.close({'type':'ok','value':$scope.scriptInfo});
		}

		$scope.searchScript = function(name){
			ConsultationService.searchScript({medicine_name: name}).then(function(rs){
				console.log(rs);
			})
		}

		$scope.people = [
            {firstName: "Daryl", surname: "Rowland", twitter: "@darylrowland"},
            {firstName: "Alan", surname: "Partridge", twitter: "@alangpartridge"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie"}
        ];

        

	})

	.directive('number', function(){
	   return {
	     require: 'ngModel',
	     link: function(scope, element, attrs, modelCtrl) {
	       modelCtrl.$parsers.push(function (inputValue) {
	           if (inputValue == undefined) return '' 
	           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
	           if (transformedInput!=inputValue) {
	              modelCtrl.$setViewValue(transformedInput);
	              modelCtrl.$render();
	           }         

	           return transformedInput;         
	       });
	         
	         element.bind('keypress', function(event) {
		        if(event.keyCode === 32) {
		          event.preventDefault();
		        }
		      });
	     }
	   };
	})