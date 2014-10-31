angular.module("app.directive.common", [])

.directive("minHeight", function(){
	return{
		restrict: "A",
		link: function(scope, element, attrs){
			//Get window height
			var windowHeight = angular.element(window).height();
			//Parse to height window
			element.css("min-height", windowHeight+"px");

			//Window Resize
			angular.element(window).resize(function(){
				//Get window height
				var windowHeight = angular.element(window).height();
				//Parse to height window
				element.css("min-height", windowHeight+"px");
			});
		}
	}
})

.directive("checkbox", function(){
	return {
		restrict: "A",
		require: "?ngModel",
		scope: {
			model: "=ngModel"
		},
		link: function(scope, element, attrs){
			element.uniform();

			scope.$watch("model", function(model){
				if(model){
					element.prop('checked',true);
					angular.element.uniform.update(element);
				}
			});
		}
	}
})

// SELECT FROM DATE TO DATE
/*.directive("inputDate", function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			var defaultDate = "dd/mm/yy";
			var params = scope.$eval(attrs.inputDate);

			if(params.type === "from")
				var type = "minDate";
			else
				var type = "maxDate";

			element.datepicker({
				onClose: function(selectedDate){
					angular.element("#"+params.id).datepicker();
					angular.element("#"+params.id).datepicker("option", type, selectedDate);
					angular.element("#"+params.id).datepicker("option", "dateFormat", defaultDate);
				}
			});

			element.datepicker("option", "dateFormat", defaultDate);
		}
	}
})*/

// INPUT DATE
.directive("customDate", function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			var defaultDate = "dd/mm/yy";

			element.datepicker({
				"dateFormat": defaultDate
			});
		}
	}
})

.directive("checkList", [function () {
    return {
        restrict: "A",
        scope: {
            selectedItemsArray: "=",
            value: "@"
        },
        link: function (scope, elem) {
            scope.$watchCollection("selectedItemsArray", function(newValue){
                if (_.contains(newValue, scope.value)) {
                    elem.prop("checked", true);
                }
                else{
                    elem.prop("checked", false);
                }
            });
            if (_.contains(scope.selectedItemsArray, scope.value)) {
                elem.prop("checked", true);
            }
            elem.on("change", function () {
                if (elem.prop("checked")) {
                    if (!_.contains(scope.selectedItemsArray, scope.value)) {
                        scope.$apply(
                            function(){
                                scope.selectedItemsArray.push(scope.value);
                            }
                        );
                    }
                } else {
                    if (_.contains(scope.selectedItemsArray, scope.value)) {
                        var index = scope.selectedItemsArray.indexOf(scope.value);
                        scope.$apply(
                            function(){
                                scope.selectedItemsArray.splice(index, 1);
                            });
                    }
                }
            });
        }
    }
}])


