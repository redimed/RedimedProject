/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.rlob.booking.controller',[])
    .controller("rlob_bookingController", function($window,$scope,$http,$state,$modal,appointmentCalendarService,$cookieStore,rlobService) {
//    UIDatepaginator.init();
//    Metronic.init();

        $scope.selectedAppointmentCalendarStorage=appointmentCalendarService.getSelectedAppointmentCalendar();
        //Xoa toan bo thong tin cu
        angular.copy({},$scope.selectedAppointmentCalendarStorage);

        $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){
            if($scope.selectedAppointmentCalendar && $scope.selectedAppointmentCalendar.CAL_ID)
            {
                angular.copy($scope.selectedAppointmentCalendar,$scope.selectedAppointmentCalendarStorage);
                if($scope.bookingType==rlobConstant.bookingType.REDiLEGAL.name)
                    $state.go("loggedIn.rlob.rlob_patient_detail");
                else if($scope.bookingType=rlobConstant.bookingType.Vaccination.name)
                    $state.go("loggedIn.vaccinob.vaccinob_patient_detail");
            }

        });


        var periodRequire=45;
        rlobService.core.getListAppointmentAfterTime(19,1,new Date (2015,3,10,9,0))
        .then(function(data){
            if(data.status=='success')
            {
                var selectedItem=data.data[0];
                var selectedItemPeriodTime=moment(new Date(selectedItem.TO_TIME)).diff(moment(new Date(selectedItem.FROM_TIME)),'minutes');
                var periodLack=periodRequire-selectedItemPeriodTime;

                if(periodLack>0)
                {
                    var listY=[];
                    listY.push(selectedItem);
                    var previousToTime=moment(new Date(selectedItem.TO_TIME));
                    for(var i=1;i<data.data.length;i++)
                    {
                        var item=data.data[i];
                        var fromTime=moment(new Date(item.FROM_TIME));
                        if(fromTime.diff(previousToTime,'minutes')==0)
                        {
                            listY.push(item);
                            previousToTime=moment(new Date(item.TO_TIME));
                        }
                        else
                        {
                            break;
                        }
                    }

                    var listChanged=[];
                    //xu ly slot dau tien
                    listY[0].TO_TIME=moment(new Date(listY[0].TO_TIME)).add(periodLack,"minutes").toDate();
                    listChanged.push(listY[0]);
                    for(var i=1;i<listY.length-1;i++)
                    {
                        var item=listY[i];
                        var periodTime=moment(new Date(item.TO_TIME)).diff(moment(new Date(item.FROM_TIME)),'minutes');
                        if(periodTime>=periodRequire)
                        {
                            alert("1")
                            item.FROM_TIME=moment(new Date(item.FROM_TIME)).add(periodLack,"minutes").toDate();
                            listChanged.push(item);
                            break;
                        }
                        else
                        {
                            alert("2")
                            item.FROM_TIME=moment(new Date(item.FROM_TIME)).add(periodLack,"minutes").toDate();
                            item.TO_TIME=moment(new Date(item.TO_TIME)).add(periodLack,"minutes").toDate();
                            listChanged.push(item);
                        }
                    }

                    for(var i=0;i<listChanged.length;i++)
                    {
                        console.log(moment(new Date(listChanged[i].FROM_TIME)).format("HH:mm DD/MM/YYYY")+
                            " "+moment(new Date(listChanged[i].TO_TIME)).format("HH:mm DD/MM/YYYY"));
                    }
                }
                else
                {
                    exlog.alert("Hop le roi");
                }
            }
            else
            {

            }
        },function(err){

        });


    })






