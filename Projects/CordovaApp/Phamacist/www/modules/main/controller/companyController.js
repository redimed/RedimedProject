angular.module('starter.main.companyController',[])

    .controller('companyController', function ($scope, $state,$q,localStorageService ,SecurityService,$ionicPopup,$ionicLoading,$ionicModal,$timeout,MainService,$filter,$location ) {

        $scope.getCompanyInfo = function(){
         MainService.getCompany($scope.userInfo.user_id).then(function(result){
              if(result.status=="Success"){
                $scope.companyinfo = result.data;
                //document.getElementById('autocomplete').value = result.data.address;
                $scope.companyinfo.contact_number = parseInt($scope.companyinfo.contact_number);
                $scope.companyinfo.phone =  parseInt($scope.companyinfo.phone);
                $scope.companyinfo.mobile =  parseInt($scope.companyinfo.mobile);
                if($location.$$path === "/app/main/userincompany"){
                  $scope.getUserByCompany();
                }
              }
          })
        }

        $scope.getUserByCompany = function(){
          console.log($scope.companyinfo.company_id)
             MainService.getUserByCompany($scope.companyinfo.company_id).then(function(result){
              if(result.status=="success"){
                $scope.dataUserIncompany = result.data;
                console.log( $scope.dataUserIncompany)
              }
          })
        }

        $scope.checkIsMain = function(){
          MainService.checkIsMain($scope.userInfo.user_id).then(function(result){
              if(result.status == "success"){
                  $scope.isMain = result.data.isMain;
              }
          })
        }


      if($scope.userInfo.user_type == "Company"){
            $scope.getCompanyInfo();
            $scope.checkIsMain();
      }
      //get company info
    
       //update company info
        $scope.updateCompanyInfo = function(){
          $ionicLoading.show({
                 template: '<i class="fa fa-refresh fa-spin"></i>'+
                  "<br />"+
                  "<span>Waiting...</span>",
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
                  });
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({'address': $scope.companyinfo.address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              $scope.companyinfo.latitude = results[0].geometry.location.lat();
              $scope.companyinfo.longitude = results[0].geometry.location.lng();
            }
            console.log($scope.companyinfo);
            MainService.updateCompanyInfo($scope.companyinfo).then(function(result){
                if(result.status=="success"){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Update Company Success'
                    })
                }
              })
            });
          }

    //modal add new user in company
     $ionicModal.fromTemplateUrl('modules/main/views/addnewUserInCompany.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModalUserInCompany = function(title,options) {
        $scope.title = title;
        $scope.options = options;
        $timeout(function(){
          $scope.modal.show();
        },200)
        
      };
      $scope.closeModalUserInCompany = function() {
     
        $scope.modal.hide();
      };
      $scope.signupData = {};
      $scope.addNewUserInCompany = function(){
          $scope.signupData.company_id = $scope.companyinfo.company_id;
          console.log($scope.signupData)
          MainService.addNewUserInCompany($scope.signupData).then(function(result){
            if(result.status=="success"){
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Inser User Success'
                })
            }else{
              $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
               title: 'Alert',
                template: result.err
                })
            }
        })
      }

      $scope.deleteUserInCompany = function(user_id){
          MainService.deleteUserInCompany(user_id).then(function(result){
            if(result.status == "success"){
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Delete User Success'
              })
            }else{
              $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: result.err
              })
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

        $scope.$watch('companyinfo.address', function(newval, old) {
          if ($scope.companyinfo && $scope.companyinfo.address && newval) {
              $scope.change();
          }
        })

        $scope.change = function() {
          var string = $scope.companyinfo.address;
          var arr = string.split(", ");
          var trim = _.map(arr, _.trim);
          console.log(trim);
          if (trim.length == 4) {
              switch (trim[2]) {
                  case "Northern Territory":
                      $scope.companyinfo.state = "NT";
                      break;
                  case "Queensland":
                      $scope.companyinfo.state = "QLD";
                      break;
                  case "Victoria":
                      $scope.companyinfo.state = "VIC";
                      break;
                  case "New South Wales":
                      $scope.companyinfo.state = "NSW";
                      break;
                  case "South Australia":
                      $scope.companyinfo.state = "SA";
                      break;
                  case "Western Australia":
                      $scope.companyinfo.state = "WA";
                      break;
                  case "Tasmania":
                      $scope.companyinfo.state = "TAS";
                      break;
                  default:
                      break;
              }
            $scope.companyinfo.surburb = trim[1];
            $scope.companyinfo.country = trim[3];
          }else{
            $scope.companyinfo.surburb = '';
            $scope.companyinfo.country = 'Australia';
            $scope.companyinfo.state = '';
          }
        }
})

.directive('googleplace', function() {
    return {
        link: function(scope, element, attrs) {
                    var options = {
                        types: [],
                        componentRestrictions: {country: 'in'}
                    };
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
                    element.blur(function(e) {
                        window.setTimeout(function() {
                            angular.element(element).trigger('input');
                        }, 0);
                    });
                }

    }
});

    