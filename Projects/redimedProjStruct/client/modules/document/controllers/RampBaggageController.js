angular.module('app.loggedIn.document.QANTASrampbaggage.controllers',[])
	.controller("RampBaggageController",function($scope, $filter, DocumentService, ConfigService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService){
		$scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.patientInfo = localStorageService.get('tempPatient');
        $scope.info = angular.copy($scope.patientInfo);
        console.log($scope.patientInfo);
        $scope.info.DOB = moment($scope.info.DOB).format('YYYY-MM-DD');
        $scope.info.assessor_date_aprove = new Date();
        $scope.info.assessor_date_aprove = moment($scope.info.assessor_date_aprove).format('YYYY-MM-DD');
         $scope.rates = [
          {id:0, name:'Excellent'},
          {id:1, name:'Very Good'},
          {id:2, name:'Good'},
          {id:3, name:'Average'},
          {id:4, name:'Poor'}
        ];
	});