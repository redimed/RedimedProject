angular.module("app.loggedIn.consult.script.controller",[])
	.controller("ScriptController",function($scope,$filter,$state,$modal,toastr,$modalInstance,$stateParams, script){
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

		if(script != null)
			$scope.scriptInfo = angular.copy(script);

		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}

		$scope.okClick = function(){
			$modalInstance.close({'type':'ok','value':$scope.scriptInfo});
		}

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