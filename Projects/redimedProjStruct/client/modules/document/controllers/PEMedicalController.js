angular.module('app.loggedIn.document.PEMedical.controllers',[])
.controller("PEMedicalController",function($scope, $sce, $filter, DocumentService, ConfigService, $http, $cookieStore, $state, toastr, $timeout, $stateParams, localStorageService,FileUploader){
	$scope.patientInfo = localStorageService.get('tempPatient');
    CalID = $stateParams.cal_id; 
    Patient_ID = $stateParams.patient_id;
    $scope.path ={};
    $scope.isSubmit = false;
    var oriInfo,clearInfo,height,weight,value;
    $scope.isSignatureShow  = [
    {id:0,isShow:false},
    {id:1,isShow:false},
    {id:2,isShow:false},
    {id:3,isShow:false}
    ];

    $scope.part1_rate1 =[
    	{id:0, name:'Always'},
    	{id:1, name:'Usually'},
    	{id:2, name:'Sometimes'},
    	{id:3, name:'Rarely'},
    	{id:4, name:'Never'}
    ];

    $scope.rate_Abdominal =[
    	{id:1,
    		name:'Unable to do a full sit-up',
    		name1:'Uni or bilateral moderate to severe stiffness',
    		name2:'Unable to complete',
    		name3:'Incorrect first and second lifts'},
    	{id:2,
    		name:'Full sit-up completed, with hands running up thighs',
    		name1:'Mild global or unilateral stiffness',
    		name2:'Able to complete, but slight discomfort',
    		name3:'Correct second lift'},
    	{id:3,
    		name:'Full sit-up completed with hands on side of head',
    		name1:'Full range of movement',
    		name2:'Able to complete without any pain',
    		name3:'Correct first lift'}
    ];

    $scope.rate_Thoracic =[
    	{id:1,
    		name:'Unable to maintain a strong contraction for 40-60 seconds',
    		name1:'Severe pain elicited on testing',
    		name2:'14 or less',
    		name3:'Incorrect first and second lifts'},
    	{id:2,
    		name:'Able to maintain a strong contraction for 45-60 seconds',
    		name1:'Mild/moderate pain elicited on testing',
    		name2:'15-19 comfortably without any pain',
    		name3:'Correct second lift'},
    	{id:3,
    		name:'Able to maintain a strong contraction for 60 seconds',
    		name1:'No pain elicited on testing',
    		name2:'>20 comfortably with no pain',
    		name3:'Correct first lift'}
    ];

    $scope.rate_Lumbar =[
    	{id:1,
    		name:'<15 back extension with no discomfort',
    		name1:'2-7 without pain',
    		name2:'Unable to hop or complains of pain or severe instability (uni or bilateral)',
    		name3:'Unable to lift more than 4 times'},
    	{id:2,
    		name:'15-25 bilateral back extensions with no discomfort',
    		name1:'8-14 without pain',
    		name2:'Able to hop but appears slightly unstable (uni or bilateral)',
    		name3:'Able to comfortably lift 5-9 times'},
    	{id:3,
    		name:'25  bilateral leg extensions with no discomfort',
    		name1:'15 without any pain',
    		name2:'Able to hop without difficulty (bilateral)',
    		name3:'Able to comfortably lift 10 times'}
    ];

    $scope.rate_Core =[
    	{id:1,
    		name:'Able to sustain posture for over 60 seconds',
    		name1:'<40kg male, <20kg females – or asymmetric grip strength <50%',
    		name2:'Unable to complete 5 without pain',
    		name3:'Unable to lift more than 4 times'},
    	{id:2,
    		name:'Able to sustain posture for 30-59 seconds',
    		name1:'40-47kg male, 21-25kg female – unilateral or bilateral',
    		name2:'Able to complete 5-9 without pain',
    		name3:'Able to comfortably lift 5-9 times'},
    	{id:3,
    		name:'25  bilateral leg extensions with no discomfort',
    		name1:'>48kg Male, >26kg female – bilaterally',
    		name2:'Able to complete 10 steps without pain',
    		name3:'Able to comfortably lift 10 times'}
    ];

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
        else if(value == 2){
            $scope.info.PATIENT_SIGN2 = '';
        }
    }
    $scope.mathBMI = function() {
    	height = $scope.info.part2_sec1_value1;
    	weight = $scope.info.part2_sec1_value2;
    	value  = (weight * 10000)/(height * height);
    	value  = value.toFixed(1);
    	if(value > 0 && value < 300){
    		$scope.info.part2_sec1_value3 = value;
    		if(value < 18.5){
    			$scope.info.part2_sec1_rate1 ="1";
    		}
    		else if(value >= 18.5 && value <= 24.9){
    			$scope.info.part2_sec1_rate1 ="2";
    		}
    		else if(value > 25.0 && value <= 29.9){
    			$scope.info.part2_sec1_rate1 ="3";
    		}
    		else if (value >= 30.0){
    			$scope.info.part2_sec1_rate1 ="4";
    		}   		
    	}
    	else{
    		$scope.info.part2_sec1_rate1 ="0";
    		$scope.info.part2_sec1_value3 =null;
    	}

    }
    var v1,v2,v3,v4;
    $scope.mathSMS = function() {
    	value = 0;
    	v1 = $scope.info.part3_sec2_value1==null?0:parseInt($scope.info.part3_sec2_value1);
    	v2 = $scope.info.part3_sec2_value2==null?0:parseInt($scope.info.part3_sec2_value2);
    	v3 = $scope.info.part3_sec2_value3==null?0:parseInt($scope.info.part3_sec2_value3);
    	v4 = $scope.info.part3_sec2_value4==null?0:parseInt($scope.info.part3_sec2_value4);
    	value = v1 + v2 + v3 + v4;
    	if(value > 0 && value < 36) {
    		$scope.info.part3_sec2_rate1 = "1";
    	}
    	else if(value > 35 && value < 43) {
    		$scope.info.part3_sec2_rate1 = "2";
    	}
    	else if(value > 42 && value < 47) {
    		$scope.info.part3_sec2_rate1 = "3";
    	}
    	else if(value > 46 && value <=48) {
    		$scope.info.part3_sec2_rate1 = "4";
    	}
    	else{
    		$scope.info.part3_sec2_rate1 = "0";
    	}
    }
    $scope.math_part3 = function(id) {
        var value = 0;
    	if(id == 1) {
	    	v1 = $scope.info.part3_sec4_rate1==null?0:parseInt($scope.info.part3_sec4_rate1);
	    	v2 = $scope.info.part3_sec4_rate2==null?0:parseInt($scope.info.part3_sec4_rate2);
	    	v3 = $scope.info.part3_sec4_rate3==null?0:parseInt($scope.info.part3_sec4_rate3);
	    	v4 = $scope.info.part3_sec4_rate4==null?0:parseInt($scope.info.part3_sec4_rate4);
	    	value = v1 + v2 + v3 + v4;
            $scope.info.part3_sec2_value1 = value;
            $scope.mathSMS();
	    	if (value >= 0 && value < 6){
	    		$scope.info.part3_sec4_value1 = "1";
	    	}
	    	else if (value > 5 && value < 9){
	    		$scope.info.part3_sec4_value1 = "2";
	    	}
	    	else if (value > 8 && value < 12){
	    		$scope.info.part3_sec4_value1 = "3";
	    	}
	    	else if (value == 12){
	    		$scope.info.part3_sec4_value1 = "4";
	    	}
    	}
    	else if(id == 2) {
	    	v1 = $scope.info.part3_sec5_rate1==null?0:parseInt($scope.info.part3_sec5_rate1);
	    	v2 = $scope.info.part3_sec5_rate2==null?0:parseInt($scope.info.part3_sec5_rate2);
	    	v3 = $scope.info.part3_sec5_rate3==null?0:parseInt($scope.info.part3_sec5_rate3);
	    	v4 = $scope.info.part3_sec5_rate4==null?0:parseInt($scope.info.part3_sec5_rate4);
	    	value = v1 + v2 + v3 + v4;
            $scope.info.part3_sec2_value2 = value;
            $scope.mathSMS();
	    	if (value >= 0 && value < 6){
	    		$scope.info.part3_sec5_value1 = "1";
	    	}
	    	else if (value > 5 && value < 9){
	    		$scope.info.part3_sec5_value1 = "2";
	    	}
	    	else if (value > 8 && value < 12){
	    		$scope.info.part3_sec5_value1 = "3";
	    	}
	    	else if (value == 12){
	    		$scope.info.part3_sec5_value1 = "4";
	    	}
    	}
    	else if(id == 3) {
	    	v1 = $scope.info.part3_sec6_rate1==null?0:parseInt($scope.info.part3_sec6_rate1);
	    	v2 = $scope.info.part3_sec6_rate2==null?0:parseInt($scope.info.part3_sec6_rate2);
	    	v3 = $scope.info.part3_sec6_rate3==null?0:parseInt($scope.info.part3_sec6_rate3);
	    	v4 = $scope.info.part3_sec6_rate4==null?0:parseInt($scope.info.part3_sec6_rate4);
	    	value = v1 + v2 + v3 + v4;
            $scope.info.part3_sec2_value3 = value;
            $scope.mathSMS();
	    	if (value >= 0 && value < 6){
	    		$scope.info.part3_sec6_value1 = "1";
	    	}
	    	else if (value > 5 && value < 9){
	    		$scope.info.part3_sec6_value1 = "2";
	    	}
	    	else if (value > 8 && value < 12){
	    		$scope.info.part3_sec6_value1 = "3";
	    	}
	    	else if (value == 12){
	    		$scope.info.part3_sec6_value1 = "4";
	    	}
    	}
    	else if(id == 4) {
	    	v1 = $scope.info.part3_sec7_rate1==null?0:parseInt($scope.info.part3_sec7_rate1);
	    	v2 = $scope.info.part3_sec7_rate2==null?0:parseInt($scope.info.part3_sec7_rate2);
	    	v3 = $scope.info.part3_sec7_rate3==null?0:parseInt($scope.info.part3_sec7_rate3);
	    	v4 = $scope.info.part3_sec7_rate4==null?0:parseInt($scope.info.part3_sec7_rate4);
	    	value = v1 + v2 + v3 + v4;
            $scope.info.part3_sec2_value4 = value;
            $scope.mathSMS();
	    	if (value >= 0 && value < 6){
	    		$scope.info.part3_sec7_value1 = "1";
	    	}
	    	else if (value > 5 && value < 9){
	    		$scope.info.part3_sec7_value1 = "2";
	    	}
	    	else if (value > 8 && value < 12){
	    		$scope.info.part3_sec7_value1 = "3";
	    	}
	    	else if (value == 12){
	    		$scope.info.part3_sec7_value1 = "4";
	    	}
    	}
    }
    $scope.manage_part = function(id) {
        if(id === 1){
            if($scope.info.part1_sec3_comment1==null || $scope.info.part1_sec3_comment1==undefined || $scope.info.part1_sec3_comment1==''){
                if($scope.info.part1_sec3_rate1!=undefined && $scope.info.part1_sec3_rate1!=null && $scope.info.part1_sec3_rate1!=''){
                    $scope.info.part1_sec3_rate1 =null;
                }
            }
        }
        else if(id === 2){
            if($scope.info.part1_sec3_check1 == "0" || $scope.info.part1_sec3_check1 == "1"){

                $scope.info.part1_sec3_comment2 = null;
            }
            if($scope.info.part1_sec3_check1 == "0"){
                $scope.info.part1_sec3_rate2 = null;
            }
        }  
        else if(id === 3){
            if($scope.info.part1_sec3_comment3 == undefined || $scope.info.part1_sec3_comment3 == null || $scope.info.part1_sec3_comment3 == ''){
                $scope.info.part1_sec3_rate3 = null;
            }
        }
        else if(id === 4){
            if($scope.info.part7_sec4_value1 !== "0"){
                $scope.info.part7_sec4_comment2 = null;
            }
        }
        else if(id === 5){
            if($scope.info.part7_sec4_value2 !== "0"){
                $scope.info.part7_sec4_comment4 = null;
            }
        }
    }

    $scope.infoChanged = function() {
            return angular.equals(oriInfo, $scope.info);
        }

        $scope.resetForm = function() {
            $scope.info = angular.copy(oriInfo);
            $scope.PEMedicalForm.$setPristine();
            $scope.isShowImg = true;
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
                $scope.PEMedicalForm.$setPristine();
                $scope.isShowImg = false;
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
            	angular.forEach($scope.uploader.queue, function(value, index) {
                    if (value.formData[0].userId === Patient_ID) {
                        $scope.uploader.removeFromQueue(index);
                    }
                });
                    //DELETE FROM DATABASE
                DocumentService.DeleteFile(Patient_ID).then(function(response) {
               		$scope.info.file_name = null;    	
                });
             	DocumentService.deletePEMedical(Patient_ID,CalID).then(function(response){
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

        $scope.avt_path = '';
        var uploader = $scope.uploader = new FileUploader({
            url:'/api/document/post-upload-file',
            autoUpload:false,
            removeAfterUpload:true,
            onAfterAddingFile: function(item){
                var arr   = item.file.name.split(".");
                var check = arr[arr.length-1];
                if(check == "jpg" || check == "jpeg" || check =="png"){
                    if(this.queue.length > 1)
                        this.queue.splice(0,1);
                }
                else{
                    toastr.error("Only jpg, jpeg and png accepted","error format!");
                    this.queue = [];
                }
            }
        });
        if(!!$stateParams.patient_id){
            uploader.formData[0] = {patient_id: $stateParams.patient_id, file_name:(new Date()).getTime(), editMode:true};
        }

        $scope.openUploader = function(){
             $timeout(function () {
                $('#patient_photo_upload').click();
            }, 100);
        };


        $scope.insert = false;
        DocumentService.checkPEMedical(Patient_ID,CalID).then(function(response){
            $scope.patientInfo = response['patientInfo'];
            $scope.patientInfo.DOB = moment($scope.patientInfo.DOB).format('YYYY-MM-DD');
            if(response.status==="insert"){
            	$scope.insert = true;
            	$scope.isNew = true;
            	$scope.path ={};
                console.log(response['company']);
            	$scope.info ={
            		PATIENT_ID:Patient_ID,
					CAL_ID:CalID,
					header_check:null,
					part1_sec1_comment1:null,
					part1_sec1_comment2:null,
					part1_sec1_comment3:null,
					part1_sec1_comment4:null,
					part1_sec1_comment5:null,
					part1_sec1_comment6:null,
					part1_sec1_comment7:null,
					part1_sec1_comment8:null,
					part1_sec1_comment9:null,
					part1_sec1_comment10:null,
					part1_sec1_comment11:null,
					part1_sec1_comment12:null,
					part1_sec1_comment13:null,
					part1_sec1_comment14:null,
					part1_sec1_comment15:null,
					part1_sec1_comment16:null,
					part1_sec1_comment17:null,
					part1_sec1_comment18:null,
					part1_sec1_comment19:null,
					part1_sec1_comment20:null,
					part1_sec1_comment21:null,
					part1_sec1_comment22:null,
					part1_sec1_comment23:null,
					part1_sec1_comment24:null,
					part1_sec2_check1 :null,
					part1_sec2_check2:null,
					part1_sec2_check3:null,
					part1_sec2_check4:null,
					part1_sec2_check5:null,
					part1_sec2_check6:null,
					part1_sec2_check7:null,
					part1_sec2_check8:null,
					part1_sec2_check9:null,
					part1_sec2_check10:null,
					part1_sec2_check11:null,
					part1_sec2_check12:null,
					part1_sec2_check13:null,
					part1_sec2_check14:null,
					part1_sec2_check15:null,
					part1_sec2_check16:null,
					part1_sec2_check17:null,
					part1_sec2_check18:null,
					part1_sec2_check19:null,
					part1_sec2_check20:null,
					part1_sec2_check21:null,
					part1_sec2_check22:null,
					part1_sec2_check23:null,
					part1_sec2_check24:null,
					part1_sec2_check25:null,
					part1_sec2_check26:null,
					part1_sec2_check27:null,
					part1_sec2_check28:null,
					part1_sec2_check29:null,
					part1_sec2_check30:null,
					part1_sec2_check31:null,
					part1_sec2_check32:null,
					part1_sec2_check33:null,
					part1_sec2_check34:null,
					part1_sec2_check35:null,
					part1_sec2_check36:null,
					part1_sec2_check37:null,
					part1_sec2_check38:null,
					part1_sec2_check39:null,
					part1_sec2_check40:null,
					part1_sec2_check41:null,
					part1_sec2_check42:null,
					part1_sec2_check43:null,
					part1_sec2_check44:null,
					part1_sec2_check45:null,
					part1_sec2_check46:null,
					part1_sec2_comment1:null,
					part1_sec2_comment2:null,
					part1_sec3_comment1:null,
					part1_sec3_comment2:null,
					part1_sec3_comment3:null,
					part1_sec3_rate1:null,
					part1_sec3_rate2:null,
					part1_sec3_rate3:null,
					part1_sec3_check1:null,
					part1_sec4_value1:null,
					part1_sec4_value2:null,
					part1_sec4_value3:null,
					part1_sec4_value4:null,
					part1_sec4_check1:null,
					part1_sec4_check2:null,
					part1_sec4_check3:null,
					part1_sec4_check4:null,
					part1_sec4_check5:null,
					part1_sec4_check6:null,
					part1_sec4_check7:null,
					part1_sec5_check1 :null,
					part1_sec5_check2 :null,
					part1_sec5_check3 :null,
					part1_sec5_check4 :null,
					part1_sec5_check5 :null,
					part1_sec5_check6 :null,
					part1_sec5_check7 :null,
					part1_sec5_check8 :null,
					part1_sec5_check9 :null,
					part1_sec5_check10 :null,
					part1_sec5_check11:null,
					part1_sec5_check12:null,
					part1_sec5_check13:null,
					part1_sec5_check14:null,
					part1_sec5_check15:null,
					part1_sec5_check16:null,
					part1_sec5_check17:null,
					part1_sec5_check18:null,
					part1_sec5_check19:null,
					part1_sec5_check20:null,
					part1_sec5_check21:null,
					part1_sec5_comment1:null,
					part1_sec5_comment2:null,
					part1_sec6_check1  :null,
					part1_sec6_check2  :null,
					part1_sec6_check3  :null,
					part1_sec6_check4  :null,
					part1_sec6_check5  :null,
					part1_sec6_check6  :null,
					part1_sec6_check7  :null,
					part1_sec6_comment1:null,
					part1_sec6_comment2:null,
					part1_sec7_check1:null,
					part1_sec7_check2:null,
					part1_sec7_comment1:null,
					part2_sec1_value1:null,
					part2_sec1_value2:null,
					part2_sec1_rate1:null,
					part2_sec2_value1:null,
					part2_sec2_value2:null,
					part2_sec2_value3:null,
					part2_sec2_rate1:null,
					part2_sec2_rate2:null,
					part2_sec2_rate3:null,
					part2_sec2_rate4:null,
					part2_sec2_rate5:null,
					part2_sec3_rate1:null,
					part2_sec4_rate1:null,
					part2_sec4_rate2:null,
					part2_sec5_value1:null,
					part2_sec5_value2:null,
					part2_sec5_value3:null,
					part2_sec5_value4:null,
					part2_sec5_value5:null,
					part2_sec5_value6:null,
					part2_sec5_value7:null,
					part2_sec5_value8:null,
					part2_sec5_rate1:null,
					part2_sec5_rate2:null,
					part2_sec5_rate3:null,
					part2_sec5_rate4:null,
					part2_sec5_rate5:null,
					part2_sec6_rate1:null,
					part2_sec6_rate2:null,
					part2_sec6_rate3:null,
					part2_sec6_rate4:null,
					part2_sec7_rate1:null,
					part2_sec7_rate2:null,
					part2_sec7_rate3:null,
					part2_sec7_rate4:null,
					part2_sec7_rate5:null,
					part2_sec8_rate1:null,
					part2_sec8_rate2:null,
					part2_sec8_rate3:null,
					part2_sec8_value1:null,
					part2_sec8_value2:null,
					part2_sec8_value3:null,
					part2_sec8_value4:null,
					part2_sec9_rate1:null,
					part2_sec9_rate2:null,
					part2_sec9_rate3:null,
					part2_sec9_rate4:null,
					part2_sec9_rate5:null,
					part2_sec9_rate6:null,
					part2_sec9_rate7:null,
					part2_sec9_rate8:null,
					part2_sec9_rate9:null,
					part2_sec9_rate10:null,
					part2_sec9_value1:null,
					part2_sec9_value2:null,
					part2_sec10_comment1:null,
					part2_sec10_rate1:null,
					part3_sec1_rate1:null,
					part3_sec2_value1:null,
					part3_sec2_value2:null,
					part3_sec2_value3:null,
					part3_sec2_value4:null,
					part3_sec2_rate1:null,
					part3_sec3_comment1:null,
					part3_sec3_value1:null,
					part3_sec4_rate1:null,
					part3_sec4_rate2:null,
					part3_sec4_rate3:null,
					part3_sec4_rate4:null,
					part3_sec4_value1:null,
					part3_sec4_comment1:null,
					part3_sec5_rate1:null,
					part3_sec5_rate2:null,
					part3_sec5_rate3:null,
					part3_sec5_rate4:null,
					part3_sec5_value1:null,
					part3_sec5_comment1:null,
					part3_sec6_rate1:null,
					part3_sec6_rate2:null,
					part3_sec6_rate3:null,
					part3_sec6_rate4:null,
					part3_sec6_value1:null,
					part3_sec6_comment1:null,
					part3_sec7_rate1:null,
					part3_sec7_rate2:null,
					part3_sec7_rate3:null,
					part3_sec7_rate4:null,
					part3_sec7_value1:null,
					part3_sec7_comment1:null,
					part4_sec3_value1:null,
					part4_sec3_value2:null,
					part4_sec3_value3:null,
					part5_sec1_value1:null,
					part5_sec2_value1:null,
					part5_sec2_value2:null,
					part5_sec2_value3:null,
					part5_sec2_value4:null,
					part5_sec2_value5:null,
					part5_sec2_value6:null,
					part5_sec2_value7:null,
					part5_sec2_value8:null,
					part5_sec2_value9:null,
					part5_sec2_value10:null,
					part5_sec2_value11:null,
					part5_sec2_value12:null,
					part5_sec2_value13:null,
                    part5_sec2_comment1:null,
                    part5_sec2_comment2:null,
					part5_sec3_value1:null,
					part6_img_file_name:null,
					part7_sec1_value1:null,
					part7_sec1_value2:null,
					part7_sec1_value3:null,
					part7_sec2_value1:$scope.patientInfo.company_id?response['company'].company_name:null,
					part7_sec2_value2:$scope.patientInfo.company_id?response['company'].Site_name:null,
					part7_sec2_value3:$scope.patientInfo.company_id?response['company'].Email:null,
                    part7_sec2_value4:$scope.patientInfo.company_id?response['company'].Phone:null,
					part7_sec3_value1:null,
					part7_sec3_value2:null,
					part7_sec3_value3:null,
					part7_sec3_value4:null,
					part7_sec3_value5:null,
					part7_sec3_comment1:null,
					part7_sec4_comment1:null,
					part7_sec4_comment2:null,
					part7_sec4_comment3:null,
					part7_sec4_comment4:null,
					part7_sec4_value1:null,
					part7_sec4_value2:null,
					PATIENT_SIGN:null,
                    PATIENT_SIGN1:null,
                    PATIENT_SIGN2:null,
                    PATIENT_SIGN3:null,
					dateChose:null,
					dateChose1:null
            	};
              	oriInfo = angular.copy($scope.info);         
            }
            else if(response.status==="update"){
              	$scope.insert = false;
              	$scope.isNew = false;
              	$scope.info = angular.copy(response['data']);
              	$scope.dateChose = $scope.info.dateChose;
              	$scope.dateChose1 = $scope.info.dateChose1;
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
					header_check:null,
					part1_sec1_comment1:null,
					part1_sec1_comment2:null,
					part1_sec1_comment3:null,
					part1_sec1_comment4:null,
					part1_sec1_comment5:null,
					part1_sec1_comment6:null,
					part1_sec1_comment7:null,
					part1_sec1_comment8:null,
					part1_sec1_comment9:null,
					part1_sec1_comment10:null,
					part1_sec1_comment11:null,
					part1_sec1_comment12:null,
					part1_sec1_comment13:null,
					part1_sec1_comment14:null,
					part1_sec1_comment15:null,
					part1_sec1_comment16:null,
					part1_sec1_comment17:null,
					part1_sec1_comment18:null,
					part1_sec1_comment19:null,
					part1_sec1_comment20:null,
					part1_sec1_comment21:null,
					part1_sec1_comment22:null,
					part1_sec1_comment23:null,
					part1_sec1_comment24:null,
					part1_sec2_check1 :null,
					part1_sec2_check2:null,
					part1_sec2_check3:null,
					part1_sec2_check4:null,
					part1_sec2_check5:null,
					part1_sec2_check6:null,
					part1_sec2_check7:null,
					part1_sec2_check8:null,
					part1_sec2_check9:null,
					part1_sec2_check10:null,
					part1_sec2_check11:null,
					part1_sec2_check12:null,
					part1_sec2_check13:null,
					part1_sec2_check14:null,
					part1_sec2_check15:null,
					part1_sec2_check16:null,
					part1_sec2_check17:null,
					part1_sec2_check18:null,
					part1_sec2_check19:null,
					part1_sec2_check20:null,
					part1_sec2_check21:null,
					part1_sec2_check22:null,
					part1_sec2_check23:null,
					part1_sec2_check24:null,
					part1_sec2_check25:null,
					part1_sec2_check26:null,
					part1_sec2_check27:null,
					part1_sec2_check28:null,
					part1_sec2_check29:null,
					part1_sec2_check30:null,
					part1_sec2_check31:null,
					part1_sec2_check32:null,
					part1_sec2_check33:null,
					part1_sec2_check34:null,
					part1_sec2_check35:null,
					part1_sec2_check36:null,
					part1_sec2_check37:null,
					part1_sec2_check38:null,
					part1_sec2_check39:null,
					part1_sec2_check40:null,
					part1_sec2_check41:null,
					part1_sec2_check42:null,
					part1_sec2_check43:null,
					part1_sec2_check44:null,
					part1_sec2_check45:null,
					part1_sec2_check46:null,
					part1_sec2_comment1:null,
					part1_sec2_comment2:null,
					part1_sec3_comment1:null,
					part1_sec3_comment2:null,
					part1_sec3_comment3:null,
					part1_sec3_rate1:null,
					part1_sec3_rate2:null,
					part1_sec3_rate3:null,
					part1_sec3_check1:null,
					part1_sec4_value1:null,
					part1_sec4_value2:null,
					part1_sec4_value3:null,
					part1_sec4_value4:null,
					part1_sec4_check1:null,
					part1_sec4_check2:null,
					part1_sec4_check3:null,
					part1_sec4_check4:null,
					part1_sec4_check5:null,
					part1_sec4_check6:null,
					part1_sec4_check7:null,
					part1_sec5_check1 :null,
					part1_sec5_check2 :null,
					part1_sec5_check3 :null,
					part1_sec5_check4 :null,
					part1_sec5_check5 :null,
					part1_sec5_check6 :null,
					part1_sec5_check7 :null,
					part1_sec5_check8 :null,
					part1_sec5_check9 :null,
					part1_sec5_check10 :null,
					part1_sec5_check11:null,
					part1_sec5_check12:null,
					part1_sec5_check13:null,
					part1_sec5_check14:null,
					part1_sec5_check15:null,
					part1_sec5_check16:null,
					part1_sec5_check17:null,
					part1_sec5_check18:null,
					part1_sec5_check19:null,
					part1_sec5_check20:null,
					part1_sec5_check21:null,
					part1_sec5_comment1:null,
					part1_sec5_comment2:null,
					part1_sec6_check1  :null,
					part1_sec6_check2  :null,
					part1_sec6_check3  :null,
					part1_sec6_check4  :null,
					part1_sec6_check5  :null,
					part1_sec6_check6  :null,
					part1_sec6_check7  :null,
					part1_sec6_comment1:null,
					part1_sec6_comment2:null,
					part1_sec7_check1:null,
					part1_sec7_check2:null,
					part1_sec7_comment1:null,
					part2_sec1_value1:null,
					part2_sec1_value2:null,
					part2_sec1_rate1:null,
					part2_sec2_value1:null,
					part2_sec2_value2:null,
					part2_sec2_value3:null,
					part2_sec2_rate1:null,
					part2_sec2_rate2:null,
					part2_sec2_rate3:null,
					part2_sec2_rate4:null,
					part2_sec2_rate5:null,
					part2_sec3_rate1:null,
					part2_sec4_rate1:null,
					part2_sec4_rate2:null,
					part2_sec5_value1:null,
					part2_sec5_value2:null,
					part2_sec5_value3:null,
					part2_sec5_value4:null,
					part2_sec5_value5:null,
					part2_sec5_value6:null,
					part2_sec5_value7:null,
					part2_sec5_value8:null,
					part2_sec5_rate1:null,
					part2_sec5_rate2:null,
					part2_sec5_rate3:null,
					part2_sec5_rate4:null,
					part2_sec5_rate5:null,
					part2_sec6_rate1:null,
					part2_sec6_rate2:null,
					part2_sec6_rate3:null,
					part2_sec6_rate4:null,
					part2_sec7_rate1:null,
					part2_sec7_rate2:null,
					part2_sec7_rate3:null,
					part2_sec7_rate4:null,
					part2_sec7_rate5:null,
					part2_sec8_rate1:null,
					part2_sec8_rate2:null,
					part2_sec8_rate3:null,
					part2_sec8_value1:null,
					part2_sec8_value2:null,
					part2_sec8_value3:null,
					part2_sec8_value4:null,
					part2_sec9_rate1:null,
					part2_sec9_rate2:null,
					part2_sec9_rate3:null,
					part2_sec9_rate4:null,
					part2_sec9_rate5:null,
					part2_sec9_rate6:null,
					part2_sec9_rate7:null,
					part2_sec9_rate8:null,
					part2_sec9_rate9:null,
					part2_sec9_rate10:null,
					part2_sec9_value1:null,
					part2_sec9_value2:null,
					part2_sec10_comment1:null,
					part2_sec10_rate1:null,
					part3_sec1_rate1:null,
					part3_sec2_value1:null,
					part3_sec2_value2:null,
					part3_sec2_value3:null,
					part3_sec2_value4:null,
					part3_sec2_rate1:null,
					part3_sec3_comment1:null,
					part3_sec3_value1:null,
					part3_sec4_rate1:null,
					part3_sec4_rate2:null,
					part3_sec4_rate3:null,
					part3_sec4_rate4:null,
					part3_sec4_value1:null,
					part3_sec4_comment1:null,
					part3_sec5_rate1:null,
					part3_sec5_rate2:null,
					part3_sec5_rate3:null,
					part3_sec5_rate4:null,
					part3_sec5_value1:null,
					part3_sec5_comment1:null,
					part3_sec6_rate1:null,
					part3_sec6_rate2:null,
					part3_sec6_rate3:null,
					part3_sec6_rate4:null,
					part3_sec6_value1:null,
					part3_sec6_comment1:null,
					part3_sec7_rate1:null,
					part3_sec7_rate2:null,
					part3_sec7_rate3:null,
					part3_sec7_rate4:null,
					part3_sec7_value1:null,
					part3_sec7_comment1:null,
					part4_sec3_value1:null,
					part4_sec3_value2:null,
					part4_sec3_value3:null,
					part5_sec1_value1:null,
					part5_sec2_value1:null,
					part5_sec2_value2:null,
					part5_sec2_value3:null,
					part5_sec2_value4:null,
					part5_sec2_value5:null,
					part5_sec2_value6:null,
					part5_sec2_value7:null,
					part5_sec2_value8:null,
					part5_sec2_value9:null,
					part5_sec2_value10:null,
					part5_sec2_value11:null,
					part5_sec2_value12:null,
					part5_sec2_value13:null,
                    part5_sec2_comment1:null,
                    part5_sec2_comment2:null,
					part5_sec3_value1:null,
					part6_img_file_name:null,
					part7_sec1_value1:null,
					part7_sec1_value2:null,
					part7_sec1_value3:null,
					part7_sec2_value1:$scope.patientInfo.company_id?response['company'].Company_name:null,
                    part7_sec2_value2:$scope.patientInfo.company_id?response['company'].Site_name:null,
                    part7_sec2_value3:$scope.patientInfo.company_id?response['company'].Email:null,
                    part7_sec2_value4:$scope.patientInfo.company_id?response['company'].Phone:null,
					part7_sec3_value1:null,
					part7_sec3_value2:null,
					part7_sec3_value3:null,
					part7_sec3_value4:null,
					part7_sec3_value5:null,
					part7_sec3_comment1:null,
					part7_sec4_comment1:null,
					part7_sec4_comment2:null,
					part7_sec4_comment3:null,
					part7_sec4_comment4:null,
					part7_sec4_value1:null,
					part7_sec4_value2:null,
					PATIENT_SIGN:null,
                    PATIENT_SIGN1:null,
                    PATIENT_SIGN2:null,
                    PATIENT_SIGN3:null,
					dateChose:null,
					dateChose1:null
            	};
            }
        });
		$scope.submitPEMedical = function(PEMedicalForm){
            $scope.isSubmit = true;
            if(PEMedicalForm.$invalid){
                toastr.error("error","!x!");
            }
            else{
            	if($scope.insert==true){
                	$scope.info.dateChose  = $scope.dateChose?$scope.dateChose:null;
                	$scope.info.dateChose1 = $scope.dateChose1?$scope.dateChose1:null;
                    $scope.isSubmit = false;
                	DocumentService.insertPEMedical($scope.info).then(function(response){
                  		if(response.status==="success"){
                    		toastr.success("insert!!","success");
                    		$state.go('loggedIn.PEMedical', null, {
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
                    $scope.isSubmit = false;
                	$scope.info.dateChose = $scope.dateChose;
                	$scope.info.dateChose1 = $scope.dateChose1;
                	DocumentService.updatePEMedical($scope.info).then(function(response){
                  
                  		if(response.status==="success"){
                    		toastr.success("update!!","success");
                    		$state.go('loggedIn.PEMedical', null, {
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