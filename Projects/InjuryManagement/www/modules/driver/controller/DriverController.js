angular.module('starter.driver.controller',[])

    .controller('DriverController', function ($scope, $state, DriverServices){


        $scope.worker = {
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Address1: '',
            DOB: '',
            Sex: '',
            Mobile: '',
            Email: '',
            injury_description: '',
            injury_date: '',
            description:''
        };

        //INIT WHEN HAVE PATIENT NOTIFICATION
        function init() {

        }
    })