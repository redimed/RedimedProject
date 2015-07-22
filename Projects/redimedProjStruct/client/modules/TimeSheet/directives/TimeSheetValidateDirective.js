angular.module("app.loggedIn.TimeSheet.formValidate.Directive", [])
    .directive("modelValidate", function() {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "=",
                modelValidate: "=",
                formValidate: "="
            },
            link: function(scope, elem, attrs) {
                //NOTIFICATION
                var notiError = {
                    maxlength: "Too long!",
                    required: "Field is required!"
                };
                //END NITIFICATION

                //LISENT MODEL
                scope.$watch('modelValidate', function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null && 
                        newModel.length !== 0 &&
                        newModel !== " ") {
                        attrs.$set("required", true);
                    } else {
                        attrs.$set("required", false);
                    }
                    var isErr = false;
                    var indexErr = -1;
                    angular.forEach(scope.formValidate, function(valueError, indexError) {
                        if (valueError === true) {
                            isErr = true;
                            indexErr = indexError;
                        }
                    });
                    if (isErr) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END

                        //CHECK IF EXIST DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //ADD
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHTML: true,
                            content: notiError[indexErr]
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //CHECK IF ESIXT REMOVE
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                });
                //END LISTEN MODEL

                scope.$watch("ngModel", function(newModel, oldModel) {
                    var isErr = false;
                    var indexErr = -1;
                    angular.forEach(scope.formValidate, function(valueError, indexError) {
                        if (valueError === true) {
                            isErr = true;
                            indexErr = indexError;
                        }
                    });
                    if (isErr) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END

                        //CHECK IF EXIST DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //ADD
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHTML: true,
                            content: notiError[indexErr]
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //CHECK IF ESIXT REMOVE
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                });
            }
        };
    });
