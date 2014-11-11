angular.module('starter.Worker.add.controller',[])

    .controller('WorkerAddController', function($scope, $state, $ionicSlideBoxDelegate, $templateCache) {

        $scope.startApp = function() {
            $state.go('');
        };
        $scope.next = function() {
            $templateCache.get('contact.html')
        };
        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };


        $scope.patientObj = {
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Known_as: '',
            Address1: '',
            Address2: '',
            Post_code: '',
            Country: 'Australia',
            DOB: '',
            Sex: '',
            Home_phone: '',
            Work_phone: '',
            Mobile: '',
            No_SMS: 1,
            Account_type: '',
            Account_holder: '',
            Account_Seft: '',
            Medicare_no: '',
            Ref: '',
            Exp_medicare: '',
            Private_fund_id: '',
            MemberShip_no: '',
            UPI: '',
            HCC_Pension_No: '',
            Exp_pension: '',
            DVA_No: '',
            Balance: '',
            Pays_Gap_Only: 1,
            Email: '',
            Suburb: '',
            Alias_First_name: '',
            Alias_Sur_name: '',
            Phone_ext: ''
        }

        //
        //var reset = function () {
        //    $scope.patient = angular.copy($scope.patientObj);
        //    $scope.isSubmit = false;
        //}
        //
        //$scope.reset = reset;

        //show popup alert
        //var alertPopup = $ionicPopup.alert({
        //    title: 'Dont eat that!',
        //    template: 'It might taste good'
        //});
        //alertPopup.then(function(res) {
        //    console.log('Thank you for not eating my delicious ice cream cone');
        //});
    })