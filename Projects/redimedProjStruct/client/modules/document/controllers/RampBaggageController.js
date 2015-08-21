angular.module('app.loggedIn.document.QANTASrampbaggage.controllers',[])
  .controller("RampBaggageController",function($scope, $filter, DocumentService, ConfigService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService){
    $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        CalID = $stateParams.cal_id; 
        Patient_ID = $stateParams.patient_id;
        var oriInfo,clearInfo;
        $scope.isSignatureShow = false;
         $scope.rates = [
          {id:0, name:'Excellent'},
          {id:1, name:'Very Good'},
          {id:2, name:'Good'},
          {id:3, name:'Average'},
          {id:4, name:'Poor'}
        ];
        $scope.isSignatureShow  = [
            {id:0,isShow:false},
            {id:1,isShow:false}
        ];
        function getAge(dateString) {
            var now = new Date();
            var birthDate = new Date(dateString);
            var age = now.getFullYear() - birthDate.getFullYear();
            var m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
        $scope.mathBPM = function(value){
          if($scope.info.group3_sec2_value2==null || $scope.info.group3_sec2_value2==''){
            $scope.info.check25 = null;
            $scope.info.group3_sec2_value2=null;
          }
          if(isNaN(value)==false){
            if(value==null||value.length==0||value<0){
              $scope.info.group3_sec2_rate =null;
            }
            else{
              if(value<71&&value>0){
                $scope.info.group3_sec2_rate ="Excellent";
              }
              else if(value>=71&&value<=102){
                $scope.info.group3_sec2_rate ="Good";
              }
              else if(value>=103&&value<=117){
                $scope.info.group3_sec2_rate ="Average";
              }
              else if(value>=118&&value<=147){
                $scope.info.group3_sec2_rate ="Below Average";
              }
              else{
                $scope.info.group3_sec2_rate ="Poor";
              }
            }
          }
        }

        $scope.showSignature = function(value){
            $scope.isSignatureShow[value].isShow = true;
        }
        $scope.okClick = function (value) {
            $scope.isSignatureShow[value].isShow = false;
        }

        $scope.cancelClick = function (value) {
            $scope.isSignatureShow[value].isShow = false;
        }

        $scope.clearClick = function (value) {
            if(value == 0){
               $scope.info.PATIENT_SIGN  = '';
            }
            else if(value == 1){
                $scope.info.PATIENT_SIGN1 = '';
            }
        }

        $scope.infoChanged = function() {
            return angular.equals(oriInfo, $scope.info);
        }

        $scope.resetForm = function() {
            $scope.info = angular.copy(oriInfo);
            $scope.QANTAS_rampbaggage.$setPristine();
        }

        $scope.clearForm = function() {
            swal({
              title: "Are you sure to clear?",
              text: "You will not be able to recover this information!",
              type: "warning",
              showCancelButton: true,
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Yes, clear it!",
              cancelButtonText: "No, cancel plx!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm) {
              if (isConfirm) {
                $scope.info = angular.copy(clearInfo);
                $scope.QANTAS_rampbaggage.$setPristine();
                swal("Clear!", "Clear Successfully.", "success");
              }
              else{
                swal("Cancelled", "Cancel Clear", "error");
              }
            });
        }

        $scope.infoClear = function() {
            return !angular.equals(clearInfo, $scope.info);
        }

        $scope.deleteForm = function(){
          swal({
            title: "Are you sure to delete?",
            text: "You will not be able to recover this information!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function(isConfirm) {
            if (isConfirm) {
              DocumentService.deleteQANTAS_RampBaggage(Patient_ID).then(function(response){
                if(response.status==="success"){
                  swal("Deleted!", "Delete Successfully.", "success");
                  $state.go('loggedIn.listall', null, {
                    'reload': true
                  });
                }
                else{
                  toastr.error("fail!!","FAIL");
                  $state.go('loggedIn.listall', null, {
                    'reload': true
                  });
                }
              });
            }
            else{
              swal("Cancelled", "Cancel Delete", "error");
            }
          });
        }

        $scope.insert = false;
        DocumentService.checkQANTAS_RampBaggage(Patient_ID).then(function(response){
            $scope.patientInfo = response['patientInfo'];
            $scope.patientInfo.Sex==0||$scope.patientInfo.Sex=="Male"?$scope.patientInfo.Sex=0:$scope.patientInfo.Sex=1;
            $scope.patientInfo.DOB = moment($scope.patientInfo.DOB).format('YYYY-MM-DD');
            if(response.status==="insert"){
              $scope.insert = true;
              $scope.isNew = true;
              $scope.info ={
                PATIENT_ID:Patient_ID,
                CAL_ID:CalID,
                check1:null,
                check2:null,
                check3:null,
                check4:null,
                check5:null,
                check6:null,
                check7:null,
                check8:null,
                check9:null,
                check10:null,
                check11:null,
                check12:null,
                check13:null,
                check14:null,
                check15:null,
                check16:null,
                check17:null,
                check18:null,
                check19:null,
                check20:null,
                check21:null,
                check22:null,
                check23:null,
                check24:null,
                check25:null,
                check26:null,
                check27:null,
                check28:null,
                check29:null,
                check30:null,
                check31:null,
                check32:null,
                check33:null,
                check34:null,
                check35:null,
                check36:null,
                check37:null,
                check38:null,
                check39:null,
                check40:null,
                check41:null,
                check42:null,
                check43:null,
                check44:null,
                check45:null,
                check46:null,
                check47:null,
                check48:null,
                check49:null,
                check50:null,
                group3_sec1_comment1:null,
                group3_sec1_comment2:null,
                group3_sec1_value1:null,
                group3_sec1_value2:null,
                group3_sec2_comment1:null,
                group3_sec2_comment2:null,
                group3_sec2_comment3:null,
                group3_sec2_comment4:null,
                group3_sec2_comment5:null,
                group3_sec2_comment6:null,
                group3_sec2_rate:null,
                group3_sec2_value1:null,
                group3_sec2_value2:null,
                group3_sec3_checkL_1:null,
                group3_sec3_checkL_2:null,
                group3_sec3_checkL_3:null,
                group3_sec3_checkL_4:null,
                group3_sec3_checkL_5:null,
                group3_sec3_checkL_6:null,
                group3_sec3_checkL_7:null,
                group3_sec3_checkL_8:null,
                group3_sec3_checkL_9:null,
                group3_sec3_checkL_10:null,
                group3_sec3_checkL_11:null,
                group3_sec3_checkL_12:null,
                group3_sec3_checkR_1:null,
                group3_sec3_checkR_2:null,
                group3_sec3_checkR_3:null,
                group3_sec3_checkR_4:null,
                group3_sec3_checkR_5:null,
                group3_sec3_checkR_6:null,
                group3_sec3_checkR_7:null,
                group3_sec3_checkR_8:null,
                group3_sec3_checkR_9:null,
                group3_sec3_checkR_10:null,
                group3_sec3_checkR_11:null,
                group3_sec3_checkR_12:null,
                group3_sec3_comment1:null,
                group3_sec3_comment2:null,
                group3_sec3_comment3:null,
                group3_sec3_comment4:null,
                group3_sec3_comment5:null,
                group3_sec3_comment6:null,
                group3_sec3_comment7:null,
                group3_sec3_comment8:null,
                group3_sec3_comment9:null,
                group3_sec3_comment10:null,
                group3_sec3_comment11:null,
                group3_sec3_comment12:null,
                group3_sec4_comment1:null,
                group3_sec4_rate1:null,
                group3_sec4_rate2:null,
                group3_sec4_rate3:null,
                group3_sec4_rate4:null,
                group3_sec4_rate5:null,
                group3_sec4_rate6:null,
                group3_sec4_rate7:null,
                group3_sec4_rate8:null,
                group3_sec5_comment1:null,
                group3_sec5_comment2:null,
                group3_sec5_comment3:null,
                group3_sec5_comment4:null,
                group3_sec5_value1:null,
                group3_sec5_value2:null,
                group3_sec5_value3:null,
                group3_sec5_value4:null,
                group3_sec6_comment1:null,
                group4_checkbox1:null,
                group4_checkbox2:null,
                group4_checkbox3:null,
                group4_checkbox4:null,
                group4_comment1:null,
                group4_comment2:null,
                group4_comment3:null,
                group4_comment4:null,
                group4_comment5:null,
                dateChose:null,
                PATIENT_SIGN:null,
                PATIENT_SIGN1:null,
                assessor:null,
                age2:null
              };
              $scope.info.group3_sec2_value1 = parseInt((220 - getAge($scope.patientInfo.DOB))*0.85);
              oriInfo = angular.copy($scope.info);         
            }
            else if(response.status==="update"){
              $scope.insert = false;
              $scope.isNew = false;
              $scope.info = angular.copy(response['data']);
              $scope.dateChose = $scope.info.dateChose;
              oriInfo = angular.copy($scope.info);
            }
            else if(response.status==="error"){
              toastr.error("fail","FAIL");
            }
            if($scope.isNew==true){
              clearInfo = angular.copy($scope.info);
            }
            else{
              clearInfo ={
                PATIENT_ID:Patient_ID,
                CAL_ID:CalID,
                check1:null,
                check2:null,
                check3:null,
                check4:null,
                check5:null,
                check6:null,
                check7:null,
                check8:null,
                check9:null,
                check10:null,
                check11:null,
                check12:null,
                check13:null,
                check14:null,
                check15:null,
                check16:null,
                check17:null,
                check18:null,
                check19:null,
                check20:null,
                check21:null,
                check22:null,
                check23:null,
                check24:null,
                check25:null,
                check26:null,
                check27:null,
                check28:null,
                check29:null,
                check30:null,
                check31:null,
                check32:null,
                check33:null,
                check34:null,
                check35:null,
                check36:null,
                check37:null,
                check38:null,
                check39:null,
                check40:null,
                check41:null,
                check42:null,
                check43:null,
                check44:null,
                check45:null,
                check46:null,
                check47:null,
                check48:null,
                check49:null,
                check50:null,
                group3_sec1_comment1:null,
                group3_sec1_comment2:null,
                group3_sec1_value1:null,
                group3_sec1_value2:null,
                group3_sec2_comment1:null,
                group3_sec2_comment2:null,
                group3_sec2_comment3:null,
                group3_sec2_comment4:null,
                group3_sec2_comment5:null,
                group3_sec2_comment6:null,
                group3_sec2_rate:null,
                group3_sec2_value1:null,
                group3_sec2_value2:null,
                group3_sec3_checkL_1:null,
                group3_sec3_checkL_2:null,
                group3_sec3_checkL_3:null,
                group3_sec3_checkL_4:null,
                group3_sec3_checkL_5:null,
                group3_sec3_checkL_6:null,
                group3_sec3_checkL_7:null,
                group3_sec3_checkL_8:null,
                group3_sec3_checkL_9:null,
                group3_sec3_checkL_10:null,
                group3_sec3_checkL_11:null,
                group3_sec3_checkL_12:null,
                group3_sec3_checkR_1:null,
                group3_sec3_checkR_2:null,
                group3_sec3_checkR_3:null,
                group3_sec3_checkR_4:null,
                group3_sec3_checkR_5:null,
                group3_sec3_checkR_6:null,
                group3_sec3_checkR_7:null,
                group3_sec3_checkR_8:null,
                group3_sec3_checkR_9:null,
                group3_sec3_checkR_10:null,
                group3_sec3_checkR_11:null,
                group3_sec3_checkR_12:null,
                group3_sec3_comment1:null,
                group3_sec3_comment2:null,
                group3_sec3_comment3:null,
                group3_sec3_comment4:null,
                group3_sec3_comment5:null,
                group3_sec3_comment6:null,
                group3_sec3_comment7:null,
                group3_sec3_comment8:null,
                group3_sec3_comment9:null,
                group3_sec3_comment10:null,
                group3_sec3_comment11:null,
                group3_sec3_comment12:null,
                group3_sec4_comment1:null,
                group3_sec4_rate1:null,
                group3_sec4_rate2:null,
                group3_sec4_rate3:null,
                group3_sec4_rate4:null,
                group3_sec4_rate5:null,
                group3_sec4_rate6:null,
                group3_sec4_rate7:null,
                group3_sec4_rate8:null,
                group3_sec5_comment1:null,
                group3_sec5_comment2:null,
                group3_sec5_comment3:null,
                group3_sec5_comment4:null,
                group3_sec5_value1:null,
                group3_sec5_value2:null,
                group3_sec5_value3:null,
                group3_sec5_value4:null,
                group3_sec6_comment1:null,
                group4_checkbox1:null,
                group4_checkbox2:null,
                group4_checkbox3:null,
                group4_checkbox4:null,
                group4_comment1:null,
                group4_comment2:null,
                group4_comment3:null,
                group4_comment4:null,
                group4_comment5:null,
                dateChose:null,
                PATIENT_SIGN:null,
                PATIENT_SIGN1:null,
                assessor:null,
                age2:null
              };
              clearInfo.group3_sec2_value1 = parseInt((220 - getAge($scope.patientInfo.DOB))*0.85);
            }
        });
        
        $scope.clearcheck = function(id){
            if(id == 1){
                if($scope.info.group3_sec3_checkL_1=='0' && $scope.info.group3_sec3_checkR_1=='0'  ||
                   $scope.info.group3_sec3_checkR_1=='0' && $scope.info.group3_sec3_checkL_1==null ||
                   $scope.info.group3_sec3_checkL_1=='0' && $scope.info.group3_sec3_checkR_1==null){
                    $scope.info.group3_sec3_comment1 = null;
                    $scope.info.check26 = null;
                    if($scope.info.group3_sec3_checkL_1==0 || $scope.info.group3_sec3_checkR_1==0){
                        $scope.info.group3_sec3_checkL_1=null;
                        $scope.info.group3_sec3_checkR_1=null;
                    }
                }
            }
            else if(id == 2){
                if($scope.info.group3_sec3_checkL_2=='0' && $scope.info.group3_sec3_checkR_2=='0'  ||
                   $scope.info.group3_sec3_checkR_2=='0' && $scope.info.group3_sec3_checkL_2==null ||
                   $scope.info.group3_sec3_checkL_2=='0' && $scope.info.group3_sec3_checkR_2==null){
                    $scope.info.group3_sec3_comment2 = null;
                    $scope.info.check27 = null;
                    if($scope.info.group3_sec3_checkL_2==0 || $scope.info.group3_sec3_checkR_2==0){
                        $scope.info.group3_sec3_checkL_2=null;
                        $scope.info.group3_sec3_checkR_2=null;
                    }
                }
            }
            else if(id == 3){
                if($scope.info.group3_sec3_checkL_3=='0' && $scope.info.group3_sec3_checkR_3=='0'  ||
                   $scope.info.group3_sec3_checkR_3=='0' && $scope.info.group3_sec3_checkL_3==null ||
                   $scope.info.group3_sec3_checkL_3=='0' && $scope.info.group3_sec3_checkR_3==null){
                    $scope.info.group3_sec3_comment3 = null;
                    $scope.info.check28 = null;
                    if($scope.info.group3_sec3_checkL_3==0 || $scope.info.group3_sec3_checkR_3==0){
                        $scope.info.group3_sec3_checkL_3=null;
                        $scope.info.group3_sec3_checkR_3=null;
                    }
                }
            }
            else if(id == 4){
                if($scope.info.group3_sec3_checkL_4=='0' && $scope.info.group3_sec3_checkR_4=='0'  ||
                   $scope.info.group3_sec3_checkR_4=='0' && $scope.info.group3_sec3_checkL_4==null ||
                   $scope.info.group3_sec3_checkL_4=='0' && $scope.info.group3_sec3_checkR_4==null){
                    $scope.info.group3_sec3_comment4 = null;
                    $scope.info.check29 = null;
                    if($scope.info.group3_sec3_checkL_4==0 || $scope.info.group3_sec3_checkR_4==0){
                        $scope.info.group3_sec3_checkL_4=null;
                        $scope.info.group3_sec3_checkR_4=null;
                    }
                }
            }
            else if(id == 5){
                if($scope.info.group3_sec3_checkL_5=='0' && $scope.info.group3_sec3_checkR_5=='0'  ||
                   $scope.info.group3_sec3_checkR_5=='0' && $scope.info.group3_sec3_checkL_5==null ||
                   $scope.info.group3_sec3_checkL_5=='0' && $scope.info.group3_sec3_checkR_5==null){
                    $scope.info.group3_sec3_comment5 = null;
                    $scope.info.check30 = null;
                    if($scope.info.group3_sec3_checkL_5==0 || $scope.info.group3_sec3_checkR_5==0){
                        $scope.info.group3_sec3_checkL_5=null;
                        $scope.info.group3_sec3_checkR_5=null;
                    }
                }
            }
            else if(id == 6){
                if($scope.info.group3_sec3_checkL_6=='0' && $scope.info.group3_sec3_checkR_6=='0'  ||
                   $scope.info.group3_sec3_checkR_6=='0' && $scope.info.group3_sec3_checkL_6==null ||
                   $scope.info.group3_sec3_checkL_6=='0' && $scope.info.group3_sec3_checkR_6==null){
                    $scope.info.group3_sec3_comment6 = null;
                    $scope.info.check31 = null;
                    if($scope.info.group3_sec3_checkL_6==0 || $scope.info.group3_sec3_checkR_6==0){
                        $scope.info.group3_sec3_checkL_6=null;
                        $scope.info.group3_sec3_checkR_6=null;
                    }
                }
            }
            else if(id == 7){
                if($scope.info.group3_sec3_checkL_7=='0' && $scope.info.group3_sec3_checkR_7=='0'  ||
                   $scope.info.group3_sec3_checkR_7=='0' && $scope.info.group3_sec3_checkL_7==null ||
                   $scope.info.group3_sec3_checkL_7=='0' && $scope.info.group3_sec3_checkR_7==null){
                    $scope.info.group3_sec3_comment7 = null;
                    $scope.info.check32 = null;
                    if($scope.info.group3_sec3_checkL_7==0 || $scope.info.group3_sec3_checkR_7==0){
                        $scope.info.group3_sec3_checkL_7=null;
                        $scope.info.group3_sec3_checkR_7=null;
                    }
                }
            }
            else if(id == 8){
                if($scope.info.group3_sec3_checkL_8=='0' && $scope.info.group3_sec3_checkR_8=='0'  ||
                   $scope.info.group3_sec3_checkR_8=='0' && $scope.info.group3_sec3_checkL_8==null ||
                   $scope.info.group3_sec3_checkL_8=='0' && $scope.info.group3_sec3_checkR_8==null){
                    $scope.info.group3_sec3_comment8 = null;
                    $scope.info.check33 = null;
                    if($scope.info.group3_sec3_checkL_8==0 || $scope.info.group3_sec3_checkR_8==0){
                        $scope.info.group3_sec3_checkL_8=null;
                        $scope.info.group3_sec3_checkR_8=null;
                    }
                }
            }
            else if(id == 9){
                if($scope.info.group3_sec3_checkL_9=='0' && $scope.info.group3_sec3_checkR_9=='0'  ||
                   $scope.info.group3_sec3_checkR_9=='0' && $scope.info.group3_sec3_checkL_9==null ||
                   $scope.info.group3_sec3_checkL_9=='0' && $scope.info.group3_sec3_checkR_9==null){
                    $scope.info.group3_sec3_comment9 = null;
                    $scope.info.check34 = null;
                    if($scope.info.group3_sec3_checkL_9==0 || $scope.info.group3_sec3_checkR_9==0){
                        $scope.info.group3_sec3_checkL_9=null;
                        $scope.info.group3_sec3_checkR_9=null;
                    }
                }
            }
            else if(id == 10){
                if($scope.info.group3_sec3_checkL_10=='0' && $scope.info.group3_sec3_checkR_10=='0'  ||
                   $scope.info.group3_sec3_checkR_10=='0' && $scope.info.group3_sec3_checkL_10==null ||
                   $scope.info.group3_sec3_checkL_10=='0' && $scope.info.group3_sec3_checkR_10==null){
                    $scope.info.group3_sec3_comment10 = null;
                    $scope.info.check35 = null;
                    if($scope.info.group3_sec3_checkL_10==0 || $scope.info.group3_sec3_checkR_10==0){
                        $scope.info.group3_sec3_checkL_10=null;
                        $scope.info.group3_sec3_checkR_10=null;
                    }
                }
            }
            else if(id == 11){
                if($scope.info.group3_sec3_checkL_11=='0' && $scope.info.group3_sec3_checkR_11=='0'  ||
                   $scope.info.group3_sec3_checkR_11=='0' && $scope.info.group3_sec3_checkL_11==null ||
                   $scope.info.group3_sec3_checkL_11=='0' && $scope.info.group3_sec3_checkR_11==null){
                    $scope.info.group3_sec3_comment11 = null;
                    $scope.info.check36 = null;
                    if($scope.info.group3_sec3_checkL_11==0 || $scope.info.group3_sec3_checkR_11==0){
                        $scope.info.group3_sec3_checkL_11=null;
                        $scope.info.group3_sec3_checkR_11=null;
                    }
                }
            }
            else if(id == 12){
                if($scope.info.group3_sec3_checkL_12=='0' && $scope.info.group3_sec3_checkR_12=='0'  ||
                   $scope.info.group3_sec3_checkR_12=='0' && $scope.info.group3_sec3_checkL_12==null ||
                   $scope.info.group3_sec3_checkL_12=='0' && $scope.info.group3_sec3_checkR_12==null){
                    $scope.info.group3_sec3_comment12 = null;
                    $scope.info.check37 = null;
                    if($scope.info.group3_sec3_checkL_12==0 || $scope.info.group3_sec3_checkR_12==0){
                        $scope.info.group3_sec3_checkL_12=null;
                        $scope.info.group3_sec3_checkR_12=null;
                    }
                }
            }
            else if(id == 13){
                if($scope.info.group4_checkbox1=='0' || $scope.info.group4_checkbox1==null){
                    $scope.info.group4_comment1=null;
                    $scope.info.group4_checkbox1=null;
                }
            }
            else if(id == 14){
                if($scope.info.group4_checkbox2=='0' || $scope.info.group4_checkbox2==null){
                    $scope.info.group4_comment2=null;
                    $scope.info.group4_checkbox2=null;
                }
            }
            else if(id == 15){
                if($scope.info.group4_checkbox3=='0' || $scope.info.group4_checkbox3==null){
                    $scope.info.group4_comment3=null;
                    $scope.info.group4_comment4=null;
                    $scope.info.group4_checkbox3=null;
                }
            }
            else if(id == 16){
                if($scope.info.group4_checkbox4=='0' || $scope.info.group4_checkbox4==null){
                    $scope.info.group4_comment5=null;
                    $scope.info.group4_checkbox4=null;
                }
            }

        }
        $scope.clearform = function(id){
            if(id == 1){
                if($scope.info.group3_sec1_value1==null || $scope.info.group3_sec1_value1==''){
                    $scope.info.group3_sec1_comment1=null;
                    $scope.info.check23 = null;
                    $scope.info.group3_sec1_value1=null;
                }
            }
            else if(id == 2){
                if($scope.info.group3_sec1_value2==null || $scope.info.group3_sec1_value2==''){
                    $scope.info.group3_sec1_comment2=null;
                    $scope.info.check24 = null;
                    $scope.info.group3_sec1_value2=null;
                }
            }
            else if(id == 3){
                if($scope.info.group3_sec5_value1==''){
                    $scope.info.check46 = null;
                    $scope.info.group3_sec5_comment1 = null;
                    $scope.info.group3_sec5_value1=null;
                }
            }
            else if(id == 4){
                if($scope.info.group3_sec5_value2==''){
                    $scope.info.check47 = null;
                    $scope.info.group3_sec5_comment2 = null;
                    $scope.info.group3_sec5_value2=null;
                }
            }
            else if(id == 5){
                if($scope.info.group3_sec5_value3==''){
                    $scope.info.check48 = null;
                    $scope.info.group3_sec5_comment3 = null;
                    $scope.info.group3_sec5_value3=null;
                }
            }
            else if(id == 6){
                if($scope.info.group3_sec5_value4==''){
                    $scope.info.check49 = null;
                    $scope.info.group3_sec5_comment4 = null;
                    $scope.info.group3_sec5_value4=null;
                }
            }
            else if(id == 7){
                if($scope.info.group3_sec2_comment1==''){
                    $scope.info.group3_sec2_comment1=null;
                }
            }
            else if(id == 8){
                if($scope.info.group3_sec2_comment2==''){
                    $scope.info.group3_sec2_comment2=null;
                }
            }
            else if(id == 9){
                if($scope.info.group3_sec2_comment3==''){
                    $scope.info.group3_sec2_comment3=null;
                }
            }
            else if(id == 10){
                if($scope.info.group3_sec2_comment4==''){
                    $scope.info.group3_sec2_comment4=null;
                }
            }
            else if(id == 11){
                if($scope.info.group3_sec2_comment5==''){
                    $scope.info.group3_sec2_comment5=null;
                }
            }
            else if(id == 12){
                if($scope.info.group3_sec2_comment6==''){
                    $scope.info.group3_sec2_comment6=null;
                }
            }
        }

        $scope.submitQANTAS_rampbaggage = function(QANTAS_rampbaggage){
         if(QANTAS_rampbaggage.$invalid){
            toastr.error('ERROR','x!!');
         }
         else{
          if($scope.insert==true){
            $scope.info.dateChose = $scope.dateChose?$scope.dateChose:null;
            $scope.info.age2 = getAge($scope.patientInfo.DOB);
            console.log($scope.info);
            DocumentService.insertQANTAS_RampBaggage($scope.info).then(function(response){
              if(response.status==="success"){
                toastr.success("insert!!","success");
                $state.go('loggedIn.QANTASrampbaggage', null, {
                  'reload': true
                });
              }
              else{
                toastr.error("fail!!","FAIL");
                $state.go('loggedIn.listall', null, {
                  'reload': true
                });
              }
            })
          }
          else{
            $scope.info.dateChose = $scope.dateChose;
            $scope.info.age2 = getAge($scope.patientInfo.DOB);
            DocumentService.updateQANTAS_RampBaggage($scope.info).then(function(response){
              
              if(response.status==="success"){
                toastr.success("update!!","success");
                $state.go('loggedIn.QANTASrampbaggage', null, {
                  'reload': true
                });
              }
              else{
                toastr.error("fail!!","FAIL");
                $state.go('loggedIn.listall', null, {
                  'reload': true
                });
              }
            })
          }
         }
        };
  });