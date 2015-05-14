/*!
 *  opentok-whiteboard (http://github.com/aullman/opentok-whiteboard)
 *  
 *  Shared Whiteboard that works with OpenTok
 *
 *  @Author: Adam Ullman (http://github.com/aullman)
 *  @Copyright (c) 2014 Adam Ullman
 *  @License: Released under the MIT license (http://opensource.org/licenses/MIT)
**/

var OpenTokWhiteboard = angular.module('opentok-whiteboard', ['opentok','restangular','toastr'])
.directive('otWhiteboard', ['OTSession', '$window','$http','Restangular','toastr', function (OTSession, $window, $http,Restangular,toastr) {
    return {
        restrict: 'E',
        scope: {
            patient:'=',
        },
        template: '<canvas></canvas>' + 

            '<div class="OT_panel">' +

            '<input type="button" ng-class="{OT_color: true, OT_selected: c[\'background-color\'] === color}" ' +
            'ng-repeat="c in colors" ng-style="c" ng-click="changeColor(c)">' +
            '</input>' +

            '<input type="button" ng-click="erase()" ng-class="{OT_erase: true, OT_selected: erasing}"' +
            ' value="Eraser"></input>' +

            // '<input type="file" onchange="angular.element(this).scope().uploadImage(this.files)" class="OT_upload" value="Upload"></input>' +
            
            '<input type="button" ng-click="capture()" class="OT_capture" value="{{captureText}}"></input>' +

            '<input type="button" ng-click="clear()" class="OT_clear" value="Clear"></input>' +
            '</div>' +

            '<div class="OT_explorer">' +
            '<js-tree tree-data="scope" tree-model="treeArr" tree-events="dblclick:selectNodeCB"></js-tree>' +
            '</div>',

        link: function (scope, element, attrs) {
            var canvas = element.context.querySelector("canvas"),
                select = element.context.querySelector("select"),
                input = element.context.querySelector("input"),
                client = {dragging:false},
                ctx = canvas.getContext("2d"),
                drawHistory = [],
                drawHistoryReceivedFrom,
                drawHistoryReceived,
                batchUpdates = [],
                iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

            var host = location.hostname;
            var port = location.port;
            scope.treeArr = [];

            scope.colors = [{'background-color': 'black'},
                            {'background-color': 'blue'},
                            {'background-color': 'red'}];
            scope.captureText = "Share";

            canvas.width = attrs.width || element.width();
            canvas.height = attrs.height || element.height();

            Restangular.one('api/consultation/draw/templates').get().then(function(rs){
                if(rs.status == 'success')
                {
                    for(var i=0; i<rs.data.length;i++)
                    {
                        var node = rs.data[i];
                        scope.treeArr.push({
                                    "id": node.id,
                                    "parent": node.parent == null ? '#' : node.parent,
                                    "text": node.fileName,
                                    "icon": node.isFolder == 1 ? 'fa fa-folder icon-state-warning' : 'fa fa-file icon-state-success'
                                })
                    }
                }
            })

            scope.selectNodeCB = function(e){
                var idArr = String(e.target.id).split('_');
                var id = idArr[0];
                if(id != null && typeof id !== 'undefined' && id != '')
                {

                    Restangular.one('api/consultation/draw/template',id).get().then(function(rs){
                        if(rs.status == 'success')
                        {
                            var img = new Image;
                            img.onload = function() {
                                ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
                            }
                            img.src = rs.data;
                        }
                    })
                }
            }
            
            var clearCanvas = function () {
                ctx.save();

                // Use the identity matrix while clearing the canvas
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Restore the transform
                ctx.restore();
                drawHistory = [];
            };

            scope.uploadImage = function(image){
                var reader = new FileReader();
                reader.onload = function(event){
                    var img = new Image();
                    img.onload = function(){
                        ctx.drawImage(img,0,0);
                    }
                    img.src = event.target.result;
                }
                console.log(reader);
                reader.readAsDataURL(image[0]);
            };
            
            scope.changeColor = function (color) {
                scope.color = color['background-color'];
                scope.lineWidth = 5;
                scope.erasing = false;
            };
            
            scope.changeColor(scope.colors[Math.floor(Math.random() * scope.colors.length)]);
            
            scope.clear = function () {
                clearCanvas();
                if (OTSession.session) {
                    OTSession.session.signal({
                        type: 'otWhiteboard_clear'
                    });
                }
            };
            
            scope.erase = function () {
                scope.color = element.css("background-color") || "#fff";
                scope.lineWidth = 50;
                scope.erasing = true;
            };
            
            scope.capture = function () {
                if(scope.patient != null)
                {
                    var imgData = canvas.toDataURL('image/png');

                    var signalError = function (err) {
                      if (err) {
                        TB.error(err);
                      }
                    };
                        
                    Restangular.all('api/consultation/draw/saveImage').post({patient_id: scope.patient, imgData: imgData}).then(function(rs){
                        if(rs.status == 'success')
                        {
                            var signal = {
                                type: 'shareImage',
                                data: {id: rs.id}
                            };
                            OTSession.session.signal(signal, signalError);
                        }
                    })
                }
                
            };

            var draw = function (update) {

                ctx.lineCap = "round";
                ctx.fillStyle = "solid";

                ctx.strokeStyle = update.color;
                ctx.lineWidth = update.lineWidth;
                ctx.beginPath();
                ctx.moveTo(update.fromX, update.fromY);
                ctx.lineTo(update.toX, update.toY);
                ctx.stroke();
                ctx.closePath();
                
                drawHistory.push(update);
            };
            
            var drawUpdates = function (updates) {
                updates.forEach(function (update) {
                    draw(update);
                });
            };
            
            var batchSignal = function (type, data, toConnection) {
                // We send data in small chunks so that they fit in a signal
                // Each packet is maximum ~250 chars, we can fit 8192/250 ~= 32 updates per signal
                var dataCopy = data.slice();
                var signalError = function (err) {
                  if (err) {
                    TB.error(err);
                  }
                };
                while(dataCopy.length) {
                    var dataChunk = dataCopy.splice(0, Math.min(dataCopy.length, 32));
                    var signal = {
                        type: type,
                        data: JSON.stringify(dataChunk)
                    };
                    if (toConnection) signal.to = toConnection;
                    OTSession.session.signal(signal, signalError);
                }
            };
            
            var updateTimeout;
            var sendUpdate = function (update) {
                if (OTSession.session) {
                    batchUpdates.push(update);
                    if (!updateTimeout) {
                        updateTimeout = setTimeout(function () {
                            batchSignal('otWhiteboard_update', batchUpdates);
                            batchUpdates = [];
                            updateTimeout = null;
                        }, 100);
                    }
                }
            };
            
            angular.element(canvas).on('mousedown mousemove mouseup mouseout touchstart touchmove touchend', 
              function (event) {
                if (event.type === 'mousemove' && !client.dragging) {
                    // Ignore mouse move Events if we're not dragging
                    return;
                }
                event.preventDefault();
                
                var offset = angular.element(canvas).offset(),
                    scaleX = canvas.width / element.width(),
                    scaleY = canvas.height / element.height(),
                    offsetX = event.offsetX || event.originalEvent.pageX - offset.left ||
                       event.originalEvent.touches[0].pageX - offset.left,
                    offsetY = event.offsetY || event.originalEvent.pageY - offset.top ||
                       event.originalEvent.touches[0].pageY - offset.top,
                    x = offsetX * scaleX,
                    y = offsetY * scaleY;

                
                
                switch (event.type) {
                case 'mousedown':
                case 'touchstart':
                    client.dragging = true;
                    client.lastX = x;
                    client.lastY = y;
                    break;
                case 'mousemove':
                case 'touchmove':
                    if (client.dragging) {
                        var update = {
                            id: OTSession.session && OTSession.session.connection &&
                                OTSession.session.connection.connectionId,
                            fromX: client.lastX,
                            fromY: client.lastY,
                            toX: x,
                            toY: y,
                            color: scope.color,
                            lineWidth: scope.lineWidth
                        };
                        // console.log(update);
                        draw(update);
                        client.lastX = x;
                        client.lastY = y;
                        sendUpdate(update);
                    }
                    break;
                case 'mouseup':
                case 'touchend':
                case 'mouseout':
                    client.dragging = false;
                }
            });
            
            if (OTSession.session) {
                OTSession.session.on({
                    'signal:otWhiteboard_update': function (event) {
                        if (event.from.connectionId !== OTSession.session.connection.connectionId) {
                            drawUpdates(JSON.parse(event.data));
                            scope.$emit('otWhiteboardUpdate');
                        }
                    },
                    'signal:otWhiteboard_history': function (event) {
                        // We will receive these from everyone in the room, only listen to the first
                        // person. Also the data is chunked together so we need all of that person's
                        if (!drawHistoryReceivedFrom || drawHistoryReceivedFrom === event.from.connectionId) {
                            drawHistoryReceivedFrom = event.from.connectionId;
                            drawUpdates(JSON.parse(event.data));
                            scope.$emit('otWhiteboardUpdate');
                        }
                    },
                    'signal:otWhiteboard_clear': function (event) {
                        if (event.from.connectionId !== OTSession.session.connection.connectionId) {
                            clearCanvas();
                        }
                    },
                    connectionCreated: function (event) {
                        if (drawHistory.length > 0 && event.connection.connectionId !==
                                OTSession.session.connection.connectionId) {
                            batchSignal('otWhiteboard_history', drawHistory, event.connection);
                        }
                    }
                });
            }
        }
    };
}]);