angular.module('app.loggedIn.sysservices.detail.directive', [])

.directive('sysservicesDetail', function ($cookieStore ,SysServicesModel, ConfigService, SysServicesService, toastr) {
    return {
        restrict: 'EA',
        scope: {
            options: '=',
            params: '=',
            isAction: "="
        },
        templateUrl: 'modules/sysservices/directives/templates/detail.html',
        link: function (scope, element, attrs) {
            scope.$watch("params.permission", function () {
                if (scope.params.permission.edit === true) {
                    console.log('changed');
                    init();
                }

            });
            var init = function () {
                    scope.isSubmit = false;
                    if (scope.params.permission.edit === true) {
                        SysServicesService.byId(scope.params.id).then(function (response) {
                            if (response.status == 'error') toastr.error('Error Get Detail', 'Error')
                            angular.extend(scope.SysServicesMap, response.data);
                            for (var key in scope.SysServicesMap) {
                                if (scope.SysServicesMap[key]) {
                                    if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
                                        scope.SysServicesMap[key] = scope.SysServicesMap[key].toString();
                                    if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)
                                        scope.SysServicesMap[key] = new Date(scope.SysServicesMap[key]);
                                }
                            } //end for
                        })
                    }
                    scope.SysServicesMap = angular.copy(SysServicesModel);
                } //end init
            init();

            scope.cancelUpdate = function () {
                //                alert('cancel');
                scope.SysServicesMap = {};
                scope.params.permission.edit = false;
                scope.params.permission.create = true;
            }

            scope.clickAction = function () {
                scope.isSubmit = true;
                if (!scope.sysservicesForm.$invalid) {
                    var uID = ($cookieStore.get('userInfo')).id;
                    var postData = angular.copy(scope.SysServicesMap);
                    for (var key in postData) {
                        if (postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
                    } //end for
                    if (scope.params.permission.edit === true) {
                        postData.Last_updated_by = uID;
                        console.log(postData);
                        SysServicesService.edit(scope.params.id, postData).then(function (response) {
                            if (response.status == 'error') toastr.error('Error Get Detail', 'Error')
                            else {
                                toastr.success('Edit Successfully !!!', 'Success');
                                scope.isAction = 'edit';
                                scope.SysServicesMap = {};
                                scope.params.permission.edit = false;
                                scope.params.permission.create = true;
                                init();
                            }

                        })
                    } else {
                        postData.Created_by = uID;
                        SysServicesService.add(postData).then(function (data) {
                            if (data.status == 'error') toastr.error('Cannot Insert', 'Error')
                            else {
                                toastr.success('Insert Successfully !!!', 'Success');
                                scope.isAction = 'add';
                                init();
                            }

                        })
                        init();
                    }
                } //end if invalid
                else toastr.error('You got some fields left', 'Error')
            } //end clickAction
        } //end link
    } //end return
})