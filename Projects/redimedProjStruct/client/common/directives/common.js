angular.module("app.directive.common", [])

.filter('offset', function () {
    return function (input, start) {
        if (input.length > 0) {
            start = (start - 1) * 20;
            return input.slice(start, start + 20);
        }
    }
})

.filter("undefined", function () {
    return function (input) {
        if (input && input !== "" && input !== null) {
            return input;
        } else
            return "No";
    }
})
.filter('arrGetBy', function() {
  return function(input, key, value) {
    for (var i=0, len=input.length; i<len; i++) {
      if (input[i][key] == value) {
        return input[i];
      }
    }
    return null;
  }
})
.directive("fabric", function(){
    return {
        restrict: "EA",
        templateUrl: "common/views/directives/fabric.html",
        link: function(scope, element, attrs){
            var canvas = new fabric.Canvas("c");

            /*fabric.Image.fromURL('http://localhost:81/billing/client/theme/body.png', function(img) {
                canvas.add(img);
            });*/

            var text = new fabric.Text("hello world", {
                fontSize: 30,
                originX: 'center',
                originY: 'center'
            });

            /*var circle = new fabric.Circle({
                radius: 100,
                fill: '#eef',
                scaleY: 0.5,
                originX: 'center',
                originY: 'center'
            });*/

            var group = new fabric.Group([text], {
                left: 150,
                top: 100,
                angle: -10
            })

            canvas.add(text);
        }
    }
})

.directive("audiogram", function($timeout){
    return {
        restrict: "EA",
        scope: {
            data: '='
        },
        templateUrl: "common/views/directives/audioDiagram.html",
        link: function(scope, element, attrs){
            
            scope.id = attrs.audiogram;

            scope.$watch("data", function(newData){
                var data = newData;

                var WIDTH = 800;
                var HEIGHT = 430;
                var MARGIN = 40;

                var xOffset = 30;
                var yOffset = 100;

                var groupAxisXData = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

                var WIDTH = data.length*yOffset+yOffset;

                var paper = Raphael(scope.id, 1000, 600);

                var path = paper.path([
                    'M', MARGIN, MARGIN,
                    'L', WIDTH+MARGIN, MARGIN,
                    'L', WIDTH+MARGIN, HEIGHT,
                    'L', MARGIN, HEIGHT,
                    'L', MARGIN, MARGIN
                ]);

                // DISPLAY COLUMN Y
                var offset = MARGIN;
                for(var i = 0; i < groupAxisXData.length; ++i){
                    paper.text(MARGIN/2, offset, groupAxisXData[i]);
                    offset += xOffset;
                    if(i < groupAxisXData.length - 2){
                        paper.path([
                            'M', MARGIN, offset,
                            'L', WIDTH+MARGIN, offset
                        ]);
                    }
                }
                // END DISPLAY COLUMN Y

                // DISPLAY COLUMN X
                var offset = yOffset+MARGIN;
                for(var i = 0; i < data.length; ++i){
                    paper.text(offset, MARGIN/2, data[i]+"Hz");

                    paper.path([
                        'M', offset, MARGIN,
                        'L', offset, HEIGHT
                    ]);

                    if(i === data.length - 1)
                        offset += yOffset*2;
                    else{
                        offset += yOffset;
                    }
                }
                // END DISPLAY COLUMN X
            }) // END WATCH
            
        } // END LINK
    } // END RETURN
})



