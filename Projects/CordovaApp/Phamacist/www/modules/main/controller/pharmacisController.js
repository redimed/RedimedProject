angular.module('starter.main.pharmacistController',[])

    .controller('pharmacistController', function ($scope, $state, $q, localStorageService , SecurityService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $ionicActionSheet, $cordovaActionSheet, $location) {
    	 
    
      $scope.pharmacist_qualification = {};
      if($scope.userInfo.user_type=="Pharmacist"){

              MainService.getPharmacist($scope.userInfo.user_id).then(function(result){

                  if(result.status=="success"){
                      $scope.pharmacisinfo = result.data;

                      $scope.pharmacisinfo.DOB = new Date($scope.pharmacisinfo.DOB);
                      var dateString = new Date($scope.pharmacisinfo.DOB).toString();
                      var monthStr = new Date(dateString).getMonth();
                      console.log(monthStr + 1);

                      $scope.pharmacisinfo.DOB.date = dateString.substring(8,10);
                      $scope.pharmacisinfo.DOB.month = monthStr;
                      $scope.pharmacisinfo.DOB.year = dateString.substring(11,15);

                      $scope.pharmacisinfo.phone = parseInt($scope.pharmacisinfo.phone);
                      $scope.pharmacisinfo.mobile = parseInt($scope.pharmacisinfo.mobile);
                      
                      $scope.getQualification();
                      $scope.getExp();
                  }
              })
       }

        if($location.$$path === "/app/main/infoPhar"){
          // console.log(MainService.infoPharmacist.infoPharmacists);
          $scope.infoPhar = [];
          $scope.infoPhar = MainService.infoPharmacist.infoPharmacists;
          // console.log($scope.infoPhar);
        }
        if($location.$$path === "/app/main/postDetailPostApply"){
          $scope.postDetail = {};
          $scope.postDetail = MainService.detailPosts.applyPost;
        }

        $scope.getDetailPharmacist = function(phamacist_id){
          MainService.getDetailInfoPhar(phamacist_id).then(function(result){
            if(result.status = 'success'){
              MainService.infoPharmacist.detail = result.data;
              console.log(MainService.infoPharmacist.detail);
              $state.go("app.main.detailInfoPhar");
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
        $scope.pharmacisinfo.DOB = $filter('date')(Date.parse($scope.pharmacisinfo.DOB.year +'/'+  $scope.pharmacisinfo.DOB.month +'/'+ $scope.pharmacisinfo.DOB.date), 'yyyy/MM/dd');
        console.log($scope.pharmacisinfo.DOB);
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
        $scope.exp.from_date = $filter('date')(Date.parse($scope.exp.from_date.year +'/'+  $scope.exp.from_date.month +'/'+ $scope.exp.from_date.date), 'yyyy/MM/dd');
        $scope.exp.to_date = $filter('date')(Date.parse($scope.exp.to_date.year +'/'+  $scope.exp.to_date.month +'/'+ $scope.exp.to_date.date), 'yyyy/MM/dd');
        console.log($scope.exp)
        MainService.addNewExp($scope.exp,$scope.pharmacisinfo.phamacist_id).then(function(result){
              $scope.closeModalExperience();
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

          var fromString = new Date($scope.exp.from_date).toString();
          var monthFromStr = $scope.exp.from_date.getMonth();
          $scope.exp.from_date.date = fromString.substring(8,10);
          $scope.exp.from_date.month = monthFromStr + 1;
          $scope.exp.from_date.year = fromString.substring(11,15);

          var toString = new Date($scope.exp.to_date).toString();
          var monthToStr = $scope.exp.to_date.getMonth();
          $scope.exp.to_date.date = toString.substring(8,10);
          $scope.exp.to_date.month = monthToStr + 1;
          $scope.exp.to_date.year = toString.substring(11,15);

          $scope.exp.exp_id = exp.exp_id;
      }
      //update exp 
      $scope.updateExp = function(){
          $scope.exp.from_date = $filter('date')(Date.parse($scope.exp.from_date.year +'/'+  $scope.exp.from_date.month +'/'+ $scope.exp.from_date.date), 'yyyy/MM/dd');
          $scope.exp.to_date = $filter('date')(Date.parse($scope.exp.to_date.year +'/'+  $scope.exp.to_date.month +'/'+ $scope.exp.to_date.date), 'yyyy/MM/dd');
          console.log($scope.exp);
          MainService.updateExp($scope.exp).then(function(result){
            if(result.status=="success"){
               $scope.closeModalExperience();
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
        
         $scope.checkdate = function(type){
          console.log("ADA")
          if(type == "date"){
            if($scope.pharmacisinfo.DOB.date > 31){
              $scope.pharmacisinfo.DOB.date = "";
            }
          }
          if(type=='month'){
            if($scope.pharmacisinfo.DOB.month > 12){
              $scope.pharmacisinfo.DOB.month = "";
            }
          }
          if(type=='year'){
            if($scope.pharmacisinfo.DOB.year > 2000){
              $scope.pharmacisinfo.DOB.year = "";
            }
          }
        }
   }      	
})
.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     scope: {
            model: "=ngModel"
        },
     link: function(scope, element, attrs, modelCtrl) {
       
        scope.$watch('model', function(newValue,oldValue) {
            // var arr = String(newValue).split("");
            // console.log(arr);
            // if (arr.length === 0) return;
            // if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.' )) return;
            // if (arr.length === 2 && newValue === '-.') return;
            // if (isNaN(newValue)) {
            //     scope.model = oldValue;
            // }
            if(element[0].id == "day"){
              if(newValue > 31){
                scope.model = "";
              }
            }
            if(element[0].id == "month"){
              if(newValue > 12){
                scope.model = "";
              }
            }
            if(element[0].id == "year"){
              if(newValue > 2030){
                scope.model = "";
              }
            }
        });

       element.bind('keypress', function(event) {
        if(event.keyCode === 32) {
          event.preventDefault();
        }
      });
     }
   };
})

    