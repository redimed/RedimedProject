angular.module('starter.main.shopController',["isteven-multi-select", 'ngAutocomplete'])

    .controller('shopController', function ($scope, $state, $q, localStorageService ,SecurityService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $stateParams, $location) {
            
            $scope.shopInfo = {};
            $scope.title = $stateParams.title;
            $scope.getCompanyInfo = function(){
                MainService.getCompany($scope.userInfo.user_id).then(function(result){
                  if(result.status=="Success"){
                    $scope.companyinfo = result.data;
                    $scope.companyinfo.phone =  parseInt($scope.companyinfo.phone);
                    $scope.companyinfo.mobile =  parseInt($scope.companyinfo.mobile);
                    $scope.selectShopByCompany();
                    }else{
                        var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'Error'
                      });
                    }
                })
            }
            $scope.getCompanyInfo();

            $scope.addNewShop = function(){
              $scope.title = 'Add New Shop';
              $state.go('app.main.addNewShop', {title:$scope.title});
            }

            $scope.editShop = function(shop){
              $scope.title = "Edit Shop";
              MainService.editShop = shop;
              $state.go('app.main.editShop', {title:$scope.title});
            }
            console.log($location.$$path);
            if($location.$$path === "/app/main/editShop/Edit Shop"){
              $scope.shopInfo = MainService.editShop;
            }

             //modal add new shops 
              // $ionicModal.fromTemplateUrl('modules/main/views/addnewShop.html', {
              //   scope: $scope,
              //   animation: 'slide-in-up'
              // }).then(function(modal) {
              //   $scope.modalShop = modal;
              // });
              // $scope.openModalShop = function(title,options,data) {
              //   $scope.title = title;
              //   $scope.options= options;

              //   if(typeof data!== 'undefined'){
              //       $scope.shopInfo= data;
              //       console.log($scope.shopInfo);
              //   }
              //   $timeout(function(){
              //     $scope.modalShop.show();
              //   },200)
                
              // };
              // $scope.closeModalShop = function() {
              //   $scope.modalShop.hide();
              //   $scope.shopInfo = {};
              // };

            //create new shop 
            $scope.createNewShop = function(){
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
                geocoder.geocode({ 'address': $scope.shopInfo.address }, function (results, status) {
                  console.log(google.maps.GeocoderStatus.OK);
                  if (status == google.maps.GeocoderStatus.OK) {
                    $scope.shopInfo.latitude = results[0].geometry.location.lat();
                    $scope.shopInfo.longitude = results[0].geometry.location.lng();
                    console.log($scope.shopInfo.latitude);
                    if ($scope.shopInfo.latitude === 'undefined' || $scope.shopInfo.longitude === 'undefined') {
                      alert("Pls check address!");
                    }else{
                    MainService.insertCompanyShop($scope.shopInfo, $scope.companyinfo.company_id).then(function(result){
                    if(result.status=="success"){
                        $ionicLoading.hide();     
                        var alertPopup = $ionicPopup.alert({
                              title: 'Alert',
                              template: 'Add New Shop Success'
                            });
                           alertPopup.then(function(res) { 
                                  $scope.shopInfo= {};
                                  $state.go('app.main.shop');
                                  $scope.selectShopByCompany();
                                  //$scope.blinds();
                           });
                    }else{
                      // $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Error'
                      });
                    }
                  })
                  }
                }
                else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Error'
                  });
                }
              });
            }

            // select  shop by company
            $scope.selectShopByCompany = function(){
               $ionicLoading.show({
                       template: '<i class="fa fa-refresh fa-spin"></i>'+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                        });
              MainService.getCompanyShopById($scope.companyinfo.company_id).then(function(result){
                  if(result.status=="success"){
                    $ionicLoading.hide();
                    $scope.Shops =  result.data; 
                  }else{
                    $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Error'
                        });
                  }
              })
            }

            //delete shop company
            $scope.delelteShopCompany = function(shop_id){
                 var confirmPopup = $ionicPopup.confirm({
                   title: 'confirm Delete',
                   template: 'Are you sure you want delete Shop'
                 });
                 confirmPopup.then(function(res) {
                   if(res) {
                         MainService.delelteShopCompany(shop_id).then(function(result){
                          if(result.status=="success"){
                            //$scope.deletePostShop(shop_id);
                              var alertPopup = $ionicPopup.alert({
                                title: 'Alert',
                                template: 'Delete Shop Success'
                              });
                             alertPopup.then(function(res) { 
                                $scope.selectShopByCompany();
                             });
                          }
                      })
                   } else {
                          console.log('You are not sure');
                   }
                 });
            }

            $scope.deletePostShop = function(shop_id){
              MainService.deletePostShop(shop_id).then(function(result){
                if (result.status == "success") {
                  $scope.delelteShopCompany(shop_id);
                }
                else{
                  console.log("Error: ", result);
                }
              })
            }

            $scope.updateShopCompany = function(){
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': $scope.shopInfo.address }, function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    $scope.shopInfo.latitude = results[0].geometry.location.lat();
                    $scope.shopInfo.longitude = results[0].geometry.location.lng();
                    console.log($scope.shopInfo.longitude);
                  if ($scope.shopInfo.latitude === 'undefined' || $scope.shopInfo.longitude === 'undefined') {
                    alert("Pls check address!");
                  }else{
                  MainService.updateShopCompany($scope.shopInfo).then(function(result){
                  if(result.status=="success"){
                       $scope.closeModalShop();
                       var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Update Shop Success'
                        });
                       alertPopup.then(function(res) { 
                              $scope.selectShopByCompany();
                              $scope.closeModalShop()
                       });
                 }
                })
              }
              }else{
                  $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                              title: 'Alert',
                              template: 'Error'
                            });
              }
            })
          }

            // $scope.localLang = {
            //     selectAll       : "Tick all",
            //     selectNone      : "Tick none",
            //     reset           : "Undo all",
            //     search          : "Type here to search...",
            //     nothingSelected : "Nothing is selected"         //default-label is deprecated and replaced with this.
            // }
            
            $scope.unique = function(origArr) {
              $scope.modernShop = [];
              $scope.found = false;
              for (var i = 0; i < origArr.length; i++) {
                for (var j = 0; j < $scope.modernShop.length; j++) {
                  if (origArr[i].shop_id === $scope.modernShop[j].id) {
                    $scope.found = true;
                    break;
                  }
                }
                if (!$scope.found) {
                  $scope.modernShop.push(
                  {
                    name: origArr[i].shop_name,
                    id: origArr[i].shop_id,
                    ticked: false
                  });
                }
              }
              console.log($scope.modernShop);
              return $scope.modernShop;
            }

            //open Modal New Post
            $ionicModal.fromTemplateUrl('modules/main/views/addNewPosts.html', {
              scope: $scope,
              animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.modalAddNewPost = modal;
            });
            $scope.post = {
                isweekend_shift:0,
                isAccommodation:0,
                isTravel:0
            };

            $scope.openModalPost = function(title,options) {
                $scope.titlePost = title;
                $scope.optionsPost = options;
                $timeout(function(){
                $scope.modalAddNewPost.show();
                $scope.unique($scope.Shops);
                // angular.forEach($scope.Shops, function(item) {
                //     $scope.modernShop.push(
                //       { 
                //         name: item.shop_name,
                //         id: item.shop_id,
                //         ticked: false
                //       });
                // })
              },200)
            } 

            $scope.closeModalPost = function() {
              $scope.modalAddNewPost.hide();
            };

            //add new posts 
            $scope.addNewPost = function(outputShop){
                   // $ionicLoading.show({
                   //     template: '<i class="fa fa-refresh fa-spin"></i>'+
                   //      "<br />"+
                   //      "<span>Waiting...</span>",
                   //      animation: 'fade-in',
                   //      showBackdrop: true,
                   //      maxWidth: 200,
                   //      showDelay: 0
                   //      });
                console.log(outputShop);
                if (typeof outputShop === 'undefined'){
                  // var selO = document.getElementsByName("select-custom-19")[0];
                  // var selValues = [];
                  //     for(i=0; i < selO.length; i++){
                  //         if(selO.options[i].selected){
                  //             selValues.push(selO.options[i].value);
                  //         }
                  //     }
                  //     console.log(selValues);
                  alert("Please choose Shop");
                }else{
                  $scope.post.company_id = $scope.companyinfo.company_id;
                  $scope.itemShop_id = [];
                  for (var i = 0; i < outputShop.length; i++) {
                    $scope.itemShop_id.push(outputShop[i].id);
                  };

                  console.log($scope.itemShop_id);
                  console.log($scope.post);

                  MainService.insertNewPost($scope.post, $scope.itemShop_id).then(function(result){
                      if(result.status=="success"){
                        $ionicLoading.hide();
                        $scope.closeModalPost();
                        $scope.post={
                          isweekend_shift:0,
                          isAccommodation:0,
                          isTravel:0
                        };
                      }
                  })
                }
            };

            $scope.getPostForShop = function(shop_id){
              $state.go('app.main.postShop', {shopId:shop_id});
            }

            $scope.getPostForShopId = function(){
              $scope.shop_id = $stateParams.shopId;
              MainService.getPostForShopId($scope.shop_id).then(function(result){
                if (result.status == "success") {
                  $scope.postShop = result.data;
                };
              })
            }
            $scope.getPostForShopId();   

            $scope.getDetailPost = function(post){
              MainService.detailPosts.postShop = post;
              $state.go('app.main.postDetailShop');
            }

            $scope.countMemPost = function(){
              if ($scope.postDetail !== 'undefined') {
              $scope.postDetail = MainService.detailPosts.postShop;
                MainService.countMember($scope.postDetail.post_id).then(function(result){
                  if (result.status == "success") {
                    $scope.mem = result.data;
                    console.log($scope.mem);
                  };
                })
              }
            }

            if($location.$$path === "/app/main/postDetailShops"){
              $scope.countMemPost();
            }

            // $scope.shopInfo.latitude = undefined;
            // $scope.shopInfo.longitude = undefined;
            // $scope.flag = false;

            // $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
            //   var location = $scope.shopInfo.address.getPlace().geometry.location;
            //   $scope.shopInfo.latitude = location.lat();
            //   $scope.shopInfo.longitude = location.lng();
            //   $scope.$apply();
            //   if ($scope.shopInfo.latitude === 'undefined' || $scope.shopInfo.longitude === 'undefined') {
            //     alert("Please check your address");
            //   }else{
            //     $scope.flag = true;
            //   }
            // });

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