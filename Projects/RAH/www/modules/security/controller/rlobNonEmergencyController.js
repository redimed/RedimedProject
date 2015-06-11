angular.module('starter.security.rlobNonEmergency.controller',[])

.controller('rlobNonEmergencyController',function($scope, $state, SecurityService,$ionicLoading,$ionicPopup,$filter,$cordovaDatePicker,$ionicModal,$ionicPopup,$timeout,$filter, $cordovaDatePicker,$cordovaKeyboard,$cordovaAppVersion){
    $scope.currentDate = new Date();
		$scope.non= {};
		$scope.next = function(FormNonEmergency){
			if(!FormNonEmergency.$invalid){
                 $scope.non.DOB = $filter('date')( Date.parse($scope.non.month +'/'+  $scope.non.date +'/'+ $scope.non.year), 'dd/MM/yyyy');
                 $state.go('security.rlobNonEmergency.rlobBookingDetail');
            }else{
                if(FormNonEmergency.$error.required){
                      var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Please Check ' + FormNonEmergency.$error.required[0].$name 
                    });
                }
            }
	   }
		$scope.selectedFilter={
            locationSelected:{},
            rltypeSelected:{},
            clnSpecialitySelected:{},
            doctorSelected:{},
            date:''
        };
        $scope.selectedFilter.date=new Date();
        $scope.$watch("selectedFilter.date", function(newDate, oldDate){
            $scope.updateAppoinmentsList();
        })
        $scope.getLocationsFilter=function()
        {
            SecurityService.getLocationsFilter().then(function(data){
                $scope.locationsFilter=data;
                 console.log( $scope.locationsFilter)
            },function(data){
                console.log(data);
            })
        }
        $scope.getLocationsFilter();
        $scope.getSpecialitiesFilter=function()
        {
            SecurityService.getRlSpecialtiesFilter().then(function(data){
                if(data.status=='success')
                    $scope.specialitiesFilter=data.data;
            },function(err){
                console.log('error');
            })
        }
        $scope.getSpecialitiesFilter();
        $scope.doctorsFilter = [];
        $scope.getDoctorsFilter=function()
        {
            SecurityService.getDoctorsFilter().then(function(data){
                if(data.status=='success')

                    $scope.doctorsFilter=data.data;
                    console.log($scope.doctorsFilter)
            },function(err){
                console.log('error');
            })
        };
        $scope.getDoctorsFilter();
        //Show LIst
        $scope.updateAppoinmentsList=function()
        {
            var specialityId=$scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_id?$scope.selectedFilter.clnSpecialitySelected.Specialties_id:'%';
            var doctorId=$scope.selectedFilter.doctorSelected  && $scope.selectedFilter.doctorSelected.doctor_id?$scope.selectedFilter.doctorSelected.doctor_id:'%';
            var locationId=$scope.selectedFilter.locationSelected  && $scope.selectedFilter.locationSelected.id?$scope.selectedFilter.locationSelected.id:'%';
              console.log(locationId);
            var fromTime=$filter('date')($scope.selectedFilter.date, "yyyy-MM-dd");
            SecurityService.getApointmentCalendar(specialityId,doctorId,locationId,fromTime).then(function(data){
                var temp={LOCATION_ITEMS:[]};
                for(var i=0;i<data.length;i++)
                {
                    if(!temp[data[i].SITE_ID])
                    {
                        temp[data[i].SITE_ID]={DOCTOR_ITEMS:[]};
                        temp.LOCATION_ITEMS.push({
                            SITE_ID: data[i].SITE_ID,
                            SITE_NAME:data[i].Site_name
                        });

                    }
                    if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID])
                    {
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID]={APPOINTMENT_ITEMS:[]};
                        temp[data[i].SITE_ID].DOCTOR_ITEMS.push({
                            DOCTOR_ID:data[i].DOCTOR_ID,
                            DOCTOR_NAME:data[i].NAME
                        });
                    }
                    if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].CAL_ID])
                    {
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].CAL_ID]={};
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID].APPOINTMENT_ITEMS.push({
                            CAL_ID:data[i].CAL_ID,
                            APPOINTMENT_TIME:data[i].appointment_time,
                            FROM_TIME:data[i].FROM_TIME,
                            DOCTOR_ID:data[i].DOCTOR_ID,
                            SITE_ID:data[i].SITE_ID
                        });
                    }
                }
                var arr=[];
                for (var i=0;i<temp.LOCATION_ITEMS.length;i++)
                {
                    var location_item=temp.LOCATION_ITEMS[i];
                    location_item.DOCTOR_ITEMS=[];
                    for(var j=0;j<temp[location_item.SITE_ID].DOCTOR_ITEMS.length;j++)
                    {
                        var doctor_item=temp[location_item.SITE_ID].DOCTOR_ITEMS[j];
                        doctor_item.APPOINTMENT_ITEMS=[];
                        location_item.DOCTOR_ITEMS.push(doctor_item);
                        for(var l=0;l<temp[location_item.SITE_ID][doctor_item.DOCTOR_ID].APPOINTMENT_ITEMS.length;l++)
                        {
                            var appointment_item=temp[location_item.SITE_ID][doctor_item.DOCTOR_ID].APPOINTMENT_ITEMS[l];
                            doctor_item.APPOINTMENT_ITEMS.push(appointment_item);
                        }
                    }
                    arr.push(location_item);
                }
                $scope.appointmentsFilter=arr;
               
                // $scope.doctorsFilter = $scope.appointmentsFilter[0].DOCTOR_ITEMS;

            },function(data){
                console.log("error");
            })
        };
        $scope.selectAppointmentCalendar = function(appointment,DOCTOR_NAME,SITE_NAME){
        		$scope.non.DOCTOR =DOCTOR_NAME;
        		$scope.non.DATE = appointment.FROM_TIME;
        		$scope.non.LOCATION = SITE_NAME;
        		$scope.non.TIME = appointment.APPOINTMENT_TIME;
        		$scope.non.CAL_ID = appointment.CAL_ID;
        		$state.go('security.rlobNonEmergency.NEInfo');
        }
        $scope.booking = function(){
            
        	$scope.non.TYPE_NAME = 'NONEMERGENCY';
            console.log($scope.non)
        	SecurityService.insertNonEmergency($scope.non).then(function(result){
        		if('success'==result.status){

                     $state.go("security.rlobNonEmergency.rlobNonEmergencySuccess");
        		}
        	})
        }

      
    
      $scope.chooseBookingType = function(type){
            if(type == "GP" || type == "Physio" || type == "HandTherapy"){
              $scope.non.BookingType =type;
              $state.go('security.rlobNonEmergency.rlobBooking');
            }else{
                $scope.showPopup()
            }
      };

      $scope.specialist = [
        {
            text: "Plastic", value: "Plastic" 
        },
        {
            text: "Ortho", value: "Ortho" 
        },
        {
             text: "Hand", value: "Hand" 
        }
      ];

      $scope.showPopup = function() {
          $scope.data = {}

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<ion-radio ng-repeat="item in specialist" ng-value="item.value" ng-model="data.wifi">{{ item.text }}</ion-radio>',
            title: 'Specialist',
            subTitle: 'Please Choose Specialist Type',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Select</b>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!$scope.data.wifi) {
                    e.preventDefault();
                  } else {
                    return $scope.data.wifi;
                  }
                }
              }
            ]
          });
          myPopup.then(function(res) {

            if( typeof res !== "undefined"){
                  $scope.non.BookingType = res;
                    $state.go('security.rlobNonEmergency.rlobBooking');
            }else{
                console.log("undefined")
            }
          });
    };

     $scope.checkdate= function(type){
        if(type == "date"){
            if($scope.non.date > 31){
                $scope.non.date = "";
            }
        }
        if(type=='month'){
            if($scope.non.month > 12){
                $scope.non.month = "";
            }
        }
        if(type=='year'){
            if($scope.non.year > 2000){
                $scope.non.year = "";
            }
        }
        
    }
    $scope.getDatePicker = function(){
         $cordovaKeyboard.close()
            var options = {
        date: new Date(),
        mode: 'date', // or 'time'
        // minDate: new Date() - 10000,
        allowOldDates: true,
        allowFutureDates: false,
        doneButtonLabel: 'DONE',
        doneButtonColor: '#F2F3F4',
        cancelButtonLabel: 'CANCEL',
        cancelButtonColor: '#000000'
      };

      document.addEventListener("deviceready", function () {
                     if(device.version <= '4.3'){
                         $cordovaDatePicker.show(options).then(function(date){
                                $scope.selectedFilter.date = new Date(date);
                            });
                     }
      }, false);
    }
    $scope.backtohome = function(){
        $scope.non = "";
        $state.go("security.login")
    }

})


