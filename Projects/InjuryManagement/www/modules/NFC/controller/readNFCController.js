angular.module('starter.NFC.controller',[])
.controller('readNFCController',function($scope,WorkerServices){
        $scope.receiveData='';
        $scope.info=[];
        $scope.getData = function(data){

            $scope.receiveData=JSON.parse(data);

            if($scope.receiveData.Patient_id != null){
                WorkerServices.getInfoPatientbyID($scope.receiveData.Patient_id).then(function(data){
                    $scope.info = data;
                })
            }
            $scope.$apply(function(){
                $scope.$watch('info',function(info){
                    $scope.testData = $scope.info;
                })

            })
        };
        app.initialize($scope.getData);

        $scope.updateWorker = function(data){

            var NewInfo = {
                Patient_id:data.data.Patient_id,
                Title:data.data.Title,
                First_name:data.data.First_name,
                Sur_name:data.data.Sur_name,
                Middle_name:data.data.Middle_name,
                Known_as:data.data.Known_as,
                Address1:data.data.Address1,
                Address2:data.data.Address2,
                Suburb:data.data.Suburb,
                State:data.data.State,
                Country:data.data.Country,
                DOB:data.data.DOB,
                Sex:data.data.Sex,
                Email:data.data.Email,
                Mobile:data.data.Mobile,
                Home_phone:data.data.Home_phone,
                Work_phone:data.data.Work_phone,
                Post_code:data.data.Post_code,
                Account_type:data.data.Account_type,
                Account_holder:data.data.Account_holder,
                Medicare_no:data.data.Medicare_no,
                Exp_medicare:data.data.Exp_medicare,
                MemberShip_no:data.data.MemberShip_no,
                DVA_No:data.data.DVA_No,
                HCC_Pension_No:data.data.HCC_Pension_No,
                Exp_pension:data.data.Exp_pension,
                Private_fund_id:data.data.Private_fund_id,
                UPI:data.data.UPI,
                Occupation:data.data.Occupation,
                Partner_name:data.data.Partner_name,
                Partner_DOB:data.data.Partner_DOB,
                Partner_Occupation:data.data.Partner_Occupation,
                Alias_First_name:data.data.Alias_First_name,
                Alias_Sur_name:data.data.Alias_Sur_name,
                UR_no:data.data.UR_no,
                Custom:data.data.Custom

            };
            WorkerServices.updateInfoPatientID(NewInfo).then(function(data){
               if(data.status =="success"){
                   alert("Update Success");
               }else{
                   alert("Update Fail");
               }
            })

        }




    })
