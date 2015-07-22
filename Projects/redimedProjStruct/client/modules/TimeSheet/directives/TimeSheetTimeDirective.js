angular.module("app.loggedIn.TimeSheet.Time.Directive", [])
    .directive('timeCharge', function(StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "=",
                formValidate: "=",
                requireValidate: "="
            },
            link: function(scope, elem, attrs, ctrls, ngModel) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        newModel !== "" &&
                        parseInt(newModel.toString().substr(newModel.toString().length - 2, 2)) > 59) {
                        scope.ngModel = StaffService.convertFromFullToShow(StaffService.convertShowToFull(newModel)).toString();
                    }
                    if (scope.ngModel !== undefined &&
                        scope.ngModel !== null &&
                        scope.ngModel !== "" &&
                        scope.ngModel !== 0 &&
                        scope.ngModel.length !== 0) {
                        var result = "";
                        for (var i = 0; i < scope.ngModel.toString().length - 2; i++) {
                            result += "9";
                        }
                        result += ":99";
                        attrs.$set('uiMask', result);
                    } else {
                        //IF EXIST NOT SET
                        if (attrs.uiMask !== "99:99") {
                            attrs.$set('uiMask', '99:99');
                        }
                        //END
                    }
                    //SET TOOLTIPLE FOR INPUT
                    var ObjectError = {
                        "required": "Field is required!",
                        "mask": "Filed is invalid!"
                    };
                    var isError = false;
                    var keyErrorOut = "";
                    angular.forEach(scope.formValidate, function(valueError, keyErrorIn) {
                        if (valueError === true) {
                            isError = true;
                            keyErrorOut = keyErrorIn;
                        }
                    });

                    if (isError === true) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END SET

                        //CHECK EXIST TOOLTIP DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //END

                        //ADD TOOLTIP
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHtml: true,
                            content: ObjectError[keyErrorOut]
                        });
                        //END
                    } else if (newModel !== undefined && newModel !== null && newModel.length === 0) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END SET

                        //CHECK EXIST TOOLTIP DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //END

                        //ADD TOOLTIP
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHtml: true,
                            content: ObjectError['required']
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //SET COLOR INPUT MORMAL
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                    //END SET
                });
            },
        };
    })
    .directive('timeChargeleave', function(StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "=",
                formValidate: "=",
                requireValidate: "="
            },
            link: function(scope, elem, attrs, ctrls, ngModel) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        newModel !== "" &&
                        parseInt(newModel.toString().substr(newModel.toString().length - 2, 2)) > 59) {
                        scope.ngModel = StaffService.convertFromFullToShow(StaffService.convertShowToFull(newModel)).toString();
                    }
                    if (scope.ngModel !== undefined &&
                        scope.ngModel !== null &&
                        scope.ngModel !== "" &&
                        scope.ngModel !== 0 &&
                        scope.ngModel.length !== 0) {
                        var result = "";
                        for (var i = 0; i < scope.ngModel.toString().length - 2; i++) {
                            result += "9";
                        }
                        result += ":99";
                        attrs.$set('uiMask', result);
                    } else {
                        //IF EXIST NOT SET
                        if (attrs.uiMask !== "99:99") {
                            attrs.$set('uiMask', '99:99');
                        }
                        //END
                    }
                    //SET TOOLTIPLE FOR INPUT
                    var ObjectError = {
                        "required": "Field is required!",
                        "mask": "Filed is invalid!"
                    };
                    var isError = false;
                    var keyErrorOut = "";
                    angular.forEach(scope.formValidate, function(valueError, keyErrorIn) {
                        if (valueError === true) {
                            isError = true;
                            keyErrorOut = keyErrorIn;
                        }
                    });

                    if (isError === true) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END SET

                        //CHECK EXIST TOOLTIP DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //END

                        //ADD TOOLTIP
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHtml: true,
                            content: ObjectError[keyErrorOut]
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //SET COLOR INPUT MORMAL
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                    //END SET
                });
                //WATCH MODEL REQUIRE
                scope.$watch('requireValidate', function(newModelRequired, oldModelRequired) {
                    if (newModelRequired !== undefined && newModelRequired !== null && newModelRequired.length !== 0) {
                        attrs.$set("required", true);
                    } else {
                        attrs.$set("required", false);
                    }
                    //CHECK REQUIRE
                    //SET TOOLTIPLE FOR INPUT
                    var ObjectError = {
                        "required": "Field is required!",
                        "mask": "Filed is invalid!"
                    };
                    var isError = false;
                    var keyErrorOut = "";
                    angular.forEach(scope.formValidate, function(valueError, keyErrorIn) {
                        if (valueError === true) {
                            isError = true;
                            keyErrorOut = keyErrorIn;
                        }
                    });

                    if (isError === true) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END SET

                        //CHECK EXIST TOOLTIP DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //END

                        //ADD TOOLTIP
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHtml: true,
                            content: ObjectError[keyErrorOut]
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //SET COLOR INPUT MORMAL
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                    //END SET
                    //END
                });
                //END   
            },
        };
    })
    .directive('timeChargenon', function(StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "=",
                formValidate: "=",
                requireValidate: "="
            },
            link: function(scope, elem, attrs, ctrls, ngModel) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        newModel !== "" &&
                        parseInt(newModel.toString().substr(newModel.toString().length - 2, 2)) > 59) {
                        scope.ngModel = StaffService.convertFromFullToShow(StaffService.convertShowToFull(newModel)).toString();
                    }
                    if (scope.ngModel !== undefined &&
                        scope.ngModel !== null &&
                        scope.ngModel !== "" &&
                        scope.ngModel !== 0 &&
                        scope.ngModel.length !== 0) {
                        var result = "";
                        for (var i = 0; i < scope.ngModel.toString().length - 2; i++) {
                            result += "9";
                        }
                        result += ":99";
                        attrs.$set('uiMask', result);
                    } else {
                        //IF EXIST NOT SET
                        if (attrs.uiMask !== "999:99") {
                            attrs.$set('uiMask', '999:99');
                        }
                        //END
                    }
                    //SET TOOLTIPLE FOR INPUT
                    var ObjectError = {
                        "required": "Field is required!",
                        "mask": "Filed is invalid!"
                    };
                    var isError = false;
                    var keyErrorOut = "";
                    angular.forEach(scope.formValidate, function(valueError, keyErrorIn) {
                        if (valueError === true) {
                            isError = true;
                            keyErrorOut = keyErrorIn;
                        }
                    });

                    if (isError === true) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END SET

                        //CHECK EXIST TOOLTIP DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //END

                        //ADD TOOLTIP
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHtml: true,
                            content: ObjectError[keyErrorOut]
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //SET COLOR INPUT MORMAL
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                    //END SET
                });
                //WATCH MODEL REQUIRE
                scope.$watch('requireValidate', function(newModelRequired, oldModelRequired) {
                    if (newModelRequired !== undefined && 
                        newModelRequired !== null && 
                        newModelRequired.length !== 0 &&
                        newModelRequired !== " ") {
                        attrs.$set("required", true);
                    } else {
                        attrs.$set("required", false);
                    }
                    //CHECK REQUIRE
                    //SET TOOLTIPLE FOR INPUT
                    var ObjectError = {
                        "required": "Field is required!",
                        "mask": "Filed is invalid!"
                    };
                    var isError = false;
                    var keyErrorOut = "";
                    angular.forEach(scope.formValidate, function(valueError, keyErrorIn) {
                        if (valueError === true) {
                            isError = true;
                            keyErrorOut = keyErrorIn;
                        }
                    });

                    if (isError === true) {
                        //SET COLOR FOR INPUT
                        elem.css("border-color", "#F3565D");
                        //END SET

                        //CHECK EXIST TOOLTIP DELETE
                        if (elem.hasClass("tooltipstered")) {
                            angular.element(elem).tooltipster("destroy");
                        }
                        //END

                        //ADD TOOLTIP
                        angular.element(elem).tooltipster({
                            theme: "tooltip-error-theme",
                            contentAsHtml: true,
                            content: ObjectError[keyErrorOut]
                        });
                        //END
                    } else {
                        if (elem.hasClass("tooltipstered")) {
                            //REMOVE TOOLTIP
                            angular.element(elem).tooltipster("destroy");
                            angular.element(elem).removeAttr("title");
                            //END
                        }
                        //SET COLOR INPUT MORMAL
                        elem.css("border-color", "#ECECEC");
                        //END
                    }
                    //END SET
                    //END
                });
                //END   
            },
        };
    });
