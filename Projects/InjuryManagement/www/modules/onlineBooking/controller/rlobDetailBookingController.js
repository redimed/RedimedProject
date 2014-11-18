angular.module('starter.booking.rlobDetailBooking.controller',[

])
    .controller('rlobDetailBookingController',function($scope,$stateParams,$timeout,localStorageService,OnlineBookingService,$state){

        $timeout(function(){
            $scope.selectedBooking=localStorageService.get("selectedBooking");
        }, 500);

        console.log( $scope.selectedBooking)

        $scope.addbooking = function(des){
            console.log( $scope.selectedBooking)
            var infoBooking = {
                patient_id:1,
                doctor_id:$scope.selectedBooking.DOCTOR_ID,
                cal_id:$scope.selectedBooking.CAL_ID,
                injury_description:des,
                STATUS:null,
                driver_id :null,
                injury_date:null

            }
            OnlineBookingService.submitBooking(infoBooking).then(function(data){
                console.log(data.status);
                if(data.status == 'success'){
                    alert('Add Booking Success','Success');

                    $state.go('app.browse');
                }
                else{
                    alert('Error');
                }
            })


        }
    })