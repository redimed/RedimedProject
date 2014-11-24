angular.module("app.loggedin.receptionist.appointment.outside.controller",[])
    .controller("ReceptionistAppointmentOutsideController",function($scope, toastr, ConfigService, ReceptionistService){
        var init= function() {
            $scope.updateMode = false;
            if($scope.outdoc.doctor_id != null && $scope.outdoc.doctor_id != '' && $scope.outdoc.doctor_id != undefined){
                $scope.updateMode = true;
            }
            $scope.isSubmit = false;
            $scope.options = {
                title: ConfigService.title_option(),
                gender: ConfigService.sex_option()
            };
        };

        $scope.addOutDoc = function(){
            $scope.isSubmit = true;
            if($scope.outDocForm.$invalid){
                toastr.error("Your form is invalid!","Error");
            }
            else {
                ReceptionistService.insertOutdoc($scope.outdoc);
            }
        };

        $scope.getDataTest = function(){
            var testData = {
                outdoc_id:1
            };
            ReceptionistService.getOutDoc(testData).then(function(result){
                if(result.data[0]){
                    console.log(result);
                    $scope.outdoc = result.data[0];
                }
            });
        };

        $scope.updateOutDoc = function(){
            $scope.isSubmit = true;
            if($scope.outDocForm.$invalid){
                toastr.error("Your form is invalid!","Error");
            }
            else{
                ReceptionistService.updateOutDoc($scope.outdoc);
            }
        };

        init();

    });