angular.module('starter.main.pharmacistController',[])

    .controller('pharmacistController', function ($scope, $state,$q,localStorageService ,SecurityService,$ionicPopup,$ionicLoading,$ionicModal,$timeout,MainService,$filter,$ionicActionSheet,$cordovaActionSheet, $location) {
    	 
    
      $scope.pharmacist_qualification = {};
      if($scope.userInfo.user_type=="Pharmacist"){

              MainService.getPharmacist($scope.userInfo.user_id).then(function(result){

                  if(result.status=="success"){
                      $scope.pharmacisinfo = result.data;
                      $scope.pharmacisinfo.DOB = new Date($scope.pharmacisinfo.DOB);
                      $scope.pharmacisinfo.phone = parseInt($scope.pharmacisinfo.phone);
                      $scope.pharmacisinfo.mobile = parseInt($scope.pharmacisinfo.mobile);
                      
                       $scope.getQualification();
                        $scope.getExp();
                  }
              })
       }

        $scope.disableTap = function(){
          container = document.getElementsByClassName('pac-container');
          // disable ionic data tab
          angular.element(container).attr('data-tap-disabled', 'true');
          // leave input field if google-address-entry is selected
          angular.element(container).on("click", function(){
            document.getElementById('autocomplete').blur();
          });
        };
       //update pharmacist
	    $scope.updatePharmasict = function(){
          $ionicLoading.show({
               template: '<i class="fa fa-refresh fa-spin"></i>'+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });
	     		// updatePharmasictInfo
	     	var geocoder = new google.maps.Geocoder();
          geocoder.geocode({'address': $scope.pharmacisinfo.address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              $scope.pharmacisinfo.latitude = results[0].geometry.location.lat();
              $scope.pharmacisinfo.longitude = results[0].geometry.location.lng();
            }
        console.log($scope.pharmacisinfo);
	     	MainService.updatePharmasictInfo($scope.pharmacisinfo).then(function(result){
	     		  if(result.status=="success"){
               $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Update Company Success'
                })
            }
	     	 })
	      })
      }

      //modal add new qualification 
      $ionicModal.fromTemplateUrl('modules/main/views/addnewQualification.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModalQualification = function(title,options) {
        $scope.titleQua = title;
        $scope.optionsQua = options;
        $timeout(function(){
          $scope.modal.show();
        },200)
        
      };
      $scope.closeModalQualification = function() {
         $scope.addnewQa = {};
        $scope.modal.hide();
      };
      $scope.addnewQa = {};
      $scope.addnewqualification = function(){ 
        MainService.addNewQualification($scope.addnewQa.qualification,$scope.pharmacisinfo.phamacist_id).then(function(result){
            if(result.status=="success"){
              var alertPopup = $ionicPopup.alert({
                  title: 'Alert',
                  template: 'Add New Qualification Success'
                });
               alertPopup.then(function(res) { 
                        $scope.addnewQa = {};     
                        $scope.closeModalQualification();
                         $scope.getQualification();
               });
            }
        })
      }
      //get qualification pharmacis
      $scope.getQualification = function(){
           $ionicLoading.show({
               template: '<i class="fa fa-refresh fa-spin"></i>'+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });
          MainService.getAllPharmacisQualification($scope.pharmacisinfo.phamacist_id).then(function(result){
              if(result.status=="success"){
                  $scope.pharmacist_qualification = result.data;
                   $ionicLoading.hide();
                  
              }else{
                   var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'can not get data pls check internet'
                    });
              }
          })
      }
      //delete qualification 
      $scope.deleteQualification = function(qualification_id){
          MainService.deletePharmacistQualification(qualification_id).then(function(result){
              if(result.status=="success"){
                   var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Delete Qualification Success'
                    });
                    alertPopup.then(function(res) { 
                         $scope.getQualification();
                    });
              }
          })
      }
      $scope.updateQulification = function(){
        console.log($scope.qualificationSelected.qualification_id);
        console.log($scope.addnewQa.qualification)
        MainService.updateQulification($scope.addnewQa.qualification,$scope.qualificationSelected.qualification_id).then(function(result){
              if(result.status=="success"){
                   var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Update Qualification Success'
                    });
                    alertPopup.then(function(res) { 
                         $scope.getQualification();
                          $scope.addnewQa = {};     
                        $scope.closeModalQualification();
                    });
              }
          })

      }
      //modal experience
       $ionicModal.fromTemplateUrl('modules/main/views/addnewExperience.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalEx = modal;
      });
      $scope.openModalExperience = function(title,options) {
        $scope.titleExp = title;
        $scope.optionsExp = options;
        $timeout(function(){
           $scope.modalEx.show();
        },200)
       
      };
      $scope.closeModalExperience = function() {
        $scope.modalEx.hide();
         $scope.exp = {};
      };

      $scope.exp = {};
      //add new exp 
      $scope.addNewExp = function(){
        
        MainService.addNewExp($scope.exp,$scope.pharmacisinfo.phamacist_id).then(function(result){
              var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Add Exp Success'
                    });
                    alertPopup.then(function(res) { 
                           $scope.exp = {};
                          $scope.closeModalExperience();
                          $scope.getExp();
                    });
        })
      }

      $scope.getExp = function(){
        $ionicLoading.show({
               template: '<i class="fa fa-refresh fa-spin"></i>'+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
                });
        MainService.getExp($scope.pharmacisinfo.phamacist_id).then(function(result){
            if(result.status=="success"){
                $scope.expInfo = result.data;
                $ionicLoading.hide();

            }else{
                var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'can not get data pls check internet'
                  });
            }
        })
      }
      //delete exp 
      $scope.deleteExp = function(exp_id){
        alert(exp_id);
        MainService.deleteExp(exp_id).then(function(result){
            if(result.status=="success"){
                 var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Delete Exp Success'
                    });
                    alertPopup.then(function(res) { 
                          $scope.getExp();
                    });
            }
        })
      }
      //oppen model exp edit
      $scope.modalEditExp = function(exp){
           $scope.openModalExperience("Edit Experiences","editExp");
           $scope.exp = exp;
           $scope.exp.from_date =  new Date($scope.exp.from_date);
            $scope.exp.to_date = new Date($scope.exp.to_date);
            $scope.exp.exp_id = exp.exp_id;

      }
      //update exp 
      $scope.updateExp = function(){
          MainService.updateExp($scope.exp).then(function(result){
            if(result.status=="success"){
               var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Edit Exp Success'
                    });
                    alertPopup.then(function(res) { 
                          $scope.getExp();
                           $scope.closeModalExperience();
                    });
            }else{
                var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Edit Exp Fail'
                    });
            }
          })
      }
      //
      $scope.show = function(qualification) {
         var options = {
          title: 'Options',
          buttonLabels: ['Edit Qualification'],
          addCancelButtonWithLabel: 'Cancel',
          androidEnableCancelButton : true,
          addDestructiveButtonWithLabel : 'Delete it'
        };
        document.addEventListener("deviceready", function () {

          $cordovaActionSheet.show(options)
            .then(function(btnIndex) {
              var index = btnIndex;
              if(index==1){
                 $scope.deleteQualification(qualification.qualification_id);
              }
              if(index==2){
                  $scope.addnewQa.qualification = qualification.qualification;
                  $scope.qualificationSelected = qualification;
                  $scope.openModalQualification("Edit Qualification","editQua");
              }
             
            });
        }, true);


         // Show the action sheet
         //   var hideSheet = $ionicActionSheet.show({
         //     buttons: [
         //       { text: 'Edit' }
               
         //     ],
         //     destructiveText: 'Delete',
         //     titleText: 'Modify your Qualification',
         //     cancelText: 'Cancel',
         //     cancel: function() {
         //          // add cancel code..
         //        },
         //     buttonClicked: function(index) {
         //        if(index == 0){
                   
         //            $scope.addnewQa.qualification = qualification.qualification;
         //            $scope.qualificationSelected = qualification;
         //            $scope.openModalQualification("Edit Qualification","editQua");

         //        }
         //        return true;
         //     },
         //      destructiveButtonClicked: function() {
         //        $scope.deleteQualification(qualification.qualification_id);
         //         return  true;
         //       }
         // });
        
         
          
   }
     
       	
})

    