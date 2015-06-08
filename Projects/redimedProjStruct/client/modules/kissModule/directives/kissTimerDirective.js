angular.module("app.kiss.timer.directive",[])
    .directive('kissTimer', function ($interval) {
        return {
            restrict: 'E',
            scope: {
                startSessionTime:'=',
                returnValue:'='
            },
            templateUrl: 'modules/kissModule/directives/templates/kissTimer.html',
            link: function ($scope, element, attrs) {
                var run=function()
                {
                    var startSessionTime=moment(new Date($scope.startSessionTime));
                    var currentTime=moment();
                    var x=currentTime.diff(startSessionTime,'seconds');
                    var timerItem={
                        x:null,
                        hour:null,
                        minute:null,
                        second:null
                    }
                    timerItem.x=x;
                    timerItem.hour=Math.floor(timerItem.x/3600);
                    var temp=timerItem.x%3600;
                    timerItem.minute=Math.floor(temp/60);
                    var temp=timerItem.x%60;
                    timerItem.second=temp;

                    var pad=function(num, size) 
                    {
                        var s = "000000000" + num;
                        return s.substr(s.length-size);
                    }

                    var updateTime=function(){
                        timerItem.hour=Math.floor(timerItem.x/3600);
                        var temp=timerItem.x%3600;
                        timerItem.minute=Math.floor(temp/60);
                        var temp=timerItem.x%60;
                        timerItem.second=temp;
                        timerItem.x=timerItem.x+1;
                        $scope.returnValue=pad(timerItem.hour,2)+":"+pad(timerItem.minute,2)+":"+pad(timerItem.second,2);
                    }
                    $scope.timer = $interval(updateTime, 1000);
                }
                $scope.$watch("startSessionTime",function(newValue,oldValue){
                    if($scope.startSessionTime)
                    {
                        if($scope.startSessionTime!='close')
                            run();
                        else
                            $interval.cancel($scope.timer);
                    }
                    
                })

                element.on('$destroy', function() {
                    $interval.cancel($scope.timer);
                });
                
            }
        };
    })
    