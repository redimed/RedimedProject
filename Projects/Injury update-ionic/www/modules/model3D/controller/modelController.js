angular.module('starter.model.controller',[])
	.controller('modelController', function($scope, $window, $ionicModal, $cordovaCamera, InjuryServices,  $state, $stateParams){

        $scope.parts = [];
        $scope.desItem = [];
        $scope.gender = $stateParams.linkGender;
        $scope.w = $window.innerWidth;

        var sprin = $('.spritespin').spritespin({
          source: SpriteSpin.sourceArray('img/model/mobile/'+ $scope.gender + '/{frame}.png', { frame: [1,4], digits: 1}),
          width: $window.innerWidth,
          height: $window.innerHeight,
          sense: -1,
          animate: false,
          reverse: true,
          mods: ['drag', '360'],
          behavior: 'drag',
          module: null,
          renderer: 'canvas',
        });

        var api = sprin.spritespin("api");
        sprin.bind("onLoad", function(){
              var data = api.data;
              data.stage.prepend($(".details .detail")); // add current details
              data.stage.find(".detail").hide();         // hide current details
        }).bind("onFrame", function(){
              var data = api.data;
              data.stage.find(".detail:visible").stop(false).fadeOut();
              data.stage.find(".detail.detail-" + data.frame).stop(false).fadeIn();
        });

        function getMousePos(canvas, evt) {
          var rect = canvas.getBoundingClientRect();
          return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
          };
        }

        var canvas = document.getElementById('spritespin-canvas');
        var ctx = canvas.getContext('2d');
        canvas.addEventListener('mousedown', function(evt) {
          var mousePos = getMousePos(canvas, evt);

          var f_body = [
              {'body':head}, {'body':chest}, {'body':belly}, {'body':groin},
              {'body':l_arm}, {'body':l_elbow}, {'body':l_hand},
              {'body':r_arm}, {'body': r_elbow}, {'body':r_hand},
              {'body': l_calf}, {'body':r_calf}, {'body':l_shin}, {'body': r_shin},
              {'body': l_foot}, {'body': r_foot}
          ];

          var b_body = [
              {'body':b_head}, {'body':r_back}, {'body':l_back},
              {'body':bl_arm}, {'body':bl_elbow}, {'body':bl_hand},
              {'body':br_arm}, {'body':br_elbow}, {'body':br_hand},
              {'body':bl_calf}, {'body':br_calf}, {'body':bl_shin}, {'body':br_shin},
              {'body':bl_foot}, {'body':br_foot}, {'body':l_back}, {'body':r_back},, {'body': bottom}
          ];

          var r_body = [
              {'body':r_head}, {'body': rr_arm}, {'body': rr_elbow}, {'body': rr_hand},
              {'body':rr_calf}, {'body': rr_shin}, {'body': rr_foot}
          ];

          var l_body = [
              {'body':l_head}, {'body': ll_arm}, {'body': ll_elbow}, {'body': ll_hand},
              {'body':ll_calf}, {'body': ll_shin}, {'body': ll_foot}
          ];

          $scope.temp = [];

          if (api.data.frame == 0) {
            checkFrame(f_body);
          }
          if (api.data.frame == 3) {
            checkFrame(r_body);
          }
          if (api.data.frame == 2) {
            checkFrame(b_body);
          }
          if (api.data.frame == 1) {
            checkFrame(l_body);
          }
          
          function checkFrame(body){
                body.forEach(function(data){
                    if (mousePos.x >= data.body.x1 && mousePos.x >= data.body.x4 &&
                        mousePos.x <= data.body.x2 && mousePos.x <= data.body.x3 &&
                        mousePos.y >= data.body.y1 && mousePos.y >= data.body.y2 &&
                        mousePos.y <= data.body.y3 && mousePos.y <= data.body.y4) {
                      $scope.temp.push({
                          'body'  : data,
                          'count' : mousePos.x - data.body.x1
                        });
                      }
                  });
                }
                if(typeof $scope.temp !== 'undefined'){
                  $scope.temp = _.min($scope.temp, 'count');
                  $scope.showModal($scope.temp.body.body.name);
                  //draw($scope.temp.body.body, ctx);
                  //$scope.parts.push($scope.temp.body.body.name);
                }
          }, false);

          // function draw(data, ctx){
          //   var width = 0;
          //   var height = 0;
          //   var resultW = 0;
          //   var resultH = 0;

          //   ctx.beginPath();
          //   ctx.fillStyle = "rgba(32, 45, 21, 0.3)";

          //   width = $window.innerWidth;
          //   height = (data.y3 - data.y2);

          //   resultW = ((width - 360)/2) - (data.x2/2);
          //   resultH = (+height + +data.y2);

          //   ctx.fillRect(resultW + (+data.x2), resultH, data.x2 - 55, height);
            // var a1 = data.x1 - (data.y4 - data.y1);
            // var c1 = (+data.x2) + (+data.y4 - data.y1);
            // ctx.moveTo(cx, cy);
            // ctx.quadraticCurveTo(a1, data.y2, data.x1, data.y4);

            // ctx.moveTo(cx, cy);
            // ctx.quadraticCurveTo(data.x1, data.y1, data.x2, data.y2);

            // ctx.moveTo(data.x2, data.y2);
            // ctx.quadraticCurveTo(c1, data.y1, data.x3, data.y3);

            // ctx.moveTo(data.x1, data.y4);
            // ctx.quadraticCurveTo(data.x1, data.y4, data.x3, data.y4);

            // ctx.moveTo(+data.x1, +data.y1);
            // ctx.lineTo(+data.x2, +data.y2);

            // ctx.moveTo(+data.x2, +data.y2);
            // ctx.lineTo(+data.x3, +data.y3);

            // ctx.moveTo(+data.x4, +data.y4);
            // ctx.lineTo(+data.x1, +data.y1);

            // ctx.moveTo(+data.x3, +data.y3);
            // ctx.lineTo(+data.x4, +data.y4);

            // ctx.closePath();
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = 'blue';
          //   ctx.stroke();
          // }

          $scope.items = {};
          $scope.tempItem = [];
          $scope.linkName = {};

          $ionicModal.fromTemplateUrl('modules/model3D/views/modal/my-model.html', function(item) {
            $scope.ModelControllerModal = item;
          },{
            scope: $scope,
            animation: 'slide-in-up'
          });

          $scope.showModal = function(item){
            $scope.linkName = item;
            if ($scope.linkName) {
              $scope.tempItem = $scope.items[$scope.linkName];
            }
            $scope.ModelControllerModal.show();
          };
          $scope.closeModal = function(des) {
            $scope.ModelControllerModal.hide();
          };

          $scope.takePicture = function(typeCam){
            $scope.itemName = $scope.linkName;
            var options = {};
            if (typeCam == "CAMERA") {
              options = {
                quality : 70,
                destinationType : Camera.DestinationType.FILE_URI,
                popoverOptions: CameraPopoverOptions,
                sourceType: navigator.camera.PictureSourceType.CAMERA,
                targetWidth: 250,
                targetHeight: 100,
                //allowEdit: false,
                //saveToPhotoAlbum: true
              };
            }
                
            if (typeCam == "PHOTOLIBRARY"){
              options = {
                quality: 70,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: 250,
                targetHeight: 100
              };
            }

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                    if (!$scope.items[$scope.itemName]) {
                      $scope.items[$scope.itemName] = [];
                    }
                    $scope.items[$scope.itemName].push({
                      'sourceImg'  : imageURI,
                      'des'   : ''
                    });
                    if ($scope.linkName) {
                      $scope.tempItem = $scope.items[$scope.linkName];
                    }
                }, function(err) {
                  console.log("Error Camera Model3D: " + err);
                });
          };

          $scope.removeItem = function(part){
            // $scope.parseObj = JSON.parse(part);
            // for (var i = 0; i < $scope.tempItem.length; i++) {
            //   if ($scope.tempItem[i].sourceImg === $scope.parseObj.sourceImg) {
            //     $scope.tempItem.splice(i, 1);
            //     return;
            //   }
            // }
            $scope.tempItem.splice($scope.tempItem.indexOf(part), 1);
          };

          $scope.nextform = function(){
            InjuryServices.getInjuryInfo.Model = $scope.items;
            $state.go("app.injury.desInjurySuccess");
          };

          //đầu
          var head = {
            x1: '156', y1: '88',
            x2: '204', y2: '88',
            x3: '204', y3: '140',
            x4: '156', y4: '140',
            'name':'head',
            'frame' : 0
          };

          // dau sau
          var b_head = {
            x1: '156', y1: '88',
            x2: '204', y2: '88',
            x3: '204', y3: '140',
            x4: '156', y4: '140',
            'name':'b_head',
            'frame' : 2
          };

          var r_head = {
            x1: '156', y1: '88',
            x2: '204', y2: '88',
            x3: '204', y3: '140',
            x4: '156', y4: '140',
            'name':'r_head',
            'frame' : 3
          };

          var l_head = {
            x1: '170', y1: '90',
            x2: '220', y2: '90',
            x3: '220', y3: '140',
            x4: '170', y4: '140',
            'name':'l_head',
            'frame' : 1
          };

        //left
        //tay
          var l_arm = {
            x1:'218', y1:'153',
            x2:'245', y2:'153',
            x3:'245', y3:'190',
            x4:'218', y4:'190',
            'name':'l_arm',
            'frame' : 0
          };

        //back left arm
          var br_arm = {
            x1:'218', y1:'153',
            x2:'245', y2:'153',
            x3:'245', y3:'190',
            x4:'218', y4:'190',
            'name':'br_arm',
            'frame': 2
          };

        //right arm
          var r_arm = {
            x1: '115', y1: '152',
            x2: '144', y2: '152',
            x3: '144', y3: '190',
            x4: '115', y4: '190',
            'name':'r_arm',
            'frame': 0
          };
        //back right arm
          var bl_arm = {
            x1: '115', y1: '152',
            x2: '144', y2: '152',
            x3: '144', y3: '190',
            x4: '115', y4: '190',
            'name':'bl_arm',
            'frame': 2
          };
        //khủy tay trai
          var l_elbow = {
            x1:'235', y1:'192',
            x2:'275', y2:'192',
            x3:'275', y3:'210',
            x4:'235', y4:'210',
            'name': 'l_elbow',
            'frame':0
          };
        //khuy tay trai sau
          var br_elbow = {
            x1:'235', y1:'192',
            x2:'275', y2:'192',
            x3:'275', y3:'210',
            x4:'235', y4:'210',
            'name': 'br_elbow',
            'frame':2
          };
        //khuy tay phai
          var r_elbow ={
            x1: '90', y1: '190',
            x2: '144', y2: '190',
            x3: '144', y3: '215',
            x4: '90', y4: '215',
            'name': 'r_elbow',
            'frame':0
          };
         //khuy tay phai sau
          var bl_elbow = {
            x1: '90', y1: '190',
            x2: '144', y2: '190',
            x3: '144', y3: '215',
            x4: '90', y4: '215',
            'name': 'bl_elbow',
            'frame':2
          };
        //bàn tay trai
          var l_hand = {
            x1:'260', y1:'215',
            x2:'285', y2:'215',
            x3:'285', y3:'245',
            x4:'260', y4:'245',
            'name':'l_hand',
            'frame':0
          };
        //ban tay trai sau
          var br_hand = {
            x1:'260', y1:'215',
            x2:'285', y2:'215',
            x3:'285', y3:'245',
            x4:'260', y4:'245',
            'name':'br_hand',
            'frame':2
          };
        //ban tay phai
          var r_hand = {
            x1: '77', y1: '215',
            x2: '105', y2: '215',
            x3: '105', y3: '245',
            x4: '77', y4: '245',
            'name':'r_hand',
            'frame':0
          };
        //ban tay phai sau
          var bl_hand = {
            x1: '77', y1: '215',
            x2: '105', y2: '215',
            x3: '105', y3: '245',
            x4: '77', y4: '245',
            'name':'bl_hand',
            'frame':2
          };

          var chest = {
            x1: '145', y1: '150',
            x2: '214', y2: '150',
            x3: '214', y3: '191',
            x4: '145', y4: '191',
            'name':'chest',
            'frame' : 0
          };
        //bụng
          var belly = {
            x1: '146', y1: '200',
            x2: '215', y2: '200',
            x3: '215', y3: '234',
            x4: '146', y4: '234',
            'name':'belly',
            'frame':0
          };
        //háng
          var groin = {
            x1: '145', y1: '240',
            x2: '212', y2: '240',
            x3: '212', y3: '267',
            x4: '145', y4: '267',
            'name':'groin',
            'frame':0
          };
        //bắp chân trai
          var l_calf = {
            x1:'185', y1:'270',
            x2:'220', y2:'270',
            x3:'220', y3:'315',
            x4:'185', y4:'315',
            'name':'l_calf',
            'frame':0
          };
        //bap chan trai sau
          var br_calf = {
            x1:'185', y1:'270',
            x2:'220', y2:'270',
            x3:'220', y3:'315',
            x4:'185', y4:'315',
            'name':'br_calf',
             'frame':2
          };
        // bap chan phai
          var r_calf = {
            x1: '141', y1: '270',
            x2: '172', y2: '270',
            x3: '172', y3: '314',
            x4: '141', y4: '314',
            'name':'r_calf',
            'frame':0
          };
        //bap chan phai sau
          var bl_calf = {
            x1: '141', y1: '270',
            x2: '172', y2: '270',
            x3: '172', y3: '314',
            x4: '141', y4: '314',
            'name':'bl_calf',
            'frame':2
          };
        //ống chân trai
          var l_shin = {
            x1:'200', y1:'320',
            x2:'225', y2:'320',
            x3:'225', y3:'376',
            x4:'200', y4:'376',
            'name':'l_shin',
            'frame':0
          };
        //ong chan trai sau
          var br_shin = {
            x1:'200', y1:'320',
            x2:'225', y2:'320',
            x3:'225', y3:'376',
            x4:'200', y4:'376',
            'name':'br_shin',
            'frame':2
          };
        //ong chan phai
          var r_shin = {
            x1: '136', y1: '320',
            x2: '162', y2: '320',
            x3: '162', y3: '376',
            x4: '136', y4: '376',
            'name':'r_shin',
            'frame':0
          };
        //ong chan phai sau
          var bl_shin = {
            x1: '136', y1: '320',
            x2: '162', y2: '320',
            x3: '162', y3: '376',
            x4: '136', y4: '376',
            'name':'bl_shin',
            'frame':2
          };
        //bàn chân trai
          var l_foot = {
            x1:'200', y1:'380',
            x2:'230', y2:'380',
            x3:'230', y3:'400',
            x4:'200', y4:'400',
            'name':'l_foot',
            'frame':0
          };
        //ban chan trai sau
          var br_foot = {
            x1:'200', y1:'380',
            x2:'230', y2:'380',
            x3:'230', y3:'400',
            x4:'200', y4:'400',
            'name':'br_foot',
            'frame':2
          };
        //ban chan phai
          var r_foot = {
            x1: '135', y1: '382',
            x2: '162', y2: '382',
            x3: '162', y3: '405',
            x4: '135', y4: '405',
            'name':'r_foot',
            'frame':0
          };
        //ban chan phai sau
          var bl_foot = {
            x1: '135', y1: '382',
            x2: '162', y2: '382',
            x3: '162', y3: '405',
            x4: '135', y4: '405',
            'name':'bl_foot',
            'frame':2
          };
        //lung trai
          var l_back = {
            x1:'147', y1:'145',
            x2:'178', y2:'145',
            x3:'178', y3:'215',
            x4:'147', y4:'215',
            'name':'l_back',
            'frame':2
          };
        //lung phai
          var r_back = {
            x1:'185', y1:'145',
            x2:'215', y2:'145',
            x3:'215', y3:'215',
            x4:'185', y4:'215',
            'name':'r_back',
            'frame':2
          };
        //mong
          var bottom = {
            x1:'145', y1:'222',
            x2:'215', y2:'222',
            x3:'215', y3:'257',
            x4:'145', y4:'257',
            'name':'bottom',
            'frame':2
          };

          var rr_arm = {
            x1:'148', y1:'155',
            x2:'175', y2:'155',
            x3:'175', y3:'190',
            x4:'148', y4:'190',
            'name':'rr_arm',
            'frame':3
          };

          var rr_elbow = {
            x1:'150', y1:'195',
            x2:'200', y2:'195',
            x3:'200', y3:'215',
            x4:'150', y4:'215',
            'name':'rr_elbow',
            'frame':3
          };

          var rr_hand = {
            x1:'190', y1:'205',
            x2:'222', y2:'205',
            x3:'222', y3:'245',
            x4:'190', y4:'245',
            'name':'rr_hand',
            'frame':3
          };

          var rr_calf = {
            x1:'135', y1:'222',
            x2:'185', y2:'222',
            x3:'185', y3:'305',
            x4:'135', y4:'305',
            'name':'rr_calf',
            'frame':3
          };

          var rr_shin = {
            x1:'135', y1:'315',
            x2:'188', y2:'315',
            x3:'188', y3:'375',
            x4:'135', y4:'375',
            'name':'rr_shin',
            'frame':3
          };

          var rr_foot = {
            x1:'135', y1:'385',
            x2:'200', y2:'385',
            x3:'200', y3:'400',
            x4:'135', y4:'400',
            'name':'rr_foot',
            'frame':3
          };

          var ll_arm = {
            x1:'185', y1:'160',
            x2:'210', y2:'160',
            x3:'210', y3:'190',
            x4:'185', y4:'190',
            'name':'ll_arm',
            'frame':1
          };

          var ll_elbow = {
            x1:'170', y1:'195',
            x2:'210', y2:'195',
            x3:'210', y3:'215',
            x4:'170', y4:'215',
            'name':'ll_elbow',
            'frame':1
          };

          var ll_hand = {
            x1:'130', y1:'215',
            x2:'170', y2:'215',
            x3:'170', y3:'240',
            x4:'130', y4:'240',
            'name':'ll_hand',
            'frame':1
          };

          var ll_calf = {
            x1:'175', y1:'225',
            x2:'222', y2:'225',
            x3:'222', y3:'300',
            x4:'175', y4:'300',
            'name':'ll_calf',
            'frame':1
          };

          var ll_shin = {
            x1:'180', y1:'315',
            x2:'220', y2:'315',
            x3:'220', y3:'380',
            x4:'180', y4:'380',
            'name':'ll_shin',
            'frame':1
          };

          var ll_foot = {
            x1:'165', y1:'380',
            x2:'222', y2:'380',
            x3:'222', y3:'400',
            x4:'165', y4:'400',
            'name':'ll_foot',
            'frame':1
          };
  });