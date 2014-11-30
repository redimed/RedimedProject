/**
 * Created by Phan Quoc Chien on 07/11/2014.
 */

angular.module('app.loggedIn.rlob.adminDocumentStatusSummary.controller',[])
    .controller("rlob_admin_documentStatusSummaryController", function($scope,$http,$cookieStore,$q,$state,rlobService) {

        $scope.listDaysOfWeek={};
        $scope.listHoursInDay={};
        $scope.listDays={};



        var dateStartWeek=rlobDate.getDateStartWeek(new Date());
        var dateEndWeek=rlobDate.getDateEndWeek(new Date());

        $scope.nextWeek=function(){
            $scope.listDaysOfWeek={};
            $scope.listHoursInDay={};
            $scope.listDays={};
            dateStartWeek=dateStartWeek.add(7,'days');
            dateEndWeek=dateEndWeek.add(7,'days');
            $scope.getDocumentStatusSummaryInWeek(dateStartWeek,dateEndWeek);

        }

        $scope.previousWeek=function(){
            $scope.listDaysOfWeek={};
            $scope.listHoursInDay={};
            $scope.listDays={};
            dateStartWeek=dateStartWeek.subtract(7,'days');
            dateEndWeek=dateEndWeek.subtract(7,'days');
            $scope.getDocumentStatusSummaryInWeek(dateStartWeek,dateEndWeek);
        }


        /***
         * Get document Status in week
         * tannv.dts@gmail.com
         */
        $scope.getDocumentStatusSummaryInWeek=function(dateStart,dateEnd)
        {
            rlobService.getDocumentStatusSummary(dateStart.format("YYYY/MM/DD"),dateEnd.format("YYYY/MM/DD")).then(function(data){

                if(data.status=='success')
                {
                    for(var i=0;i<data.data.length;i++)
                    {
                        //get list days of weeks
                        var item=data.data[i];
                        var appointmentDate=new Date (data.data[i].APPOINTMENT_DATE);
                        var dayValue=appointmentDate.getDay();
                        if(!$scope.listDaysOfWeek[ rlobDate.daysOfWeek[dayValue].value ])
                        {
                            $scope.listDaysOfWeek[ rlobDate.daysOfWeek[dayValue].value ]=rlobDate.daysOfWeek[dayValue];
                        }
                        //get list hours of day
                        if(!$scope.listHoursInDay[moment(appointmentDate).format("HH:mm")])
                        {
                            $scope.listHoursInDay[moment(appointmentDate).format("HH:mm")]={};
                        }
                    }



                    for(var i=0;i<data.data.length;i++)
                    {
                        var item=data.data[i];
                        var appointmentDate=new Date (data.data[i].APPOINTMENT_DATE);
                        var dayValue=appointmentDate.getDay();

                        if(!$scope.listDays[ rlobDate.daysOfWeek[dayValue].value])
                        {
                            $scope.listDays[ rlobDate.daysOfWeek[dayValue].value]={
                                DISPLAY:rlobDate.daysOfWeek[dayValue].display,
                                LIST:angular.copy($scope.listHoursInDay)};
                        }

                        if(!$scope.listDays[ rlobDate.daysOfWeek[dayValue].value].LIST[moment(appointmentDate).format("HH:mm")])
                        {
                            $scope.listDays[ rlobDate.daysOfWeek[dayValue].value].LIST[moment(appointmentDate).format("HH:mm")]={};
                        }

                        var styleClass='';
                        switch(item.DOCUMENT_STATUS)
                        {
                            case rlobConstant.documentStatus.notConfirmed:
                                styleClass=rlobConstant.documentStatusSummaryStyleClass.notConfirmed;
                                break;
                            case rlobConstant.documentStatus.checked:
                                styleClass=rlobConstant.documentStatusSummaryStyleClass.checked;
                                break;
                            case rlobConstant.documentStatus.noDocuments:
                                styleClass=rlobConstant.documentStatusSummaryStyleClass.noDocuments;
                                break;
                        }
                        if(!$scope.listDays[ rlobDate.daysOfWeek[dayValue].value].LIST[moment(appointmentDate).format("HH:mm")][item.BOOKING_ID])
                        {
                            $scope.listDays[ rlobDate.daysOfWeek[dayValue].value].LIST[moment(appointmentDate).format("HH:mm")][item.BOOKING_ID]
                                ={
                                BOOKING_ID:item.BOOKING_ID,
                                WRK_SURNAME:item.WRK_SURNAME,
                                DOCUMENT_STATUS:item.DOCUMENT_STATUS,
                                STYLE_CLASS:styleClass
                            }
                        }
                    }
                }
            })
        }
        $scope.getDocumentStatusSummaryInWeek(dateStartWeek,dateEndWeek);


    });
