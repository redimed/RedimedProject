angular.module("app.loggedIn.im.list.controller",[])
    .controller("InjuryListController",function($scope,$filter,$state,InjuryManagementService,UserService,toastr,socket,$stateParams,$cookieStore){
    	$scope.patient_id = $stateParams.patient_id;
    	$scope.search = {
            driver: "",
            dateRange: null
        }

        var from = $cookieStore.get('fromState');
        var params = {};

        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }

        $scope.goBack = function(){
        	 $state.go(from.fromState.name,params,{location: "replace", reload: true});
        }

        $scope.refreshList = function(){
            refreshList();
        }

        $scope.showDetails = function(id){
            $state.go('loggedIn.im.detail',{id:id});
        }

         $scope.searchInjury = function(s){
            $scope.injuryList = $filter('filter')($scope.injuryListTemp, {
                driverUser: s.driver
            });
        }

        $scope.getDateRange = function(range){
            filterDate($filter('date')(range.start.toDate(),'yyyy-MM-dd'), $filter('date')(range.end.toDate(),'yyyy-MM-dd'));
            $scope.search.patient = "";
            $scope.search.driver = "";
        };

         InjuryManagementService.getInjuryListByPatient($scope.patient_id).then(function(rs){
            if(rs.status == 'success'){
                for(var j=0;j<rs.data.length;j++){
                    if(rs.data[j].driverUser == null || typeof rs.data[j].driverUser === 'undefined')
                        rs.data[j].driverUser = '';
                }
                $scope.injuryListTemp = rs.data;

                $scope.injuryList = $scope.injuryListTemp;

            }
        })

         function refreshList(){
            $scope.search.driver = "";
            $scope.search.dateRange = null;

            $scope.injuryList = [];
            $scope.injuryListTemp = [];
            InjuryManagementService.getInjuryListByPatient($scope.patient_id).then(function(rs) {
                if (rs.status == 'success') {
                    for(var j=0;j<rs.data.length;j++){
                        if(rs.data[j].driverUser == null || typeof rs.data[j].driverUser === 'undefined')
                            rs.data[j].driverUser = '';
                    }
                    $scope.injuryListTemp = rs.data;

                    $scope.injuryList = $scope.injuryListTemp;
                }
            })
        }

        function filterDate(from,to){
            $scope.injuryList = [];
            $scope.injuryListTemp = [];
            InjuryManagementService.searchByDatePatient(from,to,$scope.patient_id).then(function(rs){
                if(rs.status == 'success'){
                    for(var j=0;j<rs.data.length;j++){
                        if(rs.data[j].driverUser == null || typeof rs.data[j].driverUser === 'undefined')
                            rs.data[j].driverUser = '';
                    }
                    $scope.injuryListTemp = rs.data;
                    $scope.injuryList = $scope.injuryListTemp;

                }
            })
        }
    })