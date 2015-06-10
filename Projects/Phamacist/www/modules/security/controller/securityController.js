angular.module('starter.security.controller',[
    'starter.security.login.controller',
    'starter.security.forgot.controller',
])
    .controller('securityController',function($scope, $state, SecurityService, $ionicPopup ,$ionicLoading,  $cordovaCamera, $cordovaFileTransfer, HOST_CONFIG){
        $scope.modelUser = {
            username: "",
            password: "",
            remember: false,
            token: "",
            platform: ""
        };
        var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/phUser/uploadAvatar";
        $scope.signupData = {};
        $scope.iserr = false;
        $scope.nextForm= function(signUpForm){

            if(signUpForm.$invalid){
                 // $scope.iserr = true;
                alert("Pls check form")

            }else{
                 // $scope.iserr = false;
                console.log($scope.signupData.username);
                SecurityService.checkUserName($scope.signupData.username).then(function(result){
                    if(result.status == 'have username in database'){
                        alert('have username in database pls input new username')
                    }else{
                        if($scope.signupData.user_type == "Company"){
                            $state.go('security.signupCompany');
                        }else if($scope.signupData.user_type == "Pharmacist"){
                             $state.go('security.signupPharmacist');
                        }
                        else{
                            alert("pls choose user type");
                        }
                    }
                });
            }
        }

         $scope.signup = function(form){

            if(form.$invalid){
                  // $scope.iserr = true;
                alert("Pls check form")
            }else{
                  // $scope.iserr = false;
              if ($scope.flag) {
                $scope.address = {};
                if ($scope.signupData.user_type == "Company") {
                    $scope.signupData.address_company = document.getElementById('autocomplete').value;
                }else{
                    $scope.signupData.address_pharmacist = document.getElementById('autocomplete').value;
                };
                // var geocoder = new google.maps.Geocoder();
                // geocoder.geocode({'address': $scope.address}, function (results, status) {
                //   if (status == google.maps.GeocoderStatus.OK) {
                //     $scope.signupData.latitude = results[0].geometry.location.lat();
                //     $scope.signupData.longitude = results[0].geometry.location.lng();
                //   }
                  //console.log(document.getElementById('autocomplete').value)
                  //console.log($scope.signupData.address_company);
                  $scope.signupData.user_img = $scope.image;
                  console.log($scope.signupData);
                  SecurityService.signup($scope.signupData).then(function(result){
                      if(result.status == "Success"){
                        console.log(result.data);
                          var params = {user_id:result.data};
                          $scope.uploadFile(serverUpload, $scope.image, params);
                           $scope.modelUser = {};
                              console.log(result);
                             var alertPopup = $ionicPopup.alert({
                               title: 'Alert',
                               template: 'SignUp Success'
                             });
                             alertPopup.then(function(res) { 
                                  $scope.modelUser = {};
                                   $state.go('security.login');
                                   
                             });
                      }else{
                         
                          var alertPopup = $ionicPopup.alert({
                               title: 'Alert',
                               template: result.status
                             });
                             alertPopup.then(function(res) { 
                                  $scope.modelUser = {};
                                   $state.go('security.login');
                                   
                             });
                      }
                  });
                // })
              }
            }
        }

        //upload picture
        $scope.updatePicture = function(){
          var options = {
            quality: 70,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 250,
            targetHeight: 100
          };

          $cordovaCamera.getPicture(options).then(function(imageURI) {
            $scope.image = imageURI;
            // var image = document.getElementById('avatar');
            // image.src = imageURI;
            // $scope.flag = true;
          }, function(err) {
              console.log("Error Camera: ", err);
          });
        }

        $scope.uploadFile = function(server, img, params) {
          var filePath = img.split(/[?]/)[0];
          console.log(filePath);
          var options =  new FileUploadOptions();
              options.fileKey = "file";
              options.fileName = "image.jpg";
              options.mimeType = "image/jpeg";
              options.chunkedMode = false;
              options.params = params;

          $cordovaFileTransfer.upload(server, filePath, options, true).then(function(result) {
                if (typeof params !== 'undefined') {
                  console.log("Upload success ", result);
                }
          },  function(err) {
                console.log("Upload Failed ", err);
          }, function (progress) {
          });
        }

        $scope.signupData.latitude = undefined;
        $scope.signupData.longitude = undefined;
        $scope.flag = false;

        $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
          $scope.address = {};
          if ($scope.signupData.user_type == "Company") {
            $scope.address = $scope.signupData.address_company
          }else{
            $scope.address = $scope.signupData.address_pharmacist
          };
          console.log($scope.address);
          var location = $scope.address.getPlace().geometry.location;
          $scope.signupData.latitude = location.lat();
          $scope.signupData.longitude = location.lng();
          $scope.$apply();
          if ($scope.signupData.latitude === 'undefined' || $scope.signupData.longitude === 'undefined') {
            alert("Please check your address");
          }else{
            $scope.flag = true;
          }
        });

        $scope.disableTap = function(){
          container = document.getElementsByClassName('pac-container');
          // disable ionic data tab
          angular.element(container).attr('data-tap-disabled', 'true');
          // leave input field if google-address-entry is selected
          angular.element(container).on("click", function(){
              document.getElementById('autocomplete').blur();
          });
        };
    })

  .directive("passwordVerify", function() {
    return {
        require: "ngModel",
        scope: {
            passwordVerify: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;
                
                if (scope.passwordVerify || ctrl.$viewValue) {
                   combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
                }                    
                return combined;
            }, function(value) {
                if (value) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        var origin = scope.passwordVerify;
                        if (origin !== viewValue) {
                            ctrl.$setValidity("passwordVerify", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("passwordVerify", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
  })