.directive("radio", function () {
    return {
        restrict: "A",
        require: "?ngModel",
        scope: {
            model: "=ngModel",
            value: "=ngValue"
        },
        link: function (scope, element, attrs) {
            element.uniform();

            scope.$watch("model", function (model) {
                if (model) {
                    if (model === scope.value)
                        element.prop('checked', true);
                    angular.element.uniform.update(element);
                }
            })
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

    .directive("minHeight", function () {
        return{
            restrict: "A",
            link: function (scope, element, attrs) {
                //Get window height
                var windowHeight = angular.element(window).height();
                //Parse to height window
                element.css("min-height", windowHeight + "px");

                //Window Resize
                angular.element(window).resize(function () {
                    //Get window height
                    var windowHeight = angular.element(window).height();
                    //Parse to height window
                    element.css("min-height", windowHeight + "px");
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

.directive("customDate", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var defaultDate = "dd/mm/yy";

            if (attrs.type === "birthday") {
                element.datepicker({
                    "dateFormat": defaultDate,
                    "changeMonth": true,
                    "changeYear": true,
                    "defaultDate": new Date(1990, 08, 06),
                    "yearRange": "1930:2100"
                });
            } else {
                element.datepicker({
                    "dateFormat": defaultDate,
                    "changeMonth": true,
                    "changeYear": true
                });
            }
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
                scope.$watchCollection("selectedItemsArray", function (newValue) {
                    if (_.contains(newValue, scope.value)) {
                        elem.prop("checked", true);
                    }
                    else {
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
                                function () {
                                    scope.selectedItemsArray.push(scope.value);
                                }
                            );
                        }
                    } else {
                        if (_.contains(scope.selectedItemsArray, scope.value)) {
                            var index = scope.selectedItemsArray.indexOf(scope.value);
                            scope.$apply(
                                function () {
                                    scope.selectedItemsArray.splice(index, 1);
                                });
                        }
                    }
                });
            }
        }
    }])


// SIDEBAR MENU RESPONSIVE
    .directive("sidebarRes", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                //Get window width
                var windowWidth = angular.element(window).width();

                if (windowWidth < 768) {
                    element.find(".not-mobile").hide();
                    element.find(".mobile").show();

                    element.addClass("sidebar-mobile");
                    element.find("#main-menu").hide();
                    element.find(".sidebar-menu").css("min-height", "0px");
                    element.find(".sidebar-menu").addClass("sidebar-mobile");
                    element.find(".sidebar-menu").css("position", "relative");
                    element.addClass("sidebar-padding-left");
                    element.removeClass("sidebar-collapsed");
                }
                else if (windowWidth < 992) {
                    element.find(".not-mobile").show();
                    element.find(".mobile").hide();

                    element.find("#main-menu").show();
                    element.addClass("sidebar-collapsed");
                    element.removeClass("sidebar-mobile");
                    element.find(".sidebar-menu").removeClass("sidebar-mobile");
                    element.find(".sidebar-menu").css("position", "absolute");
                    element.removeClass("sidebar-padding-left");
                } else {
                    element.find(".not-mobile").show();
                    element.find(".mobile").hide();

                    element.find("#main-menu").show();
                    element.removeClass("sidebar-collapsed");
                    element.removeClass("sidebar-mobile");
                    element.find(".sidebar-menu").removeClass("sidebar-mobile");
                    element.find(".sidebar-menu").css("position", "absolute");
                    element.removeClass("sidebar-padding-left");
                }

                //Window Resize
                angular.element(window).resize(function () {
                    //Get window width
                    var windowWidth = angular.element(window).width();

                    if (windowWidth < 768) {
                        element.find(".not-mobile").hide();
                        element.find(".mobile").show();

                        element.addClass("sidebar-mobile");
                        element.find("#main-menu").hide();
                        element.find(".sidebar-menu").css("min-height", "0px");
                        element.find(".sidebar-menu").css("position", "relative");
                        element.addClass("sidebar-padding-left");
                        element.removeClass("sidebar-collapsed");
                    }
                    else if (windowWidth < 992) {
                        element.find(".not-mobile").show();
                        element.find(".mobile").hide();

                        element.find("#main-menu").show();
                        element.addClass("sidebar-collapsed");
                        element.removeClass("sidebar-mobile");
                        element.find(".sidebar-menu").removeClass("sidebar-mobile");
                        element.find(".sidebar-menu").css("position", "absolute");
                        element.removeClass("sidebar-padding-left");
                    } else {
                        element.find(".not-mobile").show();
                        element.find(".mobile").hide();

                        element.find("#main-menu").show();
                        element.removeClass("sidebar-collapsed");
                        element.removeClass("sidebar-mobile");
                        element.find(".sidebar-menu").removeClass("sidebar-mobile");
                        element.find(".sidebar-menu").css("position", "absolute");
                        element.removeClass("sidebar-padding-left");
                    }
                });
            }
        }
    })

// VALIDATION EMAIL
    .directive("email", function () {
        return {
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (email) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (typeof email !== 'undefined' && email !== "") {
                        if (re.test(email)) {
                            ctrl.$setValidity("email", true);
                        } else {
                            ctrl.$setValidity("email", false);
                        }
                    } else {
                        ctrl.$setValidity("email", true);
                    }

                    return email;
                });
            }
        }
    })

