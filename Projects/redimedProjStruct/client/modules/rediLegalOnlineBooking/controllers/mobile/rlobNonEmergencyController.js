angular.module("app.sponsor1.nonemergency.controller",[])
.controller('rlobNonEmergencyController',function($scope,rlobService,$window,toastr){

    $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;

    $scope.scrollTo= function(el, offeset)
    {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;

        if (el) {
            if ($('body').hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        },0);
    };
    
    $scope.showCalendar = function(){
            angular.element('#form-data').css('display','none');
            angular.element('#caledar-data').css('display','block');
            $scope.scrollTo($(".logo"));
    }
    $scope.showFormData = function(){
            angular.element('#form-data').css('display','block');
            angular.element('#caledar-data').css('display','none');
            $scope.scrollTo($(".logo"));
    }
    $scope.insertNonEmergency = function(){
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.FormNonemergency.$valid) {
            $scope.info = {
                FIRSTNAME:$scope.fristname,
                LASTNAME:$scope.lastname,
                GENDER:$scope.gender,
                DOB:moment($scope.dob).format('YYYY/MM/DD'),
                // ADD:$scope.address,
                CONTACT_NO:$scope.contactus,
                MEDICARE_NO:$scope.medicareno,
                MEDICARE_REF:$scope.medicareref,
                TYPE_NAME:rlobConstant.sponsorType.nonemergency,
                INJURY:$scope.injury,
                LONGITUDE:$scope.Lng,
                LATITUDE:$scope.Lat,
                CAL_ID:$scope.selectedAppointmentCalendar.CAL_ID
            }
            console.log($scope.info);
            rlobService.insertNonEmergency($scope.info).then(function(data){
                if (data.status == 'success') {
                    angular.element('#caledar-data').css('display','none');
                    angular.element('#data-success').css('display','block');
                    toastr.success("Booking Success!","Success");
                }else{
                    toastr.error("Booking Failed!","Error");
                };
            })
        }else{
            $scope.showFormData();
        }
    }
    $scope.setColorMedicareRef = function(){
        if ($scope.medicareref != null && $scope.medicareref != '') {
            $('#medicareref-confix').addClass('color-label');
        }else{
            $('#medicareref-confix').removeClass('color-label');
        }
    }
    $scope.setColorMedicareNo = function(){
        if ($scope.medicareno != null && $scope.medicareno != '') {
            $('#medicareno-confix').addClass('color-label');
        }else{
            $('#medicareno-confix').removeClass('color-label');
        }
    }
})