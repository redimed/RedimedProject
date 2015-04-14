angular.module('starter.model.controller',[])
	.controller('modelController', function($scope, $window, $ionicModal, $cordovaCamera, InjuryServices,  $state){

        $scope.parts = [];
        $scope.desItem = [];
        
        var sprin = $('.spritespin').spritespin({
          source: SpriteSpin.sourceArray('img/model/{frame}.png', { frame: [1,4], digits: 1 }),
          width: $window.innerWidth,
          height: $window.innerHeight,
          sense: 1,
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
              {'body':bl_foot}, {'body':br_foot}
          ];

          $scope.temp = [];

          if (api.data.frame == 0) {
            checkFrame(f_body);
          };
          if (api.data.frame == 2) {
            checkFrame(b_body);
          };
          
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
                  // draw($scope.temp.body.body, ctx, mousePos);
                  // $scope.parts.push($scope.temp.body.body.name);
                }
          }, false);

          // function getDistance(evt) {
          //   var startingTop = 40;
          //   var startingLeft = 0;
          //   var math = Math.abs(((startingTop - evt.clientY) + (startingLeft - evt.clientX))) + 'px';
          //   return {
          //       x : Math.abs(startingLeft - evt.clientX),
          //       y : Math.abs(startingTop - evt.clientY)
          //   };
          // }
     
          // function draw(data, ctx, dis){
          //     var r_a = 0.3; 
              // var img = new Image();
              // img.src = "img/model/01.png"; 
              // var w = data.x2 - data.x1;
              // var h = data.y3 - data.y2;
              // var cy = dis.y - (h/2);
              // var cx =  dis.x - (w/2);
              // ctx.fillRect(cx, cy, w, h);
              // ctx.stroke();
              // ctx.drawImage(img,680,105,60,80);
              // console.log(img);

          //   ctx.beginPath();
          //   var a1 = data.x1 - (data.y4 - data.y1);
          //   var c1 = (+data.x2) + (+data.y4 - data.y1);
          //   ctx.moveTo(data.x1, data.y1);
          //   ctx.quadraticCurveTo(a1, data.y2, data.x1, data.y4);

          //   ctx.moveTo(data.x1, data.y1);
          //   ctx.quadraticCurveTo(data.x1, data.y1, data.x2, data.y2);

          //   ctx.moveTo(data.x2, data.y2);
          //   ctx.quadraticCurveTo(c1, data.y1, data.x3, data.y3);

          //   ctx.moveTo(data.x1, data.y4);
          //   ctx.quadraticCurveTo(data.x1, data.y4, data.x3, data.y4);
          //   ctx.closePath();
          //   ctx.lineWidth = 1;
          //   ctx.strokeStyle = 'blue';
          //   ctx.stroke();
          // }

          // canvas.addEventListener('mousemove', function(evt) {
          //   var mousePos = getMousePos(canvas, evt);
          //   var message = mousePos.x + ' / ' + mousePos.y;
          //   var div = document.getElementById("textDIV");
          //   div.textContent = message;
          // });

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
            };
            $scope.ModelControllerModal.show();
          };     
          $scope.closeModal = function(des) {
            $scope.ModelControllerModal.hide();
          };

          $scope.takePicture = function(typeCam){
            $scope.itemName = $scope.linkName;
            if (typeCam == "CAMERA") {
              var options = {
                quality: 70,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
              };
            };
            if (typeCam == "PHOTOLIBRARY"){
              var options = {
                quality: 70,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: 200,
                targetHeight: 100
              };
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
                if (!$scope.items[$scope.itemName]) {
                  $scope.items[$scope.itemName] = [];
                };
                $scope.items[$scope.itemName].push({
                  'sourceImg'  : imageURI,
                  'des'   : ''
                });
                if ($scope.linkName) {
                  $scope.tempItem = $scope.items[$scope.linkName];
                };
            }, function(err) {
              console.log("Error Camera Model3D: " + err);
            });
          }

          $scope.removeItem = function(part){
            $scope.parseObj = JSON.parse(part);
            
            for (var i = 0; i < $scope.tempItem.length; i++) {
              if ($scope.tempItem[i].name === $scope.parseObj.name) {
                $scope.tempItem.splice(i, 1);
                return;
              }
            }
          }

          $scope.nextform = function(){
            InjuryServices.getInjuryInfo.Model = $scope.items;
            $state.go("app.injury.desInjurySuccess");
          }

	 	     //đầu
          var head = {
            x1:'480', y1:'100', 
            x2:'510', y2:'100', 
            x3:'510', y3:'145', 
            x4:'480', y4:'145',
            'name':'head',
            'frame' : 0
          };

        // dau sau
          var b_head = {
            x1:'460', y1:'88', 
            x2:'515', y2:'88', 
            x3:'515', y3:'139', 
            x4:'460', y4:'139',
            'name':'b_head',
            'frame' : 2
          };

        //left
        //tay
          var l_arm = {
            x1:'421', y1:'145', 
            x2:'515', y2:'145', 
            x3:'515', y3:'232', 
            x4:'421', y4:'232',
            'name':'l_arm',
            'frame' : 0
          };

        // var l_arm = {
        //   x1:'440', y1:'165', 
        //   x2:'455', y2:'180', 
        //   x3:'420', y3:'215', 
        //   x4:'415', y4:'205',
        //   'name':'l_arm',
        //   'frame' : 0
        // };

        //back left arm
          var bl_arm = {
            x1:'421', y1:'145', 
            x2:'515', y2:'145', 
            x3:'515', y3:'232', 
            x4:'421', y4:'232',
            'name':'bl_arm',
            'frame': 2
          };

        //right arm
          var r_arm ={
            x1:'525', y1:'144', 
            x2:'559', y2:'144', 
            x3:'559', y3:'234', 
            x4:'525', y4:'234',
            'name':'r_arm',
            'frame': 0
          };
        //back right arm
          var br_arm ={
            x1:'525', y1:'144', 
            x2:'559', y2:'144', 
            x3:'559', y3:'234', 
            x4:'525', y4:'234',
            'name':'br_arm',
            'frame': 2
          };
        //khủy tay trai
          var l_elbow = {
            x1:'559', y1:'193', 
            x2:'606', y2:'193', 
            x3:'606', y3:'228', 
            x4:'559', y4:'228',
            'name': 'l_elbow',
            'frame':0
          };
        //khuy tay trai sau
          var bl_elbow = {
            x1:'559', y1:'193', 
            x2:'606', y2:'193', 
            x3:'606', y3:'228', 
            x4:'559', y4:'228',
            'name': 'bl_elbow',
            'frame':2
          };
        //khuy tay phai
          var r_elbow ={
            x1:'317', y1:'197', 
            x2:'419', y2:'197', 
            x3:'419', y3:'231', 
            x4:'317', y4:'231',
            'name': 'r_elbow',
            'frame':0
          }
         //khuy tay phai sau
          var br_elbow = {
            x1:'317', y1:'197', 
            x2:'419', y2:'197', 
            x3:'419', y3:'231', 
            x4:'317', y4:'231',
            'name': 'br_elbow',
            'frame':2
          };
        //bàn tay trai
          var l_hand = {
            x1:'368', y1:'233', 
            x2:'407', y2:'233', 
            x3:'407', y3:'266', 
            x4:'368', y4:'266',
            'name':'l_hand',
            'frame':0
          };
        //ban tay trai sau
          var bl_hand = {
            x1:'368', y1:'233', 
            x2:'407', y2:'233', 
            x3:'407', y3:'266', 
            x4:'368', y4:'266',
            'name':'bl_hand',
            'frame':2
          };
        //ban tay phai
          var r_hand = {
            x1:'573', y1:'236', 
            x2:'615', y2:'236', 
            x3:'615', y3:'267', 
            x4:'573', y4:'267',
            'name':'r_hand',
            'frame':0
          };
        //ban tay phai sau
          var br_hand = {
            x1:'573', y1:'236', 
            x2:'615', y2:'236', 
            x3:'615', y3:'267', 
            x4:'573', y4:'267',
            'name':'br_hand',
            'frame':2
          };
        //ngực
        // var chest = {
        //   x1:'460', y1:'157', 
        //   x2:'521', y2:'157', 
        //   x3:'521', y3:'208', 
        //   x4:'460', y4:'208',
        //   'name' : 'chest',
        //    'frame':0
        // };

          var chest = {
            x1:'460', y1:'170', 
            x2:'520', y2:'170', 
            x3:'510', y3:'210', 
            x4:'450', y4:'210',
            'name':'chest',
            'frame' : 0
          };
        //bụng
          var belly = {
            x1:'454', y1:'214', 
            x2:'522', y2:'214', 
            x3:'522', y3:'274', 
            x4:'454', y4:'274',
            'name':'belly',
             'frame':0
          };
        //háng
          var groin = {
            x1:'442', y1:'249', 
            x2:'538', y2:'249', 
            x3:'538', y3:'303', 
            x4:'442', y4:'303',
            'name':'groin', 
            'frame':0
          };
        //bắp chân trai
          var l_calf = {
            x1:'425', y1:'291', 
            x2:'482', y2:'291', 
            x3:'482', y3:'366', 
            x4:'425', y4:'366',
            'name':'l_calf',
             'frame':0
          };
        //bap chan trai sau
          var bl_calf = {
            x1:'425', y1:'291', 
            x2:'482', y2:'291', 
            x3:'482', y3:'366', 
            x4:'425', y4:'366',
            'name':'bl_calf',
             'frame':2
          };
        // bap chan phai
          var r_calf = {
            x1:'489', y1:'293', 
            x2:'546', y2:'293', 
            x3:'546', y3:'365', 
            x4:'489', y4:'365',
            'name':'r_calf',
             'frame':0
          };
        //bap chan phai sau
          var br_calf = {
            x1:'489', y1:'293', 
            x2:'546', y2:'293', 
            x3:'546', y3:'365', 
            x4:'489', y4:'365',
            'name':'br_calf',
             'frame':2
          };
        //ống chân trai
          var l_shin = {
            x1:'418', y1:'368', 
            x2:'480', y2:'368', 
            x3:'480', y3:'441', 
            x4:'418', y4:'441',
            'name':'l_shin',
             'frame':0
          };
        //ong chan trai sau
          var bl_shin = {
            x1:'418', y1:'368', 
            x2:'480', y2:'368', 
            x3:'480', y3:'441', 
            x4:'418', y4:'441',
            'name':'bl_shin',
             'frame':2
          };
        //ong chan phai
          var r_shin = {
            x1:'500', y1:'369', 
            x2:'567', y2:'369', 
            x3:'567', y3:'442', 
            x4:'500', y4:'442',
            'name':'r_shin',
             'frame':0
          };
        //ong chan phai sau
          var br_shin = {
            x1:'500', y1:'369', 
            x2:'567', y2:'369', 
            x3:'567', y3:'442', 
            x4:'500', y4:'442',
            'name':'br_shin',
             'frame':2
          };
        //bàn chân trai
          var l_foot = {
            x1:'419', y1:'445', 
            x2:'480', y2:'445', 
            x3:'480', y3:'477', 
            x4:'419', y4:'477',
            'name':'l_foot',
             'frame':0
          };
        //ban chan trai sau
          var bl_foot = {
            x1:'419', y1:'445', 
            x2:'480', y2:'445', 
            x3:'480', y3:'477', 
            x4:'419', y4:'477',
            'name':'bl_foot',
             'frame':2
          };
        //ban chan phai
          var r_foot = {
            x1:'502', y1:'446', 
            x2:'566', y2:'446', 
            x3:'566', y3:'478', 
            x4:'502', y4:'478',
            'name':'r_foot',
             'frame':0
          };
        //ban chan phai sau
          var br_foot = {
            x1:'502', y1:'446', 
            x2:'566', y2:'446', 
            x3:'566', y3:'478', 
            x4:'502', y4:'478',
            'name':'br_foot',
             'frame':2
          };
        //lung trai
          var l_back = {
            x1:'456', y1:'152', 
            x2:'487', y2:'152', 
            x3:'487', y3:'250', 
            x4:'456', y4:'250',
            'name':'l_back',
            'frame':2
          };
        //lung phai
          var r_back = {
            x1:'493', y1:'152', 
            x2:'520', y2:'152', 
            x3:'520', y3:'250', 
            x4:'493', y4:'250',
            'name':'r_back',
             'frame':2
          }
  })