//VALIDATION INTEGER
<<<<<<< HEAD
.directive("integer", function(){
	return {
		require: "ngModel",
		link: function(scope, element, attrs, ctrl){
			ctrl.$parsers.unshift(function(number){
			 if (typeof number !== 'undefined' && number !== "" && number !== null) {
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
// MATCH INPUT LIKE PASSWORD, ... ETC
.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
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
=======
    .directive("integer", function () {
        return {
            require: "ngModel",
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (number) {
                    if (typeof number !== 'undefined' && number !== "") {
                        if (number >= 0 && number % 1 === 0) {
                            ctrl.$setValidity("integer", true);
                        } else {
                            ctrl.$setValidity("integer", false);
                        }
                    } else {
                        ctrl.$setValidity("integer", true);
                    }

                    return number;
                });
            }
        }
    })

// LOADING
    .directive('ngLoading', function ($compile) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                // 'record' the initial div contents
                var initialContents = element.html();
                scope.$watch(attrs.ngLoading, function (loading) {
                    if (loading === true) {
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
>>>>>>> origin/thanh-merce-master
                    }
                });
            }
        };
    })

    .directive('appFilereader', function ($q) {
        /*
         made by elmerbulthuis@gmail.com WTFPL licensed
         */
        var slice = Array.prototype.slice;

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function () {
                }

                element.bind('change', function (e) {
                    var element = e.target;
                    if (!element.value) return;

                    element.disabled = true;
                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function (values) {
                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                            element.value = null;
                            element.disabled = false;
                        });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader()
                        reader.onload = function (e) {
                            deferred.resolve(e.target.result);
                        }
                        reader.onerror = function (e) {
                            deferred.reject(e);
                        }
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

<<<<<<< HEAD
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
	
	.directive("customTimepicker", function(){
    return {
        require: "ngModel",
        restrict: "EA",
        scope: {
            ngModel: "="
        },
        link: function(scope, elem, attrs, ctrl){
            elem.timepicker({
                showPeriodLabels: false,
                onSelect: function(time, inst){
                    scope.ngModel = time;
                    scope.$apply();
                }
            });
        }
    }
})

.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
})

=======
                }); //change

            } //link

        }; //return

    }) //appFilereader
    .directive("signature", function ($timeout) {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                'ngModel': "=",
                'reset': "="
            },
            link: function (scope, element, attr) {
                element.jSignature();

                element.bind("change", function (e) {
                    scope.$apply(function () {
                        scope.ngModel = element.jSignature("getData");
                    })
                })

                scope.$watch('reset', function(newReset, oldReset){
                    if(typeof newReset !== 'undefined'){
                        $timeout(function(){
                            element.jSignature('reset');
                            scope.$apply(function(){
                                scope.ngModel = '';
                                scope.reset = false;
                            })
                        }, 200)
                    }
                })
            }
        }
    })
>>>>>>> origin/thanh-merce-master

    .filter('utc', function () {

        return function (val) {
            var date = new Date(val);
            return new Date(date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds());
        };

    });
