var kiss={concat:function(){for(var str="",i=0;i<arguments.length;i++)str+=arguments[i];return str},msToTimer:function(num){var timerItem={x:null,hour:null,minute:null,second:null,display:null};timerItem.x=num,timerItem.hour=Math.floor(timerItem.x/3600);var temp=timerItem.x%3600;timerItem.minute=Math.floor(temp/60);var temp=timerItem.x%60;timerItem.second=temp;var pad=function(num,size){var s="000000000"+num;return s.substr(s.length-size)};return timerItem.display=pad(timerItem.hour,2)+":"+pad(timerItem.minute,2)+":"+pad(timerItem.second,2),timerItem}};angular.module("app.kiss.timer.directive",[]).directive("kissTimer",function($interval){return{restrict:"E",scope:{startSessionTime:"=",returnValue:"="},templateUrl:"modules/kissModule/directives/templates/kissTimer.html",link:function($scope,element,attrs){var run=function(){var startSessionTime=moment(new Date($scope.startSessionTime)),currentTime=moment(),x=currentTime.diff(startSessionTime,"seconds"),timerItem={x:null,hour:null,minute:null,second:null};timerItem.x=x,timerItem.hour=Math.floor(timerItem.x/3600);var temp=timerItem.x%3600;timerItem.minute=Math.floor(temp/60);var temp=timerItem.x%60;timerItem.second=temp;var pad=function(num,size){var s="000000000"+num;return s.substr(s.length-size)},updateTime=function(){timerItem.hour=Math.floor(timerItem.x/3600);var temp=timerItem.x%3600;timerItem.minute=Math.floor(temp/60);var temp=timerItem.x%60;timerItem.second=temp,timerItem.x=timerItem.x+1,$scope.returnValue=String(pad(timerItem.hour,2)+":"+pad(timerItem.minute,2)+":"+pad(timerItem.second,2))};$scope.timer=$interval(updateTime,1e3)};$scope.$watch("startSessionTime",function(newValue,oldValue){$scope.startSessionTime&&("close"!=$scope.startSessionTime?run():$interval.cancel($scope.timer))}),element.on("$destroy",function(){$interval.cancel($scope.timer)})}}});