// SIDEBAR MENU RESPONSIVE
.directive("sidebarRes", function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			//Get window width
			var windowWidth = angular.element(window).width();

			if(windowWidth < 768){
				element.find(".not-mobile").hide();
				element.find(".mobile").show();

				element.addClass("sidebar-mobile");
				element.find("#main-menu").hide();
				element.find(".sidebar-menu").css("min-height","0px");
				element.find(".sidebar-menu").addClass("sidebar-mobile");
				element.find(".sidebar-menu").css("position","relative");
				element.addClass("sidebar-padding-left");
				element.removeClass("sidebar-collapsed");
			}
			else if(windowWidth < 992){
				element.find(".not-mobile").show();
				element.find(".mobile").hide();

				element.find("#main-menu").show();
				element.addClass("sidebar-collapsed");
				element.removeClass("sidebar-mobile");
				element.find(".sidebar-menu").removeClass("sidebar-mobile");
				element.find(".sidebar-menu").css("position","absolute");
				element.removeClass("sidebar-padding-left");
			}else{
				element.find(".not-mobile").show();
				element.find(".mobile").hide();

				element.find("#main-menu").show();
				element.removeClass("sidebar-collapsed");
				element.removeClass("sidebar-mobile");
				element.find(".sidebar-menu").removeClass("sidebar-mobile");
				element.find(".sidebar-menu").css("position","absolute");
				element.removeClass("sidebar-padding-left");
			}

			//Window Resize
			angular.element(window).resize(function(){
				//Get window width
				var windowWidth = angular.element(window).width();

				if(windowWidth < 768){
					element.find(".not-mobile").hide();
					element.find(".mobile").show();

					element.addClass("sidebar-mobile");
					element.find("#main-menu").hide();
					element.find(".sidebar-menu").css("min-height","0px");
					element.find(".sidebar-menu").css("position","relative");
					element.addClass("sidebar-padding-left");
					element.removeClass("sidebar-collapsed");
				}
				else if(windowWidth < 992){
					element.find(".not-mobile").show();
					element.find(".mobile").hide();

					element.find("#main-menu").show();
					element.addClass("sidebar-collapsed");
					element.removeClass("sidebar-mobile");
					element.find(".sidebar-menu").removeClass("sidebar-mobile");
					element.find(".sidebar-menu").css("position","absolute");
					element.removeClass("sidebar-padding-left");
				}else{
					element.find(".not-mobile").show();
					element.find(".mobile").hide();

					element.find("#main-menu").show();
					element.removeClass("sidebar-collapsed");
					element.removeClass("sidebar-mobile");
					element.find(".sidebar-menu").removeClass("sidebar-mobile");
					element.find(".sidebar-menu").css("position","absolute");
					element.removeClass("sidebar-padding-left");
				}
			});
		}
	}
})

// VALIDATION EMAIL
.directive("email", function(){
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			ctrl.$parsers.unshift(function(email){
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if(typeof email !== 'undefined' && email !== ""){
	    			if(re.test(email)){
	    				ctrl.$setValidity("email", true);
	    			}else{
	    				ctrl.$setValidity("email", false);
	    			}
	    		}else{
	    			ctrl.$setValidity("email", true);
	    		}

	    		return email;
			});
		}
	}
})

//VALIDATION INTEGER
.directive("integer", function(){
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			ctrl.$parsers.unshift(function(number){
				if(typeof number !== 'undefined' && number !== ""){
	    			if(number >= 0 && number%1 === 0){
	    				ctrl.$setValidity("integer", true);
	    			}else{
	    				ctrl.$setValidity("integer", false);
	    			}
	    		}else{
	    			ctrl.$setValidity("integer", true);
	    		}

	    		return number;
			});
		}
	}	
})

// LOADING
.directive('ngLoading', function($compile) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
			// 'record' the initial div contents
			var initialContents = element.html();
			scope.$watch(attrs.ngLoading, function (loading) {
				if (loading===true) {
					element.html('<div class="loading-circles">' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
						'<div class="loading-circle"></div>' +
					'</div>');
				} else {
					// HERE I WANT TO RESTORE THE ORIGINAL CONTENT
					element.html(initialContents);
					$compile(element.contents())(scope);
				}
			});
		}
	};
})


.directive('appFilereader', function(
    $q
    ) {
    /*
     made by elmerbulthuis@gmail.com WTFPL licensed
     */
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {}

            element.bind('change', function(e) {
                var element = e.target;
                if(!element.value) return;

                element.disabled = true;
                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                        element.value = null;
                        element.disabled = false;
                    });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader()
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                    }
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    }
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            }); //change

        } //link

    }; //return

}) //appFilereader
	//confirm pass
	.directive('pwCheck', [function () {
		return {
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var firstPassword = '#' + attrs.pwCheck;
				elem.add(firstPassword).on('keyup', function () {
					scope.$apply(function () {
						var v = elem.val()===$(firstPassword).val();
						ctrl.$setValidity('pwmatch', v);
					});
				});
			}
		}
	}])


.filter('utc', function(){

    return function(val){
        var date = new Date(val);
        return new Date(date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds());
    };

});