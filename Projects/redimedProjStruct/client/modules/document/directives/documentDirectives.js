angular.module('app.loggedIn.document.directives',[])
	.directive("fileUpload", function(){
	return {
		restrict: "EA",
		required: "ngModel",
		scope:{
			ngModel:"="
		},
		link: function(scope, elem, attrs){
			elem.bind("change", function(changeEvent){
				var reader = new FileReader();
				reader.onload = function(loadEvent){
					scope.$apply(function(){
						scope.ngModel = loadEvent.target.result;
					});
				};
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
	}
});