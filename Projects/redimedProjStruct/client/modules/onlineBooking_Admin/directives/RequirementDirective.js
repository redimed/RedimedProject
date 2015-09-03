angular.module('app.loggedIn.booking.admin.requirement.directive', [])
.directive('requirementList', function(OnlineBookingAdminService, $filter, $modal, $state, $stateParams, toastr) {

    return{

        restrict: 'EA',
        templateUrl: 'modules/onlineBooking_Admin/directives/templates/requirements.html',
        scope: {
            options: '=',
            success: '='
        },
        link: function(scope, ele, attrs){

            // information
            var search = {
                limit: 5,
                offset: 0,
                max_size: 5,
                page: 1,
                company_id: $stateParams.fatherId
            }

            // Load data
            var load = function() {

                OnlineBookingAdminService.getAlert(search)
                .then(function(response) {
                    scope.req.list = angular.copy(response.data);
                    scope.req.count = response.count;
                }, function(error){})

            }
            // paging
            scope.setPage = function (page) {
                scope.req.search.offset = (page-1)*scope.req.search.limit;
                scope.req.load();
            }

            // Dialog create
            var add = function() {

                var modalInstance = $modal.open({
                    templateUrl: 'ReAlertAdd_R',
                    controller: function($scope, alert_id, $modalInstance){
                        $scope.alerts = {
                            success: false,
                            alert_id: alert_id
                        };

                        $scope.$watch('alerts.success', function(success){
                            if(success){
                                $modalInstance.close('success');
                            }
                        })
                    },
                    resolve: {
                        alert_id: function(){
                            return $stateParams.fatherId;
                        }
                    }
                })
                .result.then(function(response) {
                    scope.req.load();
                    scope.success="success";
                })
            }

            // Enable Disable
            var disable = function(d) {

                OnlineBookingAdminService.getDisable(d)
                .then(function(response){
                    scope.req.load();
                }, function(error) {})

            }

            // Dialog edit
            var edit = function(g) {

                var modalInstance = $modal.open({

                    templateUrl: 'ReAlertEdit_R',
                    controller: function($scope, alert_id, $modalInstance) {
                        $scope.alertedit = {
                            success: false,
                            alert_id: alert_id
                        };
                        $scope.$watch('alertedit.success', function(success) {
                            if(success){
                                $modalInstance.close('success');
                            }
                        })
                    },
                    resolve: {
                        alert_id: function() {
                            return g.id;
                        }
                    }

                })
                .result.then(function(response){
                    scope.req.load();
                })

            }

            scope.req = {
                search: search,
                list: {
                    id: 0,
                    name: '',
                    description: '',
                    company_id: 0
                },
                loading: false,
                error: [],
                count: 0,
                load: function(){ load(); },
                add: function(){ add(); },
                edit: function(g){ edit(g); },
                disable: function(d) { disable(d); }
            }

            scope.req.load();
        }//end link

    }// end return

})